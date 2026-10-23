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
