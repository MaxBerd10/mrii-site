import re

from django.conf import settings
from django.http import Http404
from django.urls import include, path, re_path
from django.views.static import serve

from cms.admin_site import mrii_admin_site

urlpatterns = [
    path('admin/', mrii_admin_site.urls),
    path('api/', include('cms.urls')),
]

# Only these upload folders are public site imagery/video (see `upload_to` in cms/models.py).
# Everything else under MEDIA_ROOT — applicant resumes (`resumes/`), management-command
# backups (`backups/`), anything dropped there later — is never served by this route.
# Staff download resumes through the authenticated admin view (admin:cms_inquiry_resume).
PUBLIC_MEDIA_PREFIXES = (
    'ai/', 'clinic-tour/', 'doctors/', 'hero/', 'homepage/', 'news/', 'specialties/',
)


def public_media(request, path):
    if not path.startswith(PUBLIC_MEDIA_PREFIXES):
        raise Http404('Not found')
    return serve(request, path, document_root=settings.MEDIA_ROOT)


_media_prefix = re.escape(settings.MEDIA_URL.strip('/'))
urlpatterns += [
    re_path(rf'^{_media_prefix}/(?P<path>.*)$', public_media),
]
