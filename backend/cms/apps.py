from django.apps import AppConfig


class CmsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cms'
    verbose_name = 'MRII Kontent'

    def ready(self):
        from django.db.models.signals import pre_save

        from .i18n_fill import autofill_from_uz

        def _autofill(sender, instance, **kwargs):
            if getattr(sender._meta, 'app_label', None) != 'cms':
                return
            autofill_from_uz(instance)

        pre_save.connect(_autofill, dispatch_uid='cms_autofill_from_uz')
