"""Fill empty RU/EN fields from UZ text via machine translation."""

from __future__ import annotations

import logging
import os

logger = logging.getLogger(__name__)

# Cursor/agent proxy env can break outbound Google Translate from runserver.
_PROXY_KEYS = (
    'HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy', 'all_proxy',
)


def _without_broken_proxy():
    """Temporarily drop loopback proxies that often fail outside the agent sandbox."""
    saved = {}
    for key in _PROXY_KEYS:
        val = os.environ.get(key)
        if not val:
            continue
        if '127.0.0.1' in val or 'localhost' in val:
            saved[key] = val
            os.environ.pop(key, None)
    return saved


def _restore_proxy(saved: dict):
    for key, val in saved.items():
        os.environ[key] = val


def translate_text(text: str, target: str) -> str:
    """Translate text → target lang ('ru' | 'en'). Does not cache failures."""
    text = (text or '').strip()
    if not text:
        return ''
    if target not in ('ru', 'en'):
        return ''

    cached = _cache_get(text, target)
    if cached is not None:
        return cached

    result, err = _translate_uncached(text, target)
    if result:
        _cache_set(text, target, result)
        return result
    if err:
        logger.warning('Translation failed (%s): %s — %s', target, text[:80], err)
    return ''


def translate_text_report(text: str, target: str) -> tuple[str, str]:
    """Return (translation, error_message)."""
    text = (text or '').strip()
    if not text:
        return '', 'Bo‘sh matn'
    result = translate_text(text, target)
    if result:
        return result, ''
    # One more uncached attempt with diagnostics
    result, err = _translate_uncached(text, target)
    if result:
        _cache_set(text, target, result)
        return result, ''
    return '', err or 'Tarjima xizmati javob bermadi'


_SUCCESS_CACHE: dict[tuple[str, str], str] = {}


def _cache_get(text: str, target: str):
    return _SUCCESS_CACHE.get((text, target))


def _cache_set(text: str, target: str, value: str):
    _SUCCESS_CACHE[(text, target)] = value


def _translate_uncached(text: str, target: str) -> tuple[str, str]:
    saved = _without_broken_proxy()
    try:
        from deep_translator import GoogleTranslator, MyMemoryTranslator

        last_err = ''
        for source in ('uz', 'auto'):
            try:
                out = GoogleTranslator(source=source, target=target).translate(text)
                out = (out or '').strip()
                if out:
                    return out, ''
                last_err = f'Google bo‘sh javob (source={source})'
            except Exception as exc:
                last_err = f'Google: {exc}'

        # Fallback — MyMemory (free, different endpoint)
        try:
            src = 'uz-UZ' if target == 'en' else 'uz-UZ'
            # MyMemory uses lang codes like en-GB / ru-RU
            tgt = 'en-GB' if target == 'en' else 'ru-RU'
            out = MyMemoryTranslator(source='uz-UZ', target=tgt).translate(text)
            out = (out or '').strip()
            if out:
                return out, ''
            last_err = (last_err + ' | MyMemory bo‘sh').strip(' |')
        except Exception as exc:
            last_err = f'{last_err} | MyMemory: {exc}'.strip(' |')

        return '', last_err
    finally:
        _restore_proxy(saved)


def autofill_from_uz(instance) -> list[str]:
    """
    For every *_uz field with text, fill matching *_ru / *_en if empty.
    Returns list of filled field names (for admin messages).
    """
    field_names = {
        f.name
        for f in instance._meta.get_fields()
        if getattr(f, 'concrete', False) and hasattr(f, 'attname')
    }
    filled: list[str] = []

    for uz_name in sorted(n for n in field_names if n.endswith('_uz')):
        base = uz_name[:-3]
        ru_name = f'{base}_ru'
        en_name = f'{base}_en'
        uz_val = (getattr(instance, uz_name, None) or '').strip()
        if not uz_val:
            continue

        if ru_name in field_names and not (getattr(instance, ru_name, None) or '').strip():
            ru = translate_text(uz_val, 'ru')
            if ru:
                setattr(instance, ru_name, ru)
                filled.append(ru_name)

        if en_name in field_names and not (getattr(instance, en_name, None) or '').strip():
            en = translate_text(uz_val, 'en')
            if en:
                setattr(instance, en_name, en)
                filled.append(en_name)

    return filled
