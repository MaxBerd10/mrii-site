"""Admin navigation, «Sayt sahifalari» hub and the global search box."""
from django.conf import settings
from django.http import JsonResponse
from django.template.response import TemplateResponse
from django.urls import reverse

from . import site_assets, site_pages, site_texts


def _front(path: str) -> str:
    base = (getattr(settings, 'FRONTEND_URL', '') or '').rstrip('/')
    return f'{base}{path}' if base else path


class HubAdminMixin:
    # ───────────── helpers ─────────────
    def _can(self, request, model) -> bool:
        opts = model._meta
        return any(
            request.user.has_perm(f'{opts.app_label}.{action}_{opts.model_name}')
            for action in ('view', 'change', 'add', 'delete')
        )

    def _is_hr_workspace(self, request) -> bool:
        return (
            request.user.is_authenticated
            and not request.user.is_superuser
            and request.user.groups.filter(name='HR bo‘limi').exists()
        )

    def _model_urls(self, name: str, single: bool):
        from . import models

        model = {m._meta.model_name: m for m in (
            models.SiteSettings, models.HomePage, models.ResearchSection, models.Testimonial, models.Specialty,
            models.ClinicTourVideo, models.Doctor, models.PriceItem, models.CheckupDirection, models.PriceCategory,
            models.NewsArticle, models.ResearchStudy, models.ResearchCapability, models.AIProduct, models.Vacancy,
            models.Inquiry, models.DoctorReview,
        )}[name]
        if single:
            obj = model.objects.first()
            url = reverse(f'admin:cms_{name}_change', args=[obj.pk]) if obj else reverse(f'admin:cms_{name}_add')
            return model, url, None
        return model, reverse(f'admin:cms_{name}_changelist'), reverse(f'admin:cms_{name}_add')

    # ───────────── navigation (every admin page) ─────────────
    def mrii_nav(self, request):
        from django.contrib.auth.models import User

        from . import models

        path = request.path

        def item(label, url, icon, model=None, match=None):
            if model is not None and not self._can(request, model):
                return None
            prefixes = match if match is not None else [url]
            active = any(path == p or (p != reverse('admin:index') and path.startswith(p)) for p in prefixes)
            return {'label': label, 'url': url, 'icon': icon, 'active': active}

        home = {'label': 'Bosh sahifa', 'url': reverse('admin:index'), 'icon': 'home',
                'active': path == reverse('admin:index')}
        if self._is_hr_workspace(request):
            groups = [{'title': '', 'items': [home, item('Arizalar', reverse('admin:cms_inquiry_changelist'), 'inbox', models.Inquiry),
                                              item('Vakansiyalar', reverse('admin:cms_vacancy_changelist'), 'briefcase', models.Vacancy)]}]
        else:
            groups = [
                {'title': '', 'items': [
                    home,
                    item('Sayt sahifalari', reverse('admin:cms_pages'), 'map', None, [reverse('admin:cms_pages')]),
                ]},
                {'title': 'Kundalik ishlar', 'items': [
                    item('Murojaatlar', reverse('admin:cms_inquiry_changelist'), 'inbox', models.Inquiry),
                    item('Yangiliklar', reverse('admin:cms_newsarticle_changelist'), 'news', models.NewsArticle),
                    item('Shifokorlar', reverse('admin:cms_doctor_changelist'), 'doctor', models.Doctor),
                    item('Shifokor sharhlari', reverse('admin:cms_doctorreview_changelist') + '?is_approved__exact=0', 'check', models.DoctorReview,
                         [reverse('admin:cms_doctorreview_changelist')]),
                    item('Narxlar', reverse('admin:cms_priceitem_changelist'), 'price', models.PriceItem,
                         [reverse('admin:cms_priceitem_changelist'), reverse('admin:cms_pricecategory_changelist'),
                          reverse('admin:cms_checkupdirection_changelist')]),
                    item('Vakansiyalar', reverse('admin:cms_vacancy_changelist'), 'briefcase', models.Vacancy),
                ]},
                {'title': 'Sayt ko‘rinishi', 'items': [
                    item('Sayt matnlari', reverse('admin:cms_texts'), 'text', models.TextOverride),
                    item('Sayt rasmlari', reverse('admin:cms_assets'), 'image', models.AssetOverride),
                    item('Aloqa ma’lumotlari', self._model_urls('sitesettings', True)[1], 'phone', models.SiteSettings,
                         ['/admin/cms/sitesettings/']),
                ]},
                {'title': 'Yordam', 'items': [
                    item('Qo‘llanma', reverse('admin:cms_guide'), 'book'),
                ]},
                {'title': 'Tizim', 'items': [
                    item('Xodimlar', reverse('admin:auth_user_changelist'), 'users', User, ['/admin/auth/']),
                    item('HR Telegram', reverse('admin:cms_hrtelegramuser_changelist'), 'send', models.HRTelegramUser),
                ]},
            ]
        for g in groups:
            g['items'] = [i for i in g['items'] if i]
        return [g for g in groups if g['items']]

    def each_context(self, request):
        context = super().each_context(request)
        if request.user.is_authenticated:
            context['mrii_nav'] = self.mrii_nav(request)
            context['mrii_front'] = _front('/')
        return context

    # ───────────── «Sayt sahifalari» ─────────────
    def pages_view(self, request):
        from . import models  # noqa: F401

        cards = []
        for page in site_pages.PAGES:
            cards.append({
                'key': page['key'], 'title': page['title'], 'blurb': page['blurb'],
                'url': reverse('admin:cms_page', args=[page['key']]),
                'view_url': _front(page['path']),
            })
        return TemplateResponse(request, 'admin/cms/pages.html', {
            **self.each_context(request), 'title': 'Sayt sahifalari', 'pages': cards,
        })

    def page_detail_view(self, request, key):
        from django.http import Http404

        from . import models

        page = site_pages.page_by_key(key)
        if not page:
            raise Http404
        overrides_by_section: dict[str, int] = {}
        for ov in models.TextOverride.objects.all():
            entry = site_texts.by_key().get(ov.key)
            if entry and any(getattr(ov, l) and getattr(ov, l) != entry[l] for l in site_texts.LANGS):
                sec = site_texts.section_of(ov.key)
                overrides_by_section[sec] = overrides_by_section.get(sec, 0) + 1
        counts: dict[str, int] = {}
        for entry in site_texts.catalog():
            sec = site_texts.section_of(entry['key'])
            counts[sec] = counts.get(sec, 0) + 1
        can_texts = request.user.has_perm('cms.change_textoverride')
        texts = [{
            'title': site_texts.section_title(s), 'count': counts.get(s, 0), 'changed': overrides_by_section.get(s, 0),
            'url': f"{reverse('admin:cms_texts')}?section={s}",
        } for s in page['text_sections'] if counts.get(s)] if can_texts else []

        replaced = {o.path for o in models.AssetOverride.objects.all()}
        assets_by_group: dict[str, list] = {}
        for e in site_assets.catalog():
            assets_by_group.setdefault(e['group'], []).append(e['path'])
        can_assets = request.user.has_perm('cms.change_assetoverride')
        assets = [{
            'title': site_assets.group_title(g), 'hint': site_assets.group_hint(g),
            'count': len(assets_by_group.get(g, [])),
            'changed': sum(1 for p in assets_by_group.get(g, []) if p in replaced),
            'url': f"{reverse('admin:cms_assets')}?group={g}",
        } for g in page['asset_groups'] if assets_by_group.get(g)] if can_assets else []

        records = []
        for name, label, hint, single in page['models']:
            model, url, add_url = self._model_urls(name, single)
            if not self._can(request, model):
                continue
            records.append({
                'label': label, 'hint': hint, 'url': url,
                'add_url': add_url if add_url and request.user.has_perm(f'cms.add_{name}') else None,
                'count': None if single else model.objects.count(),
                'single': single,
            })
        return TemplateResponse(request, 'admin/cms/page_detail.html', {
            **self.each_context(request), 'title': page['title'], 'page': page,
            'view_url': _front(page['path']), 'texts': texts, 'assets': assets, 'records': records,
        })

    # ───────────── global search ─────────────
    def search_view(self, request):
        from django.db.models import Q

        from . import models

        q = (request.GET.get('q') or '').strip()
        if len(q) < 2:
            return JsonResponse({'groups': []})
        low = q.lower()
        groups = []

        def add(title, rows):
            if rows:
                groups.append({'title': title, 'items': rows})

        def qs_rows(model, fields, title_fn, sub_fn, url_name, limit=5, base=None):
            if not self._can(request, model):
                return []
            cond = Q()
            for f in fields:
                cond |= Q(**{f'{f}__icontains': q})
            rows = []
            for obj in (base if base is not None else model.objects.all()).filter(cond)[:limit]:
                rows.append({'title': title_fn(obj), 'sub': sub_fn(obj), 'url': reverse(url_name, args=[obj.pk])})
            return rows

        hr = self._is_hr_workspace(request)
        if not hr:
            if request.user.has_perm('cms.change_textoverride'):
                rows = []
                for e in site_texts.catalog():
                    hay = ' '.join([e['uz'], e['ru'], e['en']]).lower()
                    if low in hay or low in e['key'].lower():
                        rows.append({'title': (e['uz'] or e['ru'])[:90], 'sub': site_texts.section_title(site_texts.section_of(e['key'])),
                                     'url': f"{reverse('admin:cms_texts')}?key={e['key']}"})
                        if len(rows) >= 6:
                            break
                add('Sayt matnlari', rows)
            add('Narxlar', qs_rows(models.PriceItem, ['name_uz', 'name_ru', 'name_en'],
                                   lambda o: o.name_uz, lambda o: f'{o.price_citizen:,}'.replace(',', ' ') + ' so‘m · ' + o.category.name_uz,
                                   'admin:cms_priceitem_change'))
            add('Shifokorlar', qs_rows(models.Doctor, ['name', 'role_uz', 'specialty_uz'],
                                       lambda o: o.name, lambda o: o.role_uz, 'admin:cms_doctor_change'))
            add('Yangiliklar', qs_rows(models.NewsArticle, ['title_uz', 'title_ru', 'title_en'],
                                       lambda o: o.title_uz, lambda o: o.category_uz, 'admin:cms_newsarticle_change'))
            add('Klinik yo‘nalishlar', qs_rows(models.Specialty, ['name_uz', 'name_ru', 'name_en'],
                                               lambda o: o.name_uz, lambda o: '', 'admin:cms_specialty_change'))
            add('AI mahsulotlar', qs_rows(models.AIProduct, ['name_uz', 'name_ru', 'name_en'],
                                          lambda o: o.name_uz, lambda o: '', 'admin:cms_aiproduct_change'))
            if request.user.has_perm('cms.change_assetoverride'):
                rows = [{'title': e['path'].rsplit('/', 1)[-1], 'sub': site_assets.group_title(e['group']),
                         'url': f"{reverse('admin:cms_assets')}?group={e['group']}&q={e['path'].rsplit('/', 1)[-1]}"}
                        for e in site_assets.catalog() if low in e['path'].lower()][:5]
                add('Rasm va videolar', rows)
        add('Vakansiyalar', qs_rows(models.Vacancy, ['title_uz', 'title_ru', 'title_en'],
                                    lambda o: o.title_uz, lambda o: o.department_uz, 'admin:cms_vacancy_change'))
        inquiry_base = models.Inquiry.objects.filter(intent=models.Inquiry.Intent.CAREER) if hr else models.Inquiry.objects.all()
        add('Murojaat va arizalar', qs_rows(models.Inquiry, ['name', 'phone', 'request_id'],
                                            lambda o: o.name, lambda o: f'{o.phone} · {o.request_id}',
                                            'admin:cms_inquiry_change', base=inquiry_base))
        return JsonResponse({'groups': groups})
