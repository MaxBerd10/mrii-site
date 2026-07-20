from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

from cms.admin_site import mrii_admin_site

urlpatterns = [
    path('admin/', mrii_admin_site.urls),
    path('api/', include('cms.urls')),
]

# Media files (local / Docker volume). Prefer object storage in large prod.
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
if not settings.DEBUG:
    from django.urls import re_path
    from django.views.static import serve

    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
