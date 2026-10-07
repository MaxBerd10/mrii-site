import shutil
import tempfile

from django.contrib.auth.models import Group, User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings

from .models import Inquiry

HR_GROUP = 'HR bo‘limi'


@override_settings(DEBUG=False, ALLOWED_HOSTS=['testserver'], SECURE_SSL_REDIRECT=False)
class ResumeAccessTests(TestCase):
    """Applicant resumes are personal data: staff-only, HR limited to career leads."""

    @classmethod
    def setUpClass(cls):
        cls._media = tempfile.mkdtemp()
        cls._override = override_settings(MEDIA_ROOT=cls._media)
        cls._override.enable()
        super().setUpClass()

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        cls._override.disable()
        shutil.rmtree(cls._media, ignore_errors=True)

    def setUp(self):
        group, _ = Group.objects.get_or_create(name=HR_GROUP)
        from django.contrib.auth.models import Permission

        group.permissions.set(
            Permission.objects.filter(
                content_type__app_label='cms',
                codename__in=['view_inquiry', 'change_inquiry', 'view_vacancy', 'add_vacancy', 'change_vacancy'],
            )
        )
        self.hr = User.objects.create_user('hr', password='x', is_staff=True)
        self.hr.groups.set([group])
        self.superuser = User.objects.create_superuser('root', 'r@example.com', 'x')
        self.plain_staff = User.objects.create_user('plain', password='x', is_staff=True)
        self.career = Inquiry.objects.create(
            request_id='T-CAREER', intent=Inquiry.Intent.CAREER, name='Ali Valiyev', phone='+998901112233',
            resume=SimpleUploadedFile('My CV.pdf', b'%PDF-1.4 career'),
        )
        self.booking = Inquiry.objects.create(
            request_id='T-BOOK', intent=Inquiry.Intent.BOOKING, name='Pat Ient', phone='+998901112244',
            resume=SimpleUploadedFile('other.pdf', b'%PDF-1.4 other'),
        )

    def url(self, inquiry):
        return f'/admin/cms/inquiry/{inquiry.pk}/resume/'

    def test_upload_name_is_random(self):
        self.assertNotIn('CV', self.career.resume.name)
        self.assertRegex(self.career.resume.name, r'^resumes/\d{4}/\d{2}/[0-9a-f]{32}\.pdf$')

    def test_public_media_route_never_serves_resumes(self):
        self.assertEqual(self.client.get('/media/' + self.career.resume.name).status_code, 404)

    def test_anonymous_is_sent_to_login(self):
        response = self.client.get(self.url(self.career))
        self.assertEqual(response.status_code, 302)
        self.assertIn('/admin/login/', response['Location'])

    def test_hr_downloads_career_resume_only(self):
        self.client.force_login(self.hr)
        ok = self.client.get(self.url(self.career))
        self.assertEqual(ok.status_code, 200)
        self.assertIn('attachment', ok['Content-Disposition'])
        self.assertEqual(self.client.get(self.url(self.booking)).status_code, 404)

    def test_hr_inquiry_list_hides_non_career_leads(self):
        self.client.force_login(self.hr)
        html = self.client.get('/admin/cms/inquiry/').content.decode()
        self.assertIn('T-CAREER', html)
        self.assertNotIn('T-BOOK', html)

    def test_staff_without_inquiry_permission_gets_403(self):
        self.client.force_login(self.plain_staff)
        self.assertEqual(self.client.get(self.url(self.career)).status_code, 403)

    def test_superuser_can_open_any_resume(self):
        self.client.force_login(self.superuser)
        self.assertEqual(self.client.get(self.url(self.booking)).status_code, 200)


class RemoveDemoContentTests(TestCase):
    def _make(self):
        from .models import NewsArticle, Testimonial

        NewsArticle.objects.create(slug='car-t-therapy-study', title_uz='demo')
        NewsArticle.objects.create(slug='real-clinic-news', title_uz='real')
        Testimonial.objects.create(quote_uz='q', author_uz='Elena Kovaleva')
        Testimonial.objects.create(quote_uz='q2', author_uz='Real Patient')
        from .models import SiteSettings

        SiteSettings.objects.all().delete()
        SiteSettings.objects.create(license_uz='Litsenziya LO-77-01-024876', license_ru='Лицензия ЛО-77-01-024876')

    def test_dry_run_changes_nothing_and_apply_keeps_real_rows_and_backs_up(self):
        import io
        import os

        from django.core.management import call_command

        from .models import NewsArticle, SiteSettings, Testimonial

        self._make()
        call_command('remove_demo_content', stdout=io.StringIO())
        self.assertEqual(NewsArticle.objects.count(), 2)
        self.assertEqual(Testimonial.objects.count(), 2)

        with tempfile.TemporaryDirectory() as backup:
            call_command('remove_demo_content', '--apply', f'--backup-dir={backup}', stdout=io.StringIO())
            self.assertEqual(list(NewsArticle.objects.values_list('slug', flat=True)), ['real-clinic-news'])
            self.assertEqual(list(Testimonial.objects.values_list('author_uz', flat=True)), ['Real Patient'])
            self.assertEqual(SiteSettings.objects.get().license_uz, '')
            (backup_file,) = os.listdir(backup)
            call_command('remove_demo_content', '--restore', os.path.join(backup, backup_file), stdout=io.StringIO())
            self.assertEqual(NewsArticle.objects.count(), 2)
            self.assertEqual(Testimonial.objects.count(), 2)
