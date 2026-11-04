from django.conf import settings
from django.contrib.admin import AdminSite
from django.contrib.auth.signals import user_logged_in, user_login_failed
from django.core.cache import cache
from django.dispatch import receiver
from django.http import HttpResponse, JsonResponse
from django.urls import path, reverse

from .admin_assets import AssetAdminMixin
from .utils import client_ip

# Admin login brute-force protection (shared across workers via the file cache).
LOGIN_WINDOW_SECONDS = 15 * 60
LOGIN_MAX_FAILS_PER_IP = 10
LOGIN_MAX_FAILS_PER_USER = 25


def _login_keys(request, username):
    keys = [f'adminlogin:ip:{client_ip(request)}']
    if username:
        keys.append(f'adminlogin:user:{username.strip().lower()[:150]}')
    return keys


def _bump(key):
    # add() sets the window once; incr() keeps counting inside it.
    cache.add(key, 0, LOGIN_WINDOW_SECONDS)
    try:
        cache.incr(key)
    except ValueError:
        cache.set(key, 1, LOGIN_WINDOW_SECONDS)


@receiver(user_login_failed)
def _count_failed_login(sender, credentials, request=None, **kwargs):
    if request is None:
        return
    for key in _login_keys(request, (credentials or {}).get('username', '')):
        _bump(key)


@receiver(user_logged_in)
def _reset_user_counter(sender, request, user, **kwargs):
    cache.delete(f'adminlogin:user:{user.get_username().strip().lower()[:150]}')


def login_locked(request, username=''):
    ip_key, *user_key = _login_keys(request, username)
    if (cache.get(ip_key) or 0) >= LOGIN_MAX_FAILS_PER_IP:
        return True
    return bool(user_key) and (cache.get(user_key[0]) or 0) >= LOGIN_MAX_FAILS_PER_USER


class MriiAdminSite(AssetAdminMixin, AdminSite):
    site_header = 'FJSTI CMS'
    site_title = 'FJSTI CMS'
    index_title = 'Bosh sahifa'
    # Django default `/` — bu loyihada backend emas, frontend (Vite) sayt
    site_url = None
    # Dashboard kartalari navigatsiya vazifasini bajaradi — sidebar klientni chalkashtiradi
    enable_nav_sidebar = False

    def login(self, request, extra_context=None):
        if request.method == 'POST' and login_locked(request, request.POST.get('username', '')):
            return HttpResponse(
                'Juda ko‘p muvaffaqiyatsiz urinish. 15 daqiqadan keyin qayta urinib ko‘ring.',
                status=429,
                content_type='text/plain; charset=utf-8',
                headers={'Retry-After': str(LOGIN_WINDOW_SECONDS)},
            )
        return super().login(request, extra_context)

    def each_context(self, request):
        context = super().each_context(request)
        from django.conf import settings

        context['site_url'] = getattr(settings, 'FRONTEND_URL', '') or ''
        return context

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path(
                'cms/translate/',
                self.admin_view(self.translate_api),
                name='cms_translate',
            ),
            path('cms/texts/', self.admin_view(self.site_texts_view), name='cms_texts'),
            path('cms/texts/save/', self.admin_view(self.site_texts_save), name='cms_texts_save'),
            path('cms/guide/', self.admin_view(self.guide_view), name='cms_guide'),
            path('cms/assets/', self.admin_view(self.site_assets_view), name='cms_assets'),
            path('cms/assets/upload/', self.admin_view(self.site_assets_upload), name='cms_assets_upload'),
            path('cms/assets/reset/', self.admin_view(self.site_assets_reset), name='cms_assets_reset'),
            path(
                'cms/inquiry/<int:pk>/resume/',
                self.admin_view(self.resume_download),
                name='cms_inquiry_resume',
            ),
        ]
        return custom + urls

    def resume_download(self, request, pk):
        """Authenticated download of an applicant's resume (HR sees career leads only)."""
        import os

        from django.core.exceptions import PermissionDenied
        from django.http import FileResponse, Http404
        from django.shortcuts import get_object_or_404
        from django.utils.text import slugify

        from . import models

        if not (
            request.user.has_perm('cms.view_inquiry')
            or request.user.has_perm('cms.change_inquiry')
        ):
            raise PermissionDenied

        qs = models.Inquiry.objects.exclude(resume='').exclude(resume__isnull=True)
        is_hr_only = (
            not request.user.is_superuser
            and request.user.groups.filter(name='HR bo‘limi').exists()
        )
        if is_hr_only:
            qs = qs.filter(intent=models.Inquiry.Intent.CAREER)
        inquiry = get_object_or_404(qs, pk=pk)

        try:
            handle = inquiry.resume.open('rb')
        except (FileNotFoundError, ValueError):
            raise Http404('Fayl topilmadi.')

        ext = os.path.splitext(inquiry.resume.name)[1].lower()
        stem = slugify(inquiry.name) or inquiry.request_id
        return FileResponse(handle, as_attachment=True, filename=f'{stem}-rezyume{ext}')

    # ───────────────────────── «Sayt matnlari» ─────────────────────────
    def _texts_guard(self, request):
        from django.core.exceptions import PermissionDenied

        if not request.user.has_perm('cms.change_textoverride'):
            raise PermissionDenied

    def site_texts_view(self, request):
        """Every text of the website, searchable, editable in 4 languages."""
        from django.core.paginator import Paginator
        from django.template.response import TemplateResponse

        from . import models, site_texts
        from .site_texts import LANGS

        self._texts_guard(request)
        q = request.GET.get('q', '').strip().lower()
        section = request.GET.get('section', '')
        only_changed = request.GET.get('changed') == '1'
        overrides = {o.key: o for o in models.TextOverride.objects.all()}

        def is_changed(entry, lang):
            ov = overrides.get(entry['key'])
            value = getattr(ov, lang, '') if ov else ''
            return bool(value) and value != entry[lang]

        rows, counts, changed_counts = [], {}, {}
        for entry in site_texts.catalog():
            sec = site_texts.section_of(entry['key'])
            counts[sec] = counts.get(sec, 0) + 1
            changed_langs = [l for l in LANGS if is_changed(entry, l)]
            if changed_langs:
                changed_counts[sec] = changed_counts.get(sec, 0) + 1
            if section and sec != section:
                continue
            if only_changed and not changed_langs:
                continue
            ov = overrides.get(entry['key'])
            values = {l: (getattr(ov, l) if ov and getattr(ov, l) else entry[l]) for l in LANGS}
            if q and q not in ' '.join([entry['key'], *entry.values(), *values.values()]).lower():
                continue
            rows.append({
                'key': entry['key'],
                'section': sec,
                'section_title': site_texts.section_title(sec),
                'path': entry['key'].split('.', 1)[1] if '.' in entry['key'] else entry['key'],
                'fields': [
                    {'lang': l, 'label': {'uz': 'O‘zbekcha', 'ru': 'Ruscha', 'en': 'Inglizcha', 'kaa': 'Qoraqalpoqcha'}[l],
                     'value': values[l], 'default': entry[l], 'changed': l in changed_langs,
                     'rows': max(2, min(8, len(values[l]) // 48 + 1))}
                    for l in LANGS
                ],
                'changed': bool(changed_langs),
            })
        page = Paginator(rows, 15).get_page(request.GET.get('page'))
        query = request.GET.copy()
        query.pop('page', None)
        context = {
            **self.each_context(request),
            'title': 'Sayt matnlari',
            'page_obj': page,
            'q': request.GET.get('q', ''),
            'current_section': section,
            'only_changed': only_changed,
            'total_changed': sum(changed_counts.values()),
            'sections': [
                {'key': k, 'title': site_texts.section_title(k), 'page': site_texts.section_page(k),
                 'count': counts[k], 'changed': changed_counts.get(k, 0)}
                for k in site_texts.SECTIONS if k in counts
            ],
            'querystring': query.urlencode(),
        }
        return TemplateResponse(request, 'admin/cms/site_texts.html', context)

    def site_texts_save(self, request):
        """POST {key, values:{uz,ru,en,kaa}} — blank or default-equal values mean "no override"."""
        import json

        from . import models, site_texts
        from .site_texts import LANGS

        self._texts_guard(request)
        if request.method != 'POST':
            return JsonResponse({'error': 'POST kerak'}, status=405)
        try:
            payload = json.loads(request.body.decode('utf-8') or '{}')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Noto‘g‘ri JSON'}, status=400)
        entry = site_texts.by_key().get(payload.get('key', ''))
        if entry is None:
            return JsonResponse({'error': 'Bunday matn topilmadi'}, status=400)
        values = payload.get('values') or {}
        clean = {}
        for lang in LANGS:
            text = str(values.get(lang, '') or '').replace('\r\n', '\n')
            if len(text) > 5000:
                return JsonResponse({'error': 'Matn juda uzun (5000 belgigacha)'}, status=400)
            clean[lang] = '' if not text.strip() or text == entry[lang] else text
        if not any(clean.values()):
            models.TextOverride.objects.filter(key=entry['key']).delete()
        else:
            models.TextOverride.objects.update_or_create(key=entry['key'], defaults=clean)
        effective = {l: clean[l] or entry[l] for l in LANGS}
        return JsonResponse({'ok': True, 'overridden': any(clean.values()), 'values': effective,
                             'changed': {l: bool(clean[l]) for l in LANGS}})

    def translate_api(self, request):
        """JSON: { fields: { role_uz: '...', ... } } → { translations, errors }"""
        import json

        from .i18n_fill import translate_text_report

        if request.method != 'POST':
            return JsonResponse({'error': 'POST kerak'}, status=405)

        try:
            payload = json.loads(request.body.decode('utf-8') or '{}')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Noto‘g‘ri JSON'}, status=400)

        fields = payload.get('fields') or {}
        overwrite = bool(payload.get('overwrite'))
        translations = {}
        errors = []

        for name, text in fields.items():
            if not isinstance(name, str) or not name.endswith('_uz'):
                continue
            text = (text or '').strip()
            if not text:
                continue
            base = name[:-3]
            ru, ru_err = translate_text_report(text, 'ru')
            en, en_err = translate_text_report(text, 'en')
            if ru:
                translations[f'{base}_ru'] = ru
            elif ru_err:
                errors.append(f'{name}→ru: {ru_err}')
            if en:
                translations[f'{base}_en'] = en
            elif en_err:
                errors.append(f'{name}→en: {en_err}')

        return JsonResponse({
            'translations': translations,
            'overwrite': overwrite,
            'count': len(translations),
            'errors': errors[:6],
        })

    def app_index(self, request, app_label, extra_context=None):
        """«FJSTI Kontent» breadcrumb /admin/cms/ — bo‘sh sahifa o‘rniga bosh dashboard."""
        from django.shortcuts import redirect

        return redirect('admin:index')

    def index(self, request, extra_context=None):
        from django.contrib.auth.models import User

        from . import models

        def can_access(model) -> bool:
            opts = model._meta
            return any(
                request.user.has_perm(f'{opts.app_label}.{action}_{opts.model_name}')
                for action in ('view', 'change', 'add', 'delete')
            )

        def url(name: str) -> str:
            return reverse(f'admin:cms_{name}_changelist')

        def change_url(name: str) -> str:
            model_map = {
                'sitesettings': models.SiteSettings,
                'hero': models.Hero,
                'homepage': models.HomePage,
                'researchsection': models.ResearchSection,
            }
            obj = model_map[name].objects.first()
            if obj:
                return reverse(f'admin:cms_{name}_change', args=[obj.pk])
            return reverse(f'admin:cms_{name}_add')

        new_leads = models.Inquiry.objects.filter(status=models.Inquiry.Status.NEW).count()
        new_career_leads = models.Inquiry.objects.filter(
            status=models.Inquiry.Status.NEW,
            intent=models.Inquiry.Intent.CAREER,
        ).count()

        # Cards are grouped by what the editor wants to do, each says WHERE it shows on the website.
        groups = [
            {
                'title': 'Kundalik ishlar',
                'hint': 'Eng ko‘p kerak bo‘ladigan bo‘limlar',
                'style': 'cards',
                'cards': [
                    {'title': 'Murojaatlar', 'model': models.Inquiry, 'icon': 'inbox', 'tone': 'mint',
                     'meta': f'{new_leads} yangi' if new_leads else 'Bemorlar va nomzodlar',
                     'desc': 'Saytdan kelgan so‘rovlar va ish arizalari: telefon, holat, rezyume.',
                     'url': url('inquiry')},
                    {'title': 'Yangiliklar', 'model': models.NewsArticle, 'icon': 'news', 'tone': 'sky',
                     'meta': 'Yangiliklar sahifasi',
                     'desc': 'Maqola yozish yoki tahrirlash: sarlavha, matn, sana, muqova rasmi.',
                     'url': url('newsarticle')},
                    {'title': 'Shifokorlar', 'model': models.Doctor, 'icon': 'doctor', 'tone': 'teal',
                     'meta': 'Shifokorlar sahifasi',
                     'desc': 'Shifokor qo‘shish, ism, lavozim, mutaxassislik va foto.',
                     'url': url('doctor')},
                    {'title': 'Narxlar', 'model': models.PriceItem, 'icon': 'chart', 'tone': 'teal',
                     'meta': 'Narxlar sahifasi',
                     'desc': 'Xizmat narxlari jadvali — narxni to‘g‘ridan-to‘g‘ri jadvalda o‘zgartirasiz.',
                     'url': url('priceitem')},
                    {'title': 'Vakansiyalar', 'model': models.Vacancy, 'icon': 'doctor', 'tone': 'navy',
                     'meta': 'Vakansiyalar sahifasi',
                     'desc': 'Ochiq lavozimlar. (HR xodimi buni Telegram mini-ilovada ham qiladi.)',
                     'url': url('vacancy')},
                ],
            },
            {
                'title': 'Saytning matni, rasmi va aloqa ma’lumotlari',
                'hint': 'Saytdagi HAR BIR yozuv va rasm — shu yerdan',
                'style': 'cards',
                'cards': [
                    {'title': 'Sayt matnlari', 'model': models.TextOverride, 'icon': 'doc', 'tone': 'indigo',
                     'meta': 'Hamma sahifa',
                     'desc': 'Saytdagi har bir sarlavha, tugma va tavsif — 4 tilda. Qidiruv bilan toping.',
                     'url': reverse('admin:cms_texts')},
                    {'title': 'Sayt rasmlari', 'model': models.AssetOverride, 'icon': 'hero', 'tone': 'sky',
                     'meta': 'Rasm va video',
                     'desc': 'Saytdagi tayyor rasm va videolarni yangisiga almashtirish.',
                     'url': reverse('admin:cms_assets')},
                    {'title': 'Aloqa ma’lumotlari', 'model': models.SiteSettings, 'icon': 'settings', 'tone': 'slate',
                     'meta': 'Hamma sahifa (tepa va past)',
                     'desc': 'Telefon, Telegram, Instagram, pochta, xarita manzili, mualliflik huquqi.',
                     'url': change_url('sitesettings')},
                    {'title': 'Bosh sahifa', 'model': models.HomePage, 'icon': 'hero', 'tone': 'mint',
                     'meta': 'Bosh sahifa',
                     'desc': 'Birinchi ekrandagi asosiy matn, jamoa rasmi va raqamlar.',
                     'url': change_url('homepage')},
                ],
            },
            {
                'title': 'Sahifalar bo‘yicha',
                'hint': 'Kamroq o‘zgaradigan bo‘limlar',
                'style': 'list',
                'cards': [
                    {'title': 'Klinik yo‘nalishlar', 'model': models.Specialty, 'icon': 'clinic',
                     'desc': 'Klinika sahifasi: bo‘limlar matni, xizmatlar va rasmlari',
                     'url': url('specialty')},
                    {'title': 'Check-up paketlari', 'model': models.CheckupDirection, 'icon': 'clinic',
                     'desc': 'Narxlar sahifasi: Layt / Standart / Premium paket tarkibi va narxi',
                     'url': url('checkupdirection')},
                    {'title': 'Narx bo‘limlari', 'model': models.PriceCategory, 'icon': 'doc',
                     'desc': 'Narxlar sahifasi: bo‘lim nomlari (Laboratoriya, UZI…) va tartibi',
                     'url': url('pricecategory')},
                    {'title': 'Klinika sayohati', 'model': models.ClinicTourVideo, 'icon': 'clinic',
                     'desc': 'Klinika → Video sayohat: videolar',
                     'url': url('clinictourvideo')},
                    {'title': 'AI mahsulotlar', 'model': models.AIProduct, 'icon': 'ai',
                     'desc': 'AI yechimlar sahifasi: AiShifokor va boshqa mahsulotlar',
                     'url': url('aiproduct')},
                    {'title': 'Tadqiqotlar', 'model': models.ResearchStudy, 'icon': 'research',
                     'desc': 'Tadqiqotlar sahifasi: faol tadqiqotlar va holatlari',
                     'url': url('researchstudy')},
                    {'title': 'Tadqiqotlar matni', 'model': models.ResearchSection, 'icon': 'doc',
                     'desc': 'Tadqiqotlar sahifasi: bo‘lim sarlavhasi va «Nima uchun»',
                     'url': change_url('researchsection')},
                    {'title': 'Tadqiqot imkoniyatlari', 'model': models.ResearchCapability, 'icon': 'chart',
                     'desc': 'Tadqiqotlar sahifasi: statistika qiymatlari',
                     'url': url('researchcapability')},
                    {'title': 'Sharhlar', 'model': models.Testimonial, 'icon': 'quote',
                     'desc': 'Bosh sahifa: bemor va hamkor fikrlari (kamida bittasi qo‘shilsa ko‘rinadi)',
                     'url': url('testimonial')},
                ],
            },
            {
                'title': 'Tizim',
                'hint': 'Faqat bosh administrator uchun',
                'style': 'list',
                'cards': [
                    {'title': 'HR Telegram', 'model': models.HRTelegramUser, 'icon': 'doctor',
                     'desc': 'HR mini-ilovaga kirish ruxsati berilgan Telegram akkauntlar',
                     'url': url('hrtelegramuser')},
                    {'title': 'Foydalanuvchilar', 'model': User, 'icon': 'doctor',
                     'desc': 'Admin panelga kiradigan xodimlar va ularning huquqlari',
                     'url': reverse('admin:auth_user_changelist')},
                ],
            },
        ]
        for group in groups:
            group['cards'] = [card for card in group['cards'] if can_access(card['model'])]
        groups = [group for group in groups if group['cards']]

        is_hr_workspace = (
            request.user.groups.filter(name='HR bo‘limi').exists()
            and not request.user.is_superuser
        )
        if is_hr_workspace:
            by_title = {card['title']: card for group in groups for card in group['cards']}
            picked = []
            if 'Murojaatlar' in by_title:
                picked.append({
                    **by_title['Murojaatlar'],
                    'desc': 'Vakansiyaga kelgan arizalar — rezyume, telefon, holat.',
                    'meta': f'{new_career_leads} yangi' if new_career_leads else 'Arizalar',
                })
            if 'Vakansiyalar' in by_title:
                picked.append(by_title['Vakansiyalar'])
            groups = [{'title': '', 'hint': '', 'style': 'cards', 'cards': picked}] if picked else []

        stats = [
            {'label': 'Yangi murojaat', 'value': new_leads, 'tone': 'mint', 'model': models.Inquiry},
            {'label': 'Yo‘nalishlar', 'value': models.Specialty.objects.count(), 'tone': 'navy', 'model': models.Specialty},
            {'label': 'Shifokorlar', 'value': models.Doctor.objects.count(), 'tone': 'teal', 'model': models.Doctor},
            {'label': 'Yangiliklar', 'value': models.NewsArticle.objects.count(), 'tone': 'sky', 'model': models.NewsArticle},
        ]
        if is_hr_workspace:
            stats = [
                {'label': 'Yangi ariza', 'value': new_career_leads, 'tone': 'mint'},
                {'label': 'Ochiq vakansiya', 'value': models.Vacancy.objects.filter(is_active=True).count(), 'tone': 'navy'},
            ]
        else:
            stats = [{key: value for key, value in stat.items() if key != 'model'} for stat in stats if can_access(stat['model'])]

        extra = extra_context or {}
        extra.update({
            'mrii_stats': stats,
            'mrii_groups': groups,
            'mrii_hr_workspace': is_hr_workspace,
            'mrii_guide_url': reverse('admin:cms_guide'),
            'mrii_site_url': getattr(settings, 'FRONTEND_URL', '') or '/',
        })
        return super().index(request, extra_context=extra)

    def guide_view(self, request):
        from django.template.response import TemplateResponse

        return TemplateResponse(request, 'admin/cms/guide.html', {
            **self.each_context(request),
            'title': 'Qo‘llanma',
            'site_url_public': getattr(settings, 'FRONTEND_URL', '') or '/',
        })


mrii_admin_site = MriiAdminSite(name='admin')
