from django.db import migrations, models


def seed_homepage(apps, schema_editor):
    HomePage = apps.get_model('cms', 'HomePage')
    # bulk_create intentionally skips the app's pre_save translation signal.
    # Migrations must work even where optional translation providers are absent.
    if not HomePage.objects.filter(pk=1).exists():
        HomePage.objects.bulk_create([HomePage(
            pk=1,
            eyebrow_uz='2008 yildan beri · ISO 9001:2015 · GCP',
            title_lead_uz='Farg‘onada ishonchli tibbiy yordam —',
            title_em_uz='tajribali shifokorlar',
            lead_uz=(
                '11 klinik yo‘nalish, telefon orqali yozilish va zamonaviy diagnostika. '
                'Qaror har doim shifokorda; AiShifokor qabulda yordam beradi.'
            ),
            metric_1_value='11+',
            metric_1_label_uz='Klinika yo‘nalishlari',
            metric_2_value='100+',
            metric_2_label_uz='Mutaxassis shifokorlar',
            metric_3_value='2008',
            metric_3_label_uz='Yildan beri siz bilan',
            metric_4_value='ISO 9001',
            metric_4_label_uz='Sifat menejmenti',
        )])


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0006_clinictourvideo'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomePage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('eyebrow_uz', models.CharField(blank=True, max_length=255, verbose_name='Yuqori satr (UZ)')),
                ('eyebrow_ru', models.CharField(blank=True, max_length=255, verbose_name='Yuqori satr (RU)')),
                ('eyebrow_en', models.CharField(blank=True, max_length=255, verbose_name='Yuqori satr (EN)')),
                ('title_lead_uz', models.CharField(blank=True, max_length=255, verbose_name='Sarlavha (UZ)')),
                ('title_lead_ru', models.CharField(blank=True, max_length=255, verbose_name='Sarlavha (RU)')),
                ('title_lead_en', models.CharField(blank=True, max_length=255, verbose_name='Sarlavha (EN)')),
                ('title_em_uz', models.CharField(blank=True, max_length=255, verbose_name='Ajratilgan sarlavha (UZ)')),
                ('title_em_ru', models.CharField(blank=True, max_length=255, verbose_name='Ajratilgan sarlavha (RU)')),
                ('title_em_en', models.CharField(blank=True, max_length=255, verbose_name='Ajratilgan sarlavha (EN)')),
                ('lead_uz', models.TextField(blank=True, verbose_name='Izoh (UZ)')),
                ('lead_ru', models.TextField(blank=True, verbose_name='Izoh (RU)')),
                ('lead_en', models.TextField(blank=True, verbose_name='Izoh (EN)')),
                ('team_image', models.ImageField(blank=True, null=True, upload_to='homepage/', verbose_name='Asosiy jamoa rasmi')),
                ('team_image_url', models.CharField(blank=True, max_length=512, verbose_name='Yoki rasm yo‘li/URL')),
                ('metric_1_value', models.CharField(blank=True, max_length=64, verbose_name='1-raqam')),
                ('metric_1_label_uz', models.CharField(blank=True, max_length=128, verbose_name='1-raqam izohi (UZ)')),
                ('metric_1_label_ru', models.CharField(blank=True, max_length=128, verbose_name='1-raqam izohi (RU)')),
                ('metric_1_label_en', models.CharField(blank=True, max_length=128, verbose_name='1-raqam izohi (EN)')),
                ('metric_2_value', models.CharField(blank=True, max_length=64, verbose_name='2-raqam')),
                ('metric_2_label_uz', models.CharField(blank=True, max_length=128, verbose_name='2-raqam izohi (UZ)')),
                ('metric_2_label_ru', models.CharField(blank=True, max_length=128, verbose_name='2-raqam izohi (RU)')),
                ('metric_2_label_en', models.CharField(blank=True, max_length=128, verbose_name='2-raqam izohi (EN)')),
                ('metric_3_value', models.CharField(blank=True, max_length=64, verbose_name='3-raqam')),
                ('metric_3_label_uz', models.CharField(blank=True, max_length=128, verbose_name='3-raqam izohi (UZ)')),
                ('metric_3_label_ru', models.CharField(blank=True, max_length=128, verbose_name='3-raqam izohi (RU)')),
                ('metric_3_label_en', models.CharField(blank=True, max_length=128, verbose_name='3-raqam izohi (EN)')),
                ('metric_4_value', models.CharField(blank=True, max_length=64, verbose_name='4-raqam')),
                ('metric_4_label_uz', models.CharField(blank=True, max_length=128, verbose_name='4-raqam izohi (UZ)')),
                ('metric_4_label_ru', models.CharField(blank=True, max_length=128, verbose_name='4-raqam izohi (RU)')),
                ('metric_4_label_en', models.CharField(blank=True, max_length=128, verbose_name='4-raqam izohi (EN)')),
            ],
            options={
                'verbose_name': 'Bosh sahifa',
                'verbose_name_plural': 'Bosh sahifa',
            },
        ),
        migrations.RunPython(seed_homepage, migrations.RunPython.noop),
    ]
