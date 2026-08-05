from django.db import migrations


RU = {
    'eyebrow_ru': 'С 2008 года · ISO 9001:2015 · GCP',
    'title_lead_ru': 'Надёжная медицина в Фергане —',
    'title_em_ru': 'опытные врачи',
    'lead_ru': (
        '11 направлений, запись по телефону и современная диагностика. '
        'Решение всегда за врачом; AiShifokor помогает на приёме.'
    ),
    'metric_1_label_ru': 'Клинических направлений',
    'metric_2_label_ru': 'Специалистов-врачей',
    'metric_3_label_ru': 'С вами с года',
    'metric_4_label_ru': 'Менеджмент качества',
}

EN = {
    'eyebrow_en': 'Since 2008 · ISO 9001:2015 · GCP',
    'title_lead_en': 'Trusted care in Fergana —',
    'title_em_en': 'experienced doctors',
    'lead_en': (
        '11 departments, phone booking, and modern diagnostics. '
        'The decision always stays with the doctor; AiShifokor assists during the visit.'
    ),
    'metric_1_label_en': 'Clinical departments',
    'metric_2_label_en': 'Specialist physicians',
    'metric_3_label_en': 'With you since',
    'metric_4_label_en': 'Quality management',
}


def seed_homepage_i18n(apps, schema_editor):
    HomePage = apps.get_model('cms', 'HomePage')
    try:
        page = HomePage.objects.get(pk=1)
    except HomePage.DoesNotExist:
        return

    changed = False
    for field, value in {**RU, **EN}.items():
        if not getattr(page, field, ''):
            setattr(page, field, value)
            changed = True

    if changed:
        page.save(update_fields=list({**RU, **EN}.keys()))


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0011_renormalize_uz_apostrophe'),
    ]

    operations = [
        migrations.RunPython(seed_homepage_i18n, migrations.RunPython.noop),
    ]
