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


LOCMEM = {'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache', 'LOCATION': 'sec-tests'}}


@override_settings(CACHES=LOCMEM, DEBUG=False, ALLOWED_HOSTS=['testserver'], SECURE_SSL_REDIRECT=False)
class ThrottleAndLoginSecurityTests(TestCase):
    def setUp(self):
        from django.core.cache import cache

        cache.clear()

    def test_advice_throttle_cannot_be_bypassed_by_rotating_x_forwarded_for(self):
        # nginx appends the real client ip; anything the client prepends must not count.
        codes = []
        for i in range(45):
            r = self.client.get(
                '/api/inquiries/NOPE-2026-DEADBEEF0000/',
                HTTP_X_FORWARDED_FOR=f'10.9.{i}.1, 203.0.113.7',
            )
            codes.append(r.status_code)
        self.assertEqual(codes.count(404), 40)
        self.assertEqual(codes.count(429), 5)

    def test_client_ip_uses_last_forwarded_entry_only_when_proxied(self):
        from django.test import RequestFactory

        from .utils import client_ip

        req = RequestFactory().get('/', HTTP_X_FORWARDED_FOR='1.2.3.4, 203.0.113.7', REMOTE_ADDR='127.0.0.1')
        self.assertEqual(client_ip(req), '203.0.113.7')
        self.assertEqual(client_ip(RequestFactory().get('/', REMOTE_ADDR='198.51.100.9')), '198.51.100.9')

    def test_admin_login_locks_out_after_repeated_failures(self):
        statuses = [
            self.client.post('/admin/login/', {'username': 'ghost', 'password': 'bad'},
                             HTTP_X_FORWARDED_FOR='203.0.113.50').status_code
            for _ in range(12)
        ]
        self.assertEqual(statuses[:10], [200] * 10)
        self.assertEqual(statuses[10:], [429, 429])
        # a different client address is unaffected
        other = self.client.post('/admin/login/', {'username': 'ghost', 'password': 'bad'},
                                 HTTP_X_FORWARDED_FOR='203.0.113.51')
        self.assertEqual(other.status_code, 200)

    def test_successful_login_still_works_below_the_limit(self):
        User.objects.create_user('staffer', password='correct-horse-battery', is_staff=True, is_superuser=True)
        for _ in range(3):
            self.client.post('/admin/login/', {'username': 'staffer', 'password': 'nope'},
                             HTTP_X_FORWARDED_FOR='203.0.113.60')
        ok = self.client.post('/admin/login/', {'username': 'staffer', 'password': 'correct-horse-battery'},
                              HTTP_X_FORWARDED_FOR='203.0.113.60')
        self.assertEqual(ok.status_code, 302)


@override_settings(CACHES=LOCMEM, DEBUG=False, ALLOWED_HOSTS=['testserver'], SECURE_SSL_REDIRECT=False)
class PublicMediaAndUploadTests(TestCase):
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

    def _write(self, rel, data=b'x'):
        import os

        path = os.path.join(self._media, rel)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'wb') as fh:
            fh.write(data)

    def test_only_public_folders_are_served(self):
        self._write('doctors/a.webp')
        self._write('backups/demo_content_backup.json', b'{}')
        self._write('resumes/2026/10/x.pdf', b'%PDF-')
        self._write('stray.txt')
        self.assertEqual(self.client.get('/media/doctors/a.webp').status_code, 200)
        for rel in ('backups/demo_content_backup.json', 'resumes/2026/10/x.pdf', 'stray.txt', '../etc/passwd'):
            self.assertEqual(self.client.get('/media/' + rel).status_code, 404, rel)

    def test_inquiry_endpoint_rejects_disguised_resume_and_oversized_text(self):
        from django.core.files.uploadedfile import SimpleUploadedFile

        base = {'intent': 'career', 'name': 'Ali', 'phone': '+998901112233'}
        fake = self.client.post('/api/inquiries/', {**base, 'resume': SimpleUploadedFile('cv.pdf', b'<html><script>alert(1)</script>')})
        self.assertEqual(fake.status_code, 400)
        real = self.client.post('/api/inquiries/', {**base, 'resume': SimpleUploadedFile('cv.pdf', b'%PDF-1.4 ok')})
        self.assertEqual(real.status_code, 201)
        self.assertRegex(real.json()['request_id'], r'^HR-\d{4}-[0-9A-F]{12}$')
        long_text = self.client.post('/api/inquiries/', {**base, 'message': 'x' * 5001})
        self.assertEqual(long_text.status_code, 400)
