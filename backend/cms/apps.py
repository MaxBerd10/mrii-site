from django.apps import AppConfig


class CmsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cms'
    verbose_name = 'FJSTI Kontent'

    def ready(self):
        from django.db.models.signals import post_migrate, pre_save

        from .i18n_fill import autofill_from_uz

        def _autofill(sender, instance, **kwargs):
            if (
                getattr(sender._meta, 'app_label', None) != 'cms'
                or getattr(sender, '__module__', '') == '__fake__'
            ):
                return
            autofill_from_uz(instance)

        pre_save.connect(_autofill, dispatch_uid='cms_autofill_from_uz')

        def _configure_hr_group(**kwargs):
            """Keep the HR role limited to vacancy leads and their source vacancies."""
            from django.contrib.auth.models import Group, Permission

            group, _ = Group.objects.get_or_create(name='HR bo‘limi')
            permissions = Permission.objects.filter(
                content_type__app_label='cms',
                codename__in=('view_inquiry', 'change_inquiry', 'view_vacancy'),
            )
            if permissions.count() == 3:
                group.permissions.set(permissions)

        post_migrate.connect(
            _configure_hr_group,
            sender=self,
            dispatch_uid='cms_configure_hr_group',
        )
