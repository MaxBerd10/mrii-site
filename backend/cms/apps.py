from django.apps import AppConfig


class CmsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cms'
    verbose_name = 'FJSTI Kontent'

    def ready(self):
        from django.db.models.signals import post_migrate, pre_save

        from .i18n_fill import autofill_from_uz

        def _autofill(sender, instance, **kwargs):
            if getattr(instance, '_skip_autofill', False):
                return  # caller translates later (e.g. in a background thread)
            if (
                getattr(sender._meta, 'app_label', None) != 'cms'
                or getattr(sender, '__module__', '') == '__fake__'
            ):
                return
            autofill_from_uz(instance)

        pre_save.connect(_autofill, dispatch_uid='cms_autofill_from_uz')

        def _shrink_images(sender, instance, **kwargs):
            from .images import optimize_field

            fields = {
                'Doctor': ('photo',), 'NewsArticle': ('cover',), 'Specialty': ('image',),
                'ClinicTourVideo': ('poster',), 'AssetOverride': ('file',),
            }.get(sender.__name__, ())
            if getattr(sender._meta, 'app_label', None) == 'cms':
                for name in fields:
                    optimize_field(instance, name)

        pre_save.connect(_shrink_images, dispatch_uid='cms_shrink_images')

        def _configure_hr_group(**kwargs):
            """Keep the HR role limited to vacancy leads and their source vacancies."""
            from django.contrib.auth.models import Group, Permission

            group, _ = Group.objects.get_or_create(name='HR bo‘limi')
            codenames = (
                'view_inquiry',
                'change_inquiry',
                'view_vacancy',
                'add_vacancy',
                'change_vacancy',
            )
            permissions = Permission.objects.filter(
                content_type__app_label='cms',
                codename__in=codenames,
            )
            if permissions.count() == len(codenames):
                group.permissions.set(permissions)

        def _configure_manager_group(**kwargs):
            """«Kontent menejeri»: everyday website editing without superuser powers (no users, no Telegram list)."""
            from django.contrib.auth.models import Group, Permission

            group, _ = Group.objects.get_or_create(name='Kontent menejeri')
            everything = ('doctor', 'newsarticle', 'vacancy', 'priceitem', 'pricecategory', 'checkupdirection',
                          'testimonial', 'clinictourvideo', 'researchstudy', 'researchcapability', 'aiproduct')
            codenames = [f'{action}_{model}' for model in everything for action in ('view', 'add', 'change', 'delete')]
            codenames += [
                'view_specialty', 'change_specialty', 'view_sitesettings', 'change_sitesettings',
                'view_homepage', 'change_homepage', 'view_researchsection', 'change_researchsection',
                'view_textoverride', 'change_textoverride', 'view_assetoverride', 'change_assetoverride',
                'view_doctorreview', 'change_doctorreview', 'delete_doctorreview',
                'view_inquiry', 'change_inquiry',
            ]
            permissions = Permission.objects.filter(content_type__app_label='cms', codename__in=codenames)
            if permissions.count() == len(set(codenames)):
                group.permissions.set(permissions)

        post_migrate.connect(
            _configure_manager_group,
            sender=self,
            dispatch_uid='cms_configure_manager_group',
        )
        post_migrate.connect(
            _configure_hr_group,
            sender=self,
            dispatch_uid='cms_configure_hr_group',
        )
