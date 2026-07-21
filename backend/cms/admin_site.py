from django.contrib.admin import AdminSite
from django.http import JsonResponse
from django.urls import path, reverse


class MriiAdminSite(AdminSite):
    site_header = 'MRII CMS'
    site_title = 'MRII CMS'
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
        """«MRII Kontent» breadcrumb /admin/cms/ — bo‘sh sahifa o‘rniga bosh dashboard."""
        from django.shortcuts import redirect

        return redirect('admin:index')

    def index(self, request, extra_context=None):
        from . import models

        def url(name: str) -> str:
            return reverse(f'admin:cms_{name}_changelist')

        def change_url(name: str) -> str:
            model_map = {
                'sitesettings': models.SiteSettings,
                'hero': models.Hero,
                'researchsection': models.ResearchSection,
            }
            obj = model_map[name].objects.first()
            if obj:
                return reverse(f'admin:cms_{name}_change', args=[obj.pk])
            return reverse(f'admin:cms_{name}_add')

        primary = [
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
                'title': 'Bosh ekran (Hero)',
                'desc': 'Asosiy fon rasmi va sertifikatlar.',
                'meta': 'Bosh sahifa',
                'icon': 'hero',
                'tone': 'mint',
                'url': change_url('hero'),
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
                'title': 'Ta’lim',
                'desc': 'Yo‘nalishlar va dasturlar',
                'icon': 'edu',
                'url': url('educationtrack'),
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
                'title': 'Tadqiqot imkoniyatlari',
                'desc': 'Statistika qiymatlari',
                'icon': 'chart',
                'url': url('researchcapability'),
            },
        ]

        extra = extra_context or {}
        extra.update({
            'mrii_stats': [
                {'label': 'Yo‘nalishlar', 'value': models.Specialty.objects.count(), 'tone': 'navy'},
                {'label': 'Shifokorlar', 'value': models.Doctor.objects.count(), 'tone': 'teal'},
                {'label': 'Yangiliklar', 'value': models.NewsArticle.objects.count(), 'tone': 'sky'},
                {'label': 'AI mahsulotlar', 'value': models.AIProduct.objects.count(), 'tone': 'indigo'},
            ],
            'mrii_primary': primary,
            'mrii_secondary': secondary,
        })
        return super().index(request, extra_context=extra)


mrii_admin_site = MriiAdminSite(name='admin')
