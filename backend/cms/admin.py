from django.contrib import admin, messages
from django.contrib.auth.admin import GroupAdmin, UserAdmin
from django.contrib.auth.models import Group, User
from django.utils.html import format_html

from . import models
from .admin_site import mrii_admin_site
from .i18n_fill import autofill_from_uz


mrii_admin_site.register(User, UserAdmin)
mrii_admin_site.register(Group, GroupAdmin)


def thumb(url_field, file_field):
    """Admin list_display thumbnail. Bound as ModelAdmin method → (self, obj)."""

    @admin.display(description='Rasm')
    def _thumb(self, obj):
        url = ''
        f = getattr(obj, file_field, None)
        if f:
            try:
                url = f.url
            except ValueError:
                url = ''
        if not url:
            url = getattr(obj, url_field, '') or ''
        if not url:
            return '—'
        return format_html(
            '<img src="{}" style="height:44px;width:44px;object-fit:cover;border-radius:10px;'
            'box-shadow:0 4px 10px rgba(12,27,42,.12);" />',
            url,
        )

    return _thumb


LANG_UZ = 'Faqat o‘zbekcha yozing — asosiy matn shu yerda.'
LANG_RU = (
    'Yuqoridagi «Rus va inglizchani to‘ldirish» tugmasi bilan avtomatik to‘ldiriladi. '
    'Kerak bo‘lsa qo‘lda tuzating.'
)
LANG_EN = LANG_RU
IMG_HELP = 'Yangi rasm yuklang yoki tayyor URL qoldiring. Yuklangan rasm ustunlik qiladi.'
AUTO_TIP = (
    'O‘zbekcha yozing, keyin yuqoridagi «Rus va inglizchani to‘ldirish» tugmasini bosing — '
    'maydonlar forma ichida to‘ldiriladi. So‘ng Saqlash.'
)


class AutoTranslateAdmin(admin.ModelAdmin):
    """Admin forms get a button that fills RU/EN inputs from UZ (visible before save)."""

    class Media:
        js = ('cms/auto_translate.js',)
        css = {'all': ('cms/auto_translate.css',)}

    def get_changeform_initial_data(self, request):
        data = super().get_changeform_initial_data(request)
        if hasattr(self.model, 'order'):
            last = (
                self.model.objects.order_by('-order')
                .values_list('order', flat=True)
                .first()
            )
            data['order'] = max(int(last or 0), 0) + 1
        return data

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        field = super().formfield_for_dbfield(db_field, request, **kwargs)
        if db_field.name == 'order' and field is not None:
            field.help_text = '1 = birinchi o‘rin, 2 = ikkinchi… (0 emas).'
            if not getattr(field, 'initial', None):
                field.initial = 1
        return field

    def save_model(self, request, obj, form, change):
        # Backup: still fill empty RU/EN on save if user skipped the button
        if hasattr(obj, 'order') and (obj.order is None or int(obj.order) < 1):
            obj.order = 1
        filled = autofill_from_uz(obj)
        super().save_model(request, obj, form, change)
        if filled:
            self.message_user(
                request,
                f'Saqlashda {len(filled)} ta bo‘sh RU/EN maydon ham to‘ldirildi.',
                level=messages.SUCCESS,
            )

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        filled_total = 0
        for obj in instances:
            filled_total += len(autofill_from_uz(obj))
            obj.save()
        formset.save_m2m()
        for obj in formset.deleted_objects:
            obj.delete()
        if filled_total:
            self.message_user(
                request,
                f'Ichki ro‘yxatda {filled_total} ta maydon avtomatik tarjima qilindi.',
                level=messages.SUCCESS,
            )


class EducationProgramInline(admin.TabularInline):
    model = models.EducationProgram
    extra = 1
    fields = (
        'order',
        'name_uz',
        'name_ru',
        'name_en',
        'duration_uz',
        'duration_ru',
        'duration_en',
        'spots',
    )
    verbose_name = 'Dastur'
    verbose_name_plural = 'Dasturlar (shu yo‘nalish ichida)'


@admin.register(models.SiteSettings, site=mrii_admin_site)
class SiteSettingsAdmin(AutoTranslateAdmin):
    fieldsets = (
        ('Aloqa', {
            'description': 'Telefon va ish vaqti — yuqori panel va Hero da ko‘rinadi.',
            'fields': ('phone', 'hours'),
        }),
        ('Institut', {
            'description': 'Institut nomi va shior — bosh sahifa brendi.',
            'fields': (
                'institute_name',
                'badge_uz', 'badge_ru', 'badge_en',
                'slogan_uz', 'slogan_ru', 'slogan_en',
            ),
        }),
        ('Huquqiy', {
            'description': 'Footer pastidagi copyright va litsenziya matnlari.',
            'fields': (
                'copyright_uz', 'copyright_ru', 'copyright_en',
                'license_uz', 'license_ru', 'license_en',
            ),
        }),
    )

    def has_add_permission(self, request):
        return not models.SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(models.Hero, site=mrii_admin_site)
class HeroAdmin(AutoTranslateAdmin):
    fieldsets = (
        ('O‘zbekcha', {
            'description': f'{LANG_UZ} {AUTO_TIP}',
            'fields': ('title1_uz', 'title2_uz', 'tagline_uz', 'description_uz'),
        }),
        ('Русский', {
            'classes': ('collapse',),
            'description': LANG_RU,
            'fields': ('title1_ru', 'title2_ru', 'tagline_ru', 'description_ru'),
        }),
        ('English', {
            'classes': ('collapse',),
            'description': LANG_EN,
            'fields': ('title1_en', 'title2_en', 'tagline_en', 'description_en'),
        }),
        ('Rasm', {
            'description': IMG_HELP,
            'fields': ('image', 'image_url', 'certs'),
        }),
    )

    def has_add_permission(self, request):
        return not models.Hero.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(models.Specialty, site=mrii_admin_site)
class SpecialtyAdmin(AutoTranslateAdmin):
    list_display = ('name_uz', 'slug', 'doctor_count', 'order', 'is_active', 'preview')
    list_editable = ('order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name_uz', 'name_ru', 'name_en', 'slug')
    prepopulated_fields = {'slug': ('name_uz',)}
    list_per_page = 25
    preview = thumb('image_url', 'image')
    fieldsets = (
        ('Asosiy', {
            'description': 'Slug URL uchun (masalan: cardiology). Tartib — ro‘yxatdagi o‘rin.',
            'fields': ('slug', 'icon', 'doctor_count', 'order', 'is_active'),
        }),
        ('O‘zbekcha', {
            'description': f'{LANG_UZ} {AUTO_TIP} Ro‘yxat maydonlarida | bilan ajrating.',
            'fields': (
                'name_uz', 'desc_uz', 'overview_uz',
                'conditions_uz', 'services_uz', 'diagnostics_uz',
            ),
        }),
        ('Русский', {
            'classes': ('collapse',),
            'description': LANG_RU,
            'fields': (
                'name_ru', 'desc_ru', 'overview_ru',
                'conditions_ru', 'services_ru', 'diagnostics_ru',
            ),
        }),
        ('English', {
            'classes': ('collapse',),
            'description': LANG_EN,
            'fields': (
                'name_en', 'desc_en', 'overview_en',
                'conditions_en', 'services_en', 'diagnostics_en',
            ),
        }),
        ('Rasm', {
            'description': IMG_HELP,
            'fields': ('image', 'image_url'),
        }),
    )


@admin.register(models.Doctor, site=mrii_admin_site)
class DoctorAdmin(AutoTranslateAdmin):
    list_display = ('name', 'specialty_uz', 'experience', 'order', 'is_active', 'preview')
    list_editable = ('order', 'is_active')
    search_fields = ('name', 'specialty_uz', 'specialty_ru', 'specialty_en')
    list_per_page = 25
    preview = thumb('photo_url', 'photo')
    fieldsets = (
        ('Asosiy', {
            'description': 'Shifokor ismi, tajriba va foto. Ism barcha tillarda bir xil ko‘rinadi.',
            'fields': ('name', 'experience', 'papers', 'studies', 'is_active'),
        }),
        ('O‘zbekcha', {
            'description': f'{LANG_UZ} {AUTO_TIP}',
            'fields': ('role_uz', 'specialty_uz'),
        }),
        ('Русский', {
            'description': LANG_RU,
            'fields': ('role_ru', 'specialty_ru'),
        }),
        ('English', {
            'description': LANG_EN,
            'fields': ('role_en', 'specialty_en'),
        }),
        ('Rasm', {
            'description': IMG_HELP,
            'fields': ('photo', 'photo_url'),
        }),
        ('Qo‘shimcha (ixtiyoriy)', {
            'classes': ('collapse',),
            'description': (
                'Odatda ochish shart emas. '
                'Rang admin sahifasida emas — saytdagi «Shifokorlar» bo‘limida '
                'kartochkadagi raqamlar (maqolalar / tadqiqotlar) rangini o‘zgartiradi. '
                'Saqlagach saytni ochib tekshiring. '
                'Tartib: 1 = birinchi, 2 = ikkinchi…'
            ),
            'fields': ('color', 'order'),
        }),
    )

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        from django import forms

        if db_field.name == 'color':
            kwargs['widget'] = forms.Select(choices=[
                ('#0B3D6B', 'Klinik ko‘k — standart'),
                ('#0EA5E9', 'Moviy'),
                ('#0d9488', 'Yashil'),
                ('#0369a1', 'To‘q ko‘k'),
                ('#d97706', 'Sariq'),
                ('#7c3aed', 'Binafsha'),
                ('#dc2626', 'Qizil'),
            ])
            kwargs['help_text'] = 'Saytdagi kartochka raqamlari rangi. Bo‘sh qoldirish mumkin.'
        field = super().formfield_for_dbfield(db_field, request, **kwargs)
        return field


@admin.register(models.NewsArticle, site=mrii_admin_site)
class NewsArticleAdmin(AutoTranslateAdmin):
    list_display = ('title_uz', 'slug', 'published_at', 'order', 'is_published', 'preview')
    list_editable = ('order', 'is_published')
    list_filter = ('is_published',)
    search_fields = ('title_uz', 'title_ru', 'title_en', 'slug')
    prepopulated_fields = {'slug': ('title_uz',)}
    date_hierarchy = 'published_at'
    list_per_page = 20
    preview = thumb('cover_url', 'cover')
    fieldsets = (
        ('Asosiy', {
            'description': 'Chop etilmagan (“Faol emas”) maqola saytda ko‘rinmaydi.',
            'fields': ('slug', 'published_at', 'category_color', 'order', 'is_published'),
        }),
        ('O‘zbekcha', {
            'description': f'{LANG_UZ} {AUTO_TIP} Body paragraflarini | bilan ajrating.',
            'fields': ('category_uz', 'title_uz', 'excerpt_uz', 'lead_uz', 'body_uz'),
        }),
        ('Русский', {
            'classes': ('collapse',),
            'description': LANG_RU,
            'fields': ('category_ru', 'title_ru', 'excerpt_ru', 'lead_ru', 'body_ru'),
        }),
        ('English', {
            'classes': ('collapse',),
            'description': LANG_EN,
            'fields': ('category_en', 'title_en', 'excerpt_en', 'lead_en', 'body_en'),
        }),
        ('Rasm', {
            'description': IMG_HELP,
            'fields': ('cover', 'cover_url'),
        }),
    )


@admin.register(models.AIProduct, site=mrii_admin_site)
class AIProductAdmin(AutoTranslateAdmin):
    list_display = ('name_uz', 'slug', 'metric', 'order', 'is_active', 'preview')
    list_editable = ('order', 'is_active')
    search_fields = ('name_uz', 'slug')
    prepopulated_fields = {'slug': ('name_uz',)}
    preview = thumb('image_url', 'image')
    fieldsets = (
        ('Asosiy', {
            'description': 'Metric — katta raqam (masalan 87%). Rang — teg rangi.',
            'fields': ('slug', 'product_key', 'tag_color', 'metric', 'order', 'is_active'),
        }),
        ('O‘zbekcha', {
            'description': LANG_UZ + ' Features/outcomes/workflow ni | bilan ajrating.',
            'fields': (
                'name_uz', 'tag_uz', 'desc_uz', 'features_uz', 'metric_label_uz',
                'overview_uz', 'audience_uz', 'outcomes_uz', 'workflow_uz',
            ),
        }),
        ('Русский', {
            'description': LANG_RU,
            'fields': (
                'name_ru', 'tag_ru', 'desc_ru', 'features_ru', 'metric_label_ru',
                'overview_ru', 'audience_ru', 'outcomes_ru', 'workflow_ru',
            ),
        }),
        ('English', {
            'description': LANG_EN,
            'fields': (
                'name_en', 'tag_en', 'desc_en', 'features_en', 'metric_label_en',
                'overview_en', 'audience_en', 'outcomes_en', 'workflow_en',
            ),
        }),
        ('Rasm', {
            'description': IMG_HELP,
            'fields': ('image', 'image_url'),
        }),
    )


@admin.register(models.ResearchSection, site=mrii_admin_site)
class ResearchSectionAdmin(AutoTranslateAdmin):
    fieldsets = (
        ('O‘zbekcha', {
            'description': LANG_UZ + ' Why items ni | bilan ajrating.',
            'fields': (
                'label_uz', 'title1_uz', 'title_em_uz', 'description_uz',
                'why_title_uz', 'why_items_uz', 'sponsor_btn_uz',
            ),
        }),
        ('Русский', {
            'description': LANG_RU,
            'fields': (
                'label_ru', 'title1_ru', 'title_em_ru', 'description_ru',
                'why_title_ru', 'why_items_ru', 'sponsor_btn_ru',
            ),
        }),
        ('English', {
            'description': LANG_EN,
            'fields': (
                'label_en', 'title1_en', 'title_em_en', 'description_en',
                'why_title_en', 'why_items_en', 'sponsor_btn_en',
            ),
        }),
    )

    def has_add_permission(self, request):
        return not models.ResearchSection.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(models.ResearchStudy, site=mrii_admin_site)
class ResearchStudyAdmin(AutoTranslateAdmin):
    list_display = ('study_id', 'title_uz', 'phase', 'status', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('study_id', 'title_uz')
    list_filter = ('status', 'is_active')
    fieldsets = (
        ('Asosiy', {
            'description': 'Status: open / closed. Phase: I–IV.',
            'fields': ('study_id', 'phase', 'status', 'order', 'is_active'),
        }),
        ('O‘zbekcha', {'description': LANG_UZ, 'fields': ('title_uz', 'area_uz')}),
        ('Русский', {'description': LANG_RU, 'fields': ('title_ru', 'area_ru')}),
        ('English', {'description': LANG_EN, 'fields': ('title_en', 'area_en')}),
    )


@admin.register(models.ResearchCapability, site=mrii_admin_site)
class ResearchCapabilityAdmin(AutoTranslateAdmin):
    list_display = ('label_uz', 'value', 'highlight', 'order')
    list_editable = ('order', 'highlight')
    fieldsets = (
        ('Asosiy', {
            'description': 'Value — raqam/yozuv (18+, 50 000+). Highlight — urg‘u.',
            'fields': ('value', 'highlight', 'order'),
        }),
        ('O‘zbekcha', {'fields': ('label_uz',)}),
        ('Русский', {'fields': ('label_ru',)}),
        ('English', {'fields': ('label_en',)}),
    )


@admin.register(models.EducationTrack, site=mrii_admin_site)
class EducationTrackAdmin(AutoTranslateAdmin):
    list_display = ('audience_uz', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    inlines = [EducationProgramInline]
    fieldsets = (
        ('Asosiy', {
            'description': 'Pastdagi jadvalda shu yo‘nalish dasturlarini qo‘shing.',
            'fields': ('color', 'icon', 'order', 'is_active'),
        }),
        ('O‘zbekcha', {'description': LANG_UZ, 'fields': ('audience_uz',)}),
        ('Русский', {'description': LANG_RU, 'fields': ('audience_ru',)}),
        ('English', {'description': LANG_EN, 'fields': ('audience_en',)}),
    )


@admin.register(models.Testimonial, site=mrii_admin_site)
class TestimonialAdmin(AutoTranslateAdmin):
    list_display = ('author_uz', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    fieldsets = (
        ('Asosiy', {'fields': ('order', 'is_active')}),
        ('O‘zbekcha', {
            'description': LANG_UZ,
            'fields': ('quote_uz', 'author_uz', 'role_uz'),
        }),
        ('Русский', {
            'description': LANG_RU,
            'fields': ('quote_ru', 'author_ru', 'role_ru'),
        }),
        ('English', {
            'description': LANG_EN,
            'fields': ('quote_en', 'author_en', 'role_en'),
        }),
    )


@admin.register(models.Partner, site=mrii_admin_site)
class PartnerAdmin(AutoTranslateAdmin):
    list_display = ('name', 'order', 'is_active', 'preview')
    list_editable = ('order', 'is_active')
    preview = thumb('logo_url', 'logo')
    fieldsets = (
        ('Asosiy', {
            'description': 'Hamkor nomi lenta (marquee) da aylanadi.',
            'fields': ('name', 'order', 'is_active'),
        }),
        ('Rasm', {
            'description': IMG_HELP + ' Logo ixtiyoriy.',
            'fields': ('logo', 'logo_url'),
        }),
    )


@admin.register(models.InternationalService, site=mrii_admin_site)
class InternationalServiceAdmin(AutoTranslateAdmin):
    list_display = ('title_uz', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    fieldsets = (
        ('Asosiy', {'fields': ('order', 'is_active')}),
        ('O‘zbekcha', {'description': LANG_UZ, 'fields': ('title_uz', 'desc_uz')}),
        ('Русский', {'description': LANG_RU, 'fields': ('title_ru', 'desc_ru')}),
        ('English', {'description': LANG_EN, 'fields': ('title_en', 'desc_en')}),
    )


# Keep default site labels in sync if anything still references admin.site
admin.site.site_header = mrii_admin_site.site_header
admin.site.site_title = mrii_admin_site.site_title
admin.site.index_title = mrii_admin_site.index_title
