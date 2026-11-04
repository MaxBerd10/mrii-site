from django.db import migrations

from cms.price_seed import import_prices


def seed(apps, schema_editor):
    import_prices(
        apps.get_model('cms', 'PriceCategory'),
        apps.get_model('cms', 'PriceItem'),
        apps.get_model('cms', 'CheckupDirection'),
        apps.get_model('cms', 'CheckupTier'),
    )


class Migration(migrations.Migration):
    dependencies = [('cms', '0026_prices')]
    operations = [migrations.RunPython(seed, migrations.RunPython.noop)]
