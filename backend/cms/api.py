from rest_framework.response import Response
from rest_framework.views import APIView

from . import models, serializers
from .utils import pick, resolve_lang, split_pipe


def ctx(request, lang: str) -> dict:
    return {'request': request, 'lang': lang}


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
        research = models.ResearchSection.objects.first()

        specialties = models.Specialty.objects.filter(is_active=True)
        doctors = models.Doctor.objects.filter(is_active=True)
        news = models.NewsArticle.objects.filter(is_published=True)
        ai = models.AIProduct.objects.filter(is_active=True)
        studies = models.ResearchStudy.objects.filter(is_active=True)
        caps = models.ResearchCapability.objects.all()
        tracks = models.EducationTrack.objects.filter(is_active=True).prefetch_related('programs')
        testimonials = models.Testimonial.objects.filter(is_active=True)
        partners = models.Partner.objects.filter(is_active=True)
        intl = models.InternationalService.objects.filter(is_active=True)

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
            'specialties': serializers.SpecialtyListSerializer(specialties, many=True, context=c).data,
            'doctors': serializers.DoctorSerializer(doctors, many=True, context=c).data,
            'news': serializers.NewsListSerializer(news, many=True, context=c).data,
            'aiProducts': serializers.AIProductListSerializer(ai, many=True, context=c).data,
            'research': research_data,
            'education': serializers.EducationTrackSerializer(tracks, many=True, context=c).data,
            'testimonials': serializers.TestimonialSerializer(testimonials, many=True, context=c).data,
            'partners': serializers.PartnerSerializer(partners, many=True, context=c).data,
            'international': serializers.InternationalServiceSerializer(intl, many=True, context=c).data,
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
        qs = models.Doctor.objects.filter(is_active=True)
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
