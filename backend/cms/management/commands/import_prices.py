from django.core.management.base import BaseCommand

from cms import models
from cms.price_seed import import_prices


class Command(BaseCommand):
    help = 'Load the built-in price list into the admin (only when it is still empty; --replace wipes and reloads).'

    def add_arguments(self, parser):
        parser.add_argument('--replace', action='store_true', help='Delete current prices and reload the built-in list.')

    def handle(self, *args, **opts):
        items, checkups = import_prices(
            models.PriceCategory, models.PriceItem, models.CheckupDirection, models.CheckupTier,
            replace=opts['replace'],
        )
        self.stdout.write(f'{items} ta xizmat narxi, {checkups} ta check-up yo‘nalishi yuklandi.')
