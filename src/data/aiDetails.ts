import type { Lang } from '../i18n/types'

export type AIProductContent = {
  overview: string
  audience: string
  outcomes: string[]
  workflow: string[]
  cases: { title: string; result: string }[]
}

export type AIProductDetail = {
  slug: string
  content: Record<Lang, AIProductContent>
}

export const aiProducts: AIProductDetail[] = [
  {
    slug: 'doctor-assistant',
    content: {
      uz: {
        overview: 'AI Doctor Assistant qabulda shifokorga real vaqtda yordam beradi: anamnezni tahlil qiladi, protokol shakllantiradi, klinik tavsiyalar beradi va ICD kodlashni tezlashtiradi.',
        audience: 'Klinikalar, ambulatoriya va ko‘p tarmoqli markazlar uchun.',
        outcomes: ['Hujjatlashtirish vaqtini 87% gacha qisqartirish', 'Yagona klinik protokol sifati', 'MIS bilan tez integratsiya', 'Shifokor e’tiborini bemorga qaytarish'],
        workflow: ['Qabulda suhbat va anamnez yig‘ish', 'AI protokol va tavsiyalar', 'ICD-10/11 kodlash', 'MIS ga avtomatik uzatish'],
        cases: [
          { title: 'Kardiologiya qabuli', result: 'Bir bemor hujjati 12 daqiqadan 2 daqiqaga tushdi.' },
          { title: 'Terapiya bo‘limi', result: 'Kunlik qabul hajmi 18% oshdi, sifat saqlanib qoldi.' },
        ],
      },
      ru: {
        overview: 'AI Doctor Assistant помогает врачу на приёме в реальном времени: анализирует анамнез, формирует протокол, даёт рекомендации и ускоряет ICD-кодирование.',
        audience: 'Для клиник, амбулаторий и многопрофильных центров.',
        outcomes: ['Сокращение времени документации до 87%', 'Единое качество клинических протоколов', 'Быстрая интеграция с МИС', 'Больше внимания врачу к пациенту'],
        workflow: ['Сбор анамнеза на приёме', 'AI-протокол и рекомендации', 'Кодирование ICD-10/11', 'Автопередача в МИС'],
        cases: [
          { title: 'Кардиологический приём', result: 'Документация по пациенту сократилась с 12 до 2 минут.' },
          { title: 'Терапевтическое отделение', result: 'Поток приёма вырос на 18% без потери качества.' },
        ],
      },
      en: {
        overview: 'AI Doctor Assistant supports physicians in real time: analyzing history, drafting protocols, suggesting care steps, and accelerating ICD coding.',
        audience: 'For clinics, outpatient units, and multidisciplinary centers.',
        outcomes: ['Up to 87% less documentation time', 'Consistent protocol quality', 'Fast EMR integration', 'More physician focus on patients'],
        workflow: ['Capture history during visit', 'AI protocol and recommendations', 'ICD-10/11 coding', 'Auto-sync to EMR'],
        cases: [
          { title: 'Cardiology visit', result: 'Per-patient documentation dropped from 12 to 2 minutes.' },
          { title: 'Internal medicine ward', result: 'Daily visit capacity rose 18% without quality loss.' },
        ],
      },
    },
  },
  {
    slug: 'radiology',
    content: {
      uz: {
        overview: 'AI Radiology rentgen, KT va MRT tasvirlarini avtomatik tahlil qiladi, shubhali topilmalarni prioritetlaydi va radiologga ikkinchi fikr beradi.',
        audience: 'Diagnostika markazlari va radiologiya bo‘limlari uchun.',
        outcomes: ['94% erta aniqlash sezuvchanligi', '4 soniyadan kam tahlil', 'DICOM/PACS integratsiya', 'Navbatni aqlli tartiblash'],
        workflow: ['Tasvirni PACS dan olish', 'AI tahlil va highlight', 'Radiolog tasdiqlashi', 'Xulosani klinikasiga uzatish'],
        cases: [
          { title: 'Ko‘krak qafasi KT', result: 'Shubhali tugunlar 3× tezroq ajratildi.' },
          { title: 'Miya MRT', result: 'Kechnavbatli holatlar avtomatik prioritetlandi.' },
        ],
      },
      ru: {
        overview: 'AI Radiology автоматически анализирует рентген, КТ и МРТ, приоритизирует подозрительные находки и даёт радиологу второе мнение.',
        audience: 'Для диагностических центров и отделений радиологии.',
        outcomes: ['94% чувствительность раннего выявления', 'Анализ менее чем за 4 секунды', 'Интеграция DICOM/PACS', 'Умная приоритизация очереди'],
        workflow: ['Получение снимка из PACS', 'AI-анализ и подсветка', 'Подтверждение радиологом', 'Передача заключения в клинику'],
        cases: [
          { title: 'КТ грудной клетки', result: 'Подозрительные узлы выделяются в 3× быстрее.' },
          { title: 'МРТ головного мозга', result: 'Срочные случаи автоматически поднимаются в очереди.' },
        ],
      },
      en: {
        overview: 'AI Radiology analyzes X-ray, CT, and MRI studies, prioritizes suspicious findings, and provides a second opinion for radiologists.',
        audience: 'For diagnostic centers and radiology departments.',
        outcomes: ['94% early-detection sensitivity', 'Analysis in under 4 seconds', 'DICOM/PACS integration', 'Smarter worklist prioritization'],
        workflow: ['Pull study from PACS', 'AI analysis and highlights', 'Radiologist confirmation', 'Send report to clinic'],
        cases: [
          { title: 'Chest CT', result: 'Suspicious nodules flagged 3× faster.' },
          { title: 'Brain MRI', result: 'Urgent cases automatically rise in the queue.' },
        ],
      },
    },
  },
  {
    slug: 'ultrasound',
    content: {
      uz: {
        overview: 'AI Ultrasound UTT paytida organlarni real vaqtda segmentatsiya qiladi, o‘lchovlarni avtomatlashtiradi va protokol tayyorlashni soddalashtiradi.',
        audience: 'UTT kabinetlari va ambulator diagnostika uchun.',
        outcomes: ['Diagnostikani 3× tezlashtirish', 'Avto-o‘lchov aniqligi', 'Standartlashgan protokol', 'Yangi shifokorlar uchun yordam'],
        workflow: ['Skanerlashni boshlash', 'Real vaqt segmentatsiya', 'Avto-o‘lchov va belgilar', 'Tayyor protokolni saqlash'],
        cases: [
          { title: 'Qalqonsimon bez UTT', result: 'Tugun o‘lchovi va protokol 60% tezroq.' },
          { title: 'Qorin bo‘shlig‘i UTT', result: 'Yangi mutaxassislar xatosi kamaydi.' },
        ],
      },
      ru: {
        overview: 'AI Ultrasound сегментирует органы в реальном времени, автоматизирует измерения и упрощает протоколирование УЗИ.',
        audience: 'Для кабинетов УЗИ и амбулаторной диагностики.',
        outcomes: ['Ускорение диагностики в 3×', 'Точные автоизмерения', 'Стандартизированный протокол', 'Поддержка начинающих врачей'],
        workflow: ['Старт сканирования', 'Сегментация в реальном времени', 'Автоизмерения и метки', 'Сохранение готового протокола'],
        cases: [
          { title: 'УЗИ щитовидной железы', result: 'Измерение узлов и протокол быстрее на 60%.' },
          { title: 'УЗИ брюшной полости', result: 'Снижение ошибок у новых специалистов.' },
        ],
      },
      en: {
        overview: 'AI Ultrasound segments organs in real time, automates measurements, and simplifies ultrasound reporting.',
        audience: 'For ultrasound rooms and outpatient diagnostics.',
        outcomes: ['3× faster diagnostics', 'Accurate auto-measurements', 'Standardized reporting', 'Support for junior physicians'],
        workflow: ['Start scanning', 'Real-time segmentation', 'Auto-measure and mark', 'Save finished report'],
        cases: [
          { title: 'Thyroid ultrasound', result: 'Nodule measurement and reporting 60% faster.' },
          { title: 'Abdominal ultrasound', result: 'Fewer errors among new specialists.' },
        ],
      },
    },
  },
  {
    slug: 'clinical-research',
    content: {
      uz: {
        overview: 'AI Clinical Research klinik tadqiqotlarni avtomatlashtiradi: bemor skreeningi, eCRF, nojoiya hodisalar monitoringi va CTMS integratsiyasi.',
        audience: 'Sponsorlar, CRO va tadqiqot markazlari uchun.',
        outcomes: ['Skreening vaqtini 40% kamaytirish', 'Toza eCRF ma’lumotlari', 'Tezroq start-up', 'Farmakonazor signalari'],
        workflow: ['Inkluziya mezonlarini yuklash', 'AI bemor tanlash', 'eCRF to‘ldirish', 'Monitoring va CTMS sync'],
        cases: [
          { title: 'I–II bosqich tadqiqot', result: 'Birinchi bemorgacha vaqt 6 haftadan 4 haftaga tushdi.' },
          { title: 'Ko‘p markazli KT', result: 'Ma’lumot xatolari 35% kamaydi.' },
        ],
      },
      ru: {
        overview: 'AI Clinical Research автоматизирует клинические исследования: скрининг пациентов, eCRF, мониторинг НЯ и интеграцию с CTMS.',
        audience: 'Для спонсоров, CRO и исследовательских центров.',
        outcomes: ['Снижение времени скрининга на 40%', 'Чистые данные eCRF', 'Более быстрый start-up', 'Сигналы фармаконадзора'],
        workflow: ['Загрузка критериев включения', 'AI-отбор пациентов', 'Заполнение eCRF', 'Мониторинг и синхронизация CTMS'],
        cases: [
          { title: 'Исследование I–II фазы', result: 'Время до первого пациента сократилось с 6 до 4 недель.' },
          { title: 'Многоцентровое КИ', result: 'Ошибки данных снизились на 35%.' },
        ],
      },
      en: {
        overview: 'AI Clinical Research automates trials: patient screening, eCRF, adverse-event monitoring, and CTMS integration.',
        audience: 'For sponsors, CROs, and research centers.',
        outcomes: ['40% less screening time', 'Cleaner eCRF data', 'Faster start-up', 'Pharmacovigilance signals'],
        workflow: ['Load inclusion criteria', 'AI patient matching', 'Complete eCRF', 'Monitor and sync CTMS'],
        cases: [
          { title: 'Phase I–II study', result: 'Time to first patient fell from 6 to 4 weeks.' },
          { title: 'Multi-center trial', result: 'Data errors dropped by 35%.' },
        ],
      },
    },
  },
]

export const aiPageLabels: Record<Lang, {
  back: string
  overview: string
  audience: string
  outcomes: string
  workflow: string
  cases: string
  related: string
  demoTitle: string
  demoDesc: string
  clinicField: string
  nameField: string
  phoneField: string
  emailField: string
  messageField: string
  submitting: string
  successTitle: string
  successDesc: string
  requestNumber: string
  productLabel: string
  close: string
  moreProducts: string
}> = {
  uz: {
    back: 'AI yechimlar',
    overview: 'Mahsulot haqida',
    audience: 'Kimlar uchun',
    outcomes: 'Natijalar',
    workflow: 'Qanday ishlaydi',
    cases: 'Keyslar',
    related: 'Boshqa AI mahsulotlar',
    demoTitle: 'Demoni buyurtma qilish',
    demoDesc: '15 daqiqa ichida AI jamoamiz siz bilan bog‘lanadi va moslashuv rejasini tayyorlaydi.',
    clinicField: 'Klinika / tashkilot',
    nameField: 'Ismingiz',
    phoneField: 'Telefon',
    emailField: 'Email',
    messageField: 'Izoh',
    submitting: 'Yuborilmoqda...',
    successTitle: 'Demo so‘rovi qabul qilindi',
    successDesc: 'MRII AI jamoasi ma’lumotlarni ko‘rib chiqib, demo vaqtini tasdiqlash uchun bog‘lanadi.',
    requestNumber: 'So‘rov raqami',
    productLabel: 'Mahsulot',
    close: 'Yopish',
    moreProducts: 'Barcha AI yechimlar',
  },
  ru: {
    back: 'AI решения',
    overview: 'О продукте',
    audience: 'Для кого',
    outcomes: 'Результаты',
    workflow: 'Как это работает',
    cases: 'Кейсы',
    related: 'Другие AI продукты',
    demoTitle: 'Заказать демо',
    demoDesc: 'В течение 15 минут наша AI-команда свяжется с вами и подготовит план внедрения.',
    clinicField: 'Клиника / организация',
    nameField: 'Ваше имя',
    phoneField: 'Телефон',
    emailField: 'Email',
    messageField: 'Комментарий',
    submitting: 'Отправляем...',
    successTitle: 'Заявка на демо принята',
    successDesc: 'Команда AI MRII проверит данные и свяжется для подтверждения времени демо.',
    requestNumber: 'Номер заявки',
    productLabel: 'Продукт',
    close: 'Закрыть',
    moreProducts: 'Все AI решения',
  },
  en: {
    back: 'AI solutions',
    overview: 'About the product',
    audience: 'Who it is for',
    outcomes: 'Outcomes',
    workflow: 'How it works',
    cases: 'Case studies',
    related: 'Other AI products',
    demoTitle: 'Request a demo',
    demoDesc: 'Our AI team will contact you within 15 minutes and prepare an adoption plan.',
    clinicField: 'Clinic / organization',
    nameField: 'Your name',
    phoneField: 'Phone',
    emailField: 'Email',
    messageField: 'Comment',
    submitting: 'Sending...',
    successTitle: 'Demo request received',
    successDesc: 'The MRII AI team will review your details and confirm a demo time.',
    requestNumber: 'Request number',
    productLabel: 'Product',
    close: 'Close',
    moreProducts: 'All AI solutions',
  },
}

export function getAIProductBySlug(slug: string) {
  const index = aiProducts.findIndex((item) => item.slug === slug)
  return index === -1 ? null : { detail: aiProducts[index], index }
}

export const AI_PRODUCT_SLUGS = aiProducts.map((item) => item.slug)
