"""Replace legacy MRII branding with FJSTI in the CMS database."""

from django.core.management.base import BaseCommand
from django.db import models as dj_models

from cms import models


FJSTI_SETTINGS = {
    'institute_name': "FJSTI ko'p tarmoqli klinikasi",
    'copyright_uz': "© 2026 Farg’ona Jamoat Salomatligi Tibbiyot Instituti. Barcha huquqlar himoyalangan.",
    'copyright_ru': '© 2026 Ферганский медицинский институт общественного здоровья. Все права защищены.',
    'copyright_en': '© 2026 Ferghana Medical Institute of Public Health. All rights reserved.',
}

# Longer phrases first so partial replacements stay safe.
TEXT_REPLACEMENTS = (
    ('Medical Research & Innovation Institute (MRII)', FJSTI_SETTINGS['institute_name']),
    ('MRII Academy', 'FJSTI akademiyasi'),
    ('MRII akademiyasi', 'FJSTI akademiyasi'),
    ('Академия MRII', 'Академия FJSTI'),
    ('MRII', 'FJSTI'),
)


def scrub_text(value: str) -> str:
    out = value
    for old, new in TEXT_REPLACEMENTS:
        out = out.replace(old, new)
    return out


def scrub_model_instance(obj) -> bool:
    changed = False
    for field in obj._meta.get_fields():
        if not isinstance(field, (dj_models.CharField, dj_models.TextField)):
            continue
        if field.many_to_many or field.one_to_many:
            continue
        name = field.name
        raw = getattr(obj, name, None)
        if not raw or not isinstance(raw, str):
            continue
        cleaned = scrub_text(raw)
        if cleaned != raw:
            setattr(obj, name, cleaned)
            changed = True
    return changed


class Command(BaseCommand):
    help = 'Replace MRII branding with FJSTI across CMS content (safe to re-run).'

    def handle(self, *args, **options):
        updated_rows = 0

        settings_obj, _ = models.SiteSettings.objects.get_or_create(pk=1)
        for key, value in FJSTI_SETTINGS.items():
            setattr(settings_obj, key, value)
        settings_obj.save()
        updated_rows += 1
        self.stdout.write('Updated SiteSettings (copyright + institute name).')

        cms_models = [
            models.Hero,
            models.HomePage,
            models.Specialty,
            models.Doctor,
            models.NewsArticle,
            models.AIProduct,
            models.ResearchSection,
            models.ResearchStudy,
            models.ResearchCapability,
            models.EducationTrack,
            models.Testimonial,
            models.ClinicTourVideo,
            models.Vacancy,
            models.Inquiry,
        ]

        for model in cms_models:
            for obj in model.objects.all():
                if scrub_model_instance(obj):
                    obj.save()
                    updated_rows += 1

        self.stdout.write(self.style.SUCCESS(f'FJSTI rebrand complete ({updated_rows} rows touched).'))
