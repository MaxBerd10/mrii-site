"""Fill a LOCAL database with realistic worst-case content to see how the website copes.

    python manage.py stress_content            # add ~400 records (all marked ZZ-STRESS / zz-stress-)
    python manage.py stress_content --clear    # remove exactly those records again

Never runs with DEBUG off (production) unless STRESS_ALLOW=1 is set on purpose.
"""
import io
import os
import random
from datetime import date, timedelta

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand, CommandError

from cms import models

P = 'zz-stress-'
LONG_UZ = (
    'Bu juda uzun matn: bemorlarni qabul qilish, tekshiruv natijalarini tushuntirish, davolash rejasini tuzish va keyingi '
    'kuzatuvni tashkil etish bo‘yicha batafsil izoh. '
) * 6


def png(w, h, color):
    from PIL import Image

    buf = io.BytesIO()
    Image.new('RGB', (w, h), color).save(buf, 'JPEG', quality=70)
    return ContentFile(buf.getvalue())


class Command(BaseCommand):
    help = 'Create or remove worst-case content for stress-testing the website (local databases only).'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true')

    def handle(self, *args, **opts):
        if not settings.DEBUG and os.getenv('STRESS_ALLOW') != '1':
            raise CommandError('Refusing to run with DEBUG off (production). This command is for local testing only.')
        self.clear()
        if opts['clear']:
            self.stdout.write('stress content removed')
            return
        self.doctors(); self.news(); self.vacancies(); self.specialties(); self.prices(); self.misc()
        self.stdout.write('stress content created')

    # ------------------------------------------------------------------ cleanup
    def clear(self):
        models.DoctorReview.objects.filter(doctor__slug__startswith=P).delete()
        models.Doctor.objects.filter(slug__startswith=P).delete()
        models.NewsArticle.objects.filter(slug__startswith=P).delete()
        models.Vacancy.objects.filter(slug__startswith=P).delete()
        models.Specialty.objects.filter(slug__startswith=P).delete()
        models.PriceItem.objects.filter(category__name_uz__startswith='ZZ-STRESS').delete()
        models.PriceCategory.objects.filter(name_uz__startswith='ZZ-STRESS').delete()
        models.CheckupDirection.objects.filter(slug__startswith=P).delete()
        models.Testimonial.objects.filter(author_uz__startswith='ZZ-STRESS').delete()
        for row in models.AssetOverride.objects.filter(path__startswith='/images/clinic-gallery/stress'):
            row.delete()

    def save(self, obj):
        obj._skip_autofill = True  # never call the translation service from a test fixture
        obj.save()
        return obj

    # ------------------------------------------------------------------ doctors
    def doctors(self):
        names = [
            'Aleksandra Wiśniewska-Kowalczyk', 'Jo', 'J', 'Abdurahmonov-Karimjonxo’jayev Sardorbek Ravshanbekovich',
            'Đặng Thị Ngọc Hân', '王秀英', 'نور الهدى عبد الرحمن', 'Иванова Екатерина Александровна-Петрова',
            '🦊 Fox Shifokor', '  Sam   Lee ', 'dana', 'Dr. O’Brien-Ó Súilleabháin Seán', 'Qodirov M.',
            'Mamatqulova Gulchehra Abdumutalovna', 'Xo’jaeva G.A.',
        ]
        long_role = 'Oliy toifali kardiolog, klinik farmakolog, tibbiyot fanlari nomzodi, kafedra mudiri o‘rinbosari va katta ilmiy xodim'
        long_spec = 'Kardiologiya, aritmologiya, yurak yetishmovchiligi va profilaktik tibbiyot bo‘yicha mutaxassis'
        for i in range(90):
            n = names[i % len(names)] + ('' if i < len(names) else f' {i}')
            d = models.Doctor(slug=f'{P}{i}', name=n[:255], order=1000 + i, color='#0B3D6B',
                              staff_kind=['doctor', 'professor', 'nurse'][i % 3])
            kind = i % 6
            d.role_uz = [long_role, 'Shifokor', '', 'Katta shifokor', long_role[:60], 'Hamshira'][kind]
            d.specialty_uz = [long_spec, 'Kardiologiya', 'Nevrologiya', '', 'Pediatriya', 'Urologiya'][kind]
            d.experience_uz = ['25 yil', '', 'Ko‘p yillik', '1 yil', '40 yil', '8'][kind]
            d.about_uz = [LONG_UZ * 3, '', 'Qisqa.', LONG_UZ, 'Bir qator tavsif.', LONG_UZ * 5][kind]
            d.education_uz = ['\n'.join(f'Ta’lim {k}: Toshkent tibbiyot akademiyasi, ordinatura va rezidentura dasturi' for k in range(12)), '', 'Toshkent TTA', '', 'A | B | C', ''][kind]
            d.focuses_uz = ['\n'.join(f'Yo‘nalish {k} va uning uzun nomi' for k in range(14)), '', 'Bitta', '', '', ''][kind]
            d.languages_uz = ['O‘zbek\nRus\nIngliz\nNemis\nTurk\nKoreys\nArab\nFransuz\nXitoy\nYapon', '', 'O‘zbek', 'Rus', '', ''][kind]
            d.grade_uz = ['Oliy toifali shifokor, tibbiyot fanlari doktori, professor va akademik', '', 'Oliy toifali', '', '', ''][kind]
            d.career_uz = ['\n'.join(f'{2000 + k * 2}–{2002 + k * 2} | Respublika ixtisoslashtirilgan ilmiy-amaliy tibbiyot markazi filiali | Katta shifokor-kardiolog' for k in range(9)), '', '2010–2015 | Poliklinika | Shifokor', '', '', ''][kind]
            d.papers = ['1284', '0', '', '12', '99999', ''][kind]
            d.studies = ['4', '', '0', '1000', '7', ''][kind]
            if i % 4 == 0:
                d.photo_url = '/images/doctors/does-not-exist-404.jpg'   # broken image
            elif i % 4 == 1:
                d.photo.save(f'{P}{i}.jpg', png(4000, 300, (80, 120, 160)), save=False)   # panorama
            elif i % 4 == 2:
                d.photo.save(f'{P}{i}.jpg', png(300, 3000, (160, 100, 100)), save=False)  # tall
            # i % 4 == 3: no photo at all
            self.save(d)
            if i < 25:
                texts = ['Juda yaxshi shifokor!', 'x' * 790 + ' yaxshi', 'Ajoyib 🙂 rahmat sizga katta.', 'Qabulga kutish uzoq bo‘ldi, lekin natijadan mamnunman.']
                for k in range(i % 5 + (3 if i == 0 else 0)):
                    models.DoctorReview.objects.create(doctor=d, name=['', 'Jo', 'Aleksandra Wiśniewska-Kowalczyk', '🦊'][k % 4],
                                                       rating=(k % 5) + 1, text=texts[k % 4], is_approved=True)

    # ------------------------------------------------------------------ news
    def news(self):
        titles = [
            'Farg‘ona jamoat salomatligi tibbiyot instituti klinikasida yangi zamonaviy diagnostika markazi ochildi va endi bemorlar hududda eng yangi uskunalar yordamida tekshiruvdan o‘tishlari mumkin',
            'Yangi', 'Ochiq eshiklar kuni', 'Q3 hisobot: <b>tahlil</b> & “natijalar” **muhim**', 'Konferensiya 2026',
            'Международная конференция по клиническим исследованиям и новым методам диагностики', 'Клиника',
        ]
        for i in range(70):
            a = models.NewsArticle(slug=f'{P}{i}', title_uz=titles[i % len(titles)][:255], is_published=True, order=1000 + i,
                                   category_uz=['Yangilik', 'Tadbirlar va konferensiyalar bo‘yicha rasmiy xabarlar', '', 'AI'][i % 4][:64],
                                   published_at=[date.today() - timedelta(days=i * 3), date(1970, 1, 1), date.today() + timedelta(days=40), None][i % 4])
            a.excerpt_uz = ['', 'Qisqa.', LONG_UZ[:400], LONG_UZ][i % 4]
            a.lead_uz = ['', LONG_UZ][i % 2]
            a.body_uz = ['\n'.join(f'{k + 1}-abzas. ' + LONG_UZ for k in range(12)), '', 'Bitta abzas.', LONG_UZ * 4][i % 4]
            if i % 3 == 0:
                a.cover.save(f'{P}{i}.jpg', png(4000, 240, (60, 130, 120)), save=False)
            elif i % 3 == 1:
                a.cover.save(f'{P}{i}.jpg', png(240, 3600, (140, 90, 130)), save=False)
            self.save(a)

    # ------------------------------------------------------------------ vacancies
    def vacancies(self):
        cat = models.Vacancy._meta.get_field('category').choices[0][0]
        emp = models.Vacancy._meta.get_field('employment').choices[0][0]
        for i in range(40):
            v = models.Vacancy(slug=f'{P}{i}', category=cat, employment=emp, is_active=True,
                               title_uz=['Oliy toifali yetakchi kardiolog-konsultant (poliklinika va statsionar)', 'Hamshira', 'Kassir', 'Ilmiy tadqiqotlar bo‘limi klinik koordinatori va tadqiqot ma’lumotlari menejeri'][i % 4])
            v.department_uz = ['', 'Kardiologiya bo‘limi', 'Respublika ixtisoslashtirilgan ilmiy-amaliy markaz'][i % 3]
            v.location_uz = ['Farg‘ona sh.', '', 'Farg‘ona viloyati, Marg‘ilon tumani, Yangi Turon ko‘chasi 2-a uy'][i % 3]
            v.experience_uz = ['', '3 yil', '10 yildan ortiq amaliy ish tajribasi talab qilinadi'][i % 3]
            v.description_uz = ['', LONG_UZ, 'Qisqa.'][i % 3]
            v.requirements_uz = ['\n'.join(f'Talab {k}: uzun talab matni va uning izohi' for k in range(14)), '', 'Bitta talab'][i % 3]
            v.deadline = [date.today() + timedelta(days=i), None, date.today() - timedelta(days=5)][i % 3]
            self.save(v)

    # ------------------------------------------------------------------ specialties
    def specialties(self):
        for i in range(18):
            s = models.Specialty(slug=f'{P}{i}', is_active=True, icon=['', '🫀', '🧠'][i % 3],
                                 name_uz=['Yurak-qon tomir kasalliklari, aritmologiya va interventsion kardiologiya', 'LOR', 'Nevrologiya va neyroreabilitatsiya markazi'][i % 3][:128])
            s.desc_uz = ['', 'Qisqa tavsif.', LONG_UZ][i % 3]
            s.overview_uz = ['', LONG_UZ * 3][i % 2]
            s.conditions_uz = '\n'.join(f'Kasallik {k} nomi' for k in range(i % 4 * 6))
            s.services_uz = '\n'.join(f'Xizmat {k}' for k in range(i % 3 * 8))
            s.diagnostics_uz = '\n'.join(f'Tekshiruv {k}' for k in range(i % 5 * 3))
            if i % 2:
                s.image.save(f'{P}{i}.jpg', png(3000, 260, (70, 100, 150)), save=False)
            self.save(s)

    # ------------------------------------------------------------------ prices
    def prices(self):
        big = models.PriceCategory.objects.create(name_uz='ZZ-STRESS Juda uzun nomli narxnoma bo‘limi: laboratoriya va funksional diagnostika', order=900)
        small = models.PriceCategory.objects.create(name_uz='ZZ-STRESS UZI', order=901)
        names = ['Umumiy qon tahlili', 'Biokimyoviy qon testi (asosiy): ALT, AST (jigar testlari), bilirubin (jami, bevosita), gidroksidi fosfataza (ALP), GGT, alfa-amilaza, kreatinin, mochevina',
                 'EKG', 'MRT', 'Bir kunlik ovqatlanish (nonushta, tushlik 1-2 taom va kechki ovqat) — statsionar bemorlar uchun']
        for i in range(300):
            models.PriceItem.objects.create(
                category=big if i % 3 else small, name_uz=f'{names[i % 5]} #{i}'[:400], order=i,
                price_citizen=[0, 1500, 12345678, 99999999999, 250000][i % 5],
                price_foreign=[None, 5000000, 123456789, None, 0][i % 5], is_active=True,
                location_uz=['', 'Davolash binosi 1-2 qavat', 'Ma’muriyat binosi 1 qavat, 104-xona'][i % 3])
        d = models.CheckupDirection.objects.create(slug=f'{P}one', title_uz='ZZ-STRESS Juda uzun nomli check-up yo‘nalishi', order=900)
        for t, n in (('Layt', 3), ('Standart', 40), ('Premium', 0)):
            models.CheckupTier.objects.create(
                direction=d, tier=t, price=[300000, 123456789, 0][['Layt', 'Standart', 'Premium'].index(t)],
                includes_uz='\n'.join(f'Tekshiruv {k}: batafsil nomi va izohi' for k in range(n)),
                notes_uz='Bitta uzun izoh. ' * 20)

    # ------------------------------------------------------------------ misc
    def misc(self):
        for i in range(12):
            models.Testimonial.objects.create(
                author_uz=f'ZZ-STRESS {["Jo", "Aleksandra Wiśniewska-Kowalczyk", "🦊"][i % 3]}',
                role_uz=['', 'Bemor', 'Hamkor tashkilot vakili va uzoq yillik mijoz'][i % 3],
                quote_uz=['Yaxshi.', LONG_UZ, 'Hammasi zo‘r! 🙂'][i % 3], is_active=True)
