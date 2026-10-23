import os
import uuid

from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone


def validate_resume_size(value, max_mb: int = 5):
    limit = max_mb * 1024 * 1024
    if value.size > limit:
        raise ValidationError(f'Fayl hajmi {max_mb}MB dan oshmasligi kerak.')


def client_ip(request) -> str:
    """Address of the real client behind TRUSTED_PROXY_COUNT proxies (spoof-resistant)."""
    remote = request.META.get('REMOTE_ADDR', '') or ''
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR', '')
    proxies = getattr(settings, 'TRUSTED_PROXY_COUNT', 0)
    if not proxies or not forwarded:
        return remote
    parts = [p.strip() for p in forwarded.split(',') if p.strip()]
    if not parts:
        return remote
    return parts[-min(proxies, len(parts))]


_RESUME_SIGNATURES = {
    '.pdf': (b'%PDF-',),
    '.docx': (b'PK\x03\x04',),
    '.doc': (b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1', b'PK\x03\x04', b'{\\rtf'),
}


def validate_resume_signature(value):
    """The file's first bytes must match its extension (blocks HTML/EXE renamed to .pdf)."""
    ext = os.path.splitext(getattr(value, 'name', '') or '')[1].lower()
    allowed = _RESUME_SIGNATURES.get(ext)
    if not allowed:
        return
    position = value.tell() if hasattr(value, 'tell') else 0
    head = value.read(8)
    value.seek(position)
    if not any(head.startswith(sig) for sig in allowed):
        raise ValidationError('Fayl mazmuni uning kengaytmasiga mos kelmaydi.')


def resume_upload_path(instance, filename):
    """Random file name: applicant CVs hold personal data and must not be guessable."""
    ext = os.path.splitext(filename or '')[1].lower()
    return f'resumes/{timezone.now():%Y/%m}/{uuid.uuid4().hex}{ext}'


def resolve_lang(request) -> str:
    lang = (request.query_params.get('lang') or '').lower().strip()
    if lang in settings.CMS_LANGS:
        return lang
    if lang:
        # Explicit-but-unsupported code (e.g. 'kaa' — the CMS has no per-
        # language content for it) must fall back to Uzbek deterministically,
        # not to the visitor's Accept-Language header. Otherwise a QARA-
        # selecting visitor silently sees whatever language their browser
        # happens to report instead of the intended Uzbek fallback.
        return 'uz'
    accept = (request.headers.get('Accept-Language') or '').lower()
    for code in settings.CMS_LANGS:
        if code in accept:
            return code
    return 'uz'


def pick(obj, base: str, lang: str, default: str = '') -> str:
    value = getattr(obj, f'{base}_{lang}', None)
    if value:
        return value
    for code in settings.CMS_LANGS:
        alt = getattr(obj, f'{base}_{code}', None)
        if alt:
            return alt
    return default


def absolute_frontend_url(path: str) -> str:
    """Turn /images/... into https://frontend/images/... for admin/API consumers."""
    if not path:
        return ''
    if path.startswith('http://') or path.startswith('https://'):
        return path
    if path.startswith('/'):
        base = getattr(settings, 'FRONTEND_URL', '').rstrip('/')
        return f'{base}{path}' if base else path
    return path


def media_url(request, file_field, url_field: str = '') -> str:
    f = file_field
    if f:
        try:
            return request.build_absolute_uri(f.url)
        except ValueError:
            pass
    if url_field:
        # Keep site static paths relative so React doesn't reload the same image
        # as https://domain/images/... after CMS hydrates (refresh blink).
        if url_field.startswith('/images/') or url_field.startswith('/assets/') or url_field.startswith('/videos/'):
            return url_field
        return absolute_frontend_url(url_field)
    return ''


def split_pipe(text: str) -> list[str]:
    if not text:
        return []
    return [p.strip() for p in text.split('|') if p.strip()]
