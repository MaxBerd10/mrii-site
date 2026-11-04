from django.conf import settings
from django.contrib.admin import AdminSite
from django.contrib.auth.signals import user_logged_in, user_login_failed
from django.core.cache import cache
from django.dispatch import receiver
from django.http import HttpResponse, JsonResponse
from django.urls import path, reverse

from .admin_assets import AssetAdminMixin
from .admin_hub import HubAdminMixin
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


class MriiAdminSite(HubAdminMixin, AssetAdminMixin, AdminSite):
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
            path('cms/pages/', self.admin_view(self.pages_view), name='cms_pages'),
            path('cms/pages/<slug:key>/', self.admin_view(self.page_detail_view), name='cms_page'),
            path('cms/search/', self.admin_view(self.search_view), name='cms_search'),
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
        only_key = request.GET.get('key', '').strip()
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
            if only_key and entry['key'] != only_key:
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
            'only_key': only_key,
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
        from . import models, site_pages

        hr = self._is_hr_workspace(request)
        new_leads = models.Inquiry.objects.filter(status=models.Inquiry.Status.NEW).count()
        new_career = models.Inquiry.objects.filter(
            status=models.Inquiry.Status.NEW, intent=models.Inquiry.Intent.CAREER,
        ).count()

        def go(label, hint, url, model=None, perm=None):
            if model is not None and not self._can(request, model):
                return None
            if perm and not request.user.has_perm(perm):
                return None
            return {'label': label, 'hint': hint, 'url': url}

        def add_url(name):
            return reverse(f'admin:cms_{name}_add')

        if hr:
            tasks = [t for t in (
                go('Yangi arizalarni ko‘rish', 'Rezyume, telefon, holatni belgilash', reverse('admin:cms_inquiry_changelist'), models.Inquiry),
                go('Vakansiya qo‘yish', 'Yangi lavozim e’lon qilish', add_url('vacancy'), models.Vacancy),
                go('Vakansiyalar ro‘yxati', 'Tahrirlash yoki yashirish', reverse('admin:cms_vacancy_changelist'), models.Vacancy),
            ) if t]
            attention = {'count': new_career, 'label': 'yangi ariza', 'url': reverse('admin:cms_inquiry_changelist')}
        else:
            tasks = [t for t in (
                go('Telefon yoki manzilni o‘zgartirish', 'Telefon, Telegram, pochta, xarita — butun saytda almashadi',
                   self._model_urls('sitesettings', True)[1], models.SiteSettings),
                go('Narxni o‘zgartirish', 'Xizmat narxlari jadvali', reverse('admin:cms_priceitem_changelist'), models.PriceItem),
                go('Yangilik qo‘shish', 'Sarlavha, matn, muqova rasmi', add_url('newsarticle'), models.NewsArticle),
                go('Shifokor qo‘shish yoki tahrirlash', 'Ism, lavozim, foto, ma’lumot', reverse('admin:cms_doctor_changelist'), models.Doctor),
                go('Rasm yoki videoni almashtirish', 'Saytdagi tayyor rasm va videolar', reverse('admin:cms_assets'), models.AssetOverride),
                go('Saytdagi yozuvni o‘zgartirish', 'Qidiruv orqali istalgan matnni toping', reverse('admin:cms_texts'), models.TextOverride),
                go('Vakansiya qo‘yish', 'Yangi lavozim e’lon qilish', add_url('vacancy'), models.Vacancy),
            ) if t]
            attention = {'count': new_leads, 'label': 'yangi murojaat', 'url': reverse('admin:cms_inquiry_changelist')} \
                if self._can(request, models.Inquiry) else None

        pages = [] if hr else [
            {'title': p['title'], 'url': reverse('admin:cms_page', args=[p['key']]), 'blurb': p['blurb']}
            for p in site_pages.PAGES
        ]
        extra = extra_context or {}
        extra.update({
            'title': 'Bosh sahifa',
            'mrii_tasks': tasks,
            'mrii_attention': attention,
            'mrii_pages': pages,
            'mrii_hr_workspace': hr,
            'mrii_guide_url': reverse('admin:cms_guide'),
            'mrii_site_url': getattr(settings, 'FRONTEND_URL', '') or '/',
            'mrii_name': request.user.get_short_name() or request.user.get_username(),
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
