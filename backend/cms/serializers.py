from rest_framework import serializers

from . import models
from .utils import media_url, pick, split_pipe


class LangContextMixin:
    @property
    def lang(self) -> str:
        return self.context.get('lang', 'uz')

    @property
    def request(self):
        return self.context.get('request')


class SpecialtyListSerializer(LangContextMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    desc = serializers.SerializerMethodField()
    count = serializers.IntegerField(source='doctor_count')
    image = serializers.SerializerMethodField()

    class Meta:
        model = models.Specialty
        fields = ('slug', 'icon', 'name', 'desc', 'count', 'image', 'order')

    def get_name(self, obj):
        return pick(obj, 'name', self.lang)

    def get_desc(self, obj):
        return pick(obj, 'desc', self.lang)

    def get_image(self, obj):
        return media_url(self.request, obj.image, obj.image_url)


class SpecialtyDetailSerializer(SpecialtyListSerializer):
    overview = serializers.SerializerMethodField()
    conditions = serializers.SerializerMethodField()
    services = serializers.SerializerMethodField()
    diagnostics = serializers.SerializerMethodField()

    class Meta(SpecialtyListSerializer.Meta):
        fields = SpecialtyListSerializer.Meta.fields + (
            'overview', 'conditions', 'services', 'diagnostics',
        )

    def get_overview(self, obj):
        return pick(obj, 'overview', self.lang)

    def get_conditions(self, obj):
        return split_pipe(pick(obj, 'conditions', self.lang))

    def get_services(self, obj):
        return split_pipe(pick(obj, 'services', self.lang))

    def get_diagnostics(self, obj):
        return split_pipe(pick(obj, 'diagnostics', self.lang))


class DoctorSerializer(LangContextMixin, serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    specialty = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()
    exp = serializers.CharField(source='experience')

    class Meta:
        model = models.Doctor
        fields = ('id', 'name', 'role', 'specialty', 'exp', 'papers', 'studies', 'color', 'photo', 'order')

    def get_role(self, obj):
        return pick(obj, 'role', self.lang)

    def get_specialty(self, obj):
        return pick(obj, 'specialty', self.lang)

    def get_photo(self, obj):
        return media_url(self.request, obj.photo, obj.photo_url)


class NewsListSerializer(LangContextMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    date = serializers.DateField(source='published_at', allow_null=True)
    cover = serializers.SerializerMethodField()

    class Meta:
        model = models.NewsArticle
        fields = (
            'slug', 'date', 'category', 'category_color', 'title', 'excerpt', 'cover', 'order',
        )

    def get_title(self, obj):
        return pick(obj, 'title', self.lang)

    def get_excerpt(self, obj):
        return pick(obj, 'excerpt', self.lang)

    def get_category(self, obj):
        return pick(obj, 'category', self.lang)

    def get_cover(self, obj):
        return media_url(self.request, obj.cover, obj.cover_url)


class NewsDetailSerializer(NewsListSerializer):
    lead = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()

    class Meta(NewsListSerializer.Meta):
        fields = NewsListSerializer.Meta.fields + ('lead', 'body')

    def get_lead(self, obj):
        return pick(obj, 'lead', self.lang)

    def get_body(self, obj):
        return split_pipe(pick(obj, 'body', self.lang))


class AIProductListSerializer(LangContextMixin, serializers.ModelSerializer):
    id = serializers.CharField(source='product_key')
    name = serializers.SerializerMethodField()
    tag = serializers.SerializerMethodField()
    desc = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    metric_label = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = models.AIProduct
        fields = (
            'id', 'slug', 'name', 'tag', 'tag_color', 'desc', 'features',
            'metric', 'metric_label', 'image', 'order',
        )

    def get_name(self, obj):
        return pick(obj, 'name', self.lang)

    def get_tag(self, obj):
        return pick(obj, 'tag', self.lang)

    def get_desc(self, obj):
        return pick(obj, 'desc', self.lang)

    def get_features(self, obj):
        return split_pipe(pick(obj, 'features', self.lang))

    def get_metric_label(self, obj):
        return pick(obj, 'metric_label', self.lang)

    def get_image(self, obj):
        return media_url(self.request, obj.image, obj.image_url)


class AIProductDetailSerializer(AIProductListSerializer):
    overview = serializers.SerializerMethodField()
    audience = serializers.SerializerMethodField()
    outcomes = serializers.SerializerMethodField()
    workflow = serializers.SerializerMethodField()

    class Meta(AIProductListSerializer.Meta):
        fields = AIProductListSerializer.Meta.fields + (
            'overview', 'audience', 'outcomes', 'workflow',
        )

    def get_overview(self, obj):
        return pick(obj, 'overview', self.lang)

    def get_audience(self, obj):
        return pick(obj, 'audience', self.lang)

    def get_outcomes(self, obj):
        return split_pipe(pick(obj, 'outcomes', self.lang))

    def get_workflow(self, obj):
        return split_pipe(pick(obj, 'workflow', self.lang))


class EducationProgramSerializer(LangContextMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = models.EducationProgram
        fields = ('name', 'duration', 'spots', 'order')

    def get_name(self, obj):
        return pick(obj, 'name', self.lang)

    def get_duration(self, obj):
        return pick(obj, 'duration', self.lang)


class EducationTrackSerializer(LangContextMixin, serializers.ModelSerializer):
    audience = serializers.SerializerMethodField()
    programs = EducationProgramSerializer(many=True, read_only=True)

    class Meta:
        model = models.EducationTrack
        fields = ('id', 'audience', 'color', 'icon', 'programs', 'order')

    def get_audience(self, obj):
        return pick(obj, 'audience', self.lang)


class ResearchStudySerializer(LangContextMixin, serializers.ModelSerializer):
    id = serializers.CharField(source='study_id')
    title = serializers.SerializerMethodField()
    area = serializers.SerializerMethodField()

    class Meta:
        model = models.ResearchStudy
        fields = ('id', 'title', 'phase', 'status', 'area', 'order')

    def get_title(self, obj):
        return pick(obj, 'title', self.lang)

    def get_area(self, obj):
        return pick(obj, 'area', self.lang)


class ResearchCapabilitySerializer(LangContextMixin, serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = models.ResearchCapability
        fields = ('label', 'value', 'highlight', 'order')

    def get_label(self, obj):
        return pick(obj, 'label', self.lang)


class TestimonialSerializer(LangContextMixin, serializers.ModelSerializer):
    quote = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = models.Testimonial
        fields = ('quote', 'author', 'role', 'order')

    def get_quote(self, obj):
        return pick(obj, 'quote', self.lang)

    def get_author(self, obj):
        return pick(obj, 'author', self.lang)

    def get_role(self, obj):
        return pick(obj, 'role', self.lang)


class PartnerSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = models.Partner
        fields = ('name', 'logo', 'order')

    def get_logo(self, obj):
        return media_url(self.context.get('request'), obj.logo, obj.logo_url)


class InternationalServiceSerializer(LangContextMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    desc = serializers.SerializerMethodField()

    class Meta:
        model = models.InternationalService
        fields = ('title', 'desc', 'order')

    def get_title(self, obj):
        return pick(obj, 'title', self.lang)

    def get_desc(self, obj):
        return pick(obj, 'desc', self.lang)


class SiteSettingsSerializer(LangContextMixin, serializers.ModelSerializer):
    badge = serializers.SerializerMethodField()
    slogan = serializers.SerializerMethodField()
    copyright = serializers.SerializerMethodField()
    license = serializers.SerializerMethodField()

    class Meta:
        model = models.SiteSettings
        fields = (
            'phone', 'hours', 'institute_name', 'badge', 'slogan', 'copyright', 'license',
        )

    def get_badge(self, obj):
        return pick(obj, 'badge', self.lang)

    def get_slogan(self, obj):
        return pick(obj, 'slogan', self.lang)

    def get_copyright(self, obj):
        return pick(obj, 'copyright', self.lang)

    def get_license(self, obj):
        return pick(obj, 'license', self.lang)


class HeroSerializer(LangContextMixin, serializers.ModelSerializer):
    title1 = serializers.SerializerMethodField()
    title2 = serializers.SerializerMethodField()
    tagline = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = models.Hero
        fields = ('title1', 'title2', 'tagline', 'description', 'image', 'certs')

    def get_title1(self, obj):
        return pick(obj, 'title1', self.lang)

    def get_title2(self, obj):
        return pick(obj, 'title2', self.lang)

    def get_tagline(self, obj):
        return pick(obj, 'tagline', self.lang)

    def get_description(self, obj):
        return pick(obj, 'description', self.lang)

    def get_image(self, obj):
        return media_url(self.request, obj.image, obj.image_url)


class ClinicTourVideoSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='video_key')
    src = serializers.SerializerMethodField()
    poster = serializers.SerializerMethodField()

    class Meta:
        model = models.ClinicTourVideo
        fields = ('id', 'src', 'poster', 'order')

    def get_src(self, obj):
        return media_url(self.context.get('request'), obj.video, obj.video_url)

    def get_poster(self, obj):
        return media_url(self.context.get('request'), obj.poster, obj.poster_url)


class InquiryCreateSerializer(serializers.Serializer):
    intent = serializers.ChoiceField(choices=models.Inquiry.Intent.values)
    name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=64)
    email = serializers.EmailField(required=False, allow_blank=True, default='')
    topic = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    clinic = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    product_slug = serializers.SlugField(max_length=128, required=False, allow_blank=True, default='')
    medical_history = serializers.CharField(required=False, allow_blank=True, default='')
    allergies = serializers.CharField(required=False, allow_blank=True, default='')
    message = serializers.CharField(required=False, allow_blank=True, default='')
    lang = serializers.CharField(max_length=8, required=False, allow_blank=True, default='')
    source_path = serializers.CharField(max_length=512, required=False, allow_blank=True, default='')

    def validate_phone(self, value: str) -> str:
        digits = ''.join(ch for ch in value if ch.isdigit() or ch == '+')
        if len(digits.replace('+', '')) < 7:
            raise serializers.ValidationError('Telefon raqami juda qisqa.')
        return value.strip()

    def validate(self, attrs):
        if attrs.get('intent') == models.Inquiry.Intent.CONSULT:
            if not (attrs.get('message') or '').strip():
                raise serializers.ValidationError({'message': 'Shikoyatni yozing.'})
        return attrs

    def create(self, validated_data):
        from django.utils import timezone

        year = timezone.now().year
        suffix = timezone.now().strftime('%H%M%S')[-6:]
        intent = validated_data['intent']
        if intent == models.Inquiry.Intent.AI:
            prefix = 'AI'
        elif intent == models.Inquiry.Intent.CONSULT:
            prefix = 'MAS'
        else:
            prefix = 'FJSTI'
        request_id = f'{prefix}-{year}-{suffix}'
        if models.Inquiry.objects.filter(request_id=request_id).exists():
            request_id = f'{prefix}-{year}-{timezone.now().strftime("%f")[-6:]}'
        return models.Inquiry.objects.create(request_id=request_id, **validated_data)


class InquiryAdviceSerializer(serializers.Serializer):
    request_id = serializers.CharField()
    status = serializers.CharField()
    has_advice = serializers.BooleanField()
    advice = serializers.CharField(allow_blank=True)
    name = serializers.CharField()
    created_at = serializers.DateTimeField()
