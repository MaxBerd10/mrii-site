from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0007_homepage'),
    ]

    operations = [
        migrations.CreateModel(
            name='Vacancy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order', models.PositiveIntegerField(db_index=True, default=1, verbose_name='Tartib')),
                ('slug', models.SlugField(unique=True, verbose_name='Slug')),
                ('category', models.CharField(
                    choices=[
                        ('doctor', 'Shifokor'),
                        ('nurse', 'Hamshira / parvarish'),
                        ('admin', 'Ma’muriy'),
                        ('residency', 'Ordinatura / rezident'),
                        ('other', 'Boshqa'),
                    ],
                    db_index=True,
                    default='other',
                    max_length=32,
                    verbose_name='Kategoriya',
                )),
                ('employment', models.CharField(
                    choices=[
                        ('full_time', 'To‘liq stavka'),
                        ('part_time', 'Qisman'),
                        ('contract', 'Shartnoma'),
                    ],
                    default='full_time',
                    max_length=32,
                    verbose_name='Bandlik turi',
                )),
                ('title_uz', models.CharField(max_length=255, verbose_name='Lavozim (UZ)')),
                ('title_ru', models.CharField(blank=True, max_length=255, verbose_name='Lavozim (RU)')),
                ('title_en', models.CharField(blank=True, max_length=255, verbose_name='Lavozim (EN)')),
                ('department_uz', models.CharField(blank=True, max_length=255, verbose_name='Bo‘lim (UZ)')),
                ('department_ru', models.CharField(blank=True, max_length=255, verbose_name='Bo‘lim (RU)')),
                ('department_en', models.CharField(blank=True, max_length=255, verbose_name='Bo‘lim (EN)')),
                ('location_uz', models.CharField(blank=True, max_length=255, verbose_name='Joy (UZ)')),
                ('location_ru', models.CharField(blank=True, max_length=255, verbose_name='Joy (RU)')),
                ('location_en', models.CharField(blank=True, max_length=255, verbose_name='Joy (EN)')),
                ('experience_uz', models.CharField(blank=True, max_length=128, verbose_name='Tajriba (UZ)')),
                ('experience_ru', models.CharField(blank=True, max_length=128, verbose_name='Tajriba (RU)')),
                ('experience_en', models.CharField(blank=True, max_length=128, verbose_name='Tajriba (EN)')),
                ('description_uz', models.TextField(blank=True, verbose_name='Tavsif (UZ)')),
                ('description_ru', models.TextField(blank=True, verbose_name='Tavsif (RU)')),
                ('description_en', models.TextField(blank=True, verbose_name='Tavsif (EN)')),
                ('requirements_uz', models.TextField(blank=True, verbose_name='Talablar | bilan (UZ)')),
                ('requirements_ru', models.TextField(blank=True, verbose_name='Talablar (RU)')),
                ('requirements_en', models.TextField(blank=True, verbose_name='Talablar (EN)')),
                ('deadline', models.DateField(blank=True, null=True, verbose_name='Ariza muddati')),
                ('is_active', models.BooleanField(default=True, verbose_name='Faol')),
            ],
            options={
                'verbose_name': 'Vakansiya',
                'verbose_name_plural': 'Vakansiyalar',
                'ordering': ['order', '-created_at', 'id'],
            },
        ),
        migrations.AlterField(
            model_name='inquiry',
            name='intent',
            field=models.CharField(
                choices=[
                    ('booking', 'Qabulga yozilish'),
                    ('sponsor', 'Homiy / tadqiqot'),
                    ('education', 'Klinik baza'),
                    ('ai', 'AI demo'),
                    ('international', 'Xalqaro bo‘lim'),
                    ('consult', 'Maslahat so‘rovi'),
                    ('career', 'Vakansiya / karyera'),
                ],
                db_index=True,
                default='booking',
                max_length=32,
                verbose_name='Maqsad',
            ),
        ),
    ]
