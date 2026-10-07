"""Remove the template's demo news and fabricated testimonials from the CMS database.

Dry-run by default. ``--apply`` writes a JSON backup first; ``--restore FILE`` puts it back.

    docker compose exec web python manage.py remove_demo_content            # preview
    docker compose exec web python manage.py remove_demo_content --apply    # delete (backup in /app/media/backups)
    docker compose exec web python manage.py remove_demo_content --restore /app/media/backups/<file>.json
"""
import os
import time

from django.core import serializers
from django.core.management.base import BaseCommand, CommandError

from cms import models

DEMO_NEWS_SLUGS = ('car-t-therapy-study', 'ai-radiology-certified', 'residency-2025-2027')
DEMO_TESTIMONIAL_AUTHORS = ('Elena Kovaleva', 'Dmitriy Volkov', 'Anna Petrova')
# Template licence number (Russian-style 'LO-77' format) that was seeded into SiteSettings.
DEMO_LICENSE_MARK = 'LO-77-01-024876'
DEMO_LICENSE_MARK_RU = 'ЛО-77-01-024876'


def demo_license_settings():
    from django.db.models import Q

    return models.SiteSettings.objects.filter(
        Q(license_uz__contains=DEMO_LICENSE_MARK)
        | Q(license_en__contains=DEMO_LICENSE_MARK)
        | Q(license_ru__contains=DEMO_LICENSE_MARK)
        | Q(license_ru__contains=DEMO_LICENSE_MARK_RU)
    )


def demo_querysets():
    return [
        models.NewsArticle.objects.filter(slug__in=DEMO_NEWS_SLUGS),
        models.Testimonial.objects.filter(author_uz__in=DEMO_TESTIMONIAL_AUTHORS),
    ]


class Command(BaseCommand):
    help = 'Delete demo news and fabricated testimonials (dry-run unless --apply).'

    def add_arguments(self, parser):
        parser.add_argument('--apply', action='store_true', help='Actually delete (writes a backup first).')
        parser.add_argument('--restore', metavar='FILE', help='Restore objects from a backup written by --apply.')
        parser.add_argument('--backup-dir', default='/app/media/backups')

    def handle(self, *args, **options):
        if options['restore']:
            return self.restore(options['restore'])

        rows = [obj for qs in demo_querysets() for obj in qs]
        license_rows = list(demo_license_settings())
        if not rows and not license_rows:
            self.stdout.write('Demo kontent topilmadi — hech narsa qilinmadi.')
            return
        for obj in rows:
            self.stdout.write(f'  o‘chiriladi: {obj._meta.verbose_name} [{obj.pk}] {obj}')
        for obj in license_rows:
            self.stdout.write(f'  tozalanadi: Sayt sozlamalari [{obj.pk}] litsenziya = {obj.license_uz!r}')

        if not options['apply']:
            self.stdout.write(self.style.WARNING('Dry-run: hech narsa o‘zgarmadi. O‘chirish uchun --apply.'))
            return

        os.makedirs(options['backup_dir'], exist_ok=True)
        path = os.path.join(options['backup_dir'], f'demo_content_backup_{time.strftime("%Y%m%dT%H%M%S")}.json')
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(serializers.serialize('json', rows + license_rows, ensure_ascii=False))
        for qs in demo_querysets():
            qs.delete()
        for obj in license_rows:
            obj.license_uz = obj.license_ru = obj.license_en = ''
            obj.save(update_fields=['license_uz', 'license_ru', 'license_en'])
        self.stdout.write(self.style.SUCCESS(
            f'O‘chirildi: {len(rows)} ta, litsenziya tozalandi: {len(license_rows)} ta. Qaytarish nusxasi: {path}'
        ))

    def restore(self, path):
        if not os.path.exists(path):
            raise CommandError(f'Fayl topilmadi: {path}')
        with open(path, encoding='utf-8') as fh:
            count = 0
            for obj in serializers.deserialize('json', fh.read()):
                obj.save()
                count += 1
        self.stdout.write(self.style.SUCCESS(f'Tiklandi: {count} ta.'))
