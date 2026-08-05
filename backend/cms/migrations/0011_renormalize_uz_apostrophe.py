import re

from django.db import migrations

CANON = '\u2019'
_WRONG = ('\u2018', '\u02bb', '\u02bc', "'")


def normalize_uz_apostrophe(text: str) -> str:
    if not text:
        return text
    for ch in _WRONG:
        text = text.replace(ch, CANON)
    text = re.sub(r'Farg[\u2018\u02bb\u0027]ona', f'Farg{CANON}ona', text)
    text = re.sub(r'Farg[\u2018\u02bb\u0027]onada', f'Farg{CANON}onada', text)
    return text


def fix_text_fields(instance, field_names):
    changed_fields = []
    for name in field_names:
        value = getattr(instance, name, '')
        if not isinstance(value, str) or not value:
            continue
        fixed = normalize_uz_apostrophe(value)
        if fixed != value:
            setattr(instance, name, fixed)
            changed_fields.append(name)
    if changed_fields:
        instance.save(update_fields=changed_fields)


def forwards(apps, schema_editor):
    HomePage = apps.get_model('cms', 'HomePage')
    SiteSettings = apps.get_model('cms', 'SiteSettings')
    Vacancy = apps.get_model('cms', 'Vacancy')

    homepage_fields = (
        'eyebrow_uz', 'title_lead_uz', 'title_em_uz', 'lead_uz',
        'metric_1_label_uz', 'metric_2_label_uz', 'metric_3_label_uz', 'metric_4_label_uz',
    )
    for row in HomePage.objects.all():
        fix_text_fields(row, homepage_fields)

    settings_fields = (
        'institute_name', 'slogan_uz', 'copyright_uz', 'copyright_ru', 'copyright_en',
        'badge_uz', 'license_uz',
    )
    for row in SiteSettings.objects.all():
        fix_text_fields(row, settings_fields)

    for row in Vacancy.objects.all():
        fix_text_fields(row, ('location_uz',))


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0010_alter_homepage_team_image_url'),
    ]

    operations = [
        migrations.RunPython(forwards, migrations.RunPython.noop),
    ]
