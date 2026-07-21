from django.db import migrations


ORDERED_MODELS = (
    'specialty',
    'doctor',
    'newsarticle',
    'aiproduct',
    'researchstudy',
    'researchcapability',
    'educationtrack',
    'educationprogram',
    'testimonial',
    'partner',
    'internationalservice',
)


def renumber_orders(apps, schema_editor):
    for model_name in ORDERED_MODELS:
        Model = apps.get_model('cms', model_name)
        qs = list(Model.objects.order_by('order', 'id'))
        for index, obj in enumerate(qs, start=1):
            if obj.order != index:
                Model.objects.filter(pk=obj.pk).update(order=index)


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0002_order_default_one'),
    ]

    operations = [
        migrations.RunPython(renumber_orders, noop),
    ]
