"""Seed CMS from current frontend content (uz/ru/en where available)."""

from datetime import date

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from cms import models


SPECIALTY_SLUGS = [
    'cardiology', 'neurology', 'therapy', 'gastroenterology', 'endocrinology',
    'urology', 'gynecology', 'pediatrics', 'surgery', 'rehabilitation',
    'diagnostics', 'oncology',
]

SPECIALTY_IMAGES = {
    'cardiology': '/images/medical/anatomical-heart-transparent.png',
    'neurology': '/images/medical/brain-transparent-3d.png',
    'therapy': '/images/medical/therapy-transparent-3d.png',
    'gastroenterology': '/images/medical/digestive-transparent-3d.png',
    'endocrinology': '/images/medical/thyroid-transparent-3d.png',
    'urology': '/images/medical/kidney-transparent-3d.png',
    'gynecology': '/images/medical/gynecology-3d.png',
    'pediatrics': '/images/medical/pediatrics-transparent-3d.png',
    'surgery': '/images/medical/surgery-transparent-3d.png',
    'rehabilitation': '/images/medical/rehabilitation-transparent-3d.png',
    'diagnostics': '/images/medical/diagnostics-transparent-3d.png',
    'oncology': '/images/medical/oncology-transparent-3d.png',
}


class Command(BaseCommand):
    help = 'Seed CMS database with MRII frontend content'

    def add_arguments(self, parser):
        parser.add_argument(
            '--superuser',
            action='store_true',
            help='Create admin/admin123 superuser if missing',
        )

    def handle(self, *args, **options):
        self.seed_settings()
        self.seed_hero()
        self.seed_specialties()
        self.seed_doctors()
        self.seed_news()
        self.seed_ai()
        self.seed_research()
        self.seed_education()
        self.seed_partners()
        self.seed_international()
        if options['superuser']:
            self.ensure_superuser()
        self.stdout.write(self.style.SUCCESS('CMS seed completed.'))

    def ensure_superuser(self):
        User = get_user_model()
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@mrii.local', 'admin123')
            self.stdout.write('Created superuser admin / admin123')
        else:
            self.stdout.write('Superuser admin already exists')

    def seed_settings(self):
        models.SiteSettings.objects.update_or_create(
            pk=1,
            defaults={
                'phone': '+998 (71) 234-56-78',
                'hours': 'Du–Sha 08:00–20:00',
                'institute_name': 'Medical Research & Innovation Institute (MRII)',
                'badge_uz': 'TIBBIY INSTITUT',
                'badge_ru': 'МЕДИЦИНСКИЙ ИНСТИТУТ',
                'badge_en': 'MEDICAL INSTITUTE',
                'slogan_uz': 'Davolash. Ilm-fan. Ta\'lim. Sun\'iy intellekt.',
                'slogan_ru': 'Лечение. Наука. Образование. ИИ.',
                'slogan_en': 'Care. Science. Education. AI.',
                'copyright_uz': '© 2026 MRII. Barcha huquqlar himoyalangan.',
                'copyright_ru': '© 2026 MRII. Все права защищены.',
                'copyright_en': '© 2026 MRII. All rights reserved.',
                'license_uz': 'Litsenziya LO-77-01-024876',
                'license_ru': 'Лицензия LO-77-01-024876',
                'license_en': 'License LO-77-01-024876',
            },
        )

    def seed_hero(self):
        models.Hero.objects.update_or_create(
            pk=1,
            defaults={
                'title1_uz': 'Zamonaviy tibbiy',
                'title2_uz': 'institut',
                'title1_ru': 'Современный медицинский',
                'title2_ru': 'институт',
                'title1_en': 'Modern medical',
                'title2_en': 'institute',
                'tagline_uz': 'Klinik yordam · Klinik tadqiqotlar · Tibbiy taʼlim · AI-yechimlar',
                'tagline_ru': 'Клиническая помощь · Исследования · Образование · AI',
                'tagline_en': 'Clinical care · Research · Education · AI',
                'description_uz': (
                    "Tibbiy faoliyatning to'liq tsikli — dastlabki qabuldan "
                    "I–IV bosqichli klinik tadqiqotlarda ishtirok etishgacha."
                ),
                'description_ru': (
                    'Полный цикл медицинской деятельности — от первичного приёма '
                    'до участия в клинических исследованиях I–IV фазы.'
                ),
                'description_en': (
                    'Full-cycle medical care — from first visit to participation '
                    'in Phase I–IV clinical trials.'
                ),
                'image_url': '/images/clinic/mrii-clinic-hero-centered-sharp.webp',
                'certs': 'ISO 9001:2015 · GCP · ICH E6',
            },
        )

    def seed_specialties(self):
        data = [
            ('cardiology', '🫀', 8, 'Kardiologiya', 'Кардиология', 'Cardiology',
             'Yurak-qon tomir tizimi kasalliklarini diagnostika va davolash',
             'Диагностика и лечение сердечно-сосудистых заболеваний',
             'Diagnosis and treatment of cardiovascular disease'),
            ('neurology', '🧠', 6, 'Nevrologiya', 'Неврология', 'Neurology',
             "Bosh og'rig'i, insult, epilepsiya, skleroz",
             'Головная боль, инсульт, эпилепсия, склероз',
             'Headache, stroke, epilepsy, sclerosis'),
            ('therapy', '🫁', 12, 'Terapiya', 'Терапия', 'Internal Medicine',
             'Birlamchi tibbiy yordam, profilaktika, dispanserizatsiya',
             'Первичная помощь, профилактика, диспансеризация',
             'Primary care, prevention, check-ups'),
            ('gastroenterology', '🔬', 5, 'Gastroenterologiya', 'Гастроэнтерология', 'Gastroenterology',
             "O'shqozon-ichak kasalliklari, endoskopiya",
             'Заболевания ЖКТ, эндоскопия',
             'GI disease, endoscopy'),
            ('endocrinology', '⚗️', 4, 'Endokrinologiya', 'Эндокринология', 'Endocrinology',
             'Diabet, qalqonsimon bez, metabolik buzilishlar',
             'Диабет, щитовидная железа, метаболизм',
             'Diabetes, thyroid, metabolic disorders'),
            ('urology', '🫘', 5, 'Urologiya', 'Урология', 'Urology',
             'Siydik-tanosil tizimi kasalliklari',
             'Заболевания мочеполовой системы',
             'Urinary and reproductive system care'),
            ('gynecology', '🌸', 7, 'Ginekologiya', 'Гинекология', 'Gynecology',
             'Ayollar salomatligi, reproduktiv tibbiyot',
             'Женское здоровье, репродуктивная медицина',
             'Women’s health, reproductive medicine'),
            ('pediatrics', '👶', 9, 'Pediatriya', 'Педиатрия', 'Pediatrics',
             'Bolalar salomatligi, emlash, neonatologiya',
             'Здоровье детей, вакцинация, неонатология',
             'Child health, vaccination, neonatology'),
            ('surgery', '🏥', 10, 'Jarrohlik', 'Хирургия', 'Surgery',
             'Umumiy, torokal, laparoskopik jarrohlik',
             'Общая, торакальная, лапароскопическая хирургия',
             'General, thoracic, laparoscopic surgery'),
            ('rehabilitation', '🤸', 6, 'Reabilitatsiya', 'Реабилитация', 'Rehabilitation',
             'Fizioterapiya, LFK, tiklanish',
             'Физиотерапия, ЛФК, восстановление',
             'Physiotherapy and recovery'),
            ('diagnostics', '🔭', 15, 'Diagnostika', 'Диагностика', 'Diagnostics',
             'MRT, KT, UTT, PET-KT, laboratoriya',
             'МРТ, КТ, УЗИ, ПЭТ-КТ, лаборатория',
             'MRI, CT, ultrasound, PET-CT, lab'),
            ('oncology', '💊', 8, 'Onkologiya', 'Онкология', 'Oncology',
             'Diagnostika, kimyoterapiya, immunoterapiya',
             'Диагностика, химиотерапия, иммунотерапия',
             'Diagnostics, chemo, immunotherapy'),
        ]
        overviews = {
            'cardiology': (
                'Kardiologiya bo‘limi yurak va qon-tomir kasalliklarini erta aniqlash, davolash va uzoq muddat nazorat qilishga ixtisoslashgan.',
                'Отделение кардиологии специализируется на ранней диагностике и лечении заболеваний сердца и сосудов.',
                'Cardiology provides early detection, treatment, and long-term monitoring of heart and vascular disease.',
            ),
        }
        for i, (slug, icon, count, nu, nr, ne, du, dr, de) in enumerate(data):
            ov = overviews.get(slug, (du, dr, de))
            models.Specialty.objects.update_or_create(
                slug=slug,
                defaults={
                    'order': i + 1,
                    'icon': icon,
                    'doctor_count': count,
                    'name_uz': nu, 'name_ru': nr, 'name_en': ne,
                    'desc_uz': du, 'desc_ru': dr, 'desc_en': de,
                    'overview_uz': ov[0], 'overview_ru': ov[1], 'overview_en': ov[2],
                    'conditions_uz': 'Asosiy holatlar|Diagnostika|Davolash',
                    'conditions_ru': 'Основные состояния|Диагностика|Лечение',
                    'conditions_en': 'Key conditions|Diagnostics|Treatment',
                    'services_uz': 'Konsultatsiya|Davolash rejasi|Kuzatuv',
                    'services_ru': 'Консультация|План лечения|Наблюдение',
                    'services_en': 'Consultation|Care plan|Follow-up',
                    'diagnostics_uz': 'Laboratoriya|Vizualizatsiya|Funksional testlar',
                    'diagnostics_ru': 'Лаборатория|Визуализация|Функциональные тесты',
                    'diagnostics_en': 'Lab|Imaging|Functional tests',
                    'image_url': SPECIALTY_IMAGES.get(slug, ''),
                    'is_active': True,
                },
            )

    def seed_doctors(self):
        doctors = [
            ('Professor Alexandrov A.V.', 'Kardiolog, t.f.d.', 'Кардиолог, д.м.н.', 'Cardiologist, MD PhD',
             'Kardiologiya', 'Кардиология', 'Cardiology', '24 yil tajriba', '87', '12', '#0EA5E9',
             'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=720&fit=crop&auto=format'),
            ('Dr. Ismailova N.R.', 'Nevrolog, f.d.', 'Невролог, к.м.н.', 'Neurologist, PhD',
             'Nevrologiya', 'Неврология', 'Neurology', '16 yil tajriba', '43', '7', '#6366F1',
             'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=720&fit=crop&auto=format'),
            ('Professor Gromov I.P.', 'Onkolog, t.f.d.', 'Онколог, д.м.н.', 'Oncologist, MD PhD',
             'Onkologiya', 'Онкология', 'Oncology', '31 yil tajriba', '142', '24', '#10B981',
             'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=720&fit=crop&auto=format'),
            ('Dr. Sadykova G.M.', 'Endokrinolog, f.d.', 'Эндокринолог, к.м.н.', 'Endocrinologist, PhD',
             'Endokrinologiya', 'Эндокринология', 'Endocrinology', '12 yil tajriba', '31', '5', '#F59E0B',
             'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600'),
        ]
        for i, row in enumerate(doctors):
            (name, ru_uz, ru_ru, ru_en, su, sr, se, exp, papers, studies, color, photo) = row
            models.Doctor.objects.update_or_create(
                name=name,
                defaults={
                    'order': i + 1,
                    'role_uz': ru_uz, 'role_ru': ru_ru, 'role_en': ru_en,
                    'specialty_uz': su, 'specialty_ru': sr, 'specialty_en': se,
                    'experience': exp, 'papers': papers, 'studies': studies,
                    'color': color, 'photo_url': photo, 'is_active': True,
                },
            )

    def seed_news(self):
        items = [
            {
                'slug': 'car-t-therapy-study',
                'published_at': date(2025, 7, 12),
                'category_uz': 'Tadqiqotlar', 'category_ru': 'Исследования', 'category_en': 'Research',
                'category_color': '#6366F1',
                'title_uz': 'MRII CAR-T terapiyasi bo\'yicha birinchi tadqiqotni boshladi',
                'title_ru': 'MRII начал первое исследование CAR-T терапии',
                'title_en': 'MRII launched its first CAR-T therapy study',
                'excerpt_uz': 'I-bosqich bo\'limi xalqaro ko\'p markazli tadqiqotda birinchi bemorlarni qabul qilmoqda.',
                'excerpt_ru': 'Отделение I фазы набирает первых пациентов в международное исследование.',
                'excerpt_en': 'The Phase I unit is enrolling first patients in an international study.',
                'lead_uz': 'MRII I-bosqich bo‘limi CAR-T terapiyasi bo‘yicha xalqaro tadqiqotda birinchi bemorlarni qabul qilishni boshladi.',
                'lead_ru': 'Отделение I фазы MRII начало набор первых пациентов в исследование CAR-T.',
                'lead_en': 'MRII’s Phase I unit has started enrolling patients in a CAR-T therapy study.',
                'body_uz': 'Yangi dastur onkohematologik kasalliklarni davolashda immunoterapiyani kengaytiradi.|Birinchi bemorlar to‘liq diagnostika va 24/7 kuzatuv ostida.|Kelgusi oyda markaz qo‘shimcha bemorlarni jalb etadi.',
                'body_ru': 'Новая программа расширяет иммунотерапию.|Первые пациенты принимаются с полным мониторингом.|Центр планирует расширить набор.',
                'body_en': 'The program expands immunotherapy.|First patients receive full monitoring.|Enrollment will expand next month.',
                'cover_url': 'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=1200',
            },
            {
                'slug': 'ai-radiology-certified',
                'published_at': date(2025, 7, 5),
                'category_uz': 'AI', 'category_ru': 'AI', 'category_en': 'AI',
                'category_color': '#F59E0B',
                'title_uz': 'AI Radiology klinik qo\'llash uchun sertifikatlandi',
                'title_ru': 'AI Radiology сертифицирован для клинического применения',
                'title_en': 'AI Radiology certified for clinical use',
                'excerpt_uz': 'Ko\'krak qafasi KT avtomatik tahlili 94% aniqlik bilan tasdiqlandi.',
                'excerpt_ru': 'Автоанализ КТ грудной клетки подтверждён с точностью 94%.',
                'excerpt_en': 'Chest CT auto-analysis validated at 94% accuracy.',
                'lead_uz': 'AI Radiology tizimi klinik qo‘llash uchun sertifikatlandi.',
                'lead_ru': 'Система AI Radiology сертифицирована для клиники.',
                'lead_en': 'AI Radiology has been certified for clinical use.',
                'body_uz': 'Yechim radiologlarga shubhali topilmalarni tezroq ajratishda yordam beradi.|Tizim PACS jarayoniga integratsiya qilinadi.|Sertifikatlash ichki validatsiyadan keyin yakunlandi.',
                'body_ru': 'Решение помогает быстрее выделять находки.|Система интегрируется в PACS.|Сертификация завершена после валидации.',
                'body_en': 'The tool helps prioritize findings.|It integrates into PACS.|Certification followed internal validation.',
                'cover_url': 'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=1200',
            },
            {
                'slug': 'residency-2025-2027',
                'published_at': date(2025, 6, 28),
                'category_uz': "Ta'lim", 'category_ru': 'Образование', 'category_en': 'Education',
                'category_color': '#10B981',
                'title_uz': 'Ordinatura 2025–2027: 8 ixtisoslikda 48 o\'rin',
                'title_ru': 'Ординатура 2025–2027: 48 мест по 8 специальностям',
                'title_en': 'Residency 2025–2027: 48 seats across 8 specialties',
                'excerpt_uz': 'MRII akademiyasi ilmiy yo\'nalish bilan klinik ordinaturaga ariza qabul qilmoqda.',
                'excerpt_ru': 'Академия MRII принимает заявки на клиническую ординатуру.',
                'excerpt_en': 'MRII Academy is accepting applications for clinical residency.',
                'lead_uz': 'MRII akademiyasi ordinatura dasturiga arizalarni qabul qilmoqda.',
                'lead_ru': 'Академия MRII открыла приём в ординатуру.',
                'lead_en': 'MRII Academy opened residency applications.',
                'body_uz': 'Dastur klinik amaliyot va ilmiy yo‘nalishni birlashtiradi.|8 ixtisoslikda jami 48 o‘rin.|Ariza topshirish onlayn va oflayn mavjud.',
                'body_ru': 'Программа объединяет практику и науку.|48 мест по 8 специальностям.|Подача заявок онлайн и офлайн.',
                'body_en': 'The program combines practice and research.|48 seats across 8 specialties.|Apply online or on site.',
                'cover_url': 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=1200',
            },
        ]
        for i, item in enumerate(items):
            models.NewsArticle.objects.update_or_create(
                slug=item['slug'],
                defaults={**item, 'order': i + 1, 'is_published': True},
            )

    def seed_ai(self):
        products = [
            {
                'slug': 'doctor-assistant', 'product_key': 'doctor', 'order': 1,
                'name_uz': 'AI Doctor Assistant', 'name_ru': 'AI Doctor Assistant', 'name_en': 'AI Doctor Assistant',
                'tag_uz': 'Klinik yechim', 'tag_ru': 'Клиническое решение', 'tag_en': 'Clinical tool',
                'tag_color': '#0EA5E9',
                'desc_uz': 'Qabulda shifokor yordamchisi. Protokollar, klinik tavsiyalar, anamnez tahlili real vaqtda.',
                'desc_ru': 'Помощник врача на приёме. Протоколы и рекомендации в реальном времени.',
                'desc_en': 'In-visit physician assistant. Protocols and recommendations in real time.',
                'features_uz': 'Protokol shakllantirish|Klinik tavsiyalar|ICD-10/11 kodlash|MIS integratsiyasi',
                'features_ru': 'Формирование протокола|Клинические рекомендации|Кодирование ICD|Интеграция МИС',
                'features_en': 'Protocol drafting|Clinical recommendations|ICD coding|EMR integration',
                'metric': '87%', 'metric_label_uz': 'hujjatlashtirish vaqtini qisqartirish',
                'metric_label_ru': 'сокращение времени документации',
                'metric_label_en': 'less documentation time',
                'overview_uz': 'AI Doctor Assistant qabulda shifokorga real vaqtda yordam beradi.',
                'overview_ru': 'AI Doctor Assistant помогает врачу на приёме в реальном времени.',
                'overview_en': 'AI Doctor Assistant supports physicians in real time.',
                'audience_uz': 'Klinikalar va ko‘p tarmoqli markazlar uchun.',
                'audience_ru': 'Для клиник и многопрофильных центров.',
                'audience_en': 'For clinics and multidisciplinary centers.',
                'outcomes_uz': 'Hujjatlashtirish vaqtini 87% gacha qisqartirish|Yagona protokol sifati|MIS integratsiya',
                'outcomes_ru': 'Сокращение документации до 87%|Единое качество протоколов|Интеграция МИС',
                'outcomes_en': 'Up to 87% less documentation|Consistent protocols|EMR integration',
                'workflow_uz': 'Anamnez yig‘ish|AI protokol|ICD kodlash|MIS ga uzatish',
                'workflow_ru': 'Сбор анамнеза|AI-протокол|ICD-кодирование|Передача в МИС',
                'workflow_en': 'Capture history|AI protocol|ICD coding|Sync to EMR',
                'image_url': '/images/medical/therapy-ai-3d.png',
            },
            {
                'slug': 'radiology', 'product_key': 'radiology', 'order': 2,
                'name_uz': 'AI Radiology', 'name_ru': 'AI Radiology', 'name_en': 'AI Radiology',
                'tag_uz': 'Radiologik AI', 'tag_ru': 'Радиологический AI', 'tag_en': 'Radiology AI',
                'tag_color': '#6366F1',
                'desc_uz': 'Rentgen, KT va MRT tasvirlarini avtomatik tahlil. 4 soniyadan kam vaqt.',
                'desc_ru': 'Автоанализ рентгена, КТ и МРТ менее чем за 4 секунды.',
                'desc_en': 'Auto-analysis of X-ray, CT and MRI in under 4 seconds.',
                'features_uz': "Ko'krak qafasi KT|Miya MRT|Rentgen OGK|DICOM / PACS",
                'features_ru': 'КТ грудной клетки|МРТ мозга|Рентген ОГК|DICOM / PACS',
                'features_en': 'Chest CT|Brain MRI|Chest X-ray|DICOM / PACS',
                'metric': '94%', 'metric_label_uz': 'erta aniqlash sezuvchanligi',
                'metric_label_ru': 'чувствительность раннего выявления',
                'metric_label_en': 'early detection sensitivity',
                'overview_uz': 'AI Radiology tasvirlarni avtomatik tahlil qiladi va prioritetlaydi.',
                'overview_ru': 'AI Radiology автоматически анализирует и приоритизирует снимки.',
                'overview_en': 'AI Radiology analyzes and prioritizes imaging studies.',
                'audience_uz': 'Diagnostika markazlari uchun.',
                'audience_ru': 'Для диагностических центров.',
                'audience_en': 'For diagnostic centers.',
                'outcomes_uz': '94% sezuvchanlik|4 soniyadan kam tahlil|PACS integratsiya',
                'outcomes_ru': '94% чувствительность|Анализ <4 сек|Интеграция PACS',
                'outcomes_en': '94% sensitivity|<4s analysis|PACS integration',
                'workflow_uz': 'PACS dan olish|AI tahlil|Radiolog tasdiqi|Xulosa',
                'workflow_ru': 'Получение из PACS|AI-анализ|Подтверждение|Заключение',
                'workflow_en': 'Fetch from PACS|AI analysis|Radiologist review|Report',
                'image_url': '/images/medical/diagnostics-3d.png',
            },
            {
                'slug': 'ultrasound', 'product_key': 'ultrasound', 'order': 3,
                'name_uz': 'AI Ultrasound', 'name_ru': 'AI Ultrasound', 'name_en': 'AI Ultrasound',
                'tag_uz': 'UTT yordamchisi', 'tag_ru': 'Помощник УЗИ', 'tag_en': 'Ultrasound aid',
                'tag_color': '#10B981',
                'desc_uz': 'UTT diagnostikasida real vaqt segmentatsiya va o\'lchovlar.',
                'desc_ru': 'Сегментация и измерения УЗИ в реальном времени.',
                'desc_en': 'Real-time ultrasound segmentation and measurements.',
                'features_uz': "Real vaqt segmentatsiya|Avto-o'lchov|Tugun aniqlash|Protokollash",
                'features_ru': 'Сегментация в реальном времени|Автоизмерения|Узлы|Протокол',
                'features_en': 'Real-time segmentation|Auto-measure|Nodule detection|Reporting',
                'metric': '3×', 'metric_label_uz': 'diagnostikani tezlashtirish',
                'metric_label_ru': 'ускорение диагностики',
                'metric_label_en': 'faster diagnostics',
                'overview_uz': 'AI Ultrasound organ segmentatsiyasi va o‘lchovlarni avtomatlashtiradi.',
                'overview_ru': 'AI Ultrasound автоматизирует сегментацию и измерения.',
                'overview_en': 'AI Ultrasound automates segmentation and measurements.',
                'audience_uz': 'UTT kabinetlari uchun.',
                'audience_ru': 'Для кабинетов УЗИ.',
                'audience_en': 'For ultrasound suites.',
                'outcomes_uz': '3× tezroq diagnostika|Barqaror o‘lchovlar|Oddiy protokol',
                'outcomes_ru': 'Диагностика в 3× быстрее|Стабильные измерения|Простой протокол',
                'outcomes_en': '3× faster exams|Consistent measures|Simple reporting',
                'workflow_uz': 'Skan|AI segmentatsiya|O‘lchov|Protokollash',
                'workflow_ru': 'Сканирование|AI-сегментация|Измерение|Протокол',
                'workflow_en': 'Scan|AI segment|Measure|Report',
                'image_url': '/images/medical/gynecology-3d.png',
            },
            {
                'slug': 'clinical-research', 'product_key': 'clinical-research', 'order': 4,
                'name_uz': 'AI Clinical Research', 'name_ru': 'AI Clinical Research', 'name_en': 'AI Clinical Research',
                'tag_uz': 'KT uchun', 'tag_ru': 'Для КИ', 'tag_en': 'For trials',
                'tag_color': '#F59E0B',
                'desc_uz': 'Klinik tadqiqotlarni avtomatlashtirish: AI-bemor tanlash, eCRF, farmakonazor.',
                'desc_ru': 'Автоматизация КИ: подбор пациентов, eCRF, фармаконадзор.',
                'desc_en': 'Trial automation: AI screening, eCRF, pharmacovigilance.',
                'features_uz': 'AI-skreening|Elektron eCRF|Nojoiya hodisalar monitoringi|CTMS/IWRS integratsiya',
                'features_ru': 'AI-скрининг|Электронный eCRF|Мониторинг НЯ|Интеграция CTMS',
                'features_en': 'AI screening|Electronic eCRF|AE monitoring|CTMS/IWRS integration',
                'metric': '40%', 'metric_label_uz': 'skreening vaqtini kamaytirish',
                'metric_label_ru': 'сокращение времени скрининга',
                'metric_label_en': 'less screening time',
                'overview_uz': 'AI Clinical Research tadqiqot jarayonlarini tezlash tiradi.',
                'overview_ru': 'AI Clinical Research ускоряет процессы исследований.',
                'overview_en': 'AI Clinical Research accelerates trial workflows.',
                'audience_uz': 'Sponsorlar va CRO uchun.',
                'audience_ru': 'Для спонсоров и CRO.',
                'audience_en': 'For sponsors and CROs.',
                'outcomes_uz': '40% tezroq skreening|Yagona eCRF|Real vaqt monitoring',
                'outcomes_ru': 'Скрининг на 40% быстрее|Единый eCRF|Мониторинг в реальном времени',
                'outcomes_en': '40% faster screening|Unified eCRF|Real-time monitoring',
                'workflow_uz': 'Skreening|eCRF|Monitoring|Hisobot',
                'workflow_ru': 'Скрининг|eCRF|Мониторинг|Отчёт',
                'workflow_en': 'Screen|eCRF|Monitor|Report',
                'image_url': '/images/medical/oncology-3d.png',
            },
        ]
        for p in products:
            models.AIProduct.objects.update_or_create(
                slug=p['slug'],
                defaults={**p, 'is_active': True},
            )

    def seed_research(self):
        models.ResearchSection.objects.update_or_create(
            pk=1,
            defaults={
                'label_uz': '03 / Klinik tadqiqotlar',
                'label_ru': '03 / Клинические исследования',
                'label_en': '03 / Clinical research',
                'title1_uz': 'Tadqiqotlar', 'title_em_uz': 'markazi',
                'title1_ru': 'Исследовательский', 'title_em_ru': 'центр',
                'title1_en': 'Research', 'title_em_en': 'center',
                'description_uz': 'I–IV bosqichli tadqiqotlar — homiylar, bemorlar va CRO uchun.',
                'description_ru': 'Исследования I–IV фазы — для спонсоров, пациентов и CRO.',
                'description_en': 'Phase I–IV trials — for sponsors, patients and CROs.',
                'why_title_uz': 'Nima uchun MRII tanlanadi',
                'why_title_ru': 'Почему выбирают MRII',
                'why_title_en': 'Why choose MRII',
                'why_items_uz': (
                    "O'z I-bosqich bo'limi izolyatsiyalangan bokslar bilan|"
                    "Tez start: arizadan birinchi bemorgacha — 6 hafta|"
                    "Integratsiyalashgan eTMF va markazlashtirilgan monitoring|"
                    "18+ terapevtik soha bitta markazda|"
                    "O'z klinik laboratoriyasi va biobank|"
                    "Raqamli arxiv va farmakonazor tizimi"
                ),
                'why_items_ru': (
                    'Собственное отделение I фазы|'
                    'Быстрый старт — 6 недель|'
                    'Интегрированная eTMF|'
                    '18+ терапевтических областей|'
                    'Собственная лаборатория|'
                    'Цифровой архив'
                ),
                'why_items_en': (
                    'Own Phase I unit|'
                    'Fast start — 6 weeks|'
                    'Integrated eTMF|'
                    '18+ therapeutic areas|'
                    'Own lab and biobank|'
                    'Digital archive'
                ),
                'sponsor_btn_uz': "Homiy so'rovini yuborish →",
                'sponsor_btn_ru': 'Отправить запрос спонсора →',
                'sponsor_btn_en': 'Submit sponsor inquiry →',
            },
        )
        studies = [
            ('NCT-2024-118', 'Yangi antihipertenziv preparat I-bosqichi', 'Новый антигипертензивный препарат I фазы',
             'Phase I novel antihypertensive', 'I', 'open', 'Kardiologiya', 'Кардиология', 'Cardiology'),
            ('NCT-2025-031', 'GLP-1 agonistlarini taqqoslash', 'Сравнение агонистов GLP-1',
             'GLP-1 agonist comparison', 'III', 'closed', 'Endokrinologiya', 'Эндокринология', 'Endocrinology'),
            ('NCT-2025-044', 'CAR-T terapiyasi birinchi tadqiqoti', 'Первое исследование CAR-T',
             'First CAR-T therapy study', 'I', 'open', 'Onkologiya', 'Онкология', 'Oncology'),
        ]
        for i, s in enumerate(studies):
            models.ResearchStudy.objects.update_or_create(
                study_id=s[0],
                defaults={
                    'order': i + 1,
                    'title_uz': s[1], 'title_ru': s[2], 'title_en': s[3],
                    'phase': s[4], 'status': s[5],
                    'area_uz': s[6], 'area_ru': s[7], 'area_en': s[8],
                    'is_active': True,
                },
            )
        caps = [
            ("I-bosqich bo'limi", 'Отделение I фазы', 'Phase I unit', 'Ha', True),
            ('Terapevtik sohalar', 'Терапевтические области', 'Therapeutic areas', '18+', False),
            ('Bemorlar bazasi', 'База пациентов', 'Patient database', '50 000+', False),
            ('GCP tadqiqotchilar', 'Исследователи GCP', 'GCP investigators', '35', False),
            ('Klinik laboratoriyalar', 'Клинические лаборатории', 'Clinical labs', '3', False),
            ('LIMS tizimi', 'Система LIMS', 'LIMS system', 'Ha', True),
            ('eTMF integratsiya', 'Интеграция eTMF', 'eTMF integration', 'Ha', True),
            ('CTMS tizimi', 'Система CTMS', 'CTMS system', 'Ha', True),
        ]
        models.ResearchCapability.objects.all().delete()
        for i, (lu, lr, le, value, hl) in enumerate(caps):
            models.ResearchCapability.objects.create(
                order=i + 1, label_uz=lu, label_ru=lr, label_en=le, value=value, highlight=hl,
            )

    def seed_education(self):
        tracks = [
            ('Ordinatura', 'Ординатура', 'Residency', '#0EA5E9', '🎓', [
                ('Klinik ordinatura', 'Клиническая ординатура', 'Clinical residency', '2 yil', '2 года', '2 years', "48 o'rin"),
                ('Klinik bazalar', 'Клинические базы', 'Clinical sites', 'Rotatsiya', 'Ротация', 'Rotation', '12 klinika'),
                ("Ilmiy yo'nalish", 'Научное направление', 'Research track', '+1 yil', '+1 год', '+1 year', "20 o'rin"),
            ]),
            ('Shifokorlar', 'Врачи', 'Physicians', '#10B981', '🏥', [
                ('Malaka oshirish kurslari', 'Курсы повышения квалификации', 'CME courses', '36–144 soat', '36–144 часа', '36–144 hours', 'Onlayn/oflayn'),
                ('CME dasturlari', 'Программы CME', 'CME programs', 'Modulli', 'Модульно', 'Modular', 'Sertifikat'),
                ('Klinik amaliyot vebinarlari', 'Вебинары', 'Clinical webinars', '2 soat/hafta', '2 часа/неделя', '2h/week', 'Bepul'),
            ]),
            ('Tadqiqotchilar', 'Исследователи', 'Researchers', '#6366F1', '🔬', [
                ('GCP (ICH E6 R3)', 'GCP (ICH E6 R3)', 'GCP (ICH E6 R3)', '16 soat', '16 часов', '16 hours', 'Sertifikat'),
                ('Clinical Research Coordinator', 'Clinical Research Coordinator', 'Clinical Research Coordinator', '80 soat', '80 часов', '80 hours', 'Diplom'),
                ('Study Nurse / Investigator', 'Study Nurse / Investigator', 'Study Nurse / Investigator', '40 soat', '40 часов', '40 hours', 'Guvohnoma'),
            ]),
        ]
        models.EducationProgram.objects.all().delete()
        models.EducationTrack.objects.all().delete()
        for i, (au, ar, ae, color, icon, programs) in enumerate(tracks):
            track = models.EducationTrack.objects.create(
                order=i + 1, audience_uz=au, audience_ru=ar, audience_en=ae,
                color=color, icon=icon, is_active=True,
            )
            for j, p in enumerate(programs):
                models.EducationProgram.objects.create(
                    track=track, order=j + 1,
                    name_uz=p[0], name_ru=p[1], name_en=p[2],
                    duration_uz=p[3], duration_ru=p[4], duration_en=p[5],
                    spots=p[6],
                )

    def seed_partners(self):
        models.Partner.objects.all().delete()
        for i, name in enumerate(['Roche', 'Novartis', 'Pfizer', 'AstraZeneca', 'Sanofi', 'Bayer', 'Merck', 'GSK']):
            models.Partner.objects.create(name=name, order=i + 1, is_active=True)

        models.Testimonial.objects.all().delete()
        testimonials = [
            (
                'MRII mintaqadagi eng ishonchli tadqiqot markazlaridan biri. Muddatlar doimo bajariladi.',
                'MRII — один из самых надёжных исследовательских центров региона.',
                'MRII is one of the most reliable research centers in the region.',
                'Elena Kovaleva', 'Clinical Operations Director, Roche',
            ),
            (
                'AI Doctor Assistant hujjatlashtirish vaqtini 87% qisqartirdi.',
                'AI Doctor Assistant сократил время документации на 87%.',
                'AI Doctor Assistant cut documentation time by 87%.',
                'Dmitriy Volkov', 'Bosh shifokor / Главный врач / Chief physician',
            ),
            (
                'MRII dagi GCP-trening eng yaxshisi.',
                'GCP-тренинг в MRII — один из лучших.',
                'GCP training at MRII is among the best.',
                'Anna Petrova', 'Clinical Research Coordinator',
            ),
        ]
        for i, (qu, qr, qe, author, role) in enumerate(testimonials):
            models.Testimonial.objects.create(
                order=i + 1, quote_uz=qu, quote_ru=qr, quote_en=qe,
                author_uz=author, author_ru=author, author_en=author,
                role_uz=role, role_ru=role, role_en=role, is_active=True,
            )

    def seed_international(self):
        models.InternationalService.objects.all().delete()
        services = [
            ('Tibbiy turizm', 'Медицинский туризм', 'Medical tourism',
             'Yozilishdan chiqishgacha to\'liq tibbiy tur.',
             'Полный медицинский тур от записи до выписки.',
             'Full medical journey from booking to discharge.'),
            ('Viza yordami', 'Визовое сопровождение', 'Visa support',
             'Taklifnomalar va tibbiy vizalar.',
             'Приглашения и медицинские визы.',
             'Invitations and medical visas.'),
            ('Tarjimonlar', 'Переводчики', 'Interpreters',
             '12 tilda tibbiy tarjimonlar.',
             'Медицинские переводчики на 12 языках.',
             'Medical interpreters in 12 languages.'),
            ('Telemeditsina', 'Телемедицина', 'Telemedicine',
             'Video orqali maslahat.',
             'Консультации по видео.',
             'Video consultations.'),
        ]
        for i, s in enumerate(services):
            models.InternationalService.objects.create(
                order=i + 1,
                title_uz=s[0], title_ru=s[1], title_en=s[2],
                desc_uz=s[3], desc_ru=s[4], desc_en=s[5],
                is_active=True,
            )
