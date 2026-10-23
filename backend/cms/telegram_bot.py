"""Tiny Telegram Bot API client (outbound only; no webhook needed).

Never log URLs or exception text from requests: they contain the bot token.
"""
import html
import logging
import threading

import requests
from django.conf import settings

logger = logging.getLogger(__name__)
API = 'https://api.telegram.org'
TIMEOUT = 10


def is_configured() -> bool:
    return bool(settings.TELEGRAM_BOT_TOKEN)


def _call(method: str, data: dict, files: dict | None = None) -> bool:
    if not is_configured():
        return False
    try:
        r = requests.post(f'{API}/bot{settings.TELEGRAM_BOT_TOKEN}/{method}', data=data, files=files, timeout=TIMEOUT)
        if r.status_code != 200:
            logger.warning('Telegram %s -> HTTP %s', method, r.status_code)
            return False
        return True
    except requests.RequestException as exc:  # message would leak the token-bearing URL
        logger.warning('Telegram %s failed: %s', method, type(exc).__name__)
        return False


def send_message(chat_id: int, text: str, web_app_url: str | None = None, button: str = 'Ochish') -> bool:
    import json

    data = {'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML', 'disable_web_page_preview': 'true'}
    if web_app_url:
        data['reply_markup'] = json.dumps({'inline_keyboard': [[{'text': button, 'web_app': {'url': web_app_url}}]]})
    return _call('sendMessage', data)


def send_document(chat_id: int, filename: str, content, caption: str = '') -> bool:
    return _call(
        'sendDocument',
        {'chat_id': chat_id, 'caption': caption[:1000], 'parse_mode': 'HTML'},
        files={'document': (filename, content)},
    )


def app_url(tab: str = '') -> str:
    base = f'{settings.FRONTEND_URL}/hr'
    return f'{base}?tab={tab}' if tab else base


def notify_new_application(inquiry) -> None:
    """Tell every active HR account about a new job application (fire-and-forget)."""
    if not is_configured():
        return

    def work():
        from .models import HRTelegramUser

        e = html.escape
        lines = ['🆕 <b>Yangi ish arizasi</b>', f'👤 {e(inquiry.name)}', f'📞 {e(inquiry.phone)}']
        if inquiry.topic:
            lines.append(f'💼 {e(inquiry.topic)}')
        if inquiry.message:
            lines.append(f'💬 {e(inquiry.message[:300])}')
        lines.append('📎 Rezyume bor' if inquiry.resume else '📎 Rezyume yo‘q')
        text = '\n'.join(lines)
        for hr in HRTelegramUser.objects.filter(is_active=True):
            send_message(hr.telegram_id, text, web_app_url=app_url('apps'), button='Arizalarni ochish')

    threading.Thread(target=work, daemon=True).start()
