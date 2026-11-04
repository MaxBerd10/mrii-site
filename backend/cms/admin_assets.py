"""Admin page «Sayt rasmlari»: replace any picture/video of the website, or put the original back."""
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.template.response import TemplateResponse
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_POST


from . import site_assets
from .utils import absolute_frontend_url


class AssetAdminMixin:
    def _assets_guard(self, request):
        if not request.user.has_perm('cms.change_assetoverride'):
            raise PermissionDenied

    def site_assets_view(self, request):
        from . import models

        self._assets_guard(request)
        q = request.GET.get('q', '').strip().lower()
        group = request.GET.get('group', '')
        only_changed = request.GET.get('changed') == '1'
        overrides = {o.path: o for o in models.AssetOverride.objects.all()}

        counts, changed_counts, items = {}, {}, []
        for entry in site_assets.catalog():
            g = entry['group']
            counts[g] = counts.get(g, 0) + 1
            override = overrides.get(entry['path'])
            if override:
                changed_counts[g] = changed_counts.get(g, 0) + 1
            if group and g != group:
                continue
            if only_changed and not override:
                continue
            if q and q not in (entry['path'] + ' ' + ' '.join(entry['used_in'])).lower():
                continue
            items.append({
                **entry,
                'default_url': absolute_frontend_url(entry['path']),
                'current_url': override.file.url if override and override.file else absolute_frontend_url(entry['path']),
                'changed': bool(override),
                'name': entry['path'].rsplit('/', 1)[-1],
                'size_label': f"{entry['bytes'] / 1024:.0f} KB" if entry['bytes'] < 1_000_000 else f"{entry['bytes'] / 1_000_000:.1f} MB",
            })
        context = {
            **self.each_context(request),
            'title': 'Sayt rasmlari',
            'items': items,
            'q': request.GET.get('q', ''),
            'current_group': group,
            'only_changed': only_changed,
            'total_changed': sum(changed_counts.values()),
            'groups': [
                {'key': k, 'title': site_assets.group_title(k), 'hint': site_assets.group_hint(k),
                 'count': counts[k], 'changed': changed_counts.get(k, 0)}
                for k in site_assets.GROUPS if k in counts
            ],
            'max_image_mb': site_assets.MAX_IMAGE_BYTES // (1024 * 1024),
            'max_video_mb': site_assets.MAX_VIDEO_BYTES // (1024 * 1024),
        }
        return TemplateResponse(request, 'admin/cms/site_assets.html', context)

    @method_decorator(require_POST)
    def site_assets_upload(self, request):
        from . import models

        self._assets_guard(request)
        path = request.POST.get('path', '')
        entry = site_assets.by_path().get(path)
        uploaded = request.FILES.get('file')
        if not entry:
            return JsonResponse({'error': 'Noma’lum rasm.'}, status=400)
        if not uploaded:
            return JsonResponse({'error': 'Fayl tanlanmadi.'}, status=400)
        error = site_assets.validate_upload(uploaded, entry['kind'])
        if error:
            return JsonResponse({'error': error}, status=400)
        row = models.AssetOverride.objects.filter(path=path).first()
        old_name = row.file.name if row and row.file else ''
        if row:
            row.file = uploaded
            row.save()
        else:
            row = models.AssetOverride.objects.create(path=path, file=uploaded)
        if old_name and old_name != row.file.name:
            row.file.storage.delete(old_name)
        return JsonResponse({'ok': True, 'url': row.file.url})

    @method_decorator(require_POST)
    def site_assets_reset(self, request):
        from . import models

        self._assets_guard(request)
        row = models.AssetOverride.objects.filter(path=request.POST.get('path', '')).first()
        if row:
            name = row.file.name if row.file else ''
            row.delete()
            if name:
                row.file.storage.delete(name)
        return JsonResponse({'ok': True, 'url': absolute_frontend_url(request.POST.get('path', ''))})
