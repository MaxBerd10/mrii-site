from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0003_renumber_orders_from_one'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('request_id', models.CharField(db_index=True, max_length=32, unique=True, verbose_name='Murojaat raqami')),
                ('intent', models.CharField(
                    choices=[
                        ('booking', 'Qabulga yozilish'),
                        ('sponsor', 'Homiy / tadqiqot'),
                        ('education', 'Klinik baza'),
                        ('ai', 'AI demo'),
                        ('international', 'Xalqaro bo‘lim'),
                    ],
                    db_index=True,
                    default='booking',
                    max_length=32,
                    verbose_name='Maqsad',
                )),
                ('status', models.CharField(
                    choices=[
                        ('new', 'Yangi'),
                        ('contacted', 'Bog‘lanildi'),
                        ('closed', 'Yopildi'),
                    ],
                    db_index=True,
                    default='new',
                    max_length=16,
                    verbose_name='Holat',
                )),
                ('name', models.CharField(max_length=255, verbose_name='Ism')),
                ('phone', models.CharField(max_length=64, verbose_name='Telefon')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='Email')),
                ('topic', models.CharField(blank=True, max_length=255, verbose_name='Mavzu / xizmat')),
                ('clinic', models.CharField(blank=True, max_length=255, verbose_name='Klinika / tashkilot')),
                ('product_slug', models.SlugField(blank=True, max_length=128, verbose_name='AI mahsulot')),
                ('message', models.TextField(blank=True, verbose_name='Xabar')),
                ('lang', models.CharField(blank=True, max_length=8, verbose_name='Til')),
                ('source_path', models.CharField(blank=True, max_length=512, verbose_name='Manba sahifa')),
                ('notes', models.TextField(blank=True, help_text='Faqat admin uchun.', verbose_name='Ichki izoh')),
            ],
            options={
                'verbose_name': 'Murojaat',
                'verbose_name_plural': 'Murojaatlar',
                'ordering': ['-created_at'],
            },
        ),
    ]
