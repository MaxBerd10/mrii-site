from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class OrderedModel(models.Model):
    order = models.PositiveIntegerField('Tartib', default=1, db_index=True)

    class Meta:
        abstract = True
        ordering = ['order', 'id']


class SiteSettings(TimeStampedModel):
    """Singleton site-wide settings."""

    phone = models.CharField('Telefon', max_length=64, blank=True)
    hours = models.CharField('Ish vaqti', max_length=128, blank=True)
    badge_uz = models.CharField('Badge (UZ)', max_length=128, blank=True)
    badge_ru = models.CharField('Badge (RU)', max_length=128, blank=True)
    badge_en = models.CharField('Badge (EN)', max_length=128, blank=True)
    institute_name = models.CharField('Institut nomi', max_length=255, blank=True)
    slogan_uz = models.CharField('Shior (UZ)', max_length=255, blank=True)
    slogan_ru = models.CharField('Shior (RU)', max_length=255, blank=True)
    slogan_en = models.CharField('Shior (EN)', max_length=255, blank=True)
    copyright_uz = models.CharField('Copyright (UZ)', max_length=255, blank=True)
    copyright_ru = models.CharField('Copyright (RU)', max_length=255, blank=True)
    copyright_en = models.CharField('Copyright (EN)', max_length=255, blank=True)
    license_uz = models.CharField('Litsenziya (UZ)', max_length=255, blank=True)
    license_ru = models.CharField('Litsenziya (RU)', max_length=255, blank=True)
    license_en = models.CharField('Litsenziya (EN)', max_length=255, blank=True)

    class Meta:
        verbose_name = 'Sayt sozlamalari'
        verbose_name_plural = 'Sayt sozlamalari'

    def __str__(self):
        return 'Sayt sozlamalari'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Hero(TimeStampedModel):
    title1_uz = models.CharField('Sarlavha 1 (UZ)', max_length=255, blank=True)
    title1_ru = models.CharField('Sarlavha 1 (RU)', max_length=255, blank=True)
    title1_en = models.CharField('Sarlavha 1 (EN)', max_length=255, blank=True)
    title2_uz = models.CharField('Sarlavha 2 (UZ)', max_length=255, blank=True)
    title2_ru = models.CharField('Sarlavha 2 (RU)', max_length=255, blank=True)
    title2_en = models.CharField('Sarlavha 2 (EN)', max_length=255, blank=True)
    tagline_uz = models.CharField('Tagline (UZ)', max_length=512, blank=True)
    tagline_ru = models.CharField('Tagline (RU)', max_length=512, blank=True)
    tagline_en = models.CharField('Tagline (EN)', max_length=512, blank=True)
    description_uz = models.TextField('Tavsif (UZ)', blank=True)
    description_ru = models.TextField('Tavsif (RU)', blank=True)
    description_en = models.TextField('Tavsif (EN)', blank=True)
    image = models.ImageField('Asosiy rasm', upload_to='hero/', blank=True, null=True)
    image_url = models.URLField('Yoki rasm URL', blank=True)
    certs = models.CharField('Sertifikatlar', max_length=255, blank=True)

    class Meta:
        verbose_name = 'Hero'
        verbose_name_plural = 'Hero'

    def __str__(self):
        return 'Hero'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)


class Specialty(TimeStampedModel, OrderedModel):
    slug = models.SlugField('Slug', unique=True)
    icon = models.CharField('Icon (emoji)', max_length=16, blank=True)
    doctor_count = models.PositiveIntegerField('Shifokorlar soni', default=0)
    name_uz = models.CharField('Nomi (UZ)', max_length=128)
    name_ru = models.CharField('Nomi (RU)', max_length=128, blank=True)
    name_en = models.CharField('Nomi (EN)', max_length=128, blank=True)
    desc_uz = models.TextField('Qisqa tavsif (UZ)', blank=True)
    desc_ru = models.TextField('Qisqa tavsif (RU)', blank=True)
    desc_en = models.TextField('Qisqa tavsif (EN)', blank=True)
    overview_uz = models.TextField('Batafsil (UZ)', blank=True)
    overview_ru = models.TextField('Batafsil (RU)', blank=True)
    overview_en = models.TextField('Batafsil (EN)', blank=True)
    conditions_uz = models.TextField('Kasalliklar | bilan (UZ)', blank=True)
    conditions_ru = models.TextField('Kasalliklar (RU)', blank=True)
    conditions_en = models.TextField('Kasalliklar (EN)', blank=True)
    services_uz = models.TextField('Xizmatlar (UZ)', blank=True)
    services_ru = models.TextField('Xizmatlar (RU)', blank=True)
    services_en = models.TextField('Xizmatlar (EN)', blank=True)
    diagnostics_uz = models.TextField('Diagnostika (UZ)', blank=True)
    diagnostics_ru = models.TextField('Diagnostika (RU)', blank=True)
    diagnostics_en = models.TextField('Diagnostika (EN)', blank=True)
    image = models.ImageField('Rasm', upload_to='specialties/', blank=True, null=True)
    image_url = models.CharField('Yoki rasm yo‘li/URL', max_length=512, blank=True)
    is_active = models.BooleanField('Faol', default=True)

    class Meta:
        verbose_name = 'Klinik yo‘nalish'
        verbose_name_plural = 'Klinik yo‘nalishlar'
        ordering = ['order', 'id']

    def __str__(self):
        return self.name_uz


class Doctor(TimeStampedModel, OrderedModel):
    name = models.CharField('Ism', max_length=255)
    role_uz = models.CharField('Lavozim (UZ)', max_length=255, blank=True)
    role_ru = models.CharField('Lavozim (RU)', max_length=255, blank=True)
    role_en = models.CharField('Lavozim (EN)', max_length=255, blank=True)
    specialty_uz = models.CharField('Mutaxassislik (UZ)', max_length=255, blank=True)
    specialty_ru = models.CharField('Mutaxassislik (RU)', max_length=255, blank=True)
    specialty_en = models.CharField('Mutaxassislik (EN)', max_length=255, blank=True)
    experience = models.CharField('Tajriba', max_length=64, blank=True)
    papers = models.CharField('Maqolalar', max_length=64, blank=True)
    studies = models.CharField('Tadqiqotlar', max_length=64, blank=True)
    color = models.CharField('Rang', max_length=32, blank=True, default='#0B3D6B')
    photo = models.ImageField('Foto', upload_to='doctors/', blank=True, null=True)
    photo_url = models.URLField('Yoki foto URL', blank=True)
    is_active = models.BooleanField('Faol', default=True)

    class Meta:
        verbose_name = 'Shifokor'
        verbose_name_plural = 'Shifokorlar'
        ordering = ['order', 'id']

    def __str__(self):
        return self.name


class NewsArticle(TimeStampedModel, OrderedModel):
    slug = models.SlugField('Slug', unique=True)
    published_at = models.DateField('Sana', null=True, blank=True)
    category_uz = models.CharField('Kategoriya (UZ)', max_length=64, blank=True)
    category_ru = models.CharField('Kategoriya (RU)', max_length=64, blank=True)
    category_en = models.CharField('Kategoriya (EN)', max_length=64, blank=True)
    category_color = models.CharField('Kategoriya rangi', max_length=32, blank=True, default='#5B4CDB')
    title_uz = models.CharField('Sarlavha (UZ)', max_length=255)
    title_ru = models.CharField('Sarlavha (RU)', max_length=255, blank=True)
    title_en = models.CharField('Sarlavha (EN)', max_length=255, blank=True)
    excerpt_uz = models.TextField('Qisqa (UZ)', blank=True)
    excerpt_ru = models.TextField('Qisqa (RU)', blank=True)
    excerpt_en = models.TextField('Qisqa (EN)', blank=True)
    lead_uz = models.TextField('Lead (UZ)', blank=True)
    lead_ru = models.TextField('Lead (RU)', blank=True)
    lead_en = models.TextField('Lead (EN)', blank=True)
    body_uz = models.TextField('Matn paragraflari | bilan (UZ)', blank=True)
    body_ru = models.TextField('Matn (RU)', blank=True)
    body_en = models.TextField('Matn (EN)', blank=True)
    cover = models.ImageField('Muqova', upload_to='news/', blank=True, null=True)
    cover_url = models.URLField('Yoki muqova URL', blank=True)
    is_published = models.BooleanField('Nashr qilingan', default=True)

    class Meta:
        verbose_name = 'Yangilik'
        verbose_name_plural = 'Yangiliklar'
        ordering = ['order', '-published_at', 'id']

    def __str__(self):
        return self.title_uz


class AIProduct(TimeStampedModel, OrderedModel):
    slug = models.SlugField('Slug', unique=True)
    product_key = models.CharField('Ichboliy ID', max_length=64, blank=True)
    name_uz = models.CharField('Nomi (UZ)', max_length=128)
    name_ru = models.CharField('Nomi (RU)', max_length=128, blank=True)
    name_en = models.CharField('Nomi (EN)', max_length=128, blank=True)
    tag_uz = models.CharField('Tag (UZ)', max_length=128, blank=True)
    tag_ru = models.CharField('Tag (RU)', max_length=128, blank=True)
    tag_en = models.CharField('Tag (EN)', max_length=128, blank=True)
    tag_color = models.CharField('Tag rangi', max_length=32, blank=True, default='#5B4CDB')
    desc_uz = models.TextField('Tavsif (UZ)', blank=True)
    desc_ru = models.TextField('Tavsif (RU)', blank=True)
    desc_en = models.TextField('Tavsif (EN)', blank=True)
    features_uz = models.TextField('Xususiyatlar | bilan (UZ)', blank=True)
    features_ru = models.TextField('Xususiyatlar (RU)', blank=True)
    features_en = models.TextField('Xususiyatlar (EN)', blank=True)
    metric = models.CharField('Metrika', max_length=64, blank=True)
    metric_label_uz = models.CharField('Metrika label (UZ)', max_length=128, blank=True)
    metric_label_ru = models.CharField('Metrika label (RU)', max_length=128, blank=True)
    metric_label_en = models.CharField('Metrika label (EN)', max_length=128, blank=True)
    overview_uz = models.TextField('Overview (UZ)', blank=True)
    overview_ru = models.TextField('Overview (RU)', blank=True)
    overview_en = models.TextField('Overview (EN)', blank=True)
    audience_uz = models.TextField('Audience (UZ)', blank=True)
    audience_ru = models.TextField('Audience (RU)', blank=True)
    audience_en = models.TextField('Audience (EN)', blank=True)
    outcomes_uz = models.TextField('Natijalar | bilan (UZ)', blank=True)
    outcomes_ru = models.TextField('Natijalar (RU)', blank=True)
    outcomes_en = models.TextField('Natijalar (EN)', blank=True)
    workflow_uz = models.TextField('Jarayon | bilan (UZ)', blank=True)
    workflow_ru = models.TextField('Jarayon (RU)', blank=True)
    workflow_en = models.TextField('Jarayon (EN)', blank=True)
    image = models.ImageField('Rasm', upload_to='ai/', blank=True, null=True)
    image_url = models.CharField('Yoki rasm yo‘li/URL', max_length=512, blank=True)
    is_active = models.BooleanField('Faol', default=True)

    class Meta:
        verbose_name = 'AI mahsulot'
        verbose_name_plural = 'AI mahsulotlar'
        ordering = ['order', 'id']

    def __str__(self):
        return self.name_uz


class ResearchSection(TimeStampedModel):
    label_uz = models.CharField('Label (UZ)', max_length=128, blank=True)
    label_ru = models.CharField('Label (RU)', max_length=128, blank=True)
    label_en = models.CharField('Label (EN)', max_length=128, blank=True)
    title1_uz = models.CharField('Sarlavha 1 (UZ)', max_length=255, blank=True)
    title1_ru = models.CharField('Sarlavha 1 (RU)', max_length=255, blank=True)
    title1_en = models.CharField('Sarlavha 1 (EN)', max_length=255, blank=True)
    title_em_uz = models.CharField('Emphasized (UZ)', max_length=255, blank=True)
    title_em_ru = models.CharField('Emphasized (RU)', max_length=255, blank=True)
    title_em_en = models.CharField('Emphasized (EN)', max_length=255, blank=True)
    description_uz = models.TextField('Tavsif (UZ)', blank=True)
    description_ru = models.TextField('Tavsif (RU)', blank=True)
    description_en = models.TextField('Tavsif (EN)', blank=True)
    why_title_uz = models.CharField('Why title (UZ)', max_length=255, blank=True)
    why_title_ru = models.CharField('Why title (RU)', max_length=255, blank=True)
    why_title_en = models.CharField('Why title (EN)', max_length=255, blank=True)
    why_items_uz = models.TextField('Why items | bilan (UZ)', blank=True)
    why_items_ru = models.TextField('Why items (RU)', blank=True)
    why_items_en = models.TextField('Why items (EN)', blank=True)
    sponsor_btn_uz = models.CharField('CTA (UZ)', max_length=128, blank=True)
    sponsor_btn_ru = models.CharField('CTA (RU)', max_length=128, blank=True)
    sponsor_btn_en = models.CharField('CTA (EN)', max_length=128, blank=True)

    class Meta:
        verbose_name = 'Tadqiqotlar bo‘limi'
        verbose_name_plural = 'Tadqiqotlar bo‘limi'

    def __str__(self):
        return 'Tadqiqotlar bo‘limi'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)


class ResearchStudy(TimeStampedModel, OrderedModel):
    study_id = models.CharField('Tadqiqot ID', max_length=64)
    title_uz = models.CharField('Sarlavha (UZ)', max_length=255)
    title_ru = models.CharField('Sarlavha (RU)', max_length=255, blank=True)
    title_en = models.CharField('Sarlavha (EN)', max_length=255, blank=True)
    phase = models.CharField('Bosqich', max_length=32, blank=True)
    status = models.CharField('Status', max_length=32, blank=True, help_text='open / closed')
    area_uz = models.CharField('Soha (UZ)', max_length=255, blank=True)
    area_ru = models.CharField('Soha (RU)', max_length=255, blank=True)
    area_en = models.CharField('Soha (EN)', max_length=255, blank=True)
    is_active = models.BooleanField('Faol', default=True)

    class Meta:
        verbose_name = 'Tadqiqot'
        verbose_name_plural = 'Tadqiqotlar'
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.study_id} — {self.title_uz}'


class ResearchCapability(TimeStampedModel, OrderedModel):
    label_uz = models.CharField('Label (UZ)', max_length=128)
    label_ru = models.CharField('Label (RU)', max_length=128, blank=True)
    label_en = models.CharField('Label (EN)', max_length=128, blank=True)
    value = models.CharField('Qiymat', max_length=128)
    highlight = models.BooleanField('Ajratib ko‘rsatish', default=False)

    class Meta:
        verbose_name = 'Tadqiqot imkoniyati'
        verbose_name_plural = 'Tadqiqot imkoniyatlari'
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.label_uz}: {self.value}'


class EducationTrack(TimeStampedModel, OrderedModel):
    audience_uz = models.CharField('Auditoriya (UZ)', max_length=128)
    audience_ru = models.CharField('Auditoriya (RU)', max_length=128, blank=True)
    audience_en = models.CharField('Auditoriya (EN)', max_length=128, blank=True)
    color = models.CharField('Rang', max_length=32, blank=True, default='#059669')
    icon = models.CharField('Icon', max_length=16, blank=True)
    is_active = models.BooleanField('Faol', default=True)

    class Meta:
        verbose_name = 'Ta’lim yo‘nalishi'
        verbose_name_plural = 'Ta’lim yo‘nalishlari'
        ordering = ['order', 'id']

    def __str__(self):
        return self.audience_uz


class EducationProgram(TimeStampedModel, OrderedModel):
    track = models.ForeignKey(
        EducationTrack,
        related_name='programs',
        on_delete=models.CASCADE,
        verbose_name='Yo‘nalish',
    )
    name_uz = models.CharField('Nomi (UZ)', max_length=255)
    name_ru = models.CharField('Nomi (RU)', max_length=255, blank=True)
    name_en = models.CharField('Nomi (EN)', max_length=255, blank=True)
    duration_uz = models.CharField('Davomiylik (UZ)', max_length=128, blank=True)
    duration_ru = models.CharField('Davomiylik (RU)', max_length=128, blank=True)
    duration_en = models.CharField('Davomiylik (EN)', max_length=128, blank=True)
    spots = models.CharField('O‘rinlar', max_length=64, blank=True)

    class Meta:
        verbose_name = 'Dastur'
        verbose_name_plural = 'Dasturlar'
        ordering = ['order', 'id']

    def __str__(self):
        return self.name_uz


class Testimonial(TimeStampedModel, OrderedModel):
    quote_uz = models.TextField('Iqtibos (UZ)')
    quote_ru = models.TextField('Iqtibos (RU)', blank=True)
    quote_en = models.TextField('Iqtibos (EN)', blank=True)
    author_uz = models.CharField('Muallif (UZ)', max_length=255, blank=True)
    author_ru = models.CharField('Muallif (RU)', max_length=255, blank=True)
    author_en = models.CharField('Muallif (EN)', max_length=255, blank=True)
    role_uz = models.CharField('Lavozim (UZ)', max_length=255, blank=True)
    role_ru = models.CharField('Lavozim (RU)', max_length=255, blank=True)
    role_en = models.CharField('Lavozim (EN)', max_length=255, blank=True)
    is_active = models.BooleanField('Faol', default=True)

    class Meta:
        verbose_name = 'Sharh'
        verbose_name_plural = 'Sharhlar'
        ordering = ['order', 'id']

    def __str__(self):
        return self.author_uz or self.quote_uz[:40]


class Partner(TimeStampedModel, OrderedModel):
    name = models.CharField('Nom', max_length=128)
    logo = models.ImageField('Logo', upload_to='partners/', blank=True, null=True)
    logo_url = models.URLField('Yoki logo URL', blank=True)
    is_active = models.BooleanField('Faol', default=True)

    class Meta:
        verbose_name = 'Hamkor'
        verbose_name_plural = 'Hamkorlar'
        ordering = ['order', 'id']

    def __str__(self):
        return self.name


class InternationalService(TimeStampedModel, OrderedModel):
    title_uz = models.CharField('Sarlavha (UZ)', max_length=255)
    title_ru = models.CharField('Sarlavha (RU)', max_length=255, blank=True)
    title_en = models.CharField('Sarlavha (EN)', max_length=255, blank=True)
    desc_uz = models.TextField('Tavsif (UZ)', blank=True)
    desc_ru = models.TextField('Tavsif (RU)', blank=True)
    desc_en = models.TextField('Tavsif (EN)', blank=True)
    is_active = models.BooleanField('Faol', default=True)

    class Meta:
        verbose_name = 'Xalqaro xizmat'
        verbose_name_plural = 'Xalqaro xizmatlar'
        ordering = ['order', 'id']

    def __str__(self):
        return self.title_uz
