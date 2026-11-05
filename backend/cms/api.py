from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from . import models, serializers
from .utils import pick, resolve_lang, split_pipe


def ctx(request, lang: str) -> dict:
    return {'request': request, 'lang': lang}


def with_ratings(qs):
    """Annotate doctors with the average and number of approved reviews."""
    from django.db.models import Avg, Count, Q

    approved = Q(reviews__is_approved=True)
    return qs.annotate(
        rating_avg=Avg('reviews__rating', filter=approved),
        rating_count=Count('reviews', filter=approved),
    )


class DoctorReviewsAPI(APIView):
    """Patient reviews of one doctor. Anyone can read approved ones; new ones wait for approval in the admin."""

    authentication_classes = []
    throttle_scope = 'doctor_review'

    def get_throttles(self):
        # Reading is free; only writing is rate-limited.
        return super().get_throttles() if self.request.method == 'POST' else []

    def get(self, request, slug):
        doctor = get_object_or_404(models.Doctor, slug=slug, is_active=True)
        rows = doctor.reviews.filter(is_approved=True)[:50]
        ordered = sorted(rows, key=lambda r: r.created_at, reverse=True)
        return Response([
            {'id': r.pk, 'name': r.name or '', 'rating': r.rating, 'text': r.text, 'createdAt': r.created_at.isoformat()}
            for r in ordered
        ])

    def post(self, request, slug):
        import re

        doctor = get_object_or_404(models.Doctor, slug=slug, is_active=True)
        data = request.data
        if str(data.get('website') or '').strip():
            return Response({'ok': True, 'pending': True}, status=201)  # honeypot: pretend success, store nothing
        text = str(data.get('text') or '').strip()
        name = re.sub(r'\s+', ' ', str(data.get('name') or '')).strip()[:60]
        try:
            rating = int(data.get('rating'))
        except (TypeError, ValueError):
            rating = 0
        if not 1 <= rating <= 5:
            return Response({'error': 'Bahoni tanlang (1–5).'}, status=400)
        if len(text) < 10:
            return Response({'error': 'Sharh juda qisqa — kamida 10 ta belgi yozing.'}, status=400)
        if len(text) > 800:
            return Response({'error': 'Sharh 800 belgidan oshmasin.'}, status=400)
        if re.search(r'https?://|www\.|@\w+\.\w+|(?:\d[\s().-]?){9,}', text + ' ' + name, re.I):
            return Response({'error': 'Sharhda havola, telefon yoki pochta bo‘lmasin.'}, status=400)
        models.DoctorReview.objects.create(doctor=doctor, name=name, rating=rating, text=text)
        return Response({'ok': True, 'pending': True}, status=201)


class TextsAPI(APIView):
    """Everything the clinic edited in the admin that is not CMS content:
    {texts: {key: {lang: text}}, contacts: {phone, telegramUrl, …}, assets: {path: url}}. Only differences from the built-in defaults."""

    def get(self, request):
        from .site_assets import assets_payload
        from .site_texts import contacts_payload, overrides_payload

        response = Response({
            'texts': overrides_payload(),
            'contacts': contacts_payload(),
            'assets': assets_payload(request),
        })
        response['Cache-Control'] = 'public, max-age=60'
        return response


class PricesAPI(APIView):
    """Price list edited in the admin. A section that has no rows yet is null, so the website keeps its built-in data."""

    def get(self, request):
        from .site_texts import prices_payload

        response = Response(prices_payload())
        response['Cache-Control'] = 'public, max-age=60'
        return response


class SettingsAPI(APIView):
    def get(self, request):
        lang = resolve_lang(request)
        obj = models.SiteSettings.load()
        return Response(serializers.SiteSettingsSerializer(obj, context=ctx(request, lang)).data)


class HomeAPI(APIView):
    """Single payload for homepage CMS sections."""

    def get(self, request):
        lang = resolve_lang(request)
        c = ctx(request, lang)

        settings = models.SiteSettings.load()
        hero = models.Hero.objects.first()
        homepage = models.HomePage.load()
        research = models.ResearchSection.objects.first()

        specialties = models.Specialty.objects.filter(is_active=True)
        doctors = with_ratings(models.Doctor.objects.filter(is_active=True))
        news = models.NewsArticle.objects.filter(is_published=True)
        ai = models.AIProduct.objects.filter(is_active=True)
        studies = models.ResearchStudy.objects.filter(is_active=True)
        caps = models.ResearchCapability.objects.all()
        tracks = models.EducationTrack.objects.filter(is_active=True).prefetch_related('programs')
        testimonials = models.Testimonial.objects.filter(is_active=True)

        research_data = None
        if research:
            research_data = {
                'label': pick(research, 'label', lang),
                'title1': pick(research, 'title1', lang),
                'titleEm': pick(research, 'title_em', lang),
                'description': pick(research, 'description', lang),
                'whyTitle': pick(research, 'why_title', lang),
                'whyItems': split_pipe(pick(research, 'why_items', lang)),
                'sponsorBtn': pick(research, 'sponsor_btn', lang),
                'studies': serializers.ResearchStudySerializer(studies, many=True, context=c).data,
                'capabilities': serializers.ResearchCapabilitySerializer(caps, many=True, context=c).data,
            }

        return Response({
            'lang': lang,
            'settings': serializers.SiteSettingsSerializer(settings, context=c).data,
            'hero': serializers.HeroSerializer(hero, context=c).data if hero else None,
            'homepage': serializers.HomePageSerializer(homepage, context=c).data,
            'specialties': serializers.SpecialtyListSerializer(specialties, many=True, context=c).data,
            'doctors': serializers.DoctorSerializer(doctors, many=True, context=c).data,
            'news': serializers.NewsListSerializer(news, many=True, context=c).data,
            'aiProducts': serializers.AIProductListSerializer(ai, many=True, context=c).data,
            'research': research_data,
            'education': serializers.EducationTrackSerializer(tracks, many=True, context=c).data,
            'testimonials': serializers.TestimonialSerializer(testimonials, many=True, context=c).data,
        })


class SpecialtyListAPI(APIView):
    def get(self, request):
        lang = resolve_lang(request)
        qs = models.Specialty.objects.filter(is_active=True)
        return Response(serializers.SpecialtyListSerializer(qs, many=True, context=ctx(request, lang)).data)


class SpecialtyDetailAPI(APIView):
    def get(self, request, slug):
        lang = resolve_lang(request)
        try:
            obj = models.Specialty.objects.get(slug=slug, is_active=True)
        except models.Specialty.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        return Response(serializers.SpecialtyDetailSerializer(obj, context=ctx(request, lang)).data)


class DoctorListAPI(APIView):
    def get(self, request):
        lang = resolve_lang(request)
        qs = with_ratings(models.Doctor.objects.filter(is_active=True))
        return Response(serializers.DoctorSerializer(qs, many=True, context=ctx(request, lang)).data)


class NewsListAPI(APIView):
    def get(self, request):
        lang = resolve_lang(request)
        qs = models.NewsArticle.objects.filter(is_published=True)
        return Response(serializers.NewsListSerializer(qs, many=True, context=ctx(request, lang)).data)


class NewsDetailAPI(APIView):
    def get(self, request, slug):
        lang = resolve_lang(request)
        try:
            obj = models.NewsArticle.objects.get(slug=slug, is_published=True)
        except models.NewsArticle.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        return Response(serializers.NewsDetailSerializer(obj, context=ctx(request, lang)).data)


class AIProductListAPI(APIView):
    def get(self, request):
        lang = resolve_lang(request)
        qs = models.AIProduct.objects.filter(is_active=True)
        return Response(serializers.AIProductListSerializer(qs, many=True, context=ctx(request, lang)).data)


class AIProductDetailAPI(APIView):
    def get(self, request, slug):
        lang = resolve_lang(request)
        try:
            obj = models.AIProduct.objects.get(slug=slug, is_active=True)
        except models.AIProduct.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        return Response(serializers.AIProductDetailSerializer(obj, context=ctx(request, lang)).data)


class ResearchAPI(APIView):
    def get(self, request):
        lang = resolve_lang(request)
        c = ctx(request, lang)
        section = models.ResearchSection.objects.first()
        studies = models.ResearchStudy.objects.filter(is_active=True)
        caps = models.ResearchCapability.objects.all()
        data = {
            'section': None,
            'studies': serializers.ResearchStudySerializer(studies, many=True, context=c).data,
            'capabilities': serializers.ResearchCapabilitySerializer(caps, many=True, context=c).data,
        }
        if section:
            data['section'] = {
                'label': pick(section, 'label', lang),
                'title1': pick(section, 'title1', lang),
                'titleEm': pick(section, 'title_em', lang),
                'description': pick(section, 'description', lang),
                'whyTitle': pick(section, 'why_title', lang),
                'whyItems': split_pipe(pick(section, 'why_items', lang)),
                'sponsorBtn': pick(section, 'sponsor_btn', lang),
            }
        return Response(data)


class EducationAPI(APIView):
    def get(self, request):
        lang = resolve_lang(request)
        qs = models.EducationTrack.objects.filter(is_active=True).prefetch_related('programs')
        return Response(serializers.EducationTrackSerializer(qs, many=True, context=ctx(request, lang)).data)


class ClinicTourListAPI(APIView):
    def get(self, request):
        lang = resolve_lang(request)
        qs = models.ClinicTourVideo.objects.filter(is_active=True)
        return Response(
            serializers.ClinicTourVideoSerializer(qs, many=True, context=ctx(request, lang)).data
        )


class VacancyListAPI(APIView):
    def get(self, request):
        lang = resolve_lang(request)
        qs = models.Vacancy.objects.filter(is_active=True)
        return Response(
            serializers.VacancySerializer(qs, many=True, context=ctx(request, lang)).data
        )


class InquiryCreateAPI(APIView):
    """Public POST for contact / AI demo / consult leads → Django admin."""

    authentication_classes = []
    throttle_scope = 'inquiry_create'

    def post(self, request):
        serializer = serializers.InquiryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        return Response(
            {
                'ok': True,
                'request_id': inquiry.request_id,
                'intent': inquiry.intent,
            },
            status=201,
        )


class InquiryAdviceAPI(APIView):
    """Public GET: patient checks advice by request_id (no private medical dump)."""

    authentication_classes = []
    throttle_scope = 'inquiry_advice'

    def get(self, request, request_id: str):
        inquiry = models.Inquiry.objects.filter(request_id__iexact=request_id.strip()).first()
        if not inquiry:
            return Response({'detail': 'Murojaat topilmadi.'}, status=404)
        advice = (inquiry.advice or '').strip()
        return Response(
            {
                'request_id': inquiry.request_id,
                'status': inquiry.status,
                'has_advice': bool(advice),
                'advice': advice if advice else '',
                'name': inquiry.name,
                'created_at': inquiry.created_at,
            }
        )
