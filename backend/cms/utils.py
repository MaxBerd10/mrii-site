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


def media_url(request, file_field, url_field: str = '') -> str:
    f = file_field
    if f:
        try:
            return request.build_absolute_uri(f.url)
        except ValueError:
            pass
    if url_field:
        if url_field.startswith('http://') or url_field.startswith('https://'):
            return url_field
        if url_field.startswith('/'):
            # Frontend public path — return as-is for Vite to serve
            return url_field
    return url_field or ''


def split_pipe(text: str) -> list[str]:
    if not text:
        return []
    return [p.strip() for p in text.split('|') if p.strip()]
