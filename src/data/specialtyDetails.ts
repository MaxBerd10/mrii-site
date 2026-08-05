import type { ContentLang } from '../i18n/types'
import { CLINIC_SPECIALTY_SLUGS } from './clinicContact'

type SpecialtyContent = {
  overview: string
  conditions: string
  services: string
  diagnostics: string
}

export type SpecialtyDetail = {
  slug: string
  content: Record<ContentLang, SpecialtyContent>
}

export const specialtyDetails: SpecialtyDetail[] = [
  {
    slug: 'ent',
    content: {
      uz: {
        overview: 'Otorinolaringologiya bo’limi quloq, burun va tomoq kasalliklarini diagnostika qiladi va davolaydi. Eshitish, nafas olish va ovoz muammolari bir markazda baholanadi.',
        conditions: 'Sinuzit va rinit|O’tka o’tish va tonsillit|Eshitish pasayishi va shovqin',
        services: 'LOR konsultatsiyasi|Endoskopik tekshiruv|Eshitishni baholash',
        diagnostics: 'LOR endoskopiyasi|Audiometriya|KT va rentgen',
      },
      ru: {
        overview: 'Отделение оториноларингологии диагностирует и лечит заболевания уха, горла и носа. Проблемы слуха, дыхания и голоса оцениваются в одном центре.',
        conditions: 'Синусит и ринит|Острые и хронические тонзиллиты|Снижение слуха и шум в ушах',
        services: 'Консультация ЛОР-врача|Эндоскопическое обследование|Оценка слуха',
        diagnostics: 'ЛОР-эндоскопия|Аудиометрия|КТ и рентген',
      },
      en: {
        overview: 'Otorhinolaryngology diagnoses and treats ear, nose, and throat conditions. Hearing, breathing, and voice concerns are assessed in one centre.',
        conditions: 'Sinusitis and rhinitis|Acute and chronic tonsillitis|Hearing loss and tinnitus',
        services: 'ENT consultation|Endoscopic examination|Hearing assessment',
        diagnostics: 'ENT endoscopy|Audiometry|CT and X-ray',
      },
    },
  },
  {
    slug: 'gastroenterology',
    content: {
      uz: {
        overview: 'Gastroenterologiya markazi ovqat hazm qilish tizimi, jigar va o’t yo’llari kasalliklarini diagnostika va davolash bilan shug’ullanadi. Endoskopiya, laboratoriya va ovqatlanish tavsiyalari bir joyda taqdim etiladi.',
        conditions: 'Gastrit va reflyuks|Ichak yallig’lanish kasalliklari|Jigar va o’t yo’llari kasalliklari',
        services: 'Gastroenterolog qabuli|Davolovchi ovqatlanish rejasi|Endoskopik muolajalar',
        diagnostics: 'Gastroskopiya va kolonoskopiya|UZI va elastografiya|Mikrobiom tahlillari',
      },
      ru: {
        overview: 'Центр гастроэнтерологии занимается диагностикой и лечением заболеваний пищеварительной системы, печени и желчных путей. Эндоскопия, лаборатория и рекомендации по питанию доступны в одном месте.',
        conditions: 'Гастрит и рефлюкс|Воспалительные заболевания кишечника|Заболевания печени и желчных путей',
        services: 'Приём гастроэнтеролога|Лечебный план питания|Эндоскопические процедуры',
        diagnostics: 'Гастроскопия и колоноскопия|УЗИ и эластография|Анализы микробиома',
      },
      en: {
        overview: 'Gastroenterology diagnoses and treats conditions of the digestive system, liver, and biliary tract. Endoscopy, laboratory services, and nutrition guidance are available in one center.',
        conditions: 'Gastritis and reflux|Inflammatory bowel disease|Liver and biliary disease',
        services: 'Gastroenterology consultation|Therapeutic nutrition plan|Endoscopic procedures',
        diagnostics: 'Gastroscopy and colonoscopy|Ultrasound and elastography|Microbiome testing',
      },
    },
  },
  {
    slug: 'pulmonology',
    content: {
      uz: {
        overview: 'Pulmonologiya bo’limi o’pka va nafas yo’llari kasalliklarini erta aniqlash, davolash va surunkali holatlarni nazorat qilish bilan shug’ullanadi.',
        conditions: 'Bronxit va bronxial astma|Surunkali obstruktiv o’pka kasalligi|O’pka infeksiyalari',
        services: 'Pulmonolog konsultatsiyasi|Nafas funksiyasini tiklash|Surunkali holatlarni kuzatuv',
        diagnostics: 'Spirometriya|Rentgen va KT|Arterial qon gazlari tahlili',
      },
      ru: {
        overview: 'Пульмонология занимается ранней диагностикой, лечением и наблюдением заболеваний лёгких и дыхательных путей.',
        conditions: 'Бронхит и бронхиальная астма|ХОБЛ|Инфекции лёгких',
        services: 'Консультация пульмонолога|Восстановление функции дыхания|Наблюдение хронических состояний',
        diagnostics: 'Спирометрия|Рентген и КТ|Анализ газов крови',
      },
      en: {
        overview: 'Pulmonology focuses on early detection, treatment, and monitoring of lung and airway disease.',
        conditions: 'Bronchitis and asthma|COPD|Pulmonary infections',
        services: 'Pulmonology consultation|Respiratory rehabilitation|Chronic disease monitoring',
        diagnostics: 'Spirometry|X-ray and CT|Arterial blood gas analysis',
      },
    },
  },
  {
    slug: 'rheumatology',
    content: {
      uz: {
        overview: 'Revmatologiya bo’limi bo’g’im, mushak va autoimmun kasalliklarni kompleks baholaydi. Og’riqni kamaytirish va harakat funksiyasini tiklashga qaratilgan davolash rejasi tuziladi.',
        conditions: 'Artrit va artroz|Revmatoid artrit|Autoimmun kasalliklar',
        services: 'Revmatolog konsultatsiyasi|Dori-darmon terapiyasi|Fizioterapiya yo’naltirish',
        diagnostics: 'Laborator immunoassay|Rentgen va MRT|Qon va sidik tahlillari',
      },
      ru: {
        overview: 'Ревматология комплексно оценивает заболевания суставов, мышц и аутоиммунные состояния. Лечение направлено на снижение боли и восстановление подвижности.',
        conditions: 'Артрит и артроз|Ревматоидный артрит|Аутоиммунные заболевания',
        services: 'Консультация ревматолога|Медикаментозная терапия|Направление на физиотерапию',
        diagnostics: 'Иммунологические анализы|Рентген и МРТ|Анализы крови и мочи',
      },
      en: {
        overview: 'Rheumatology provides comprehensive assessment of joint, muscle, and autoimmune conditions with treatment focused on pain relief and restoring mobility.',
        conditions: 'Arthritis and osteoarthritis|Rheumatoid arthritis|Autoimmune disorders',
        services: 'Rheumatology consultation|Medication therapy|Physiotherapy referral',
        diagnostics: 'Immunology panels|X-ray and MRI|Blood and urine testing',
      },
    },
  },
  {
    slug: 'cardiology',
    content: {
      uz: {
        overview: 'Kardiologiya bo’limi yurak va qon-tomir kasalliklarini erta aniqlash, davolash va uzoq muddat nazorat qilishga ixtisoslashgan. Har bir holat kardiolog, diagnost va zarur bo’lsa kardiojarroh ishtirokida ko’rib chiqiladi.',
        conditions: 'Arterial gipertoniya|Yurak ishemik kasalligi|Aritmiya va yurak yetishmovchiligi',
        services: 'Kardiolog konsultatsiyasi|Individual davolash rejasi|Operatsiyadan keyingi kuzatuv',
        diagnostics: 'EKG va Xolter monitoring|Ehokardiografiya|Yuklama sinovlari',
      },
      ru: {
        overview: 'Отделение кардиологии специализируется на ранней диагностике, лечении и длительном наблюдении заболеваний сердца и сосудов. Каждый случай рассматривается кардиологом, диагностом и при необходимости кардиохирургом.',
        conditions: 'Артериальная гипертензия|Ишемическая болезнь сердца|Аритмия и сердечная недостаточность',
        services: 'Консультация кардиолога|Индивидуальный план лечения|Послеоперационное наблюдение',
        diagnostics: 'ЭКГ и Холтер|Эхокардиография|Нагрузочные тесты',
      },
      en: {
        overview: 'Our Cardiology Department provides early detection, treatment, and long-term monitoring of heart and vascular disease. Each case is reviewed by a cardiologist, diagnostic specialist, and cardiac surgeon when needed.',
        conditions: 'Hypertension|Coronary artery disease|Arrhythmia and heart failure',
        services: 'Cardiology consultation|Individual treatment plan|Post-operative follow-up',
        diagnostics: 'ECG and Holter monitoring|Echocardiography|Cardiac stress testing',
      },
    },
  },
  {
    slug: 'laboratory',
    content: {
      uz: {
        overview: 'Laboratoriya markazi klinik tahlillar, skrining va murakkab diagnostik tekshiruvlarni yagona tizimda taqdim etadi. Natijalar shifokorga tez yetkaziladi.',
        conditions: 'Umumiy va maxsus tahlillar|Check-up va skrining|Kasallikni nazorat qilish',
        services: 'Klinik laboratoriya|Uyorudagi tahlil olish|Tez natija',
        diagnostics: 'Biokimyo va gematologiya|Immunologiya va gormonlar|Infeksion markerlar',
      },
      ru: {
        overview: 'Лаборатория предоставляет клинические анализы, скрининг и сложную диагностику в единой системе. Результаты быстро передаются лечащему врачу.',
        conditions: 'Общие и специальные анализы|Check-up и скрининг|Контроль заболевания',
        services: 'Клиническая лаборатория|Забор анализов|Быстрые результаты',
        diagnostics: 'Биохимия и гематология|Иммунология и гормоны|Инфекционные маркеры',
      },
      en: {
        overview: 'The laboratory delivers clinical testing, screening, and advanced diagnostics in one integrated system. Results are returned rapidly to the treating physician.',
        conditions: 'General and specialist tests|Check-up and screening|Disease monitoring',
        services: 'Clinical laboratory|Sample collection|Rapid turnaround',
        diagnostics: 'Biochemistry and haematology|Immunology and hormones|Infectious markers',
      },
    },
  },
  {
    slug: 'intensive-care',
    content: {
      uz: {
        overview: 'Reanimatsiya bo’limi og’ir va shoshilinch holatlarda doimiy monitoring, intensiv terapiya va ko’p tarmoqli yordam ko’rsatadi.',
        conditions: 'Shoshilinch yurak-qon tomir holatlari|Og’ir nafas yetishmovchiligi|Operatsiyadan keyingi intensiv kuzatuv',
        services: 'Intensiv monitoring|Reanimatsiya va yordam|Ko’p tarmoqli konsilium',
        diagnostics: 'Doimiy vital monitoring|Laboratoriya va tasvir|Portativ diagnostika',
      },
      ru: {
        overview: 'Отделение реанимации обеспечивает непрерывный мониторинг, интенсивную терапию и мультидисциплинарную помощь при тяжёлых и неотложных состояниях.',
        conditions: 'Неотложные сердечно-сосудистые состояния|Тяжёлая дыхательная недостаточность|Послеоперационное интенсивное наблюдение',
        services: 'Интенсивный мониторинг|Реанимация и поддержка|Мультидисциплинарный консилиум',
        diagnostics: 'Постоянный витальный мониторинг|Лаборатория и визуализация|Портативная диагностика',
      },
      en: {
        overview: 'Intensive care provides continuous monitoring, critical therapy, and multidisciplinary support for severe and emergency conditions.',
        conditions: 'Cardiovascular emergencies|Severe respiratory failure|Post-operative critical care',
        services: 'Intensive monitoring|Resuscitation and support|Multidisciplinary review',
        diagnostics: 'Continuous vital monitoring|Laboratory and imaging|Point-of-care diagnostics',
      },
    },
  },
  {
    slug: 'gynecology',
    content: {
      uz: {
        overview: 'Ginekologiya bo’limi profilaktik ko’rikdan reproduktiv tibbiyot va minimal invaziv jarrohlikkacha ayollar salomatligining barcha bosqichlarini qamrab oladi.',
        conditions: 'Hayz sikli buzilishlari|Bepushtlik va reproduktiv muammolar|Bachadon va tuxumdon kasalliklari',
        services: 'Ginekolog konsultatsiyasi|Homiladorlikni rejalashtirish|Minimal invaziv muolajalar',
        diagnostics: 'Ekspert UZI|Kolposkopiya|Gormonal va sitologik tahlillar',
      },
      ru: {
        overview: 'Гинекология охватывает все этапы женского здоровья — от профилактического осмотра до репродуктивной медицины и малоинвазивной хирургии.',
        conditions: 'Нарушения менструального цикла|Бесплодие и репродуктивные проблемы|Заболевания матки и яичников',
        services: 'Консультация гинеколога|Планирование беременности|Малоинвазивные процедуры',
        diagnostics: 'Экспертное УЗИ|Кольпоскопия|Гормональные и цитологические анализы',
      },
      en: {
        overview: 'Gynecology supports every stage of women’s health, from preventive screening to reproductive medicine and minimally invasive surgery.',
        conditions: 'Menstrual disorders|Infertility and reproductive concerns|Uterine and ovarian disease',
        services: 'Gynecology consultation|Pregnancy planning|Minimally invasive procedures',
        diagnostics: 'Expert ultrasound|Colposcopy|Hormonal and cytology testing',
      },
    },
  },
  {
    slug: 'neurology',
    content: {
      uz: {
        overview: 'Nevrologiya bo’limi bosh miya, orqa miya va periferik asab tizimi kasalliklarini kompleks baholaydi. Tezkor diagnostika reabilitatsiya va profilaktika bilan yagona rejaga birlashtiriladi.',
        conditions: 'Bosh og’rig’i va migren|Insult va uning oqibatlari|Epilepsiya va neyrodegenerativ holatlar',
        services: 'Nevrolog konsultatsiyasi|Insultdan keyingi kuzatuv|Kognitiv reabilitatsiya',
        diagnostics: 'MRT va KT|EEG va ENMG|Qon-tomir doppleri',
      },
      ru: {
        overview: 'Отделение неврологии комплексно оценивает заболевания головного, спинного мозга и периферической нервной системы. Быстрая диагностика объединяется с реабилитацией и профилактикой.',
        conditions: 'Головная боль и мигрень|Инсульт и его последствия|Эпилепсия и нейродегенеративные состояния',
        services: 'Консультация невролога|Наблюдение после инсульта|Когнитивная реабилитация',
        diagnostics: 'МРТ и КТ|ЭЭГ и ЭНМГ|Допплер сосудов',
      },
      en: {
        overview: 'Neurology provides comprehensive assessment of brain, spinal cord, and peripheral nervous system disorders. Rapid diagnostics are integrated with rehabilitation and prevention.',
        conditions: 'Headache and migraine|Stroke and its consequences|Epilepsy and neurodegenerative disorders',
        services: 'Neurology consultation|Post-stroke monitoring|Cognitive rehabilitation',
        diagnostics: 'MRI and CT|EEG and EMG|Vascular Doppler',
      },
    },
  },
  {
    slug: 'surgery',
    content: {
      uz: {
        overview: 'Jarrohlik markazi umumiy, torakal va laparoskopik operatsiyalarni xavfsizlikning xalqaro standartlari asosida bajaradi. Operatsiyadan oldingi tayyorgarlik va reabilitatsiya yagona yo’l xaritasiga kiritiladi.',
        conditions: 'Qorin bo’shlig’i kasalliklari|Churra va yumshoq to’qima holatlari|Torakal jarrohlik patologiyalari',
        services: 'Jarroh konsultatsiyasi|Laparoskopik operatsiyalar|Operatsiyadan keyingi kuzatuv',
        diagnostics: 'Operatsiya oldi check-up|KT va MRT rejalashtirish|Anesteziolog bahosi',
      },
      ru: {
        overview: 'Хирургический центр выполняет общие, торакальные и лапароскопические операции по международным стандартам безопасности. Подготовка и реабилитация входят в единый маршрут.',
        conditions: 'Заболевания брюшной полости|Грыжи и патология мягких тканей|Торакальная хирургическая патология',
        services: 'Консультация хирурга|Лапароскопические операции|Послеоперационное наблюдение',
        diagnostics: 'Предоперационный check-up|Планирование по КТ и МРТ|Оценка анестезиолога',
      },
      en: {
        overview: 'Surgery performs general, thoracic, and laparoscopic procedures under international safety standards, integrating preparation and rehabilitation into one pathway.',
        conditions: 'Abdominal disease|Hernias and soft-tissue conditions|Thoracic surgical conditions',
        services: 'Surgical consultation|Laparoscopic surgery|Post-operative follow-up',
        diagnostics: 'Pre-operative check-up|CT and MRI planning|Anesthesiology assessment',
      },
    },
  },
  {
    slug: 'therapy',
    content: {
      uz: {
        overview: 'Terapiya bo’limi kattalar uchun birlamchi tibbiy yordam, profilaktik tekshiruv va surunkali kasalliklarni boshqarishni ta’minlaydi. Terapevt kerakli tor mutaxassislarni yagona davolash rejasiga birlashtiradi.',
        conditions: 'Nafas yo’llari kasalliklari|Surunkali metabolik holatlar|Ko’p kasallik birga kechishi',
        services: 'Terapevt qabuli|Yillik check-up|Surunkali holatlarni nazorat qilish',
        diagnostics: 'Laboratoriya tahlillari|Funksional diagnostika|Individual xavf bahosi',
      },
      ru: {
        overview: 'Терапевтическое отделение обеспечивает первичную помощь взрослым, профилактические обследования и ведение хронических заболеваний. Терапевт объединяет необходимых специалистов в единый план.',
        conditions: 'Заболевания дыхательных путей|Хронические метаболические состояния|Сочетанные заболевания',
        services: 'Приём терапевта|Ежегодный check-up|Контроль хронических состояний',
        diagnostics: 'Лабораторные анализы|Функциональная диагностика|Индивидуальная оценка рисков',
      },
      en: {
        overview: 'Internal Medicine provides adult primary care, preventive screening, and chronic disease management. Your physician coordinates all required specialists into one care plan.',
        conditions: 'Respiratory disease|Chronic metabolic conditions|Multiple coexisting conditions',
        services: 'Physician consultation|Annual check-up|Chronic care management',
        diagnostics: 'Laboratory testing|Functional diagnostics|Individual risk assessment',
      },
    },
  },
]

if (import.meta.env.DEV && specialtyDetails.length !== CLINIC_SPECIALTY_SLUGS.length) {
  console.warn('specialtyDetails length does not match clinic signage order')
}

export const specialtyPageLabels: Record<ContentLang, {
  back: string
  expertise: string
  conditions: string
  services: string
  diagnostics: string
  pathway: string
  pathwayText: string
  accredited: string
  available: string
  related: string
  teamText: string
  closingTitle: string
  closingText: string
}> = {
  uz: {
    back: 'Klinika yo’nalishlari',
    expertise: 'Yo’nalish haqida',
    conditions: 'Qaysi holatlarda yordam beramiz',
    services: 'Xizmatlar va davolash',
    diagnostics: 'Diagnostika imkoniyatlari',
    pathway: 'Shaxsiy davolash yo’li',
    pathwayText: 'Birinchi konsultatsiyadan natijalarni nazorat qilishgacha barcha bosqichlar bitta koordinatsiyalangan jamoa tomonidan boshqariladi.',
    accredited: 'Xalqaro klinik protokollar',
    available: 'Telefon orqali yozilish',
    related: 'Boshqa klinik yo’nalishlar',
    teamText: 'Mutaxassis profilini ko’ring va sizga mos shifokorni tanlang.',
    closingTitle: 'Keyingi qadam — qabulga qo’ng’iroq qiling',
    closingText: 'Belgilangan raqamga qo’ng’iroq qiling — bemor xizmatimiz mos shifokor va vaqtni tayinlaydi.',
  },
  ru: {
    back: 'Направления клиники',
    expertise: 'О направлении',
    conditions: 'С чем мы помогаем',
    services: 'Услуги и лечение',
    diagnostics: 'Диагностические возможности',
    pathway: 'Персональный маршрут лечения',
    pathwayText: 'Все этапы — от первой консультации до контроля результатов — ведёт единая координированная команда.',
    accredited: 'Международные протоколы',
    available: 'Запись по телефону',
    related: 'Другие направления клиники',
    teamText: 'Посмотрите профили специалистов и выберите подходящего врача.',
    closingTitle: 'Следующий шаг — позвонить для записи',
    closingText: 'Позвоните по указанному номеру — пациентский сервис подберёт врача и время визита.',
  },
  en: {
    back: 'Clinic specialties',
    expertise: 'About the specialty',
    conditions: 'Conditions we treat',
    services: 'Services and treatment',
    diagnostics: 'Diagnostic capabilities',
    pathway: 'Personal treatment pathway',
    pathwayText: 'Every stage, from first consultation to outcome monitoring, is managed by one coordinated care team.',
    accredited: 'International clinical protocols',
    available: 'Book by phone',
    related: 'Other clinical specialties',
    teamText: 'Review specialist profiles and choose the right doctor for you.',
    closingTitle: 'Your next step is to call and book',
    closingText: 'Call the clinic number — patient service will match a doctor and set your visit time.',
  },
}

export function getSpecialtyBySlug(slug: string) {
  const index = specialtyDetails.findIndex((item) => item.slug === slug)
  return index === -1 ? null : { detail: specialtyDetails[index], index }
}
