from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0005_inquiry_consult_fields'),
    ]

    operations = [
        migrations.CreateModel(
            name='ClinicTourVideo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order', models.PositiveIntegerField(db_index=True, default=1, verbose_name='Tartib')),
                ('video_key', models.CharField(
                    choices=[
                        ('tour', 'Asosiy virtual sayohat'),
                        ('officialVisit', 'Rasmiy tashrif'),
                        ('opening', 'Ochilish marosimi'),
                        ('openDoors', 'Ochiq eshiklar'),
                        ('innovation', 'Innovatsiya sayohati'),
                    ],
                    max_length=32,
                    unique=True,
                    verbose_name='Video turi',
                )),
                ('video', models.FileField(blank=True, null=True, upload_to='clinic-tour/', verbose_name='Video fayl')),
                ('video_url', models.CharField(
                    blank=True,
                    help_text='Masalan: /videos/clinic-tour/virtual-tour.web.mp4',
                    max_length=512,
                    verbose_name='Yoki video yo‘li/URL',
                )),
                ('poster', models.ImageField(blank=True, null=True, upload_to='clinic-tour/posters/', verbose_name='Poster')),
                ('poster_url', models.CharField(
                    blank=True,
                    help_text='Masalan: /images/clinic-gallery/courtyard.webp',
                    max_length=512,
                    verbose_name='Yoki poster yo‘li/URL',
                )),
                ('is_active', models.BooleanField(default=True, verbose_name='Faol')),
            ],
            options={
                'verbose_name': 'Klinika sayohati videosi',
                'verbose_name_plural': 'Klinika sayohati videolari',
                'ordering': ['order', 'id'],
            },
        ),
    ]
