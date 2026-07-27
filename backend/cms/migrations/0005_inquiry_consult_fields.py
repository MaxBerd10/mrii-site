from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0004_inquiry'),
    ]

    operations = [
        migrations.AddField(
            model_name='inquiry',
            name='medical_history',
            field=models.TextField(blank=True, verbose_name='Kasallik tarixi'),
        ),
        migrations.AddField(
            model_name='inquiry',
            name='allergies',
            field=models.TextField(blank=True, verbose_name='Allergiya'),
        ),
        migrations.AddField(
            model_name='inquiry',
            name='advice',
            field=models.TextField(
                blank=True,
                help_text='Bemor uchun javob. To‘ldirilsa, murojaat raqami orqali ko‘rinadi.',
                verbose_name='Javob / maslahat',
            ),
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
                ],
                db_index=True,
                default='booking',
                max_length=32,
                verbose_name='Maqsad',
            ),
        ),
        migrations.AlterField(
            model_name='inquiry',
            name='name',
            field=models.CharField(max_length=255, verbose_name='Ism familiya'),
        ),
        migrations.AlterField(
            model_name='inquiry',
            name='message',
            field=models.TextField(blank=True, verbose_name='Shikoyat / xabar'),
        ),
    ]
