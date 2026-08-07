import json
from pathlib import Path

from django.core.management.base import BaseCommand

from cms import models


class Command(BaseCommand):
    help = (
        'One-time import of the real doctor profiles that used to live in '
        'src/data/doctors.ts (frontend) into the CMS Doctor model, so the '
        'admin panel becomes the source of truth for the /doctors pages.'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            default=str(Path(__file__).parent / 'data' / 'doctors_import.json'),
            help='Path to the doctors_import.json export.',
        )

    def handle(self, *args, **options):
        path = Path(options['file'])
        rows = json.loads(path.read_text(encoding='utf-8'))

        created, updated = 0, 0
        for i, row in enumerate(rows):
            uz = row['content']['uz']
            ru = row['content']['ru']
            en = row['content']['en']
            obj, was_created = models.Doctor.objects.update_or_create(
                slug=row['slug'],
                defaults={
                    'order': i + 1,
                    'staff_kind': row.get('staffKind', 'doctor'),
                    'name': uz['name'],
                    'role_uz': uz['role'], 'role_ru': ru['role'], 'role_en': en['role'],
                    'specialty_uz': uz['specialty'], 'specialty_ru': ru['specialty'], 'specialty_en': en['specialty'],
                    'experience_uz': uz['exp'], 'experience_ru': ru['exp'], 'experience_en': en['exp'],
                    'about_uz': uz['about'], 'about_ru': ru['about'], 'about_en': en['about'],
                    'education_uz': '|'.join(uz['education']),
                    'education_ru': '|'.join(ru['education']),
                    'education_en': '|'.join(en['education']),
                    'focuses_uz': '|'.join(uz['focuses']),
                    'focuses_ru': '|'.join(ru['focuses']),
                    'focuses_en': '|'.join(en['focuses']),
                    'languages_uz': '|'.join(uz['languages']),
                    'languages_ru': '|'.join(ru['languages']),
                    'languages_en': '|'.join(en['languages']),
                    'papers': str(row.get('papers', '')),
                    'studies': str(row.get('studies', '')),
                    'color': row.get('color', '#0B3D6B'),
                    'photo_url': row.get('photo', ''),
                    'is_active': True,
                },
            )
            created += was_created
            updated += not was_created

        self.stdout.write(self.style.SUCCESS(
            f'Doctors import done: {created} created, {updated} updated (total {len(rows)}).'
        ))
