"""Authentication for the Telegram HR Mini App.

The Mini App sends ``Authorization: tma <initData>``. initData is signed by Telegram with a key
derived from the bot token, so only someone who really opened the app inside Telegram — as a
specific Telegram account — can produce it. We additionally require that account to be on the
allow-list (``HRTelegramUser``), so merely knowing the bot is not enough.
https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
"""
import hashlib
import hmac
import json
import time
from urllib.parse import parse_qsl

from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication

from .models import HRTelegramUser


class InvalidInitData(Exception):
    pass


def validate_init_data(init_data: str, bot_token: str, max_age: int, now: float | None = None) -> dict:
    """Return the Telegram ``user`` dict if initData is genuine and fresh, else raise."""
    if not init_data or not bot_token:
        raise InvalidInitData('missing')
    try:
        pairs = parse_qsl(init_data, keep_blank_values=True, strict_parsing=True)
    except ValueError:
        raise InvalidInitData('malformed')
    fields = dict(pairs)
    received_hash = fields.pop('hash', '')
    if not received_hash:
        raise InvalidInitData('no hash')

    data_check_string = '\n'.join(f'{k}={v}' for k, v in sorted(fields.items()))
    secret_key = hmac.new(b'WebAppData', bot_token.encode(), hashlib.sha256).digest()
    expected = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, received_hash):
        raise InvalidInitData('bad signature')

    try:
        auth_date = int(fields.get('auth_date', ''))
    except ValueError:
        raise InvalidInitData('bad auth_date')
    current = time.time() if now is None else now
    if auth_date > current + 60 or current - auth_date > max_age:
        raise InvalidInitData('expired')

    try:
        user = json.loads(fields.get('user', ''))
        int(user['id'])
    except (ValueError, KeyError, TypeError):
        raise InvalidInitData('no user')
    return user


class TelegramNotConfigured(exceptions.APIException):
    status_code = 503
    default_detail = 'Telegram bot sozlanmagan.'
    default_code = 'telegram_not_configured'


class TelegramInitDataAuthentication(BaseAuthentication):
    keyword = 'tma'

    def authenticate_header(self, request):
        return self.keyword

    def authenticate(self, request):
        header = request.META.get('HTTP_AUTHORIZATION', '')
        scheme, _, init_data = header.partition(' ')
        if scheme.lower() != self.keyword or not init_data:
            return None  # let permission classes answer 401
        if not settings.TELEGRAM_BOT_TOKEN:
            raise TelegramNotConfigured()
        try:
            user = validate_init_data(
                init_data.strip(), settings.TELEGRAM_BOT_TOKEN, settings.TELEGRAM_INITDATA_MAX_AGE
            )
        except InvalidInitData:
            raise exceptions.AuthenticationFailed('Telegram imzosi noto‘g‘ri yoki eskirgan. Mini Appni qayta oching.')
        hr = HRTelegramUser.objects.filter(telegram_id=int(user['id']), is_active=True).first()
        if hr is None:
            raise exceptions.PermissionDenied('Sizga bu bo‘limga kirish ruxsat etilmagan.')
        return hr, None
