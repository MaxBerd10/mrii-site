from django.contrib.admin import AdminSite
from django.http import JsonResponse
from django.urls import path, reverse


class MriiAdminSite(AdminSite):
    site_header = 'FJSTI CMS'
    site_title = 'FJSTI CMS'
    index_title = 'Bosh sahifa'
    # Django default `/` — bu loyihada backend emas, frontend (Vite) sayt
    site_url = None
    # Dashboard kartalari navigatsiya vazifasini bajaradi — sidebar klientni chalkashtiradi
    enable_nav_sidebar = False

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
        ]
        return custom + urls

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

        primary = [
            {
                'title': 'Murojaatlar',
                'desc': 'Kontakt, AI demo va ishga arizalar — telefon, holat, izoh.',
                'meta': f'{new_leads} yangi' if new_leads else 'Leadlar',
                'icon': 'inbox',
                'tone': 'mint',
                'url': url('inquiry'),
            },
            {
                'title': 'Yangiliklar',
                'desc': 'Maqola, sana, kategoriya va muqova rasmi.',
                'meta': 'Eng kerakli',
                'icon': 'news',
                'tone': 'sky',
                'url': url('newsarticle'),
            },
            {
                'title': 'Shifokorlar',
                'desc': 'Ism, lavozim, mutaxassislik va foto.',
                'meta': 'Jamoa',
                'icon': 'doctor',
                'tone': 'teal',
                'url': url('doctor'),
            },
            {
                'title': 'Klinik yo‘nalishlar',
                'desc': 'Bo‘limlar matni, xizmatlar va rasmlar.',
                'meta': 'Klinika',
                'icon': 'clinic',
                'tone': 'navy',
                'url': url('specialty'),
            },
            {
                'title': 'Sayt sozlamalari',
                'desc': 'Telefon, ish vaqti, copyright.',
                'meta': 'Aloqa',
                'icon': 'settings',
                'tone': 'slate',
                'url': change_url('sitesettings'),
            },
            {
                'title': 'Bosh sahifa',
                'desc': 'Asosiy matn, jamoa rasmi va birinchi ekrandagi raqamlar.',
                'meta': 'Bosh sahifa',
                'icon': 'hero',
                'tone': 'mint',
                'url': change_url('homepage'),
            },
            {
                'title': 'AI mahsulotlar',
                'desc': 'AI Doctor Assistant va boshqa mahsulotlar.',
                'meta': 'AI',
                'icon': 'ai',
                'tone': 'indigo',
                'url': url('aiproduct'),
            },
        ]

        secondary = [
            {
                'title': 'Tadqiqotlar',
                'desc': 'Faol tadqiqotlar va holatlar',
                'icon': 'research',
                'url': url('researchstudy'),
            },
            {
                'title': 'Tadqiqotlar matni',
                'desc': 'Bo‘lim sarlavhasi va “Nima uchun”',
                'icon': 'doc',
                'url': change_url('researchsection'),
            },
            {
                'title': 'Vakansiyalar',
                'desc': 'Ochiq lavozimlar va arizalar',
                'icon': 'doctor',
                'url': url('vacancy'),
            },
            {
                'title': 'Sharhlar',
                'desc': 'Mijoz va hamkor fikrlari',
                'icon': 'quote',
                'url': url('testimonial'),
            },
            {
                'title': 'Hamkorlar',
                'desc': 'Hamkor nomlari lentasi',
                'icon': 'partner',
                'url': url('partner'),
            },
            {
                'title': 'Xalqaro xizmatlar',
                'desc': 'Xorijiy bemorlar uchun kartalar',
                'icon': 'globe',
                'url': url('internationalservice'),
            },
            {
                'title': 'Klinika sayohati',
                'desc': 'Virtual tur va tadbir videolari',
                'icon': 'clinic',
                'url': url('clinictourvideo'),
            },
            {
                'title': 'Tadqiqot imkoniyatlari',
                'desc': 'Statistika qiymatlari',
                'icon': 'chart',
                'url': url('researchcapability'),
            },
        ]

        card_models = {
            'Murojaatlar': models.Inquiry,
            'Yangiliklar': models.NewsArticle,
            'Shifokorlar': models.Doctor,
            'Klinik yo‘nalishlar': models.Specialty,
            'Sayt sozlamalari': models.SiteSettings,
            'Bosh sahifa': models.HomePage,
            'AI mahsulotlar': models.AIProduct,
            'Tadqiqotlar': models.ResearchStudy,
            'Tadqiqotlar matni': models.ResearchSection,
            'Vakansiyalar': models.Vacancy,
            'Sharhlar': models.Testimonial,
            'Hamkorlar': models.Partner,
            'Xalqaro xizmatlar': models.InternationalService,
            'Klinika sayohati': models.ClinicTourVideo,
            'Tadqiqot imkoniyatlari': models.ResearchCapability,
        }
        primary = [card for card in primary if can_access(card_models[card['title']])]
        secondary = [card for card in secondary if can_access(card_models[card['title']])]

        is_hr_workspace = (
            request.user.groups.filter(name='HR bo‘limi').exists()
            and not request.user.is_superuser
        )
        if is_hr_workspace:
            vacancy_card = next((card for card in secondary if card['title'] == 'Vakansiyalar'), None)
            inquiry_card = next((card for card in primary if card['title'] == 'Murojaatlar'), None)
            primary = [card for card in (inquiry_card, vacancy_card) if card]
            secondary = []

        stats = [
            {'label': 'Yangi murojaat', 'value': new_leads, 'tone': 'mint', 'model': models.Inquiry},
            {'label': 'Yo‘nalishlar', 'value': models.Specialty.objects.count(), 'tone': 'navy', 'model': models.Specialty},
            {'label': 'Shifokorlar', 'value': models.Doctor.objects.count(), 'tone': 'teal', 'model': models.Doctor},
            {'label': 'Yangiliklar', 'value': models.NewsArticle.objects.count(), 'tone': 'sky', 'model': models.NewsArticle},
        ]
        if is_hr_workspace:
            stats = [
                {'label': 'Yangi murojaat', 'value': new_leads, 'tone': 'mint'},
                {'label': 'Ochiq vakansiya', 'value': models.Vacancy.objects.filter(is_active=True).count(), 'tone': 'navy'},
            ]
        else:
            stats = [{key: value for key, value in stat.items() if key != 'model'} for stat in stats if can_access(stat['model'])]

        extra = extra_context or {}
        extra.update({
            'mrii_stats': stats,
            'mrii_primary': primary,
            'mrii_secondary': secondary,
            'mrii_hr_workspace': is_hr_workspace,
        })
        return super().index(request, extra_context=extra)


mrii_admin_site = MriiAdminSite(name='admin')
