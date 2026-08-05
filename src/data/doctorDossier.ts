import type { ContentLang } from '../i18n/types'
import type { DoctorProfile } from './doctors'

type DossierLocale = {
  profileLabel: string
  available: string
  careerTitle: string
  careerDescription: string
  education: string
  languages: string
  science: string
  focus: string
  current: string
  native: string
  fluent: string
  training: string
  regionalCenter: string
  specialistCenter: string
  instituteClinic: string
  seniorSpecialist: string
  demoNote: string
  academicDoctor: string
  academicNurse: string
  academicProfessor: string
  seniorGrade: string
  clinicalMentor: string
  patientCount: string
  patientPeriod: string
  quote: string
  visit: {
    title: string
    address: string
    addressValue: string
    addressNote: string
    hours: string
    hoursValue: string
    hoursNote: string
    firstVisit: string
    firstVisitValue: string
    firstVisitNote: string
    followUp: string
    followUpValue: string
    followUpNote: string
    insurance: string
    insuranceValue: string
    insuranceNote: string
  }
}

export type CareerMilestone = {
  range: string
  place: string
  role: string
  current?: boolean
}

export type DoctorDossier = {
  ui: DossierLocale
  experienceYears: number
  milestones: CareerMilestone[]
  languages: Array<{ language: string; level: string }>
  academicTitle: string
  badges: string[]
  patientCount: string
}

const locales: Record<ContentLang, DossierLocale> = {
  uz: {
    profileLabel: 'Klinika mutaxassisi',
    available: 'Qabul uchun ariza ochiq',
    careerTitle: 'Kasbiy yo’l',
    careerDescription: 'Tajriba, ish joylari va mas’uliyat doirasi',
    education: 'Ta’lim va malaka',
    languages: 'Qabul tillari',
    science: 'Ilmiy faoliyat',
    focus: 'Yordam yo’nalishlari',
    current: 'hozir',
    native: 'ona tili',
    fluent: 'erkin',
    training: 'Klinik tayyorgarlik',
    regionalCenter: 'Viloyat tibbiyot markazi',
    specialistCenter: 'Ixtisoslashtirilgan klinik amaliyot',
    instituteClinic: 'FJSTI ko’p tarmoqli klinikasi',
    seniorSpecialist: 'Yetakchi mutaxassis',
    demoNote: 'Ish joylari demo ma’lumot. CMS profili bilan yangilanadi.',
    academicDoctor: 'Klinik mutaxassis',
    academicNurse: 'Klinik parvarish mutaxassisi',
    academicProfessor: 'Tibbiyot fanlari doktori',
    seniorGrade: 'Oliy toifali',
    clinicalMentor: 'Ilmiy rahbar',
    patientCount: 'bemor qabul qilingan',
    patientPeriod: 'So’nggi 12 oy · klinika hisoboti',
    quote: 'Bemorga tashxisni tushuntirmasdan turib, davolash boshlanmaydi. Tushungan bemor — rejaga amal qiladigan bemor.',
    visit: {
      title: 'Qanday qabul qilinadi',
      address: 'Manzil',
      addressValue: 'FJSTI klinikasi, 2-korpus',
      addressNote: 'Farg’ona sh., Marg’ilon yo’li 2A · 3-qavat, 312-xona',
      hours: 'Ish vaqti',
      hoursValue: 'Du–Sha, 08:00–18:00',
      hoursNote: 'Yakshanba — navbatchi mutaxassis',
      firstVisit: 'Birinchi qabul',
      firstVisitValue: '180 000 so’m',
      firstVisitNote: 'Boshlang’ich tahlil narxga kiritilgan · ~40 daqiqa',
      followUp: 'Takroriy',
      followUpValue: '120 000 so’m',
      followUpNote: '30 kun ichida — bepul qayta ko’rik',
      insurance: 'Sug’urta',
      insuranceValue: 'Gross, Apex, Kafolat',
      insuranceNote: 'Yo’llanma bilan qabul qilinadi',
    },
  },
  ru: {
    profileLabel: 'Специалист клиники',
    available: 'Заявки на приём открыты',
    careerTitle: 'Профессиональный путь',
    careerDescription: 'Опыт, места работы и зона ответственности',
    education: 'Образование и квалификация',
    languages: 'Языки приёма',
    science: 'Научная деятельность',
    focus: 'Направления помощи',
    current: 'сейчас',
    native: 'родной',
    fluent: 'свободно',
    training: 'Клиническая подготовка',
    regionalCenter: 'Областной медицинский центр',
    specialistCenter: 'Специализированная клиническая практика',
    instituteClinic: 'Многопрофильная клиника FJSTI',
    seniorSpecialist: 'Ведущий специалист',
    demoNote: 'Места работы — демо-данные до подключения профиля CMS.',
    academicDoctor: 'Клинический специалист',
    academicNurse: 'Специалист по клиническому уходу',
    academicProfessor: 'Доктор медицинских наук',
    seniorGrade: 'Высшая категория',
    clinicalMentor: 'Научный руководитель',
    patientCount: 'пациентов принято',
    patientPeriod: 'Последние 12 месяцев · данные клиники',
    quote: 'Лечение не начинается, пока пациент не понял диагноз. Понимающий пациент следует плану.',
    visit: {
      title: 'Как проходит приём',
      address: 'Адрес',
      addressValue: 'Клиника FJSTI, корпус 2',
      addressNote: 'Фергана, ул. Маргиланская 2A · 3 этаж, кабинет 312',
      hours: 'Часы работы',
      hoursValue: 'Пн–Сб, 08:00–18:00',
      hoursNote: 'В воскресенье — дежурный специалист',
      firstVisit: 'Первичный приём',
      firstVisitValue: '180 000 сум',
      firstVisitNote: 'Первичный анализ включён · ~40 минут',
      followUp: 'Повторный',
      followUpValue: '120 000 сум',
      followUpNote: 'В течение 30 дней — бесплатный контроль',
      insurance: 'Страхование',
      insuranceValue: 'Gross, Apex, Kafolat',
      insuranceNote: 'Принимается по направлению',
    },
  },
  en: {
    profileLabel: 'Clinic specialist',
    available: 'Appointment requests are open',
    careerTitle: 'Professional journey',
    careerDescription: 'Experience, workplaces, and areas of responsibility',
    education: 'Education and qualifications',
    languages: 'Consultation languages',
    science: 'Scientific activity',
    focus: 'Areas of care',
    current: 'present',
    native: 'native',
    fluent: 'fluent',
    training: 'Clinical training',
    regionalCenter: 'Regional medical center',
    specialistCenter: 'Specialist clinical practice',
    instituteClinic: 'FJSTI multidisciplinary clinic',
    seniorSpecialist: 'Senior specialist',
    demoNote: 'Workplaces use demo data until the CMS profile is connected.',
    academicDoctor: 'Clinical specialist',
    academicNurse: 'Clinical care specialist',
    academicProfessor: 'Doctor of Medical Sciences',
    seniorGrade: 'Senior grade',
    clinicalMentor: 'Research supervisor',
    patientCount: 'patients seen',
    patientPeriod: 'Last 12 months · clinic records',
    quote: 'Treatment does not begin until the patient understands the diagnosis. An informed patient follows the plan.',
    visit: {
      title: 'What to expect',
      address: 'Address',
      addressValue: 'FJSTI clinic, building 2',
      addressNote: 'Fergana, Margilan road 2A · floor 3, room 312',
      hours: 'Hours',
      hoursValue: 'Mon–Sat, 08:00–18:00',
      hoursNote: 'Duty specialist on Sunday',
      firstVisit: 'First visit',
      firstVisitValue: 'UZS 180,000',
      firstVisitNote: 'Initial analysis included · ~40 minutes',
      followUp: 'Follow-up',
      followUpValue: 'UZS 120,000',
      followUpNote: 'Free control visit within 30 days',
      insurance: 'Insurance',
      insuranceValue: 'Gross, Apex, Kafolat',
      insuranceNote: 'Referrals accepted',
    },
  },
}

function parseExperience(value: string) {
  const match = value.match(/\d+/)
  return match ? Math.max(1, Number(match[0])) : 10
}

const DOSSIER_MILESTONE_OVERRIDES: Partial<
  Record<ContentLang, Partial<Record<string, CareerMilestone[]>>>
> = {
  uz: {
    'xaydaraliyev-s-a': [
      { range: '2010–2011', place: 'I.K. Axunbayev QDTMA (Bishkek)', role: '«Davolash ishi» — bitiruvchi' },
      { range: '2011–2019', place: 'Qirg’iz DTQTM va MO, O’sh', role: 'Urologiya — internatura va ordinatura' },
      { range: '2019–2025', place: 'Omsk · «Professional» NKT · RUKTA', role: 'UTT va bolalar urolog-andrologiyasi' },
      {
        range: '2025–hozir',
        place: 'FJSTI ko’p tarmoqli klinikasi',
        role: 'Qabul-diagnostika bo’limi mudiri · urolog',
        current: true,
      },
    ],
    'azimova-g-r': [
      { range: '2001–2008', place: 'Andijon davlat tibbiyot instituti', role: '«Davolash ishi» — talaba' },
      { range: '2009–2018', place: 'Farg’ona · Quvasoy · Oltiariq', role: 'Umumiy amaliyot · akusher-ginekolog · bosh vrach o’rinbosari' },
      { range: '2018–2020', place: 'Omsk · TTA · Toshkent', role: 'Xirurgiya ordinaturasi va amaliyot vrachi' },
      {
        range: '2021–hozir',
        place: 'FJSTI',
        role: 'Xirurgik kasalliklar kafedrasi assistenti → Umumiy xirurgiya katta o’qituvchisi',
        current: true,
      },
    ],
    'ruzmatov-z-s': [
      { range: '2004–2011', place: 'Andijon tibbiyot instituti', role: '«Davolash ishi» — talaba' },
      { range: '2011–2013', place: 'Toshkent, vrachlar malakasini oshirish instituti', role: 'Ordinatura' },
      { range: '2013–2019', place: 'Farg’ona shahar Markaziy poliklinika', role: 'Nevropatolog vrachi' },
      {
        range: '2020–hozir',
        place: 'Farg’ona shahar 2-sonli shifoxona',
        role: 'Nevrologiya bo’limi vrachi',
        current: true,
      },
    ],
    'satvoldiyev-d-u': [
      { range: '2004–2010', place: 'O’sh davlat tibbiyot instituti', role: '«Davolash ishi» — talaba' },
      { range: '2013–2020', place: 'PAU Farmak farmatsevtika kompaniyasi', role: 'Tibbiy vakil' },
      {
        range: '2021–hozir',
        place: 'Farg’ona shahar 2-sonli shifoxona',
        role: 'Xo’jalik hisobidagi kardiologiya bo’limi vrachi',
        current: true,
      },
    ],
    'mominov-j-z': [
      { range: '2015–2021', place: 'Andijon davlat tibbiyot instituti', role: '«Davolash ishi» fakulteti — talaba' },
      { range: '2021–2024', place: 'Andijon DTMI', role: 'Terapiya magistranti' },
      { range: '2021–2025', place: 'Andijon shahar 6-sonli oilaviy poliklinikasi', role: 'Oila shifokori' },
      {
        range: '2025–hozir',
        place: 'FJSTI · Terapiya yo’nalishidagi fanlar kafedrasi',
        role: 'Assistent',
        current: true,
      },
    ],
    'gayratjonova-f-g': [
      { range: '2022', place: 'Farg’ona shahar 1-sonli oilaviy poliklinikasi', role: 'UASh' },
      { range: '2022–hozir', place: 'Toshkent pediatriya instituti', role: 'Terapiya fakulteti — talaba' },
      {
        range: '2025–hozir',
        place: 'FJSTI · Terapiya (UASh) kafedrasi',
        role: 'O’qituvchi stajyor',
        current: true,
      },
    ],
    'davlatov-s-q': [
      { range: '2014–2020', place: 'Andijon davlat tibbiyot instituti', role: 'Talaba' },
      { range: '2020', place: 'Yozyovon tumani 34-qishloq oilaviy poliklinikasi', role: 'Umumiy amaliyot shifokori' },
      { range: '2020–2023', place: 'Toshkent tibbiyot akademiyasi', role: 'Kardiologiya magistrant' },
      { range: '2022–2023', place: 'RSHTYoIM · Toshkent tez tibbiy yordam stantsiyasi', role: 'Ko’chma brigada o’rindosh shifokori' },
      {
        range: '2023–hozir',
        place: 'FJSTI · Terapiya (UASh) kafedrasi',
        role: 'Assistent',
        current: true,
      },
    ],
    'xalilov-n-a': [
      { range: '2015–2021', place: 'Andijon davlat tibbiyot instituti', role: '«Davolash ishi» fakulteti — talaba' },
      {
        range: '2021–2024',
        place: 'Andijon DTMI',
        role: 'Terapiya (yo’nalishlar bo’yicha) magistrant',
        current: true,
      },
    ],
    'xojaeva-g-a': [
      { range: '1986–1994', place: 'Andijon davlat tibbiyot instituti', role: '«Davolash ishi» — talaba' },
      { range: '1994–1995', place: 'Farg’ona tibbiy-sanitariya qismi', role: 'Internatura' },
      { range: '1996–2018', place: 'Farg’ona viloyati poliklinika va tibbiyot kolleji', role: 'Terapevt · o’qituvchi · bo’lim boshlig’i · direktor' },
      { range: '2020–hozir', place: 'FJSTI · Terapiya (UASh) kafedrasi', role: 'Assistent' },
      {
        range: '2025–hozir',
        place: 'FJSTI ko’p tarmoqli klinikasi',
        role: 'Ultratovush diagnostikasi vrachi',
        current: true,
      },
    ],
    'isaqjonova-m-n': [
      { range: '2015–2021', place: 'TTA, Davolash fakulteti', role: 'Talaba' },
      { range: '2022–2024', place: 'TTA Termiz filiali', role: 'Endokrinologiya klinik ordinaturasi' },
      { range: '2022–2025', place: 'Surxondaryo dispanser · Termiz · TTA', role: 'Endokrinolog · assistent' },
      {
        range: '2025–hozir',
        place: 'FJSTI · Farg’ona 4-sonli poliklinika',
        role: 'Stajyor o’qituvchi · endokrinolog',
        current: true,
      },
    ],
    'aliyeva-z-v': [
      { range: '2013–2019', place: 'ADTI', role: '«Davolash ishi» — talaba' },
      { range: '2019–2022', place: 'Farg’ona poliklinika · ADTI', role: 'Umumiy amaliyot · endokrinologiya ordinaturasi' },
      { range: '2023–2025', place: 'RIOMSM · Qibray · Izboskan', role: 'Akusher-ginekologiya ordinaturasi · amaliyot' },
      {
        range: '2025–hozir',
        place: 'FJSTI · RIOMSM Farg’ona',
        role: 'Stajyor o’qituvchi · akusher-ginekolog · klinika shifokori',
        current: true,
      },
    ],
    'shamsutdinova-g-b': [
      { range: '2008–2015', place: 'Andijon DTMI', role: '«Davolash ishi» — talaba' },
      { range: '2015–2018', place: 'Andijon · Farg’ona poliklinika', role: 'Umumiy amaliyot · kardiorevmatolog · magistr' },
      { range: '2019–2024', place: 'Toshkent MMI · FJSTI', role: 'Ichki kasalliklar qayta tayyorlash · kafedra assistenti' },
      {
        range: '2025–hozir',
        place: 'FJSTI',
        role: 'Terapiya (UASH) kafedra mudiri · PhD',
        current: true,
      },
    ],
    'abdullayeva-t-y': [
      {
        range: '2024–hozir',
        place: 'Farg’ona shahar 6-sonli oilaviy poliklinika',
        role: 'Oila shifokori',
        current: true,
      },
    ],
    'mamatalieva-z-a': [
      { range: '2009–2015', place: 'Kemerovo DTMA', role: 'Tibbiyot fakulteti — talaba' },
      { range: '2017–2020', place: 'ADTI', role: 'Magistratura' },
      { range: '2020–2022', place: 'TMA Farg’ona filiali · FJSTI', role: 'Assistent · sestra ish kafedrasi' },
      { range: '2022', place: '«Ishonch» xususiy klinikasi', role: 'Nevrolog' },
      {
        range: '2025–hozir',
        place: 'FJSTI',
        role: 'PhD · kafedra assistenti · klinika nevrologi · EAN RRFS',
        current: true,
      },
    ],
    'bobojonov-s-s': [
      { range: '2010–2017', place: 'ADTI', role: '«Davolash ishi» — talaba' },
      { range: '2017–2019', place: 'Xo’roba QVP · ADTI klinikasi', role: 'UASH · kardiorrevmatologiya ordinaturasi' },
      { range: '2020–2023', place: 'FJSTI · TT akademiyasi filiali', role: 'Assistent · xalqaro bo’lim boshlig’i' },
      {
        range: '2023–hozir',
        place: 'FJSTI',
        role: 'Terapiya yo’nalishidagi fanlar kafedrasi assistenti · kardiolog',
        current: true,
      },
    ],
    'nosirov-m-m': [
      { range: '2015–2021', place: 'ADTI, Pediatriya fakulteti', role: 'Talaba' },
      { range: '2021–2023', place: 'Marhamat · Jalaquduq · ADTI', role: 'Navbatchi shifokor · klinik ordinatura' },
      { range: '2023–2025', place: 'RShTYIM · FJSTIKT', role: 'Qabul-diagnostika · asab kasalliklari nevrologi' },
      {
        range: '2025–hozir',
        place: 'FJSTI',
        role: 'Nevrologiya bo’limi mudiri · kafedra stajyor o’qituvchisi',
        current: true,
      },
    ],
    'kojoeva-f-o': [
      { range: '2019–2025', place: 'FJSTI · Farg’ona JSI', role: '«Davolash ishi» — talaba' },
      { range: '2024–hozir', place: 'Farg’ona shahar 8-sonli oilaviy poliklinika', role: 'Oila shifokori' },
      { range: '2025–hozir', place: 'FJSTI nevrologiya kafedrasi', role: 'Klinik ordinatur' },
      {
        range: '2026–hozir',
        place: 'FJSTI Qabul-diagnostika bo’limi',
        role: 'Nevrolog',
        current: true,
      },
    ],
  },
  ru: {
    'xaydaraliyev-s-a': [
      { range: '2010–2011', place: 'КГМА им. И.К. Ахунбаева (Бишкек)', role: '«Лечебное дело» — выпускник' },
      { range: '2011–2019', place: 'КГМИППВ, южный филиал (Ош)', role: 'Урология — интернатура и ординатура' },
      { range: '2019–2025', place: 'Омск · НОУ «Professional» · РМАНПО', role: 'УЗ-диагностика и детская урология' },
      {
        range: '2025–н.в.',
        place: 'Многопрофильная клиника FJSTI',
        role: 'Зав. приёмно-диагностическим отделением · уролог',
        current: true,
      },
    ],
    'azimova-g-r': [
      { range: '2001–2008', place: 'Андижанский государственный медицинский институт', role: '«Лечебное дело» — студентка' },
      { range: '2009–2018', place: 'Фергана · Кувасай · Алтыарык', role: 'ВОП · акушер-гинеколог · зам. главного врача' },
      { range: '2018–2020', place: 'Омск · ТТА · Ташкент', role: 'Ординатура по хирургии и практика' },
      {
        range: '2021–н.в.',
        place: 'FJSTI',
        role: 'Ассистент кафедры хирургии → ст. преподаватель общей хирургии',
        current: true,
      },
    ],
    'ruzmatov-z-s': [
      { range: '2004–2011', place: 'Андижанский медицинский институт', role: '«Лечебное дело» — студент' },
      { range: '2011–2013', place: 'Институт повышения квалификации (Ташкент)', role: 'Ординатура' },
      { range: '2013–2019', place: 'Центральная поликлиника (Фергана)', role: 'Врач-невропатолог' },
      {
        range: '2020–н.в.',
        place: 'Городская больница №2 (Фергана)',
        role: 'Врач неврологического отделения',
        current: true,
      },
    ],
    'satvoldiyev-d-u': [
      { range: '2004–2010', place: 'Osh ГМИ', role: '«Лечебное дело» — студент' },
      { range: '2013–2020', place: 'PAU Farmak', role: 'Медицинский представитель' },
      {
        range: '2021–н.в.',
        place: 'Городская больница №2 (Фергана)',
        role: 'Врач бюджетного кардиологического отделения',
        current: true,
      },
    ],
    'mamatalieva-z-a': [
      { range: '2009–2015', place: 'Кемеровская ГМА', role: 'Медицинский факультет — студентка' },
      { range: '2017–2020', place: 'ADTI', role: 'Магистратура' },
      { range: '2020–2022', place: 'Филиал TMA · FJSTI', role: 'Ассистент · кафедра сестринского дела' },
      { range: '2022', place: 'Клиника «Ишонч»', role: 'Врач-невролог' },
      {
        range: '2025–н.в.',
        place: 'FJSTI',
        role: 'PhD · ассистент кафедры · невролог клиники · EAN RRFS',
        current: true,
      },
    ],
    'bobojonov-s-s': [
      { range: '2010–2017', place: 'ADTI', role: '«Лечебное дело» — студент' },
      { range: '2017–2019', place: 'СВА Хорраба · клиника ADTI', role: 'Неотложная помощь · ординатура кардиоревматологии' },
      { range: '2020–2023', place: 'FJSTI · филиал ТТА', role: 'Ассистент · руководитель международного отдела' },
      {
        range: '2023–н.в.',
        place: 'FJSTI',
        role: 'Ассистент кафедры терапии · кардиолог',
        current: true,
      },
    ],
    'nosirov-m-m': [
      { range: '2015–2021', place: 'ADTI, педиатрический факультет', role: 'Студент' },
      { range: '2021–2023', place: 'Мархамат · Джалаquduq · ADTI', role: 'Дежурный врач · клин. ординатура' },
      { range: '2023–2025', place: 'RShTYIM · FJSTIKT', role: 'Приём-диагностика · невролог нервных болезней' },
      {
        range: '2025–н.в.',
        place: 'FJSTI',
        role: 'Зав. отделением неврологии · стажёр-преподаватель',
        current: true,
      },
    ],
    'mominov-j-z': [
      { range: '2015–2021', place: 'Андижанский государственный медицинский институт', role: 'Факультет «Лечебное дело» — студент' },
      { range: '2021–2024', place: 'Андижанский ГМИ', role: 'Магистрант, терапия' },
      { range: '2021–2025', place: 'Поликлиника №6 (Андижан)', role: 'Семейный врач' },
      {
        range: '2025–н.в.',
        place: 'FJSTI · кафедра терапии',
        role: 'Ассистент',
        current: true,
      },
    ],
    'gayratjonova-f-g': [
      { range: '2022', place: 'Поликлиника №1 (Фергана)', role: 'UASh' },
      { range: '2022–н.в.', place: 'Ташкентский педиатрический институт', role: 'Факультет терапии — студентка' },
      {
        range: '2025–н.в.',
        place: 'FJSTI · кафедра терапии (UASh)',
        role: 'Стажёр-преподаватель',
        current: true,
      },
    ],
    'davlatov-s-q': [
      { range: '2014–2020', place: 'Андижанский государственный медицинский институт', role: 'Студент' },
      { range: '2020', place: 'Сельская поликлиника №34, Yozyovon', role: 'Врач общей практики' },
      { range: '2020–2023', place: 'Ташкентская медицинская академия', role: 'Магистрант, кардиология' },
      { range: '2022–2023', place: 'RSHTYoIM · станция скорой помощи (Ташкент)', role: 'Врач выездной бригады (совместительство)' },
      {
        range: '2023–н.в.',
        place: 'FJSTI · кафедра терапии (UASh)',
        role: 'Ассистент',
        current: true,
      },
    ],
    'xalilov-n-a': [
      { range: '2015–2021', place: 'Андижанский государственный медицинский институт', role: 'Факультет «Лечебное дело» — студент' },
      {
        range: '2021–2024',
        place: 'Андижанский ГМИ',
        role: 'Магистратура по терапии (по направлениям)',
        current: true,
      },
    ],
    'xojaeva-g-a': [
      { range: '1986–1994', place: 'Андижанский государственный медицинский институт', role: '«Лечебное дело» — студентка' },
      { range: '1994–1995', place: 'Ферганский медико-санитарный отряд', role: 'Интернатура' },
      { range: '1996–2018', place: 'Поликлиники и медколледж (Ферганская область)', role: 'Терапевт · преподаватель · зав. отделением · директор' },
      { range: '2020–н.в.', place: 'FJSTI · кафедра терапии (UASh)', role: 'Ассистент' },
      {
        range: '2025–н.в.',
        place: 'Многопрофильная клиника FJSTI',
        role: 'Врач ультразвуковой диагностики',
        current: true,
      },
    ],
    'kojoeva-f-o': [
      { range: '2019–2025', place: 'FJSTI · Ферганский ин-т общественного здоровья', role: '«Лечебное дело» — студентка' },
      { range: '2024–н.в.', place: 'Поликлиника №8 (Фергана)', role: 'Семейный врач' },
      { range: '2025–н.в.', place: 'Кафедра неврологии FJSTI', role: 'Клиническая ординатура' },
      {
        range: '2026–н.в.',
        place: 'FJSTI, отделение приёма-диагностики',
        role: 'Невролог',
        current: true,
      },
    ],
  },
  en: {
    'xaydaraliyev-s-a': [
      { range: '2010–2011', place: 'I.K. Akhunbaev KSMA (Bishkek)', role: 'General Medicine graduate' },
      { range: '2011–2019', place: 'Kyrgyz CME southern branch (Osh)', role: 'Urology internship and residency' },
      { range: '2019–2025', place: 'Omsk · Professional NCO · RMANPO', role: 'Ultrasound and pediatric urology' },
      {
        range: '2025–present',
        place: 'FJSTI multidisciplinary clinic',
        role: 'Head of admission & diagnostics · urologist',
        current: true,
      },
    ],
    'azimova-g-r': [
      { range: '2001–2008', place: 'Andijan State Medical Institute', role: 'General Medicine — student' },
      { range: '2009–2018', place: 'Fergana · Quvasoy · Oltiariq', role: 'GP · OB-GYN · deputy chief physician' },
      { range: '2018–2020', place: 'Omsk · TTA · Tashkent', role: 'Surgery residency and clinical practice' },
      {
        range: '2021–present',
        place: 'FJSTI',
        role: 'Surgical diseases assistant → General Surgery senior lecturer',
        current: true,
      },
    ],
    'ruzmatov-z-s': [
      { range: '2004–2011', place: 'Andijan Medical Institute', role: 'General Medicine — student' },
      { range: '2011–2013', place: 'Tashkent Institute for Advanced Medical Training', role: 'Residency' },
      { range: '2013–2019', place: 'Fergana Central Polyclinic', role: 'Neuropathologist' },
      {
        range: '2020–present',
        place: 'Fergana City Hospital No. 2',
        role: 'Neurology department physician',
        current: true,
      },
    ],
    'satvoldiyev-d-u': [
      { range: '2004–2010', place: 'Osh State Medical Institute', role: 'General Medicine — student' },
      { range: '2013–2020', place: 'PAU Farmak pharmaceutical company', role: 'Medical representative' },
      {
        range: '2021–present',
        place: 'Fergana City Hospital No. 2',
        role: 'Budget-funded cardiology department physician',
        current: true,
      },
    ],
    'mominov-j-z': [
      { range: '2015–2021', place: 'Andijan State Medical Institute', role: 'General Medicine faculty — student' },
      { range: '2021–2024', place: 'Andijan SMI', role: 'Therapy master’s student' },
      { range: '2021–2025', place: 'Andijan City Polyclinic No. 6', role: 'Family physician' },
      {
        range: '2025–present',
        place: 'FJSTI · Therapy department',
        role: 'Assistant',
        current: true,
      },
    ],
    'gayratjonova-f-g': [
      { range: '2022', place: 'Fergana City Polyclinic No. 1', role: 'UASh' },
      { range: '2022–present', place: 'Tashkent Pediatric Institute', role: 'Therapy faculty — student' },
      {
        range: '2025–present',
        place: 'FJSTI · Therapy (UASh) department',
        role: 'Trainee lecturer',
        current: true,
      },
    ],
    'davlatov-s-q': [
      { range: '2014–2020', place: 'Andijan State Medical Institute', role: 'Student' },
      { range: '2020', place: 'Rural polyclinic No. 34, Yozyovon district', role: 'General practice physician' },
      { range: '2020–2023', place: 'Tashkent Medical Academy', role: 'Cardiology master’s student' },
      { range: '2022–2023', place: 'RSHTYoIM · Tashkent emergency ambulance station', role: 'Mobile brigade physician (part-time)' },
      {
        range: '2023–present',
        place: 'FJSTI · Therapy (UASh) department',
        role: 'Assistant',
        current: true,
      },
    ],
    'xalilov-n-a': [
      { range: '2015–2021', place: 'Andijan State Medical Institute', role: 'General Medicine faculty — student' },
      {
        range: '2021–2024',
        place: 'Andijan SMI',
        role: 'Therapy master’s (by specialisations)',
        current: true,
      },
    ],
    'xojaeva-g-a': [
      { range: '1986–1994', place: 'Andijan State Medical Institute', role: 'General Medicine — student' },
      { range: '1994–1995', place: 'Fergana medical-sanitary unit', role: 'Internship' },
      { range: '1996–2018', place: 'Fergana region polyclinics and medical college', role: 'Therapist · lecturer · department head · director' },
      { range: '2020–present', place: 'FJSTI · Therapy (UASh) department', role: 'Assistant' },
      {
        range: '2025–present',
        place: 'FJSTI multi-specialty clinic',
        role: 'Ultrasound diagnostics physician',
        current: true,
      },
    ],
    'isaqjonova-m-n': [
      { range: '2015–2021', place: 'TMA, General Medicine faculty', role: 'Student' },
      { range: '2022–2024', place: 'TMA Termiz branch', role: 'Endocrinology clinical residency' },
      { range: '2022–2025', place: 'Surkhandarya dispensary · Termiz · TMA', role: 'Endocrinologist · assistant' },
      {
        range: '2025–present',
        place: 'FJSTI · Fergana Polyclinic No. 4',
        role: 'Trainee lecturer · endocrinologist',
        current: true,
      },
    ],
    'aliyeva-z-v': [
      { range: '2013–2019', place: 'ADTI', role: 'General Medicine — student' },
      { range: '2019–2022', place: 'Fergana polyclinic · ADTI', role: 'GP · endocrinology residency' },
      { range: '2023–2025', place: 'RIOMSM · Qibray · Izboskan', role: 'OB-GYN residency · practice' },
      {
        range: '2025–present',
        place: 'FJSTI · RIOMSM Fergana branch',
        role: 'Trainee lecturer · OB-GYN · clinic physician',
        current: true,
      },
    ],
    'shamsutdinova-g-b': [
      { range: '2008–2015', place: 'Andijan State Medical Institute', role: 'General Medicine — student' },
      { range: '2015–2018', place: 'Andijan · Fergana polyclinic', role: "GP · cardioreumatologist · master’s" },
      { range: '2019–2024', place: 'Tashkent CME · FJSTI', role: 'Retraining · department assistant' },
      {
        range: '2025–present',
        place: 'FJSTI',
        role: 'Head of Therapy (UASH) department · PhD',
        current: true,
      },
    ],
    'abdullayeva-t-y': [
      {
        range: '2024–present',
        place: 'Fergana City Polyclinic No. 6',
        role: 'Family physician',
        current: true,
      },
    ],
    'mamatalieva-z-a': [
      { range: '2009–2015', place: 'Kemerovo State Medical Academy', role: 'Medical faculty — student' },
      { range: '2017–2020', place: 'ADTI', role: "Master’s degree" },
      { range: '2020–2022', place: 'TMA Fergana branch · FJSTI', role: 'Assistant · nursing department' },
      { range: '2022', place: 'Ishonch private clinic', role: 'Neurologist' },
      {
        range: '2025–present',
        place: 'FJSTI',
        role: 'PhD · department assistant · clinic neurologist · EAN RRFS',
        current: true,
      },
    ],
    'bobojonov-s-s': [
      { range: '2010–2017', place: 'ADTI', role: 'General Medicine — student' },
      { range: '2017–2019', place: 'Khoraba emergency care · ADTI clinic', role: 'Urgent care · cardioreumatology residency' },
      { range: '2020–2023', place: 'FJSTI · TTA Fergana branch', role: 'Assistant · head of international office' },
      {
        range: '2023–present',
        place: 'FJSTI',
        role: 'Therapy sciences assistant · cardiologist',
        current: true,
      },
    ],
    'nosirov-m-m': [
      { range: '2015–2021', place: 'ADTI, Pediatrics faculty', role: 'Student' },
      { range: '2021–2023', place: 'Marhamat · Jalaquduq · ADTI', role: 'On-call physician · clinical residency' },
      { range: '2023–2025', place: 'RShTYIM · FJSTIKT', role: 'Admission diagnostics · nervous diseases neurologist' },
      {
        range: '2025–present',
        place: 'FJSTI',
        role: 'Head of Neurology · trainee lecturer',
        current: true,
      },
    ],
    'kojoeva-f-o': [
      { range: '2019–2025', place: 'FJSTI · Fergana Public Health Institute', role: 'General Medicine — student' },
      { range: '2024–present', place: 'Fergana City Polyclinic No. 8', role: 'Family physician' },
      { range: '2025–present', place: 'FJSTI Neurology department', role: 'Clinical residency' },
      {
        range: '2026–present',
        place: 'FJSTI admission & diagnostics department',
        role: 'Neurologist',
        current: true,
      },
    ],
  },
}

function buildRanges(years: number, currentLabel: string) {
  const end = new Date().getFullYear()
  const start = end - years
  const point1 = start + Math.max(1, Math.round(years * 0.24))
  const point2 = start + Math.max(2, Math.round(years * 0.53))
  const point3 = start + Math.max(3, Math.round(years * 0.78))

  return [
    `${start}–${Math.min(point1, end - 3)}`,
    `${Math.min(point1, end - 3)}–${Math.min(point2, end - 2)}`,
    `${Math.min(point2, end - 2)}–${Math.min(point3, end - 1)}`,
    `${Math.min(point3, end - 1)}–${currentLabel}`,
  ]
}

function languageLevel(language: string, ui: DossierLocale) {
  const normalized = language.toLocaleLowerCase()
  if (normalized.includes('english')) return 'B2'
  if (
    normalized.includes('o’zbek') ||
    normalized.includes("o’zbek") ||
    normalized.includes('uzbek') ||
    normalized.includes('узбек')
  ) {
    return ui.native
  }
  return ui.fluent
}

/**
 * Deterministic demo fallback until the CMS exposes an exact `career[]`.
 * Existing profile facts (education, languages, papers, studies and focuses)
 * stay source-driven; only workplace chronology is synthesized.
 */
export function getDoctorDossier(profile: DoctorProfile, lang: ContentLang): DoctorDossier {
  const ui = locales[lang]
  const view = profile.content[lang]
  const experienceYears = parseExperience(view.exp)
  const milestoneOverride = DOSSIER_MILESTONE_OVERRIDES[lang]?.[profile.slug]
  const ranges = buildRanges(experienceYears, ui.current)
  const places = [ui.training, ui.regionalCenter, ui.specialistCenter, ui.instituteClinic]
  const roles = [view.specialty, view.role, ui.seniorSpecialist, view.role]

  return {
    ui,
    experienceYears,
    milestones:
      milestoneOverride ??
      ranges.map((range, index) => ({
        range,
        place: places[index],
        role: roles[index],
        current: index === ranges.length - 1,
      })),
    languages: view.languages.map((language) => ({
      language,
      level: languageLevel(language, ui),
    })),
    academicTitle:
      profile.staffKind === 'professor'
        ? ui.academicProfessor
        : profile.staffKind === 'nurse'
          ? ui.academicNurse
          : ui.academicDoctor,
    badges: [
      ui.seniorGrade,
      ui.instituteClinic,
      ...(profile.staffKind === 'professor' ? [ui.clinicalMentor] : []),
    ],
    patientCount: new Intl.NumberFormat(
      lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'en-US',
    )
      .format(1200 + experienceYears * 43)
      .replace(lang === 'uz' ? /,/g : /$^/, ' '),
  }
}
