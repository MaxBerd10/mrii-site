import type { Lang } from '../i18n/types'

type SpecialtyContent = {
  overview: string
  conditions: string
  services: string
  diagnostics: string
}

export type SpecialtyDetail = {
  slug: string
  content: Record<Lang, SpecialtyContent>
}

export const specialtyDetails: SpecialtyDetail[] = [
  {
    slug: 'cardiology',
    content: {
      uz: {
        overview: 'Kardiologiya bo‘limi yurak va qon-tomir kasalliklarini erta aniqlash, davolash va uzoq muddat nazorat qilishga ixtisoslashgan. Har bir holat kardiolog, diagnost va zarur bo‘lsa kardiojarroh ishtirokida ko‘rib chiqiladi.',
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
    slug: 'neurology',
    content: {
      uz: {
        overview: 'Nevrologiya bo‘limi bosh miya, orqa miya va periferik asab tizimi kasalliklarini kompleks baholaydi. Tezkor diagnostika reabilitatsiya va profilaktika bilan yagona rejaga birlashtiriladi.',
        conditions: 'Bosh og‘rig‘i va migren|Insult va uning oqibatlari|Epilepsiya va neyrodegenerativ holatlar',
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
    slug: 'therapy',
    content: {
      uz: {
        overview: 'Terapiya bo‘limi kattalar uchun birlamchi tibbiy yordam, profilaktik tekshiruv va surunkali kasalliklarni boshqarishni ta’minlaydi. Terapevt kerakli tor mutaxassislarni yagona davolash rejasiga birlashtiradi.',
        conditions: 'Nafas yo‘llari kasalliklari|Surunkali metabolik holatlar|Ko‘p kasallik birga kechishi',
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
  {
    slug: 'gastroenterology',
    content: {
      uz: {
        overview: 'Gastroenterologiya markazi ovqat hazm qilish tizimi, jigar va o‘t yo‘llari kasalliklarini diagnostika va davolash bilan shug‘ullanadi. Endoskopiya, laboratoriya va ovqatlanish tavsiyalari bir joyda taqdim etiladi.',
        conditions: 'Gastrit va reflyuks|Ichak yallig‘lanish kasalliklari|Jigar va o‘t yo‘llari kasalliklari',
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
    slug: 'endocrinology',
    content: {
      uz: {
        overview: 'Endokrinologiya bo‘limi gormonal tizim, qalqonsimon bez va moddalar almashinuvi buzilishlarini zamonaviy protokollar asosida boshqaradi. Davolash laborator monitoring va turmush tarzi yordami bilan davom ettiriladi.',
        conditions: 'Qandli diabet|Qalqonsimon bez kasalliklari|Semizlik va metabolik sindrom',
        services: 'Endokrinolog qabuli|Diabet maktabi|Vaznni tibbiy boshqarish',
        diagnostics: 'Gormonal panel|Qalqonsimon bez UZI|Glyukoza monitoringi',
      },
      ru: {
        overview: 'Эндокринология ведёт нарушения гормональной системы, щитовидной железы и обмена веществ по современным протоколам. Лечение дополняется лабораторным мониторингом и поддержкой образа жизни.',
        conditions: 'Сахарный диабет|Заболевания щитовидной железы|Ожирение и метаболический синдром',
        services: 'Приём эндокринолога|Школа диабета|Медицинское управление весом',
        diagnostics: 'Гормональная панель|УЗИ щитовидной железы|Мониторинг глюкозы',
      },
      en: {
        overview: 'Endocrinology manages hormonal, thyroid, and metabolic disorders using current clinical protocols, supported by laboratory monitoring and lifestyle care.',
        conditions: 'Diabetes mellitus|Thyroid disorders|Obesity and metabolic syndrome',
        services: 'Endocrinology consultation|Diabetes education|Medical weight management',
        diagnostics: 'Hormone panel|Thyroid ultrasound|Glucose monitoring',
      },
    },
  },
  {
    slug: 'urology',
    content: {
      uz: {
        overview: 'Urologiya bo‘limi buyrak, siydik yo‘llari va erkaklar reproduktiv salomatligi bo‘yicha konservativ hamda minimal invaziv yordam ko‘rsatadi. Murakkab holatlar multidisiplinar konsiliumda ko‘riladi.',
        conditions: 'Buyrak tosh kasalligi|Prostata kasalliklari|Siydik yo‘llari infeksiyalari',
        services: 'Urolog konsultatsiyasi|Endourologik muolajalar|Operatsiyadan keyingi kuzatuv',
        diagnostics: 'UZI va urofloumetriya|KT-urografiya|Laborator va PSA tahlillari',
      },
      ru: {
        overview: 'Урология оказывает консервативную и малоинвазивную помощь при заболеваниях почек, мочевых путей и мужского репродуктивного здоровья. Сложные случаи обсуждаются консилиумом.',
        conditions: 'Мочекаменная болезнь|Заболевания простаты|Инфекции мочевых путей',
        services: 'Консультация уролога|Эндоурологические процедуры|Послеоперационное наблюдение',
        diagnostics: 'УЗИ и урофлоуметрия|КТ-урография|Лабораторные анализы и ПСА',
      },
      en: {
        overview: 'Urology provides conservative and minimally invasive care for kidney, urinary tract, and male reproductive health conditions. Complex cases receive multidisciplinary review.',
        conditions: 'Kidney stone disease|Prostate disorders|Urinary tract infections',
        services: 'Urology consultation|Endourologic procedures|Post-operative follow-up',
        diagnostics: 'Ultrasound and uroflowmetry|CT urography|Laboratory and PSA testing',
      },
    },
  },
  {
    slug: 'gynecology',
    content: {
      uz: {
        overview: 'Ginekologiya bo‘limi profilaktik ko‘rikdan reproduktiv tibbiyot va minimal invaziv jarrohlikkacha ayollar salomatligining barcha bosqichlarini qamrab oladi.',
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
    slug: 'pediatrics',
    content: {
      uz: {
        overview: 'Pediatriya markazi tug‘ilgandan 18 yoshgacha bo‘lgan bolalarga xavfsiz va mehrli muhitda kompleks yordam beradi. O‘sish, rivojlanish va profilaktika muntazam kuzatiladi.',
        conditions: 'Bolalar infeksiyalari|Allergik va nafas yo‘llari holatlari|O‘sish va rivojlanish muammolari',
        services: 'Pediatr qabuli|Emlash va profilaktika|Yangi tug‘ilgan chaqaloq kuzatuvi',
        diagnostics: 'Bolalar laboratoriyasi|UZI va funksional tekshiruv|Rivojlanishni baholash',
      },
      ru: {
        overview: 'Педиатрический центр оказывает комплексную помощь детям от рождения до 18 лет в безопасной и доброжелательной среде. Рост, развитие и профилактика регулярно контролируются.',
        conditions: 'Детские инфекции|Аллергические и респираторные состояния|Нарушения роста и развития',
        services: 'Приём педиатра|Вакцинация и профилактика|Наблюдение новорождённых',
        diagnostics: 'Детская лаборатория|УЗИ и функциональные исследования|Оценка развития',
      },
      en: {
        overview: 'Pediatrics provides comprehensive care from birth to age 18 in a safe, child-friendly environment, with continuous attention to growth, development, and prevention.',
        conditions: 'Childhood infections|Allergic and respiratory conditions|Growth and developmental concerns',
        services: 'Pediatric consultation|Vaccination and prevention|Newborn follow-up',
        diagnostics: 'Pediatric laboratory|Ultrasound and functional testing|Developmental assessment',
      },
    },
  },
  {
    slug: 'surgery',
    content: {
      uz: {
        overview: 'Jarrohlik markazi umumiy, torakal va laparoskopik operatsiyalarni xavfsizlikning xalqaro standartlari asosida bajaradi. Operatsiyadan oldingi tayyorgarlik va reabilitatsiya yagona yo‘l xaritasiga kiritiladi.',
        conditions: 'Qorin bo‘shlig‘i kasalliklari|Churra va yumshoq to‘qima holatlari|Torakal jarrohlik patologiyalari',
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
    slug: 'rehabilitation',
    content: {
      uz: {
        overview: 'Reabilitatsiya markazi jarohat, operatsiya va nevrologik kasalliklardan keyin harakat va mustaqillikni tiklashga yordam beradi. Dastur funksional maqsadlarga qarab individual tuziladi.',
        conditions: 'Operatsiyadan keyingi holatlar|Insult va nevrologik oqibatlar|Bo‘g‘im va umurtqa muammolari',
        services: 'Individual reabilitatsiya rejasi|Fizioterapiya va LFK|Og‘riqni boshqarish',
        diagnostics: 'Harakat tahlili|Mushak kuchini baholash|Funksional testlar',
      },
      ru: {
        overview: 'Реабилитационный центр помогает восстановить движение и самостоятельность после травм, операций и неврологических заболеваний. Программа строится по индивидуальным функциональным целям.',
        conditions: 'Состояния после операций|Инсульт и неврологические последствия|Проблемы суставов и позвоночника',
        services: 'Индивидуальная программа|Физиотерапия и ЛФК|Управление болью',
        diagnostics: 'Анализ движения|Оценка мышечной силы|Функциональные тесты',
      },
      en: {
        overview: 'Rehabilitation restores movement and independence after injury, surgery, and neurological disease through programs built around individual functional goals.',
        conditions: 'Post-operative conditions|Stroke and neurological effects|Joint and spine disorders',
        services: 'Individual rehabilitation plan|Physiotherapy and exercise therapy|Pain management',
        diagnostics: 'Movement analysis|Muscle strength assessment|Functional testing',
      },
    },
  },
  {
    slug: 'diagnostics',
    content: {
      uz: {
        overview: 'Diagnostika markazi MRT, KT, UZI va laborator tekshiruvlarni yagona raqamli tizimda birlashtiradi. Natijalar tajribali radiologlar tomonidan ko‘rib chiqilib, davolovchi shifokorga tez yetkaziladi.',
        conditions: 'Kompleks tekshiruv talab qiluvchi holatlar|Erta skrining|Davolash natijasini nazorat qilish',
        services: 'MRT va KT|Ekspert UZI|Klinik laboratoriya',
        diagnostics: 'PET-KT imkoniyatlari|Kontrast tekshiruvlar|Ikkinchi radiologik xulosa',
      },
      ru: {
        overview: 'Диагностический центр объединяет МРТ, КТ, УЗИ и лабораторные исследования в единой цифровой системе. Результаты оценивают опытные радиологи и быстро передают лечащему врачу.',
        conditions: 'Состояния, требующие комплексного обследования|Ранний скрининг|Контроль результатов лечения',
        services: 'МРТ и КТ|Экспертное УЗИ|Клиническая лаборатория',
        diagnostics: 'Возможности ПЭТ-КТ|Контрастные исследования|Второе радиологическое мнение',
      },
      en: {
        overview: 'Diagnostics integrates MRI, CT, ultrasound, and laboratory testing in one digital system. Experienced radiologists review results and deliver them rapidly to the treating physician.',
        conditions: 'Conditions requiring comprehensive work-up|Early screening|Treatment response monitoring',
        services: 'MRI and CT|Expert ultrasound|Clinical laboratory',
        diagnostics: 'PET-CT capabilities|Contrast studies|Second radiology opinion',
      },
    },
  },
  {
    slug: 'oncology',
    content: {
      uz: {
        overview: 'Onkologiya markazi tashxisdan davolash va kuzatuvgacha bo‘lgan to‘liq yo‘lni ta’minlaydi. Har bir bemor holati onkolog, jarroh, radiolog va boshqa mutaxassislar konsiliumida muhokama qilinadi.',
        conditions: 'Ko‘krak va o‘pka o‘smalari|Oshqozon-ichak o‘smalari|Siydik-tanosil tizimi o‘smalari',
        services: 'Onkolog konsultatsiyasi|Kimyo va immunoterapiya|Davolashdan keyingi kuzatuv',
        diagnostics: 'Biopsiya va gistologiya|KT, MRT va PET-KT|Molekulyar testlar',
      },
      ru: {
        overview: 'Онкологический центр обеспечивает полный маршрут от диагноза до лечения и наблюдения. Каждый случай обсуждается консилиумом онколога, хирурга, радиолога и других специалистов.',
        conditions: 'Опухоли молочной железы и лёгких|Опухоли ЖКТ|Опухоли мочеполовой системы',
        services: 'Консультация онколога|Химио- и иммунотерапия|Наблюдение после лечения',
        diagnostics: 'Биопсия и гистология|КТ, МРТ и ПЭТ-КТ|Молекулярные тесты',
      },
      en: {
        overview: 'Oncology provides a complete pathway from diagnosis through treatment and follow-up. Every case receives multidisciplinary review by oncology, surgery, radiology, and other specialists.',
        conditions: 'Breast and lung tumors|Gastrointestinal tumors|Urogenital tumors',
        services: 'Oncology consultation|Chemotherapy and immunotherapy|Post-treatment monitoring',
        diagnostics: 'Biopsy and histology|CT, MRI and PET-CT|Molecular testing',
      },
    },
  },
]

export const specialtyPageLabels: Record<Lang, {
  back: string
  expertise: string
  conditions: string
  services: string
  diagnostics: string
  pathway: string
  pathwayText: string
  accredited: string
  available: string
}> = {
  uz: {
    back: 'Klinika yo‘nalishlari',
    expertise: 'Yo‘nalish haqida',
    conditions: 'Qaysi holatlarda yordam beramiz',
    services: 'Xizmatlar va davolash',
    diagnostics: 'Diagnostika imkoniyatlari',
    pathway: 'Shaxsiy davolash yo‘li',
    pathwayText: 'Birinchi konsultatsiyadan natijalarni nazorat qilishgacha barcha bosqichlar bitta koordinatsiyalangan jamoa tomonidan boshqariladi.',
    accredited: 'Xalqaro klinik protokollar',
    available: 'Onlayn yozilish mavjud',
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
    available: 'Доступна онлайн-запись',
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
    available: 'Online booking available',
  },
}

export function getSpecialtyBySlug(slug: string) {
  const index = specialtyDetails.findIndex((item) => item.slug === slug)
  return index === -1 ? null : { detail: specialtyDetails[index], index }
}
