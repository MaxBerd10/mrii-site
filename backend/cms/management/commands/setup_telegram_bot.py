"""One-time bot setup: make the bot's menu button open the HR Mini App.

    docker compose exec web python manage.py setup_telegram_bot

Needs TELEGRAM_BOT_TOKEN in the server .env. Only calls Telegram; touches nothing else.
"""
import json

import requests
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from cms.telegram_bot import API, TIMEOUT, app_url


class Command(BaseCommand):
    help = 'Set the bot menu button to open the HR Mini App.'

    def handle(self, *args, **opts):
        token = settings.TELEGRAM_BOT_TOKEN
        if not token:
            raise CommandError('TELEGRAM_BOT_TOKEN sozlanmagan (.env).')
        url = app_url()
        if not url.startswith('https://'):
            raise CommandError(f'Mini App manzili https bo‘lishi shart (hozir: {url}). FRONTEND_URL ni tekshiring.')
        try:
            r = requests.post(
                f'{API}/bot{token}/setChatMenuButton',
                data={'menu_button': json.dumps({'type': 'web_app', 'text': 'Vakansiyalar', 'web_app': {'url': url}})},
                timeout=TIMEOUT,
            )
            r2 = requests.post(f'{API}/bot{token}/getMe', timeout=TIMEOUT)
        except requests.RequestException as exc:
            raise CommandError(f'Telegramga ulanib bo‘lmadi ({type(exc).__name__}).')
        if r.status_code != 200 or not r.json().get('ok'):
            raise CommandError(f'Telegram rad etdi: {r.text[:200]}')
        me = r2.json().get('result', {}) if r2.status_code == 200 else {}
        self.stdout.write(self.style.SUCCESS(f'Tayyor. Bot: @{me.get("username", "?")} → menyu tugmasi {url} ni ochadi.'))
