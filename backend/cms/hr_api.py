"""HR API for the Telegram Mini App: post vacancies, read applications, get resumes in Telegram.

Everything here is authenticated by Telegram initData + allow-list (see telegram_auth.py).
HR can only ever see career applications, never patient inquiries.
"""
import threading

from django.http import Http404
from django.utils.text import slugify
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from . import models, telegram_bot
from .i18n_fill import autofill_from_uz
from .telegram_auth import TelegramInitDataAuthentication

TRANSLATABLE = ('title', 'department', 'location', 'experience', 'description', 'requirements')


class HrBaseAPI(APIView):
    authentication_classes = [TelegramInitDataAuthentication]
    permission_classes = [IsAuthenticated]
    throttle_scope = 'hr_api'


def _unique_slug(title: str) -> str:
    base = slugify(title.replace('’', '').replace("'", ''))[:100] or 'vakansiya'
    slug, n = base, 2
    while models.Vacancy.objects.filter(slug=slug).exists():
        slug = f'{base}-{n}'
        n += 1
    return slug


def _translate_in_background(pk: int) -> None:
    """RU/EN are filled from the Uzbek text after the response is sent (Google can be slow)."""

    def work():
        try:
            obj = models.Vacancy.objects.get(pk=pk)
            if autofill_from_uz(obj):
                obj.save()
        except Exception:  # never let a translation failure surface; admin can fill it later
            pass

    threading.Thread(target=work, daemon=True).start()


class VacancyReadSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='title_uz')
    department = serializers.CharField(source='department_uz')
    location = serializers.CharField(source='location_uz')
    experience = serializers.CharField(source='experience_uz')
    description = serializers.CharField(source='description_uz')
    requirements = serializers.SerializerMethodField()
    applications = serializers.SerializerMethodField()

    class Meta:
        model = models.Vacancy
        fields = (
            'id', 'slug', 'category', 'employment', 'deadline', 'is_active',
            'title', 'department', 'location', 'experience', 'description', 'requirements',
            'applications', 'created_at',
        )

    def get_requirements(self, obj):
        return [r.strip() for r in obj.requirements_uz.split('|') if r.strip()]

    def get_applications(self, obj):
        counts = self.context.get('application_counts') or {}
        return counts.get(obj.title_uz, 0)


class VacancyWriteSerializer(serializers.Serializer):
    category = serializers.ChoiceField(choices=models.Vacancy.Category.values, required=False)
    employment = serializers.ChoiceField(choices=models.Vacancy.Employment.values, required=False)
    deadline = serializers.DateField(required=False, allow_null=True)
    is_active = serializers.BooleanField(required=False)
    title = serializers.CharField(max_length=255, required=False)
    department = serializers.CharField(max_length=255, required=False, allow_blank=True)
    location = serializers.CharField(max_length=255, required=False, allow_blank=True)
    experience = serializers.CharField(max_length=128, required=False, allow_blank=True)
    description = serializers.CharField(max_length=5000, required=False, allow_blank=True)
    requirements = serializers.ListField(
        child=serializers.CharField(max_length=300), required=False, max_length=20
    )

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Lavozim nomini yozing.')
        return value

    def validate_requirements(self, value):
        items = [v.strip() for v in value if v.strip()]
        if any('|' in v for v in items):
            raise serializers.ValidationError('Talab matnida "|" belgisi bo‘lmasin.')
        return items

    def apply(self, vacancy: models.Vacancy) -> models.Vacancy:
        data = self.validated_data
        for key in ('category', 'employment', 'deadline', 'is_active'):
            if key in data:
                setattr(vacancy, key, data[key])
        for field in TRANSLATABLE:
            if field not in data:
                continue
            new = '|'.join(data[field]) if field == 'requirements' else data[field].strip()
            if new != getattr(vacancy, f'{field}_uz'):
                setattr(vacancy, f'{field}_uz', new)
                # stale translations are cleared so the background pass retranslates them
                setattr(vacancy, f'{field}_ru', '')
                setattr(vacancy, f'{field}_en', '')
        vacancy._skip_autofill = True
        if not vacancy.pk:
            vacancy.slug = _unique_slug(vacancy.title_uz)
            vacancy.order = 1  # ties break by newest first
        vacancy.save()
        _translate_in_background(vacancy.pk)
        return vacancy


def _application_counts():
    from django.db.models import Count

    rows = (
        models.Inquiry.objects.filter(intent=models.Inquiry.Intent.CAREER)
        .values('topic')
        .annotate(n=Count('id'))
    )
    return {r['topic']: r['n'] for r in rows}


class HrMeAPI(HrBaseAPI):
    def get(self, request):
        hr = request.user
        return Response({
            'name': hr.name,
            'new_applications': models.Inquiry.objects.filter(
                intent=models.Inquiry.Intent.CAREER, status=models.Inquiry.Status.NEW
            ).count(),
            'choices': {
                'category': [{'value': v, 'label': l} for v, l in models.Vacancy.Category.choices],
                'employment': [{'value': v, 'label': l} for v, l in models.Vacancy.Employment.choices],
            },
        })


class HrVacancyListAPI(HrBaseAPI):
    def get(self, request):
        qs = models.Vacancy.objects.all()
        data = VacancyReadSerializer(qs, many=True, context={'application_counts': _application_counts()}).data
        return Response(data)

    def post(self, request):
        ser = VacancyWriteSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        if not ser.validated_data.get('title'):
            raise serializers.ValidationError({'title': 'Lavozim nomini yozing.'})
        vacancy = ser.apply(models.Vacancy())
        return Response(VacancyReadSerializer(vacancy).data, status=status.HTTP_201_CREATED)


class HrVacancyDetailAPI(HrBaseAPI):
    def _get(self, pk):
        try:
            return models.Vacancy.objects.get(pk=pk)
        except models.Vacancy.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        return Response(VacancyReadSerializer(self._get(pk)).data)

    def patch(self, request, pk):
        vacancy = self._get(pk)
        ser = VacancyWriteSerializer(data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        return Response(VacancyReadSerializer(ser.apply(vacancy)).data)

    def delete(self, request, pk):
        self._get(pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ApplicationSerializer(serializers.ModelSerializer):
    vacancy = serializers.CharField(source='topic')
    has_resume = serializers.SerializerMethodField()

    class Meta:
        model = models.Inquiry
        fields = ('id', 'request_id', 'name', 'phone', 'email', 'vacancy', 'message', 'status', 'has_resume', 'created_at')

    def get_has_resume(self, obj):
        return bool(obj.resume)


def _career_qs():
    return models.Inquiry.objects.filter(intent=models.Inquiry.Intent.CAREER)


class HrApplicationListAPI(HrBaseAPI):
    def get(self, request):
        qs = _career_qs().order_by('-created_at')
        wanted = request.query_params.get('status')
        if wanted in models.Inquiry.Status.values:
            qs = qs.filter(status=wanted)
        try:
            limit = max(1, min(int(request.query_params.get('limit', 50)), 100))
        except ValueError:
            limit = 50
        return Response(ApplicationSerializer(qs[:limit], many=True).data)


class HrApplicationDetailAPI(HrBaseAPI):
    def patch(self, request, pk):
        try:
            inquiry = _career_qs().get(pk=pk)
        except models.Inquiry.DoesNotExist:
            raise Http404
        new_status = request.data.get('status')
        if new_status not in models.Inquiry.Status.values:
            raise serializers.ValidationError({'status': 'Noto‘g‘ri holat.'})
        inquiry.status = new_status
        inquiry.save(update_fields=['status', 'updated_at'])
        return Response(ApplicationSerializer(inquiry).data)


class HrApplicationResumeAPI(HrBaseAPI):
    """Send the applicant's resume to the HR user's own Telegram chat (no file URL is exposed)."""

    def post(self, request, pk):
        try:
            inquiry = _career_qs().get(pk=pk)
        except models.Inquiry.DoesNotExist:
            raise Http404
        if not inquiry.resume:
            raise serializers.ValidationError({'detail': 'Bu arizada rezyume yo‘q.'})
        try:
            handle = inquiry.resume.open('rb')
        except (FileNotFoundError, ValueError):
            raise Http404
        with handle:
            ext = inquiry.resume.name.rsplit('.', 1)[-1].lower()
            filename = f'{slugify(inquiry.name) or inquiry.request_id}-rezyume.{ext}'
            ok = telegram_bot.send_document(
                request.user.telegram_id, filename, handle.read(),
                caption=f'📎 {telegram_bot.html.escape(inquiry.name)} — {telegram_bot.html.escape(inquiry.topic or "ariza")}',
            )
        if not ok:
            return Response({'detail': 'Telegramga yuborib bo‘lmadi. Botga /start bosganingizni tekshiring.'}, status=502)
        return Response({'ok': True})
