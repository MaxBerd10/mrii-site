from django.conf import settings


def resolve_lang(request) -> str:
    lang = (request.query_params.get('lang') or '').lower().strip()
    if lang in settings.CMS_LANGS:
        return lang
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
        return absolute_frontend_url(url_field)
    return ''


def split_pipe(text: str) -> list[str]:
    if not text:
        return []
    return [p.strip() for p in text.split('|') if p.strip()]
