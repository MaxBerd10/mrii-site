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
        long_text = self.client.post('/api/inquiries/', {**base, 'message': 'x' * 10001})
        self.assertEqual(long_text.status_code, 400)


# ───────────────────────── Telegram HR Mini App ─────────────────────────
BOT = '123456:TEST-TOKEN-for-unit-tests'


def make_init_data(user_id=777, token=BOT, age=0, tamper=False):
    import hashlib
    import hmac
    import json
    import time
    from urllib.parse import urlencode

    fields = {
        'auth_date': str(int(time.time()) - age),
        'query_id': 'AAH-test',
        'user': json.dumps({'id': user_id, 'first_name': 'Hr'}, separators=(',', ':')),
    }
    dcs = '\n'.join(f'{k}={v}' for k, v in sorted(fields.items()))
    secret = hmac.new(b'WebAppData', token.encode(), hashlib.sha256).digest()
    fields['hash'] = hmac.new(secret, dcs.encode(), hashlib.sha256).hexdigest()
    if tamper:
        fields['user'] = fields['user'].replace(str(user_id), '999')
    return urlencode(fields)


@override_settings(
    CACHES=LOCMEM, DEBUG=False, ALLOWED_HOSTS=['testserver'], SECURE_SSL_REDIRECT=False,
    TELEGRAM_BOT_TOKEN=BOT, TELEGRAM_INITDATA_MAX_AGE=3600,
)
class TelegramHrApiTests(TestCase):
    def setUp(self):
        from django.core.cache import cache

        from .models import HRTelegramUser

        cache.clear()
        self.hr = HRTelegramUser.objects.create(telegram_id=777, name='HR Xodim')

    def call(self, method, path, body=None, init=None, **kw):
        headers = {}
        if init is not None:
            headers['HTTP_AUTHORIZATION'] = f'tma {init}'
        kwargs = {'content_type': 'application/json', **headers}
        data = body if body is None else __import__('json').dumps(body)
        return getattr(self.client, method)(path, data=data, **kwargs) if data is not None else getattr(self.client, method)(path, **kwargs)

    # ---- authentication
    def test_rejects_missing_forged_expired_and_unknown_users(self):
        self.assertEqual(self.call('get', '/api/hr/me/').status_code, 401)
        self.assertEqual(self.call('get', '/api/hr/me/', init=make_init_data(tamper=True)).status_code, 401)
        self.assertEqual(self.call('get', '/api/hr/me/', init=make_init_data(token='1:other-bot')).status_code, 401)
        self.assertEqual(self.call('get', '/api/hr/me/', init=make_init_data(age=7200)).status_code, 401)
        self.assertEqual(self.call('get', '/api/hr/me/', init=make_init_data(user_id=555)).status_code, 403)
        from .models import HRTelegramUser

        HRTelegramUser.objects.filter(pk=self.hr.pk).update(is_active=False)
        self.assertEqual(self.call('get', '/api/hr/me/', init=make_init_data()).status_code, 403)

    def test_valid_allow_listed_user_gets_in(self):
        r = self.call('get', '/api/hr/me/', init=make_init_data())
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()['name'], 'HR Xodim')

    @override_settings(TELEGRAM_BOT_TOKEN='')
    def test_returns_503_when_bot_not_configured(self):
        self.assertEqual(self.call('get', '/api/hr/me/', init=make_init_data()).status_code, 503)

    # ---- vacancies
    def test_create_edit_toggle_delete_vacancy(self):
        from unittest import mock

        from .models import Vacancy

        init = make_init_data()
        with mock.patch('cms.hr_api._translate_in_background') as bg:
            r = self.call('post', '/api/hr/vacancies/', {
                'title': 'Kardiolog', 'category': 'doctor', 'employment': 'full_time',
                'department': 'Kardiologiya', 'location': 'Farg’ona', 'experience': '3 yil',
                'description': 'Klinikada ishlash', 'requirements': ['Oliy ma’lumot', 'Sertifikat'],
                'deadline': '2026-12-31',
            }, init=init)
            self.assertEqual(r.status_code, 201, r.content)
            bg.assert_called_once()
        vac = Vacancy.objects.get(title_uz='Kardiolog')
        self.assertEqual(vac.requirements_uz, 'Oliy ma’lumot|Sertifikat')
        self.assertTrue(vac.is_active and vac.slug.startswith('kardiolog'))
        # public site shows it
        pub = self.client.get('/api/vacancies/?lang=uz').json()
        self.assertIn('Kardiolog', [v['title'] for v in pub])

        # edit title clears stale translations of that field only
        Vacancy.objects.filter(pk=vac.pk).update(title_ru='Кардиолог', department_ru='Кардиология')
        with mock.patch('cms.hr_api._translate_in_background'):
            r = self.call('patch', f'/api/hr/vacancies/{vac.pk}/', {'title': 'Katta kardiolog'}, init=init)
        self.assertEqual(r.status_code, 200)
        vac.refresh_from_db()
        self.assertEqual((vac.title_uz, vac.title_ru, vac.department_ru), ('Katta kardiolog', '', 'Кардиология'))

        # deactivate -> disappears from public site
        with mock.patch('cms.hr_api._translate_in_background'):
            self.call('patch', f'/api/hr/vacancies/{vac.pk}/', {'is_active': False}, init=init)
        pub = self.client.get('/api/vacancies/?lang=uz').json()
        self.assertNotIn('Katta kardiolog', [v['title'] for v in pub])

        self.assertEqual(self.call('delete', f'/api/hr/vacancies/{vac.pk}/', init=init).status_code, 204)
        self.assertFalse(Vacancy.objects.filter(pk=vac.pk).exists())

    def test_vacancy_validation_and_slug_uniqueness(self):
        from unittest import mock

        init = make_init_data()
        self.assertEqual(self.call('post', '/api/hr/vacancies/', {'category': 'doctor'}, init=init).status_code, 400)
        self.assertEqual(self.call('post', '/api/hr/vacancies/', {'title': 'X', 'requirements': ['a|b']}, init=init).status_code, 400)
        self.assertEqual(self.call('post', '/api/hr/vacancies/', {'title': 'X', 'category': 'hacker'}, init=init).status_code, 400)
        with mock.patch('cms.hr_api._translate_in_background'):
            a = self.call('post', '/api/hr/vacancies/', {'title': 'Hamshira'}, init=init).json()
            b = self.call('post', '/api/hr/vacancies/', {'title': 'Hamshira'}, init=init).json()
        self.assertNotEqual(a['slug'], b['slug'])

    # ---- applications
    def _inquiries(self):
        from django.core.files.uploadedfile import SimpleUploadedFile

        from .models import Inquiry

        career = Inquiry.objects.create(
            request_id='HR-2026-AAAAAAAAAAAA', intent='career', name='Ali', phone='+998901', topic='Terapevt',
            resume=SimpleUploadedFile('cv.pdf', b'%PDF-1.4 hello'),
        )
        patient = Inquiry.objects.create(
            request_id='FJSTI-2026-BBBBBBBBBBBB', intent='booking', name='Bemor', phone='+998902',
            medical_history='secret history', allergies='penicillin',
        )
        return career, patient

    def test_hr_sees_only_career_applications_and_can_set_status(self):
        career, patient = self._inquiries()
        init = make_init_data()
        rows = self.call('get', '/api/hr/applications/', init=init).json()
        self.assertEqual([r['name'] for r in rows], ['Ali'])
        self.assertNotIn('medical_history', rows[0])
        self.assertEqual(self.call('patch', f'/api/hr/applications/{patient.pk}/', {'status': 'closed'}, init=init).status_code, 404)
        r = self.call('patch', f'/api/hr/applications/{career.pk}/', {'status': 'contacted'}, init=init)
        self.assertEqual(r.json()['status'], 'contacted')
        self.assertEqual(self.call('patch', f'/api/hr/applications/{career.pk}/', {'status': 'x'}, init=init).status_code, 400)

    def test_resume_is_sent_to_the_hr_chat_not_exposed_as_url(self):
        from unittest import mock

        career, patient = self._inquiries()
        init = make_init_data()
        with mock.patch('cms.telegram_bot.send_document', return_value=True) as send:
            r = self.call('post', f'/api/hr/applications/{career.pk}/resume/', init=init)
        self.assertEqual(r.status_code, 200)
        chat_id, filename, content = send.call_args.args[:3]
        self.assertEqual((chat_id, content), (777, b'%PDF-1.4 hello'))
        self.assertTrue(filename.endswith('.pdf'))
        with mock.patch('cms.telegram_bot.send_document') as send:
            self.assertEqual(self.call('post', f'/api/hr/applications/{patient.pk}/resume/', init=init).status_code, 404)
            send.assert_not_called()
        with mock.patch('cms.telegram_bot.send_document', return_value=False):
            self.assertEqual(self.call('post', f'/api/hr/applications/{career.pk}/resume/', init=init).status_code, 502)

    def test_new_career_application_notifies_hr_but_other_intents_do_not(self):
        from unittest import mock

        with mock.patch('cms.telegram_bot.notify_new_application') as notify:
            self.client.post('/api/inquiries/', {'intent': 'career', 'name': 'Vali', 'phone': '+99890111223'})
            self.client.post('/api/inquiries/', {'intent': 'booking', 'name': 'Bemor', 'phone': '+99890111224'})
        self.assertEqual(notify.call_count, 1)

    def test_notification_text_escapes_html_and_targets_active_hr_only(self):
        from unittest import mock

        from . import telegram_bot
        from .models import HRTelegramUser, Inquiry

        HRTelegramUser.objects.create(telegram_id=888, name='Off', is_active=False)
        inquiry = Inquiry(name='<b>Eve</b>', phone='1', topic='A&B', message='<script>x</script>', resume=None)
        sent = []
        with mock.patch.object(telegram_bot, 'send_message', side_effect=lambda cid, text, **kw: sent.append((cid, text))), \
                mock.patch('threading.Thread') as T:
            telegram_bot.notify_new_application(inquiry)
            T.call_args.kwargs['target']()
        self.assertEqual([c for c, _ in sent], [777])
        self.assertNotIn('<script>', sent[0][1])
        self.assertIn('&lt;b&gt;Eve&lt;/b&gt;', sent[0][1])


# ───────────────── Applicant submission matrix: every kind of resume ─────────────────
def _zip_bytes(files):
    import io
    import zipfile

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w') as z:
        for name, data in files.items():
            z.writestr(name, data)
    return buf.getvalue()


def _image_bytes(fmt, size=(64, 48)):
    import io

    from PIL import Image

    buf = io.BytesIO()
    Image.new('RGB', size, (250, 250, 250)).save(buf, fmt)
    return buf.getvalue()


def _padded(head: bytes, total: int) -> bytes:
    return head + b'0' * (total - len(head))


VALID_RESUMES = {
    'pdf': ('Rezyume.pdf', b'%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF'),
    'pdf_with_leading_junk': ('cv.pdf', b'\xef\xbb\xbf\n\n%PDF-1.7\n%%EOF'),
    'docx': ('Resume.docx', _zip_bytes({'[Content_Types].xml': '<x/>', 'word/document.xml': '<w:document/>'})),
    'doc_ole': ('eski.doc', b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1' + b'\x00' * 512),
    'doc_actually_docx': ('word97.doc', _zip_bytes({'word/document.xml': '<w/>'})),
    'rtf': ('cv.rtf', b'{\\rtf1\\ansi\\deff0 {\\fonttbl{\\f0 Arial;}} Salom \\par }'),
    'odt': ('cv.odt', _zip_bytes({'mimetype': 'application/vnd.oasis.opendocument.text', 'content.xml': '<o/>'})),
    'txt_uz': ('cv.txt', 'Men Valiyev Ali, 5 yillik tajriba. Oʻzbekcha: oʻgʻil, gʻoya.'.encode()),
    'txt_cyrillic': ('резюме.txt', 'Иванов Иван. Опыт 5 лет. Ўзбекча: қ, ғ, ҳ'.encode()),
    'jpg_photo': ('IMG_2041.JPG', _image_bytes('JPEG')),
    'png_scan': ('scan.png', _image_bytes('PNG')),
    'webp': ('photo.webp', _image_bytes('WEBP')),
    'heic_iphone': ('IMG_0001.HEIC', b'\x00\x00\x00\x18ftypheic\x00\x00\x00\x00mif1heic' + b'\x00' * 64),
    'uppercase_ext': ('CV.PDF', b'%PDF-1.4 %%EOF'),
    'cyrillic_name': ('Резюме Алишер (1).pdf', b'%PDF-1.4 %%EOF'),
    'spaces_apostrophes': ("Ali o'g'li  rezyume   final .pdf", b'%PDF-1.4 %%EOF'),
    'emoji_name': ('cv 📄✅.pdf', b'%PDF-1.4 %%EOF'),
    'very_long_name': (('a' * 250) + '.pdf', b'%PDF-1.4 %%EOF'),
    'path_traversal_name': ('../../etc/passwd.pdf', b'%PDF-1.4 %%EOF'),
    'exactly_10mb': ('big.pdf', _padded(b'%PDF-1.4\n', 10 * 1024 * 1024)),
}

INVALID_RESUMES = {
    'exe': ('virus.exe', b'MZ\x90\x00' + b'\x00' * 64),
    'exe_disguised_as_pdf': ('cv.pdf', b'MZ\x90\x00' + b'\x00' * 64),
    'html_as_pdf': ('cv.pdf', b'<html><script>alert(1)</script></html>'),
    'svg': ('logo.svg', b'<svg xmlns="http://www.w3.org/2000/svg"><script>1</script></svg>'),
    'zip_archive': ('cv.zip', _zip_bytes({'cv.pdf': '%PDF-'})),
    'no_extension': ('resume', b'%PDF-1.4'),
    'double_extension_exe': ('cv.pdf.exe', b'MZ\x90\x00'),
    'png_renamed_pdf': ('cv.pdf', _image_bytes('PNG')),
    'binary_renamed_txt': ('cv.txt', b'\x00\x01\x02\x03binary'),
    'empty_file': ('empty.pdf', b''),
    'over_10mb': ('huge.pdf', _padded(b'%PDF-1.4\n', 10 * 1024 * 1024 + 1)),
    'pages_apple': ('cv.pages', _zip_bytes({'index.xml': '<p/>'})),
}


@override_settings(CACHES=LOCMEM, DEBUG=False, ALLOWED_HOSTS=['testserver'], SECURE_SSL_REDIRECT=False)
class ApplicantSubmissionMatrixTests(TestCase):
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

    base = {'intent': 'career', 'name': 'Ali Valiyev', 'phone': '+998901234567', 'topic': 'Terapevt'}

    def post(self, **extra):
        from django.core.cache import cache

        cache.clear()  # these tests are about validation, not the hourly rate limit
        return self.client.post('/api/inquiries/', {**self.base, **extra})

    def upload(self, name, data):
        from django.core.files.uploadedfile import SimpleUploadedFile

        return self.post(resume=SimpleUploadedFile(name, data))

    def test_every_valid_kind_is_accepted_stored_safely_and_retrievable(self):
        from unittest import mock

        from django.contrib.auth.models import User

        from .models import Inquiry

        admin = User.objects.create_superuser('root2', 'r@x.y', 'x')
        self.client.force_login(admin)
        for label, (name, data) in VALID_RESUMES.items():
            with self.subTest(label):
                response = self.upload(name, data)
                self.assertEqual(response.status_code, 201, (label, response.content[:200]))
                inquiry = Inquiry.objects.get(request_id=response.json()['request_id'])
                # stored under an unguessable name, extension lower-cased, nothing from the client's name
                self.assertRegex(inquiry.resume.name, r'^resumes/\d{4}/\d{2}/[0-9a-f]{32}\.[a-z]+$', label)
                with inquiry.resume.open('rb') as fh:
                    self.assertEqual(fh.read(), data)
                # staff can download it with a sensible filename and the exact bytes
                dl = self.client.get(f'/admin/cms/inquiry/{inquiry.pk}/resume/')
                self.assertEqual(dl.status_code, 200, label)
                self.assertEqual(b''.join(dl.streaming_content), data)
                self.assertIn('attachment', dl['Content-Disposition'])
                self.assertEqual(dl['X-Content-Type-Options'], 'nosniff')

    def test_every_invalid_kind_is_rejected_with_a_resume_error_and_nothing_is_stored(self):
        import os

        from .models import Inquiry

        for label, (name, data) in INVALID_RESUMES.items():
            with self.subTest(label):
                before = Inquiry.objects.count()
                response = self.upload(name, data)
                self.assertEqual(response.status_code, 400, (label, response.content[:200]))
                self.assertIn('resume', response.json(), label)
                self.assertEqual(Inquiry.objects.count(), before, label)
        stored = [f for _, _, files in os.walk(self._media) for f in files]
        self.assertEqual([f for f in stored if f.endswith(('.exe', '.svg', '.zip', '.pages'))], [])

    def test_application_without_a_file_or_with_pasted_text_works(self):
        r = self.post()
        self.assertEqual(r.status_code, 201)
        self.assertEqual(self.post(message='x' * 10000).status_code, 201)  # CV pasted into the message box
        self.assertEqual(self.post(message='x' * 10001).status_code, 400)
        self.assertEqual(self.post(message='Резюме: Иванов 🙂 <script>x</script>').status_code, 201)

    def test_bad_form_fields_never_create_a_row(self):
        from .models import Inquiry

        before = Inquiry.objects.count()
        self.assertEqual(self.post(name='').status_code, 400)
        self.assertEqual(self.post(phone='12').status_code, 400)
        self.assertEqual(self.post(email='not-an-email').status_code, 400)
        self.assertEqual(self.post(intent='hacker').status_code, 400)
        self.assertEqual(Inquiry.objects.count(), before)

    def test_a_telegram_outage_never_breaks_the_applicant(self):
        from unittest import mock

        import requests

        from .models import HRTelegramUser

        class SyncThread:  # run the notifier inline so the test is deterministic
            def __init__(self, target, daemon=None, **kw):
                self.target = target

            def start(self):
                self.target()

        HRTelegramUser.objects.create(telegram_id=777, name='HR')
        with override_settings(TELEGRAM_BOT_TOKEN='1:x'), \
                mock.patch('cms.telegram_bot.threading.Thread', SyncThread), \
                mock.patch('requests.post', side_effect=requests.ConnectionError('boom https://api.telegram.org/bot1:x/')) as post:
            self.assertEqual(self.upload('cv.pdf', b'%PDF-1.4 %%EOF').status_code, 201)
            self.assertTrue(post.called)  # we really tried to reach Telegram, it failed, the applicant never noticed
        # and even if the notifier itself blows up
        with mock.patch('cms.telegram_bot.notify_new_application', side_effect=RuntimeError('x')):
            self.assertEqual(self.upload('cv.pdf', b'%PDF-1.4 %%EOF').status_code, 201)

    def test_resume_of_each_kind_reaches_the_hr_chat_with_the_right_bytes_and_extension(self):
        from unittest import mock

        from .models import HRTelegramUser, Inquiry

        HRTelegramUser.objects.create(telegram_id=777, name='HR')
        for label in ('pdf', 'docx', 'jpg_photo', 'heic_iphone', 'txt_cyrillic', 'cyrillic_name'):
            name, data = VALID_RESUMES[label]
            with self.subTest(label), override_settings(TELEGRAM_BOT_TOKEN=BOT):
                with mock.patch('cms.telegram_bot.notify_new_application'):  # no real thread/network here
                    response = self.upload(name, data)
                inquiry = Inquiry.objects.get(request_id=response.json()['request_id'])
                with mock.patch('cms.telegram_bot.send_document', return_value=True) as send:
                    r = self.client.post(
                        f'/api/hr/applications/{inquiry.pk}/resume/',
                        HTTP_AUTHORIZATION=f'tma {make_init_data()}',
                    )
                self.assertEqual(r.status_code, 200, label)
                chat_id, filename, content = send.call_args.args[:3]
                self.assertEqual((chat_id, content), (777, data), label)
                ext = name.rsplit('.', 1)[-1].lower()
                self.assertTrue(filename.endswith(f'.{ext}'), (label, filename))
                self.assertNotIn('/', filename)

    def test_hourly_limit_returns_429_and_the_form_can_explain_it(self):
        from django.core.cache import cache

        cache.clear()
        codes = [self.client.post('/api/inquiries/', {**self.base}).status_code for _ in range(14)]
        self.assertEqual(codes[:12], [201] * 12)
        self.assertEqual(codes[12:], [429, 429])
