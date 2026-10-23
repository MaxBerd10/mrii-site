import os
import uuid

from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone


# Applicants send whatever they have: PDF/Word, a phone photo of a paper CV (JPG/PNG, iPhone HEIC),
# or plain text. Anything else is rejected with a clear message.
RESUME_EXTENSIONS = ('pdf', 'doc', 'docx', 'rtf', 'odt', 'txt', 'jpg', 'jpeg', 'png', 'webp', 'heic', 'heif')
RESUME_MAX_MB = 10


def validate_resume_size(value, max_mb: int = RESUME_MAX_MB):
    limit = max_mb * 1024 * 1024
    if value.size > limit:
        raise ValidationError(f'Fayl hajmi {max_mb}MB dan oshmasligi kerak.')
    if value.size == 0:
        raise ValidationError('Fayl bo‘sh.')


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


_OLE = b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1'
_ZIP = b'PK\x03\x04'
_HEIF_BRANDS = (b'heic', b'heix', b'heim', b'heis', b'hevc', b'hevx', b'mif1', b'msf1')


def _looks_like(ext: str, head: bytes) -> bool:
    if ext == 'pdf':
        return b'%PDF-' in head[:1024]  # the spec allows junk before the header
    if ext == 'docx' or ext == 'odt':
        return head.startswith(_ZIP)
    if ext == 'doc':
        return head.startswith((_OLE, _ZIP, b'{\\rtf'))
    if ext == 'rtf':
        return head.lstrip().startswith(b'{\\rtf')
    if ext in ('jpg', 'jpeg'):
        return head.startswith(b'\xff\xd8\xff')
    if ext == 'png':
        return head.startswith(b'\x89PNG\r\n\x1a\n')
    if ext == 'webp':
        return head[:4] == b'RIFF' and head[8:12] == b'WEBP'
    if ext in ('heic', 'heif'):
        return head[4:8] == b'ftyp' and head[8:12] in _HEIF_BRANDS
    if ext == 'txt':
        return b'\x00' not in head  # text only: no binary files renamed to .txt
    return False


def validate_resume_signature(value):
    """The file's first bytes must match its extension (blocks HTML/EXE renamed to .pdf)."""
    ext = os.path.splitext(getattr(value, 'name', '') or '')[1].lower().lstrip('.')
    if ext not in RESUME_EXTENSIONS:
        return  # the extension validator reports this
    position = value.tell() if hasattr(value, 'tell') else 0
    head = value.read(2048)
    value.seek(position)
    if not _looks_like(ext, head):
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
