"""Allow a Telegram account to use the HR Mini App.

    docker compose exec web python manage.py add_hr_telegram 123456789 --name "Nigmatova S.A."
    docker compose exec web python manage.py add_hr_telegram 123456789 --deactivate

The numeric id comes from the person's Telegram (e.g. via @userinfobot) — it is NOT a phone
number or @username.
"""
from django.core.management.base import BaseCommand, CommandError

from cms.models import HRTelegramUser


class Command(BaseCommand):
    help = 'Add/enable (or --deactivate) a Telegram account for the HR Mini App.'

    def add_arguments(self, parser):
        parser.add_argument('telegram_id', type=int)
        parser.add_argument('--name', default='')
        parser.add_argument('--deactivate', action='store_true')

    def handle(self, *args, **opts):
        tid = opts['telegram_id']
        if tid <= 0:
            raise CommandError('Telegram ID musbat son bo‘lishi kerak.')
        obj, created = HRTelegramUser.objects.get_or_create(telegram_id=tid, defaults={'name': opts['name']})
        if opts['name']:
            obj.name = opts['name']
        obj.is_active = not opts['deactivate']
        obj.save()
        state = 'faol' if obj.is_active else 'o‘chirilgan'
        self.stdout.write(self.style.SUCCESS(f'{"Qo‘shildi" if created else "Yangilandi"}: {obj} ({tid}) — {state}'))
