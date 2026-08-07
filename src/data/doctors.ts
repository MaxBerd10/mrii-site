import type { Lang } from '../i18n/types'
import { DOCTOR_PHOTOS } from './doctorPhotos'
import { getDoctorPortrait } from './doctorTurnMedia'

export type StaffKind = 'professor' | 'doctor' | 'nurse'

export type DoctorProfile = {
  slug: string
  photo: string
  color: string
  papers: number
  studies: number
  staffKind: StaffKind
  content: Record<
    Lang,
    {
      name: string
      role: string
      specialty: string
      exp: string
      about: string
      education: string[]
      focuses: string[]
      languages: string[]
    }
  >
}

const COLORS = ['#0EA5E9', '#6366F1', '#10B981', '#F59E0B'] as const

function inferStaffKind(uzName: string, explicit?: StaffKind): StaffKind {
  if (explicit) return explicit
  if (/^Prof\.|^Проф\./i.test(uzName.trim())) return 'professor'
  return 'doctor'
}

function profile(
  index: number,
  slug: string,
  uz: DoctorProfile['content']['uz'],
  ru: DoctorProfile['content']['ru'],
  en: DoctorProfile['content']['en'],
  kaa: DoctorProfile['content']['kaa'],
  papers: number,
  studies: number,
  staffKind?: StaffKind,
): DoctorProfile {
  return {
    slug,
    photo: getDoctorPortrait(slug, DOCTOR_PHOTOS[index % DOCTOR_PHOTOS.length]),
    color: COLORS[index % COLORS.length],
    papers,
    studies,
    staffKind: inferStaffKind(uz.name, staffKind),
    content: { uz, ru, en, kaa },
  }
}

const STATIC_DOCTOR_PROFILES: DoctorProfile[] = [
  profile(0, 'satvoldiyev-d-u', {
    name: 'Dr. Satvoldiyev D.U.',
    role: 'Kardiologiya bo’limi vrachi',
    specialty: 'Kardiologiya',
    exp: '5 yil tajriba',
    about:
      'Satvoldiyev Doniyor Umarovich — Farg’ona shahar 2-sonli shifoxonasining xo’jalik hisobidagi kardiologiya bo’limi vrachi (2021 yil 5 yanvardan). O’sh davlat tibbiyot instituti va kardiologiya ordinaturasi bitiruvchisi; yurak-qon tomir kasalliklarini diagnostika va davolash bilan shug’ullanadi.',
    education: [
      '2010 — O’sh davlat tibbiyot instituti (kunduzgi), «Davolash ishi»',
      'ADMI — kardiologiya ordinaturasi',
    ],
    focuses: [
      'Kardiologiya',
      'Yurak-qon tomir kasalliklari',
      'Statsionar kuzatuv',
      'Klinik diagnostika',
    ],
    languages: ["O’zbek", 'Русский'],
  }, {
    name: 'Др. Сатволдиев Д.У.',
    role: 'Врач кардиологического отделения',
    specialty: 'Кардиология',
    exp: '5 лет опыта',
    about:
      'Сатволдиев Донийор Умарович — врач бюджетного кардиологического отделения городской больницы №2 г. Ферганы (с 5 января 2021 г.). Окончил Osh ГМИ и ординатуру по кардиологии; занимается диагностикой и лечением сердечно-сосудистых заболеваний.',
    education: [
      '2010 — Osh государственный медицинский институт (дневное), «Лечебное дело»',
      'ADMI — ординатура по кардиологии',
    ],
    focuses: [
      'Кардиология',
      'Сердечно-сосудистые заболевания',
      'Стационарное наблюдение',
      'Клиническая диагностика',
    ],
    languages: ['Узбекский', 'Русский'],
  }, {
    name: 'Dr. Satvoldiyev D.U.',
    role: 'Cardiology department physician',
    specialty: 'Cardiology',
    exp: '5 years experience',
    about:
      'Satvoldiyev Doniyor Umarovich — physician at the budget-funded cardiology department of Fergana City Hospital No. 2 (since 5 January 2021). Graduate of Osh State Medical Institute and cardiology residency; focuses on cardiovascular diagnosis and treatment.',
    education: [
      '2010 — Osh State Medical Institute (full-time), General Medicine',
      'ADMI — cardiology residency',
    ],
    focuses: [
      'Cardiology',
      'Cardiovascular disease',
      'Inpatient care',
      'Clinical diagnostics',
    ],
    languages: ['Uzbek', 'Russian'],
  },   {
    name: "Dr. Satvoldiyev D.U.",
    role: "Kardiologiya bólimi shıpakeri",
    specialty: "Kardiologiya",
    exp: "5 jıl tájiriybe",
    about:
      "Satvoldiyev Doniyor Umarovich — Farg’ona qalasınıń 2-sanlı awrıwxanasınıń xojalıq esabındaǵı kardiologiya bóliminiń shıpakeri (2021-jıl 5-yanvardan). Osh mámleket medicina institutı hám kardiologiya ordinaturasınıń bitiriwshisi; júrek-qan tamır keselliklerin diagnostika hám emlew menen shuǵıllanadı.",
    education: [
      "2010 — Osh mámleket medicina institutı (kúndizgi), «Emlew isi»",
      "ADMI — kardiologiya ordinaturası",
    ],
    focuses: [
      "Kardiologiya",
      "Júrek-qan tamır keselligi",
      "Stacionar baqlaw",
      "Klinikalıq diagnostika",
    ],
    languages: ["Ózbek", "Rus"],
  }, 20, 4),

  profile(1, 'aliyeva-z-v', {
    name: 'Dr. Aliyeva Z.V.',
    role: 'Akusher-ginekolog · stajyor o’qituvchi',
    specialty: 'Akusherlik',
    exp: '7 yil tajriba',
    about:
      'Aliyeva Zarnigor Valijon qizi — FJSTI ko’p tarmoqli klinikasida akusher-ginekolog (2026 yil 1 apreldan). Akusher-ginekologiya kafedrasi stajyor o’qituvchisi; RIOMSM Farg’ona filialida akusher-ginekolog. Endokrinologiya va akusher-ginekologiya bo’yicha klinik ordinatura tajribasiga ega.',
    education: [
      '2019 — Andijon davlat tibbiyot instituti, umumiy amaliyot shifokori',
      '2020–2022 — ADTI klinik ordinatura, endokrinologiya',
      '2023–2025 — RIOMSM, akusher-ginekologiya klinik ordinaturasi',
    ],
    focuses: [
      'Akusher-ginekologiya',
      'Ona va bola salomatligi',
      'Klinik ordinatura',
      'Stajyor o’qituvchilik',
    ],
    languages: ["O’zbek", 'Русский', 'Deutsch'],
  }, {
    name: 'Др. Алиева З.В.',
    role: 'Акушер-гинеколог · стажёр-преподаватель',
    specialty: 'Акушерство',
    exp: '7 лет опыта',
    about:
      'Алиева Зарнигор Валижон кизи — акушер-гинеколог многопрофильной клиники FJSTI (с 1 апреля 2026 г.). Стажёр-преподаватель кафедры акушерства и гинекологии; врач филиала RIOMSM в Фергане. Клиническая ординатура по эндокринологии и акушерству-гинекологии.',
    education: [
      '2019 — Андижанский государственный медицинский институт, врач общей практики',
      '2020–2022 — ADTI, клиническая ординатура, эндокринология',
      '2023–2025 — RIOMSM, клиническая ординатура, акушерство-гинекология',
    ],
    focuses: [
      'Акушерство-гинекология',
      'Здоровье матери и ребёнка',
      'Клиническая ординатура',
      'Педагогическая практика',
    ],
    languages: ['Узбекский', 'Русский', 'Deutsch'],
  }, {
    name: 'Dr. Aliyeva Z.V.',
    role: 'OB-GYN · trainee lecturer',
    specialty: 'Obstetrics',
    exp: '7 years experience',
    about:
      'Aliyeva Zarnigor Valijon qizi — obstetrician-gynecologist at the FJSTI multidisciplinary clinic (since 1 April 2026). Trainee lecturer at the Obstetrics and Gynecology department; OB-GYN at the RIOMSM Fergana branch. Clinical residency in endocrinology and obstetrics-gynecology.',
    education: [
      '2019 — Andijan State Medical Institute, general practitioner',
      '2020–2022 — ADTI clinical residency, endocrinology',
      '2023–2025 — RIOMSM clinical residency, obstetrics-gynecology',
    ],
    focuses: [
      'Obstetrics and gynecology',
      'Maternal and child health',
      'Clinical residency',
      'Trainee teaching',
    ],
    languages: ['Uzbek', 'Russian', 'German'],
  },   {
    name: "Dr. Aliyeva Z.V.",
    role: "Akusher-ginekolog · stajyor oqıtıwshı",
    specialty: "Akusherlik",
    exp: "7 jıl tájiriybe",
    about:
      "Aliyeva Zarnigor Valijon qızı — FJSTI kóp tarmaqlı klinikasında akusher-ginekolog (2026-jıl 1-apreldan). Akusher-ginekologiya kafedrası stajyor oqıtıwshısı; RIOMSM Farg’ona filialında akusher-ginekolog. Endokrinologiya hám akusher-ginekologiya boyınsha klinikalıq ordinatura tájiriybesine iye.",
    education: [
      "2019 — Andijon mámleket medicina institutı, ulıwma ámeliyat shıpakeri",
      "2020–2022 — ADTI klinikalıq ordinaturası, endokrinologiya",
      "2023–2025 — RIOMSM, akusher-ginekologiya klinikalıq ordinaturası",
    ],
    focuses: [
      "Akusher-ginekologiya",
      "Ana hám bala salamatlıǵı",
      "Klinikalıq ordinatura",
      "Stajyor oqıtıwshılıq",
    ],
    languages: ["Ózbek", "Rus", "Deutsch"],
  }, 12, 2, 'professor'),

  profile(2, 'mamatalieva-z-a', {
    name: 'Dr. Mamatalieva Z.A.',
    role: 'PhD · nevrologiya va psixiatriya kafedrasi assistenti',
    specialty: 'Nevrologiya',
    exp: 'PhD · 11 yil tajriba',
    about:
      'Mamatalieva Janona Alimjanovna — PhD, FJSTI «Nevrologiya va psixiatriya» kafedrasi assistenti (2025 yil oktyabrdan). FJSTI klinikasida nevrolog (2026 yil apreldan). Yevropa nevrologlar akademiyasi (EAN RRFS) rezidenti (2026 yildan). Nevrolog, tadqiqotchi-pedagog.',
    education: [
      '2009–2015 — Kemerovo davlat tibbiyot akademiyasi',
      '2017–2020 — ADTI, magistratura',
      '2025–2026 — FJSTI, bazaviy doktorantura',
      'PhD — ilmiy daraja',
    ],
    focuses: [
      'Nevrologiya',
      'Psixiatriya',
      'Ilmiy-tadqiqot',
      'Klinik amaliyot',
    ],
    languages: ["O’zbek", 'Русский', 'English'],
  }, {
    name: 'Др. Маматалиева Ж.А.',
    role: 'PhD · ассистент кафедры «Неврология и психиатрия»',
    specialty: 'Неврология',
    exp: 'PhD · 11 лет опыта',
    about:
      'Мамatalieva Жanona Alimzhanovna — PhD, ассистент кафедры «Неврология и психиатрия» FJSTI (с октября 2025 г.). Врач-невролог клиники (с апреля 2026 г.). Резидент EAN RRFS Европейской академии неврологов (с января 2026 г.). Невrolog, исследователь-педагог.',
    education: [
      '2009–2015 — Кемеровская государственная медицинская академия',
      '2017–2020 — ADTI, магистратура',
      '2025–2026 — Ферганский медицинский институт общественного здоровья, базовая докторантура',
      'PhD — учёная степень',
    ],
    focuses: [
      'Неврология',
      'Психиатрия',
      'Научные исследования',
      'Клиническая практика',
    ],
    languages: ['Узбекский', 'Русский', 'English'],
  }, {
    name: 'Dr. Mamatalieva Z.A.',
    role: 'PhD · assistant, Neurology & Psychiatry department',
    specialty: 'Neurology',
    exp: 'PhD · 11 years experience',
    about:
      'Mamatalieva Zhanona Alimzhanovna — PhD, assistant at the FJSTI Neurology and Psychiatry department (since October 2025). Neurologist at the FJSTI clinic (since April 2026). EAN RRFS resident of the European Academy of Neurology (since January 2026). Neurologist, researcher-educator.',
    education: [
      '2009–2015 — Kemerovo State Medical Academy',
      '2017–2020 — ADTI, master’s degree',
      '2025–2026 — Fergana Public Health Medical Institute, basic doctorate',
      'PhD',
    ],
    focuses: [
      'Neurology',
      'Psychiatry',
      'Research',
      'Clinical practice',
    ],
    languages: ['Uzbek', 'Russian', 'English'],
  },   {
    name: "Dr. Mamatalieva Z.A.",
    role: "PhD · nevrologiya hám psixiatriya kafedrası assistenti",
    specialty: "Nevrologiya",
    exp: "PhD · 11 jıl tájiriybe",
    about:
      "Mamatalieva Janona Alimjanovna — PhD, FJSTI «Nevrologiya hám psixiatriya» kafedrası assistenti (2025-jıl oktyabrdan). FJSTI klinikasında nevrolog (2026-jıl apreldan). Evropa nevrologlar akademiyası (EAN RRFS) rezidenti (2026-jıldan). Nevrolog, izertlewshi-pedagog.",
    education: [
      "2009–2015 — Kemerovo mámleket medicina akademiyası",
      "2017–2020 — ADTI, magistratura",
      "2025–2026 — FJSTI, baza doktoranturası",
      "PhD — ilimiy dáreje",
    ],
    focuses: [
      "Nevrologiya",
      "Psixiatriya",
      "Ilimiy-izertlew",
      "Klinikalıq ámeliyat",
    ],
    languages: ["Ózbek", "Rus", "Ingliz"],
  }, 32, 8, 'professor'),

  profile(3, 'abdullayeva-t-y', {
    name: 'Dr. Abdullayeva T.Y.',
    role: 'Oila shifokori',
    specialty: 'Terapiya',
    exp: '2 yil amaliyot',
    about:
      'Abdullayeva Tatyana Yusupovna — Farg’ona shahar 6-sonli oilaviy poliklinikasining oila shifokori (2024 yil 2 oktyabrdan). «Davolash ishi» yo’nalishida oliy ta’lim olmoqda; birlamchi tibbiy-yordam va oila bemorlarini kuzatish bilan shug’ullanadi.',
    education: [
      'Oliy ta’lim (kunduzgi) — «Davolash ishi» (o’qish davom etmoqda)',
    ],
    focuses: [
      'Oila shifokorligi',
      'Birlamchi tibbiy yordam',
      'Profilaktik ko’riklar',
      'Surunkali kasalliklarni kuzatish',
    ],
    languages: ['Русский', 'English'],
  }, {
    name: 'Др. Абдуллаева Т.Ю.',
    role: 'Семейный врач',
    specialty: 'Терапия',
    exp: '2 года практики',
    about:
      'Абдуллаева Татьяна Юсуповна — семейный врач поликлиники №6 г. Ферганы (с 2 октября 2024 г.). Получает высшее образование по специальности «Лечебное дело»; ведёт первичный приём и наблюдение семей.',
    education: [
      'Высшее образование (дневное) — «Лечебное дело» (обучение продолжается)',
    ],
    focuses: [
      'Семейная медицина',
      'Первичная медико-санитарная помощь',
      'Профилактические осмотры',
      'Наблюдение хронических заболеваний',
    ],
    languages: ['Русский', 'English'],
  }, {
    name: 'Dr. Abdullayeva T.Y.',
    role: 'Family physician',
    specialty: 'Therapy',
    exp: '2 years practice',
    about:
      'Abdullayeva Tatyana Yusupovna — family physician at Fergana City Polyclinic No. 6 (since 2 October 2024). Pursuing a General Medicine degree; provides primary care and family follow-up.',
    education: [
      'Higher education (full-time) — General Medicine (in progress)',
    ],
    focuses: [
      'Family medicine',
      'Primary care',
      'Preventive checkups',
      'Chronic disease follow-up',
    ],
    languages: ['Russian', 'English'],
  },   {
    name: "Dr. Abdullayeva T.Y.",
    role: "Shańaraq shıpakeri",
    specialty: "Terapiya",
    exp: "2 jıl ámeliyat",
    about:
      "Abdullayeva Tatyana Yusupovna — Farg’ona qalası 6-sanlı shańaraq poliklinikasınıń shańaraq shıpakeri (2024-jıl 2-oktyabrdan). «Emlew isi» baǵdarında joqarı bilim alıp atır; birinshi medicinalıq járdem hám shańaraq bemarların baqlaw menen shuǵıllanadı.",
    education: [
      "Joqarı bilim (kúndizgi) — «Emlew isi» (oqıw dawam etpekte)",
    ],
    focuses: [
      "Shańaraq shıpakerligi",
      "Birinshi medicinalıq járdem",
      "Profilaktikalıq kórikler",
      "Uzaq múddetli kesellikler baqlawı",
    ],
    languages: ["Rus", "Ingliz"],
  }, 8, 1),
]

// Generate remaining profiles from photo index + generic templates so all 20 have pages
const REST: Array<{
  slug: string
  uzName: string
  ruName: string
  roleUz: string
  roleRu: string
  roleEn: string
  specUz: string
  specRu: string
  specEn: string
  papers: number
  studies: number
  staffKind?: StaffKind
}> = [
  { slug: 'alimova-d-k', uzName: 'Dr. Alimova D.K.', ruName: 'Др. Алимова Д.К.', roleUz: 'Nevrolog', roleRu: 'Невролог', roleEn: 'Neurologist', specUz: 'Nevrologiya', specRu: 'Неврология', specEn: 'Neurology', papers: 17, studies: 2 },
  { slug: 'xojaeva-g-a', uzName: 'Dr. Xo’jaeva G.A.', ruName: 'Др. Ходжаева Г.А.', roleUz: 'UTT vrachi · Terapiya (UASh) kafedrasi assistenti', roleRu: 'Врач УЗД · ассистент кафедры терапии (UASh)', roleEn: 'Ultrasound physician · Therapy (UASh) assistant', specUz: 'Ultratovush diagnostikasi', specRu: 'УЗ-диагностика', specEn: 'Ultrasound diagnostics', papers: 10, studies: 2 },
  { slug: 'mirzayeva-a-n', uzName: 'Dr. Mirzayeva A.N.', ruName: 'Др. Мирзаева А.Н.', roleUz: 'Dermatolog', roleRu: 'Дерматолог', roleEn: 'Dermatologist', specUz: 'Dermatologiya', specRu: 'Дерматология', specEn: 'Dermatology', papers: 11, studies: 1 },
  { slug: 'hamidova-f-t', uzName: 'Dr. Hamidova F.T.', ruName: 'Др. Хамидова Ф.Т.', roleUz: 'LOR', roleRu: 'ЛОР', roleEn: 'ENT', specUz: 'Otorinolaringologiya', specRu: 'Оториноларингология', specEn: 'Otolaryngology', papers: 16, studies: 3 },
  { slug: 'sobirova-n-m', uzName: 'Dr. Sobirova N.M.', ruName: 'Др. Собирова Н.М.', roleUz: 'Akusher-ginekolog', roleRu: 'Акушер-гинеколог', roleEn: 'OB-GYN', specUz: 'Akusherlik', specRu: 'Акушерство', specEn: 'Obstetrics', papers: 33, studies: 7 },
  { slug: 'jorayeva-s-a', uzName: 'Hamshira Jo’rayeva S.A.', ruName: 'Медсестра Жураева С.А.', roleUz: 'Bosh hamshira', roleRu: 'Старшая медсестра', roleEn: 'Head nurse', specUz: 'Pediatriya', specRu: 'Педиатрия', specEn: 'Pediatrics', papers: 9, studies: 0, staffKind: 'nurse' },
  { slug: 'rasulova-d-i', uzName: 'Dr. Rasulova D.I.', ruName: 'Др. Расулова Д.И.', roleUz: 'Nevrolog', roleRu: 'Невролог', roleEn: 'Neurologist', specUz: 'Nevrologiya', specRu: 'Неврология', specEn: 'Neurology', papers: 14, studies: 2 },
  { slug: 'toxtayeva-h-r', uzName: 'Dr. To’xtayeva H.R.', ruName: 'Др. Тухтаева Х.Р.', roleUz: 'Terapevt', roleRu: 'Терапевт', roleEn: 'General practitioner', specUz: 'Terapiya', specRu: 'Терапия', specEn: 'Therapy', papers: 20, studies: 3 },
  { slug: 'karimova-o-b', uzName: 'Dr. Karimova O.B.', ruName: 'Др. Каримова О.Б.', roleUz: 'Endokrinolog', roleRu: 'Эндокринолог', roleEn: 'Endocrinologist', specUz: 'Endokrinologiya', specRu: 'Эндокринология', specEn: 'Endocrinology', papers: 21, studies: 4 },
  { slug: 'yusupov-b-t', uzName: 'Dr. Yusupov B.T.', ruName: 'Др. Юсупов Б.Т.', roleUz: 'Pulmonolog', roleRu: 'Пульмонолог', roleEn: 'Pulmonologist', specUz: 'Pulmonologiya', specRu: 'Пульмонология', specEn: 'Pulmonology', papers: 31, studies: 6 },
  { slug: 'nigmatova-s-a', uzName: 'Nigmatova S.A.', ruName: 'Нигматова С.А.', roleUz: 'Kadrlar bo’limi', roleRu: 'Отдел кадров', roleEn: 'Human resources', specUz: 'Kadrlar bo’limi', specRu: 'Отдел кадров', specEn: 'Human resources', papers: 4, studies: 0, staffKind: 'nurse' },
  { slug: 'boboyeva-m-r', uzName: 'Hamshira Boboyeva M.R.', ruName: 'Медсестра Бобоева М.Р.', roleUz: 'Procedura hamshirasi', roleRu: 'Процедурная медсестра', roleEn: 'Procedure nurse', specUz: 'Procedura', specRu: 'Процедурный кабинет', specEn: 'Procedures', papers: 3, studies: 0, staffKind: 'nurse' },
  { slug: 'sharipova-d-a', uzName: 'Hamshira Sharipova D.A.', ruName: 'Медсестра Шарипова Д.А.', roleUz: 'Operatsion hamshira', roleRu: 'Операционная медсестра', roleEn: 'Operating nurse', specUz: 'Jarrohlik', specRu: 'Хирургия', specEn: 'Surgery', papers: 5, studies: 0, staffKind: 'nurse' },
  { slug: 'madaminova-l-k', uzName: 'Hamshira Madaminova L.K.', ruName: 'Медсестра Мадаминова Л.К.', roleUz: 'Bosh hamshira', roleRu: 'Старшая медсестра', roleEn: 'Head nurse', specUz: 'Terapiya', specRu: 'Терапия', specEn: 'Therapy', papers: 6, studies: 0, staffKind: 'nurse' },
  { slug: 'tursunov-a-r', uzName: 'Prof. Tursunov A.R.', ruName: 'Проф. Турсунов А.Р.', roleUz: 'Jarroh', roleRu: 'Хирург', roleEn: 'Surgeon', specUz: 'Jarrohlik', specRu: 'Хирургия', specEn: 'Surgery', papers: 48, studies: 9, staffKind: 'professor' },
  { slug: 'soliyev-m-h', uzName: 'Dr. Soliyev M.H.', ruName: 'Др. Солиев М.Х.', roleUz: 'Anesteziolog', roleRu: 'Анестезиолог', roleEn: 'Anesthesiologist', specUz: 'Anesteziologiya', specRu: 'Анестезиология', specEn: 'Anesthesiology', papers: 27, studies: 5 },
  { slug: 'xolmatov-a-s', uzName: 'Dr. Xolmatov A.S.', ruName: 'Др. Холматов А.С.', roleUz: 'Ortoped', roleRu: 'Ортопед', roleEn: 'Orthopedist', specUz: 'Ortopediya', specRu: 'Ортопедия', specEn: 'Orthopedics', papers: 21, studies: 4 },
]

for (let i = 0; i < REST.length; i++) {
  const r = REST[i]
  const idx = i + 4
  STATIC_DOCTOR_PROFILES.push(
    profile(idx, r.slug, {
      name: r.uzName,
      role: r.roleUz,
      specialty: r.specUz,
      exp: `${10 + (i % 12)} yil tajriba`,
      about: `${r.uzName} — ${r.specUz.toLowerCase()} yo’nalishida bemorlarga klinik yordam ko’rsatadi. Aniq diagnostika, individual yondashuv va doimiy kuzatuvga e’tibor beradi.`,
      education: ['Tibbiyot oliy ta’lim muassasasi', `${r.specUz} bo’yicha klinik tayyorgarlik`],
      focuses: ['Diagnostika', 'Davolash rejasi', 'Kuzatuv'],
      languages: ["O’zbek", 'Русский'],
    }, {
      name: r.ruName,
      role: r.roleRu,
      specialty: r.specRu,
      exp: `${10 + (i % 12)} лет опыта`,
      about: `${r.ruName} оказывает клиническую помощь по направлению «${r.specRu}». Внимание к диагностике, индивидуальному плану и наблюдению.`,
      education: ['Высшее медицинское образование', `Клиническая подготовка — ${r.specRu}`],
      focuses: ['Диагностика', 'План лечения', 'Наблюдение'],
      languages: ['Узбекский', 'Русский'],
    }, {
      name: r.uzName,
      role: r.roleEn,
      specialty: r.specEn,
      exp: `${10 + (i % 12)} years experience`,
      about: `${r.uzName} provides clinical care in ${r.specEn.toLowerCase()}, with focus on diagnostics, personal plans, and follow-up.`,
      education: ['Medical university degree', `Clinical training — ${r.specEn}`],
      focuses: ['Diagnostics', 'Treatment planning', 'Follow-up'],
      languages: ['Uzbek', 'Russian'],
    }, {
      name: r.uzName,
      role: r.roleUz,
      specialty: r.specUz,
      exp: `${10 + (i % 12)} jıl tájiriybe`,
      about: `${r.uzName} — ${r.specUz.toLowerCase()} baǵdarında bemarlarǵa klinikalıq járdem kórsetedi. Anıq diagnostika, jeke jantasıw hám turaqlı baqlawǵa itibar beredi.`,
      education: ['Medicina joqarı oqıw orны', `${r.specUz} boyınsha klinikalıq taярlıq`],
      focuses: ['Diagnostika', 'Emlew jobası', 'Baqlaw'],
      languages: ['Ózbek', 'Rus'],
    }, r.papers, r.studies, r.staffKind),
  )
}

{
  const xojaevaIndex = STATIC_DOCTOR_PROFILES.findIndex((p) => p.slug === 'xojaeva-g-a')
  if (xojaevaIndex >= 0) {
    STATIC_DOCTOR_PROFILES[xojaevaIndex] = profile(5, 'xojaeva-g-a', {
      name: 'Dr. Xo’jaeva G.A.',
      role: 'UTT vrachi · Terapiya (UASh) kafedrasi assistenti',
      specialty: 'Ultratovush diagnostikasi',
      exp: '32 yil tajriba',
      about:
        'Xo’jaeva Gulnora Abdubannonovna — Farg’ona jamoat salomatligi tibbiyot instituti ko’p tarmoqli klinikasida ultratovush diagnostikasi vrachi (2025 yildan) va Terapiya yo’nalishidagi fanlar (UASh) kafedrasi assistenti (2020 yildan). 1994 yilda Andijon davlat tibbiyot institutini tamomlagan; terapevt, o’qituvchi, tibbiyot kolleji bo’lim boshlig’i va direktori sifatida uzoq yillik amaliy tajribaga ega.',
      education: [
        '1994 — Andijon davlat tibbiyot instituti (kunduzgi), «Davolash ishi»',
        '1994–1995 — Farg’ona tibbiy-sanitariya qismi internaturasi',
      ],
      focuses: [
        'Ultratovush diagnostikasi',
        'Terapiya (UASh)',
        'Ichki kasalliklar',
        'Ambulator va klinik yordam',
      ],
      languages: ['O’zbek', 'Русский'],
    }, {
      name: 'Др. Ходжаева Г.А.',
      role: 'Врач УЗД · ассистент кафедры терапии (UASh)',
      specialty: 'УЗ-диагностика',
      exp: '32 года опыта',
      about:
        'Ходжаева Гулнора Абдубанноновна — врач ультразвуковой диагностики многопрофильной клиники FJSTI (с 2025 г.) и ассистент кафедры терапии (UASh) института (с 2020 г.). Окончила Андижанский государственный медицинский институт в 1994 г.; имеет многолетний опыт работы терапевтом, преподавателем, зав. отделением и директором медицинского колледжа.',
      education: [
        '1994 — Андижанский государственный медицинский институт (дневное), «Лечебное дело»',
        '1994–1995 — Интернатура, Ферганский медико-санитарный отряд',
      ],
      focuses: [
        'УЗ-диагностика',
        'Терапия (UASh)',
        'Внутренние болезни',
        'Амбулаторная и клиническая помощь',
      ],
      languages: ['Узбекский', 'Русский'],
    }, {
      name: 'Dr. Xo’jaeva G.A.',
      role: 'Ultrasound physician · Therapy (UASh) department assistant',
      specialty: 'Ultrasound diagnostics',
      exp: '32 years experience',
      about:
        'Xo’jaeva Gulnora Abdubannonovna — ultrasound diagnostics physician at the FJSTI multi-specialty clinic (since 2025) and assistant at the Therapy (UASh) department (since 2020). Graduated from Andijan State Medical Institute in 1994; long clinical experience as a therapist, lecturer, department head, and medical college director.',
      education: [
        '1994 — Andijan State Medical Institute (full-time), General Medicine',
        '1994–1995 — Internship, Fergana medical-sanitary unit',
      ],
      focuses: [
        'Ultrasound diagnostics',
        'Therapy (UASh)',
        'Internal medicine',
        'Outpatient and clinical care',
      ],
      languages: ['Uzbek', 'Russian'],
    },     {
      name: "Dr. Xo’jaeva G.A.",
      role: "UTT shıpakeri · Terapiya (UASh) kafedrası assistenti",
      specialty: "Ultrадыбыс diagnostikası",
      exp: "32 jıl tájiriybe",
      about:
        "Xo’jaeva Gulnora Abdubannonovna — Farg’ona jámiyet salamatlıǵı medicina institutınıń kóp tarmaqlı klinikasında ultrадыбыс diagnostikası shıpakeri (2025-jıldan) hám Terapiya baǵdarındaǵı pánler (UASh) kafedrası assistenti (2020-jıldan). 1994-jılda Andijon mámleket medicina institutın tamamlaǵan; terapevt, oqıtıwshı, medicina kolleji bólim baslıǵı hám direktorı sıpatında uzaq jıllıq ámeliy tájiriybege iye.",
      education: [
        "1994 — Andijon mámleket medicina institutı (kúndizgi), «Emlew isi»",
        "1994–1995 — Farg’ona medicina-sanitariya bólimi internaturası",
      ],
      focuses: [
        "Ultrадыбыс diagnostikası",
        "Terapiya (UASh)",
        "Ishki kesellikler",
        "Ambulator hám klinikalıq járdem",
      ],
      languages: ["Ózbek", "Rus"],
    }, 10, 2)
  }
}

{
  const nigmatovaIndex = STATIC_DOCTOR_PROFILES.findIndex((p) => p.slug === 'nigmatova-s-a')
  if (nigmatovaIndex >= 0) {
    STATIC_DOCTOR_PROFILES[nigmatovaIndex] = profile(14, 'nigmatova-s-a', {
      name: 'Nigmatova S.A.',
      role: 'Kadrlar bo’limi',
      specialty: 'Kadrlar bo’limi',
      exp: '14 yil tajriba',
      about:
        'Nigmatova S.A. — FJSTI ko’p tarmoqli klinikasining Kadrlar bo’limida ishlaydi. Xodimlar hujjatlari, mehnat intizomi va kadrlar bilan bog’liq tashkiliy jarayonlarda klinika jamoasiga yordam beradi.',
      education: ['Tibbiyot kolleji', 'Kadrlar bo’limi amaliyoti'],
      focuses: ['Kadrlar hujjatlari', 'Mehnat intizomi', 'Tashkiliy yordam', 'Klinika jamoasi'],
      languages: ["O’zbek", 'Русский'],
    }, {
      name: 'Нигматова С.А.',
      role: 'Отдел кадров',
      specialty: 'Отдел кадров',
      exp: '14 лет опыта',
      about:
        'Нигматова С.А. работает в отделе кадров многопрофильной клиники FJSTI. Сопровождает кадровую документацию, трудовую дисциплину и организационные процессы, связанные с персоналом клиники.',
      education: ['Медицинский колледж', 'Практика в отделе кадров'],
      focuses: ['Кадровая документация', 'Трудовая дисциплина', 'Организационная поддержка', 'Команда клиники'],
      languages: ['Узбекский', 'Русский'],
    }, {
      name: 'Nigmatova S.A.',
      role: 'Human resources',
      specialty: 'Human resources',
      exp: '14 years experience',
      about:
        'Nigmatova S.A. works in the HR department of the FJSTI multi-specialty clinic. Supports personnel records, workplace compliance, and organizational processes for the clinical team.',
      education: ['Medical college', 'HR department practice'],
      focuses: ['Personnel records', 'Workplace compliance', 'Organizational support', 'Clinical team'],
      languages: ['Uzbek', 'Russian'],
    },     {
      name: "Nigmatova S.A.",
      role: "Kadrlar bólimi",
      specialty: "Kadrlar bólimi",
      exp: "14 jıl tájiriybe",
      about:
        "Nigmatova S.A. — FJSTI kóp tarmaqlı klinikasınıń Kadrlar bóliminde isleydi. Xızmetkerler hújjetleri, miynet tártibi hám kadrlar menen baylanıslı shólkemlestiriw processlerinde klinika jamaatına járdem beredi.",
      education: [
        "Medicina kolleji",
        "Kadrlar bólimi ámeliyatı",
      ],
      focuses: [
        "Kadrlar hújjetleri",
        "Miynet tártibi",
        "Shólkemlestiriw járdemi",
        "Klinika jamaatı",
      ],
      languages: ["Ózbek", "Rus"],
    }, 4, 0, 'nurse')
  }
}

STATIC_DOCTOR_PROFILES.push(
  profile(33, 'xaydaraliyev-s-a', {
    name: 'Dr. Xaydaraliyev S.A.',
    role: 'Qabul-diagnostika bo’limi mudiri · urolog · UTT shifokor',
    specialty: 'Urologiya',
    exp: '15 yil tajriba',
    about:
      'Xaydaraliyev Suxrobjon Abdulnasirovich — ko’p tarmoqli klinikaning Qabul-diagnostika bo’limi mudiri. Urolog shifokor, bolalar urolog-andrologi va ultratovush diagnostikasi shifokori. Umumiy tibbiy ish staji — 15 yil; urologiya bo’yicha — 15 yil.',
    education: [
      '2010 — I.K. Axunbayev nomidagi Qirg’iz davlat tibbiyot akademiyasi, «Davolash ishi»',
      '2011–2012 — Qirg’iz DTQTM va MO Janubiy filiali (O’sh), «Urologiya» internaturasi',
      '2017–2019 — Qirg’iz DTQTM va MO Janubiy filiali (O’sh), «Urologiya» ordinaturasi',
      '2019 — Omsk, «Akademiya dopolnitelnogo obrazovaniya», «Ultratovush diagnostikasi»',
      '2019 — «Professional» NKT, «Bolalar urologiyasi-andrologiyasi»',
      '2025 — Moskva RUKTA, «Ultratovush diagnostikasi» malakasini tasdiqlash',
      '2025 — Moskva Urologiya ilmiy-tadqiqot instituti, urologiya malaka oshirish kursi',
    ],
    focuses: [
      'Urologiya',
      'Bolalar urologiyasi-andrologiyasi',
      'Ultratovush diagnostikasi',
      'Qabul-diagnostika bo’limi',
    ],
    languages: ["O’zbek", 'Русский'],
  }, {
    name: 'Др. Хайдаралиев С.А.',
    role: 'Зав. приёмно-диагностическим отделением · уролог · врач УЗД',
    specialty: 'Урология',
    exp: '15 лет опыта',
    about:
      'Хайдаралиев Сухробжон Абдулнасирович — заведующий приёмно-диагностическим отделением многопрофильной клиники. Врач-уролог, детский уролог-андролог и врач ультразвуковой диагностики. Общий медицинский стаж — 15 лет; в урологии — 15 лет.',
    education: [
      '2010 — Кырgyzская государственная медицинская академия им. И.К. Ахунбаева, «Лечебное дело»',
      '2011–2012 — Интернатура «Урология», южный филиал КГМИППВ (г. Ош)',
      '2017–2019 — Ординатура «Урология», южный филиал КГМИППВ (г. Ош)',
      '2019 — Омск, «Академия дополнительного образования», «УЗ-диагностика»',
      '2019 — НОУ «Professional», «Детская урология-андрология»',
      '2025 — Москва, РМАНПО, подтверждение квалификации «УЗ-диагностика»',
      '2025 — Московский НИИ урологии, курсы повышения квалификации по урологии',
    ],
    focuses: [
      'Урология',
      'Детская урология-андрология',
      'УЗ-диагностика',
      'Приёмно-диагностическое отделение',
    ],
    languages: ['Узбекский', 'Русский'],
  }, {
    name: 'Dr. Khaydaraliyev S.A.',
    role: 'Head of admission & diagnostics · urologist · ultrasound physician',
    specialty: 'Urology',
    exp: '15 years experience',
    about:
      'Khaydaraliyev Suxrobjon Abdulnasirovich — head of the admission and diagnostics department. Urologist, pediatric urologist-andrologist, and ultrasound diagnostics physician. Total medical experience — 15 years; in urology — 15 years.',
    education: [
      '2010 — I.K. Akhunbaev Kyrgyz State Medical Academy, General Medicine',
      '2011–2012 — Urology internship, Kyrgyz CME southern branch (Osh)',
      '2017–2019 — Urology residency, Kyrgyz CME southern branch (Osh)',
      '2019 — Omsk Academy of Additional Education, Ultrasound diagnostics',
      '2019 — Professional NCO, Pediatric urology and andrology',
      '2025 — Moscow RMANPO, Ultrasound diagnostics credential renewal',
      '2025 — Moscow Research Institute of Urology, advanced urology course',
    ],
    focuses: [
      'Urology',
      'Pediatric urology and andrology',
      'Ultrasound diagnostics',
      'Admission and diagnostics department',
    ],
    languages: ['Uzbek', 'Russian'],
  },   {
    name: "Dr. Xaydaraliyev S.A.",
    role: "Qabıllaw-diagnostika bólimi baslıǵı · urolog · UTT shıpakeri",
    specialty: "Urologiya",
    exp: "15 jıl tájiriybe",
    about:
      "Xaydaraliyev Suxrobjon Abdulnasirovich — kóp tarmaqlı klinikanıń Qabıllaw-diagnostika bólimi baslıǵı. Urolog shıpaker, balalar urolog-andrologı hám ultrадыбыс diagnostikası shıpakeri. Ulıwma medicinalıq staj — 15 jıl; urologiya boyınsha — 15 jıl.",
    education: [
      "2010 — I.K. Axunbaev atındaǵı Qırǵız mámleket medicina akademiyası, «Emlew isi»",
      "2011–2012 — Qırǵız DTQTM va MO Qublа filialı (Osh), «Urologiya» internaturası",
      "2017–2019 — Qırǵız DTQTM va MO Qublа filialı (Osh), «Urologiya» ordinaturası",
      "2019 — Omsk, «Qosımsha bilimlendiriw akademiyası», «Ultrадыбыс diagnostikası»",
      "2019 — «Professional» NKT, «Balalar urologiyası-andrologiyası»",
      "2025 — Moskva RUKTA, «Ultrадыбыс diagnostikası» maliykesin tastıyıqlaw",
      "2025 — Moskva Urologiya ilimiy-izertlew institutı, urologiya boyınsha maliyke asırıw kursı",
    ],
    focuses: [
      "Urologiya",
      "Balalar urologiyası-andrologiyası",
      "Ultrадыбыs diagnostikası",
      "Qabıllaw-diagnostika bólimi",
    ],
    languages: ["Ózbek", "Rus"],
  }, 29, 6),
)

STATIC_DOCTOR_PROFILES.push(
  profile(34, 'azimova-g-r', {
    name: 'Dr. Azimova G.R.',
    role: 'Umumiy xirurgiya kafedrasi katta o’qituvchisi · PhD',
    specialty: 'Jarrohlik',
    exp: '17 yil tajriba',
    about:
      'Azimova Gulnoza Ravshanovna — FJSTI Umumiy xirurgiya kafedrasi katta o’qituvchisi, PhD. 2008 yilda Andijon davlat tibbiyot institutini tamomlagan. Birlamchi tibbiy yordam, akusher-ginekologiya va xirurgiya yo’nalishlarida amaliy ish tajribasi; hozir klinik va o’quv faoliyatini birlashtiradi.',
    education: [
      '2008 — Andijon davlat tibbiyot instituti (kunduzgi), «Davolash ishi»',
      '2018–2019 — R.F. Omsk tibbiyot akademiyasi, xirurgiya ordinaturasi',
      '2019 — TTA, xirurgiya ordinaturasi',
      'PhD — ilmiy daraja',
    ],
    focuses: [
      'Umumiy xirurgiya',
      'Klinik amaliyot',
      'O’quv-metodik ish',
      'Akusher-ginekologiya tajribasi',
    ],
    languages: ["O’zbek", 'Русский'],
  }, {
    name: 'Др. Азимова Г.Р.',
    role: 'Старший преподаватель кафедры общей хирургии · PhD',
    specialty: 'Хирургия',
    exp: '17 лет опыта',
    about:
      'Азимова Гульноза Равшановна — старший преподаватель кафедры общей хирургии FJSTI, PhD. Окончила Андижанский государственный медицинский институт в 2008 году. Опыт работы в первичном звене, акушерстве-гинекологии и хирургии; совмещает клиническую и учебную деятельность.',
    education: [
      '2008 — Андижанский государственный медицинский институт (дневное), «Лечебное дело»',
      '2018–2019 — Омская медицинская академия (РФ), ординатура по хирургии',
      '2019 — ТТА, ординатура по хирургии',
      'PhD — учёная степень',
    ],
    focuses: [
      'Общая хирургия',
      'Клиническая практика',
      'Учебно-методическая работа',
      'Опыт в акушерстве-гинекологии',
    ],
    languages: ['Узбекский', 'Русский'],
  }, {
    name: 'Dr. Azimova G.R.',
    role: 'Senior lecturer, General Surgery · PhD',
    specialty: 'Surgery',
    exp: '17 years experience',
    about:
      'Azimova Gulnoza Ravshanovna — senior lecturer at the FJSTI General Surgery department, PhD. Graduated from Andijan State Medical Institute in 2008. Experience in primary care, obstetrics-gynecology, and surgery; combines clinical and academic work.',
    education: [
      '2008 — Andijan State Medical Institute (full-time), General Medicine',
      '2018–2019 — Omsk Medical Academy (Russia), surgery residency',
      '2019 — TTA, surgery residency',
      'PhD',
    ],
    focuses: [
      'General surgery',
      'Clinical practice',
      'Academic teaching',
      'Obstetrics-gynecology background',
    ],
    languages: ['Uzbek', 'Russian'],
  },   {
    name: "Dr. Azimova G.R.",
    role: "Ulıwma xirurgiya kafedrası úlken oqıtıwshısı · PhD",
    specialty: "Jarrаhlıq",
    exp: "17 jıl tájiriybe",
    about:
      "Azimova Gulnoza Ravshanovna — FJSTI Ulıwma xirurgiya kafedrasınıń úlken oqıtıwshısı, PhD. 2008-jılda Andijon mámleket medicina institutın tamamlaǵan. Birinshi medicinalıq járdem, akusher-ginekologiya hám xirurgiya baǵdarlarında ámeliy jumıs tájiriybesi; házir klinikalıq hám oqıw jumısların birlestiredi.",
    education: [
      "2008 — Andijon mámleket medicina institutı (kúndizgi), «Emlew isi»",
      "2018–2019 — R.F. Omsk medicina akademiyası, xirurgiya ordinaturası",
      "2019 — TTA, xirurgiya ordinaturası",
      "PhD — ilimiy dáreje",
    ],
    focuses: [
      "Ulıwma xirurgiya",
      "Klinikalıq ámeliyat",
      "Oqıw-metodikalıq jumıs",
      "Akusher-ginekologiya tájiriybesi",
    ],
    languages: ["Ózbek", "Rus"],
  }, 32, 8, 'professor'),
)

STATIC_DOCTOR_PROFILES.push(
  profile(35, 'ruzmatov-z-s', {
    name: 'Dr. Ruzmatov Z.S.',
    role: 'Nevrologiya bo’limi vrachi',
    specialty: 'Nevrologiya',
    exp: '15 yil tajriba',
    about:
      'Ruzmatov Zuxriddin Sirojiddinovich — Farg’ona shahar 2-sonli shifoxonasining nevrologiya bo’limi vrachi (2020 yildan). Nevropatolog va nevrolog sifatida amaliy tajriba; bemorlarga nevrologik diagnostika va davolash bo’yicha yordam ko’rsatadi.',
    education: [
      '2011 — Andijon davlat tibbiyot instituti, «Davolash ishi»',
      '2011–2013 — Toshkent vrachlar malakasini oshirish instituti, ordinatura',
    ],
    focuses: [
      'Nevrologiya',
      'Nevropatologiya',
      'Nevrologik diagnostika',
      'Ambulator va statsionar yordam',
    ],
    languages: ["O’zbek", 'Русский', 'English'],
  }, {
    name: 'Др. Рузматов З.С.',
    role: 'Врач неврологического отделения',
    specialty: 'Неврология',
    exp: '15 лет опыта',
    about:
      'Рузматов Зухриддин Сирожиддинович — врач неврологического отделения Ферганской городской больницы №2 (с 2020 г.). Практический опыт невропатолога и невролога; диагностика и лечение неврологических заболеваний.',
    education: [
      '2011 — Андижанский государственный медицинский институт, «Лечебное дело»',
      '2011–2013 — Институт повышения квалификации врачей (Ташкент), ординатура',
    ],
    focuses: [
      'Неврология',
      'Невропатология',
      'Неврологическая диагностика',
      'Амбулаторная и стационарная помощь',
    ],
    languages: ['Узбекский', 'Русский', 'English'],
  }, {
    name: 'Dr. Ruzmatov Z.S.',
    role: 'Neurology department physician',
    specialty: 'Neurology',
    exp: '15 years experience',
    about:
      'Ruzmatov Zukhriddin Sirozhiddinovich — neurologist at Fergana City Hospital No. 2 neurology department (since 2020). Experience as neuropathologist and neurologist; neurological diagnostics and treatment.',
    education: [
      '2011 — Andijan State Medical Institute, General Medicine',
      '2011–2013 — Tashkent Institute for Advanced Medical Training, residency',
    ],
    focuses: [
      'Neurology',
      'Neuropathology',
      'Neurological diagnostics',
      'Outpatient and inpatient care',
    ],
    languages: ['Uzbek', 'Russian', 'English'],
  },   {
    name: "Dr. Ruzmatov Z.S.",
    role: "Nevrologiya bólimi shıpakeri",
    specialty: "Nevrologiya",
    exp: "15 jıl tájiriybe",
    about:
      "Ruzmatov Zuxriddin Sirojiddinovich — Farg’ona qalası 2-sanlı awrıwxanasınıń nevrologiya bólimi shıpakeri (2020-jıldan). Nevropatolog hám nevrolog sıpatında ámeliy tájiriybe; bemarlarǵa nevrologiyalıq diagnostika hám emlew boyınsha járdem beredi.",
    education: [
      "2011 — Andijon mámleket medicina institutı, «Emlew isi»",
      "2011–2013 — Tashkent shıpakerler maliykesin asırıw institutı, ordinatura",
    ],
    focuses: [
      "Nevrologiya",
      "Nevropatologiya",
      "Nevrologiyalıq diagnostika",
      "Ambulator hám stacionar járdem",
    ],
    languages: ["Ózbek", "Rus", "Ingliz"],
  }, 18, 3),
)

STATIC_DOCTOR_PROFILES.push(
  profile(36, 'kojoeva-f-o', {
    name: 'Dr. Kojoeva F.O.',
    role: 'Qabul-diagnostika bo’limi nevrologi · klinik ordinatur',
    specialty: 'Nevrologiya',
    exp: 'Klinik ordinatur · 2 yil amaliyot',
    about:
      'Kojoeva Farangiz Omurbekovna — FJSTI ko’p tarmoqli klinikasining Qabul-diagnostika bo’limida nevrolog (2026 yildan). Nevrologiya kafedrasida klinik ordinatur o’quvchisi; Farg’ona shahar 8-sonli oilaviy poliklinikasida oila shifokori (2024 yil 17 dekabr dan).',
    education: [
      '2019–2025 — FJSTI, «Davolash ishi»',
      'Farg’ona jamoat salomatligi instituti, «Davolash ishi»',
      '2025 yildan — FJSTI nevrologiya kafedrasi, klinik ordinatura',
    ],
    focuses: [
      'Nevrologiya',
      'Qabul-diagnostika',
      'Oila shifokorligi',
      'Klinik ordinatura',
    ],
    languages: ["O’zbek", 'Русский', 'English', 'Qirg’izcha'],
  }, {
    name: 'Др. Кожоева Ф.О.',
    role: 'Невролог отделения приёма-диагностики · клин. ординатор',
    specialty: 'Неврология',
    exp: 'Клин. ординатура · 2 года практики',
    about:
      'Кожоева Фарангиз Омурбековна — невролог отделения приёма-диагностики клиники FJSTI (с 2026 г.). Клинический ординатор кафедры неврологии; семейный врач поликлиники №8 г. Ферганы (с 17 декабря 2024 г.).',
    education: [
      '2019–2025 — FJSTI, «Лечебное дело»',
      'Ферганский институт общественного здоровья, «Лечебное дело»',
      'С 2025 г. — клиническая ординатура, кафедра неврологии FJSTI',
    ],
    focuses: [
      'Неврология',
      'Приёмно-диагностическое отделение',
      'Семейная медицина',
      'Клиническая ординатура',
    ],
    languages: ['Узбекский', 'Русский', 'English', 'Киргизский'],
  }, {
    name: 'Dr. Kojoeva F.O.',
    role: 'Neurologist, admission & diagnostics · clinical resident',
    specialty: 'Neurology',
    exp: 'Clinical residency · 2 years practice',
    about:
      'Kojoeva Farangiz Omurbekovna — neurologist at the FJSTI admission and diagnostics department (since 2026). Clinical resident at the neurology department; family physician at Fergana City Polyclinic No. 8 (since 17 December 2024).',
    education: [
      '2019–2025 — FJSTI, General Medicine',
      'Fergana Public Health Institute, General Medicine',
      'Since 2025 — clinical residency, FJSTI Neurology department',
    ],
    focuses: [
      'Neurology',
      'Admission and diagnostics',
      'Family medicine',
      'Clinical residency',
    ],
    languages: ['Uzbek', 'Russian', 'English', 'Kyrgyz'],
  },   {
    name: "Dr. Kojoeva F.O.",
    role: "Qabıllaw-diagnostika bólimi nevrologı · klinikalıq ordinator",
    specialty: "Nevrologiya",
    exp: "Klinikalıq ordinatura · 2 jıl ámeliyat",
    about:
      "Kojoeva Farangiz Omurbekovna — FJSTI kóp tarmaqlı klinikasınıń Qabıllaw-diagnostika bóliminde nevrolog (2026-jıldan). Nevrologiya kafedrasında klinikalıq ordinator oqıwshısı; Farg’ona qalası 8-sanlı shańaraq poliklinikasında shańaraq shıpakeri (2024-jıl 17-dekabrdan).",
    education: [
      "2019–2025 — FJSTI, «Emlew isi»",
      "Farg’ona jámiyet salamatlıǵı institutı, «Emlew isi»",
      "2025-jıldan — FJSTI nevrologiya kafedrası, klinikalıq ordinatura",
    ],
    focuses: [
      "Nevrologiya",
      "Qabıllaw-diagnostika",
      "Shańaraq shıpakerligi",
      "Klinikalıq ordinatura",
    ],
    languages: ["Ózbek", "Rus", "Ingliz", "Qırǵız"],
  }, 12, 1),
)
STATIC_DOCTOR_PROFILES.push(
  profile(37, 'nosirov-m-m', {
    name: 'Dr. Nosirov M.M.',
    role: 'Nevrologiya bo’limi mudiri · stajyor o’qituvchi',
    specialty: 'Nevrologiya',
    exp: '5 yil tajriba',
    about:
      'Nosirov Muhammadali Maqsudali o’gli — FJSTI ko’p tarmoqli klinikasining nevrologiya bo’limi mudiri (2025 yildan). Asab kasalliklari bo’limida nevrolog; «Nevrologiya va psixiatriya» kafedrasi stajyor o’qituvchisi (2026 yil fevraldan). ADTI pediatriya fakulteti va nevrologiya klinik ordinaturasi bitiruvchisi.',
    education: [
      '2015–2021 — Andijon davlat tibbiyot instituti, Pediatriya fakulteti',
      '2021–2023 — ADTI, Nevrologiya kafedrasi, klinik ordinatura',
    ],
    focuses: [
      'Nevrologiya',
      'Asab kasalliklari',
      'Qabul-diagnostika',
      'Nevrologiya va psixiatriya',
    ],
    languages: ["O’zbek", 'Русский', 'English'],
  }, {
    name: 'Др. Носиров М.М.',
    role: 'Зав. отделением неврологии · стажёр-преподаватель',
    specialty: 'Неврология',
    exp: '5 лет опыта',
    about:
      'Носиров Мухаммадали, сын Максудали — заведующий отделением неврологии клиники FJSTI (с 2025 г.). Невролог отделения нервных болезней; стажёр-преподаватель кафедры «Неврология и психиатрия» (с февраля 2026 г.). Окончил педиатрический факультет ADTI и клиническую ординатуру по неврологии.',
    education: [
      '2015–2021 — Андижанский государственный медицинский институт, педиатрический факультет',
      '2021–2023 — ADTI, кафедра неврологии, клиническая ординатура',
    ],
    focuses: [
      'Неврология',
      'Болезни нервной системы',
      'Приёмно-диагностическое отделение',
      'Неврология и психиатрия',
    ],
    languages: ['Узбекский', 'Русский', 'English'],
  }, {
    name: 'Dr. Nosirov M.M.',
    role: 'Head of Neurology · trainee lecturer',
    specialty: 'Neurology',
    exp: '5 years experience',
    about:
      'Nosirov Muhammadali Maqsudali — head of the neurology department at FJSTI clinic (since 2025). Neurologist in the nervous diseases department; trainee lecturer at the Neurology and Psychiatry department (since February 2026). Graduate of ADTI pediatrics faculty and neurology clinical residency.',
    education: [
      '2015–2021 — Andijan State Medical Institute, Pediatrics faculty',
      '2021–2023 — ADTI, Neurology department, clinical residency',
    ],
    focuses: [
      'Neurology',
      'Nervous system diseases',
      'Admission and diagnostics',
      'Neurology and psychiatry',
    ],
    languages: ['Uzbek', 'Russian', 'English'],
  },   {
    name: "Dr. Nosirov M.M.",
    role: "Nevrologiya bólimi baslıǵı · stajyor oqıtıwshı",
    specialty: "Nevrologiya",
    exp: "5 jıl tájiriybe",
    about:
      "Nosirov Muhammadali Maqsudali ulı — FJSTI kóp tarmaqlı klinikasınıń nevrologiya bólimi baslıǵı (2025-jıldan). Nerv keselliklери bóliminde nevrolog; «Nevrologiya hám psixiatriya» kafedrası stajyor oqıtıwshısı (2026-jıl fevraldan). ADTI pediatriya fakulteti hám nevrologiya klinikalıq ordinaturasınıń bitiriwshisi.",
    education: [
      "2015–2021 — Andijon mámleket medicina institutı, Pediatriya fakulteti",
      "2021–2023 — ADTI, Nevrologiya kafedrası, klinikalıq ordinatura",
    ],
    focuses: [
      "Nevrologiya",
      "Nerv keselliklери",
      "Qabıllaw-diagnostika",
      "Nevrologiya hám psixiatriya",
    ],
    languages: ["Ózbek", "Rus", "Ingliz"],
  }, 14, 3, 'professor'),
)
STATIC_DOCTOR_PROFILES.push(
  profile(38, 'bobojonov-s-s', {
    name: 'Dr. Bobojonov S.S.',
    role: 'Terapiya yo’nalishidagi fanlar kafedrasi assistenti · kardiolog',
    specialty: 'Kardiologiya',
    exp: '9 yil tajriba',
    about:
      'Bobojonov Sardorbek Solijon o’g’li — Farg’ona jamoat salomatligi tibbiyot instituti «Terapiya yo’nalishidagi fanlar» kafedrasi assistenti (2023 yil 4 sentyabrdan). Kardiolog-mutaxassis; ADTI kardiorrevmatologiya klinik ordinaturasi bitiruvchisi. Ilgari ichki kasalliklar kafedrasi assistenti va xalqaro bo’lim boshlig’i lavozimlarida ishlagan.',
    education: [
      '2019 — Andijon davlat tibbiyot oliygohi',
      '2017–2019 — ADTI klinikasi, «Kardiorrevmatologiya» klinik ordinaturasi',
    ],
    focuses: [
      'Kardiologiya',
      'Terapiya',
      'Kardiorrevmatologiya',
      'Ichki kasalliklar',
    ],
    languages: ["O’zbek", 'Русский', 'English'],
  }, {
    name: 'Др. Бобожонов S.S.',
    role: 'Ассистент кафедры терапии · кардиолог',
    specialty: 'Кардиология',
    exp: '9 лет опыта',
    about:
      'Бобожонов Сардорбек Солижон огли — ассистент кафедры «Дисциплины терапевтического профиля» Ферганского института общественного здоровья (с 4 сентября 2023 г.). Кардиолог; окончил клиническую ординатуру по кардиоревматологии ADTI. Ранее — ассистент кафедры внутренних болезней и руководитель международного отдела.',
    education: [
      '2019 — Андижанский государственный медицинский университет',
      '2017–2019 — Клиника ADTI, клиническая ординатура «Кардиоревматология»',
    ],
    focuses: [
      'Кардиология',
      'Терапия',
      'Кардиоревматология',
      'Внутренние болезни',
    ],
    languages: ['Узбекский', 'Русский', 'English'],
  }, {
    name: 'Dr. Bobojonov S.S.',
    role: 'Assistant professor, Therapy · cardiologist',
    specialty: 'Cardiology',
    exp: '9 years experience',
    about:
      'Bobojonov Sardorbek Solijon o’g’li — assistant at the Fergana Public Health Institute Therapy Sciences department (since 4 September 2023). Cardiologist; graduate of ADTI cardioreumatology clinical residency. Former assistant at internal medicine department and head of the international office.',
    education: [
      '2019 — Andijan State Medical University',
      '2017–2019 — ADTI clinic, Cardioreumatology clinical residency',
    ],
    focuses: [
      'Cardiology',
      'Therapy',
      'Cardioreumatology',
      'Internal medicine',
    ],
    languages: ['Uzbek', 'Russian', 'English'],
  },   {
    name: "Dr. Bobojonov S.S.",
    role: "Terapiya baǵdarındaǵı pánler kafedrası assistenti · kardiolog",
    specialty: "Kardiologiya",
    exp: "9 jıl tájiriybe",
    about:
      "Bobojonov Sardorbek Solijon ulı — Farg’ona jámiyet salamatlıǵı medicina institutı «Terapiya baǵdarındaǵı pánler» kafedrası assistenti (2023-jıl 4-sentyabrdan). Kardiolog-mutaxassis; ADTI kardiorevmatologiya klinikalıq ordinaturasınıń bitiriwshisi. Aldın ishki kesellikler kafedrası assistenti hám xalıqaralıq bólim baslıǵı wazıypalarında islegen.",
    education: [
      "2019 — Andijon mámleket medicina joqarı oqıw orны",
      "2017–2019 — ADTI klinikası, «Kardiorevmatologiya» klinikalıq ordinaturası",
    ],
    focuses: [
      "Kardiologiya",
      "Terapiya",
      "Kardiorevmatologiya",
      "Ishki kesellikler",
    ],
    languages: ["Ózbek", "Rus", "Ingliz"],
  }, 24, 5, 'professor'),
)
STATIC_DOCTOR_PROFILES.push(
  profile(39, 'shamsutdinova-g-b', {
    name: 'Dr. Shamsutdinova G.B.',
    role: 'Terapiya (UASH) kafedra mudiri · PhD · kardiorevmatolog',
    specialty: 'Kardiologiya',
    exp: '11 yil tajriba',
    about:
      'Shamsutdinova Guzel Baxodirovna — FJSTI «Terapiya yo’nalishidagi fanlar (UASH)» kafedrasi mudiri (2025 yil 13 yanvardan), PhD, kardiorevmatolog. Andijon DTMI va magistratura bitiruvchisi; ichki kasalliklar bo’yicha qayta tayyorlash va klinik amaliyot tajribasiga ega.',
    education: [
      '2015 — Andijon davlat tibbiyot instituti',
      '2015–2018 — ADTI, magistratura',
      '2019–2020 — Toshkent vrachlar malakasini oshirish instituti, «Ichki kasalliklar» qayta tayyorlash',
      'PhD — ilmiy daraja',
    ],
    focuses: [
      'Kardiorevmatologiya',
      'Terapiya',
      'Ichki kasalliklar',
      'UASH',
    ],
    languages: ["O’zbek", 'Русский', 'English'],
  }, {
    name: 'Др. Шамсутдинова Г.Б.',
    role: 'Зав. кафедрой терапии (UASH) · PhD · кардиоревматолог',
    specialty: 'Кардиология',
    exp: '11 лет опыта',
    about:
      'Шамсутдинова Гузель Баходировна — заведующая кафедрой «Дисциплины терапевтического профиля (UASH)» FJSTI (с 13 января 2025 г.), PhD, кардиоревматолог. Окончила ADTI и магистратуру; переподготовка по внутренним болезням и клинический опыт.',
    education: [
      '2015 — Андижанский государственный медицинский институт',
      '2015–2018 — ADTI, магистратура',
      '2019–2020 — Институт повышения квалификации (Ташкент), переподготовка «Внутренние болезни»',
      'PhD — учёная степень',
    ],
    focuses: [
      'Кардиоревматология',
      'Терапия',
      'Внутренние болезни',
      'UASH',
    ],
    languages: ['Узбекский', 'Русский', 'English'],
  }, {
    name: 'Dr. Shamsutdinova G.B.',
    role: 'Head of Therapy (UASH) department · PhD · cardioreumatologist',
    specialty: 'Cardiology',
    exp: '11 years experience',
    about:
      'Shamsutdinova Guzel Baxodirovna — head of the FJSTI Therapy Sciences (UASH) department (since 13 January 2025), PhD, cardioreumatologist. ADTI and master’s graduate; retraining in internal medicine and clinical experience.',
    education: [
      '2015 — Andijan State Medical Institute',
      '2015–2018 — ADTI, master’s degree',
      '2019–2020 — Tashkent CME Institute, Internal Medicine retraining',
      'PhD',
    ],
    focuses: [
      'Cardioreumatology',
      'Therapy',
      'Internal medicine',
      'UASH',
    ],
    languages: ['Uzbek', 'Russian', 'English'],
  },   {
    name: "Dr. Shamsutdinova G.B.",
    role: "Terapiya (UASH) kafedra baslıǵı · PhD · kardiorevmatolog",
    specialty: "Kardiologiya",
    exp: "11 jıl tájiriybe",
    about:
      "Shamsutdinova Guzel Baxodirovna — FJSTI «Terapiya baǵdarındaǵı pánler (UASH)» kafedrası baslıǵı (2025-jıl 13-yanvardan), PhD, kardiorevmatolog. Andijon DTMI hám magistratura bitiriwshisi; ishki kesellikler boyınsha qayta taярlaw hám klinikalıq ámeliyat tájiriybesine iye.",
    education: [
      "2015 — Andijon mámleket medicina institutı",
      "2015–2018 — ADTI, magistratura",
      "2019–2020 — Tashkent shıpakerler maliykesin asırıw institutı, «Ishki kesellikler» qayta taярlaw",
      "PhD — ilimiy dáreje",
    ],
    focuses: [
      "Kardiorevmatologiya",
      "Terapiya",
      "Ishki kesellikler",
      "UASH",
    ],
    languages: ["Ózbek", "Rus", "Ingliz"],
  }, 28, 6, 'professor'),
)
STATIC_DOCTOR_PROFILES.push(
  profile(40, 'isaqjonova-m-n', {
    name: 'Dr. Isaqjonova M.N.',
    role: 'Stajyor o’qituvchi · endokrinolog',
    specialty: 'Endokrinologiya',
    exp: '5 yil tajriba',
    about:
      'Isaqjonova Mohinur Nodirjon qizi — Farg’ona jamoat salomatligi tibbiyot instituti stajyor o’qituvchisi (2025 yil 9 dekabrdan), endokrinolog. TTA Termiz filiali endokrinologiya klinik ordinaturasi bitiruvchisi; Surxondaryo endokrinologiya dispanseri va Farg’ona shahar 4-oilaviy poliklinikasida amaliy tajribaga ega.',
    education: [
      '2015–2021 — Toshkent tibbiyot akademiyasi, Davolash fakulteti (kunduzgi)',
      '2022–2024 — TTA Termiz filiali, endokrinologiya klinik ordinaturasi',
    ],
    focuses: [
      'Endokrinologiya',
      'Diabet va metabolik kasalliklar',
      'Stajyor o’qituvchilik',
      'Ambulator endokrinologiya',
    ],
    languages: ["O’zbek", 'Русский', 'English'],
  }, {
    name: 'Др. Исакжонова М.Н.',
    role: 'Стажёр-преподаватель · эндокринолог',
    specialty: 'Эндокринология',
    exp: '5 лет опыта',
    about:
      'Исакжонова Мохинур Нодиржон кизи — стажёр-преподаватель FJSTI (с 9 декабря 2025 г.), эндокринолог. Окончила клиническую ординатуру по эндокринологии филиала TTA в Termiz; практика в эндокринологическом диспансере и поликлинике №4 г. Ферганы.',
    education: [
      '2015–2021 — Ташкентская медицинская академия, лечебный факультет (дневное)',
      '2022–2024 — Филиал TTA (Termiz), клиническая ординатура, эндокринология',
    ],
    focuses: [
      'Эндокринология',
      'Диабет и метаболические заболевания',
      'Педагогическая практика',
      'Амбулаторная эндокринология',
    ],
    languages: ['Узбекский', 'Русский', 'English'],
  }, {
    name: 'Dr. Isaqjonova M.N.',
    role: 'Trainee lecturer · endocrinologist',
    specialty: 'Endocrinology',
    exp: '5 years experience',
    about:
      'Isaqjonova Mohinur Nodirjon qizi — trainee lecturer at FJSTI (since 9 December 2025), endocrinologist. Graduate of TTA Termiz branch endocrinology clinical residency; experience at Surkhandarya endocrinology dispensary and Fergana City Polyclinic No. 4.',
    education: [
      '2015–2021 — Tashkent Medical Academy, General Medicine faculty (full-time)',
      '2022–2024 — TTA Termiz branch, endocrinology clinical residency',
    ],
    focuses: [
      'Endocrinology',
      'Diabetes and metabolic disorders',
      'Trainee teaching',
      'Outpatient endocrinology',
    ],
    languages: ['Uzbek', 'Russian', 'English'],
  },   {
    name: "Dr. Isaqjonova M.N.",
    role: "Stajyor oqıtıwshı · endokrinolog",
    specialty: "Endokrinologiya",
    exp: "5 jıl tájiriybe",
    about:
      "Isaqjonova Mohinur Nodirjon qızı — Farg’ona jámiyet salamatlıǵı medicina institutı stajyor oqıtıwshısı (2025-jıl 9-dekabrdan), endokrinolog. TTA Termiz filialı endokrinologiya klinikalıq ordinaturasınıń bitiriwshisi; Surxandarya endokrinologiya dispanseri hám Farg’ona qalası 4-shańaraq poliklinikasında ámeliy tájiriybege iye.",
    education: [
      "2015–2021 — Tashkent medicina akademiyası, Emlew fakulteti (kúndizgi)",
      "2022–2024 — TTA Termiz filialı, endokrinologiya klinikalıq ordinaturası",
    ],
    focuses: [
      "Endokrinologiya",
      "Diabet hám metabolikalıq kesellikler",
      "Stajyor oqıtıwshılıq",
      "Ambulator endokrinologiya",
    ],
    languages: ["Ózbek", "Rus", "Ingliz"],
  }, 14, 3, 'professor'),
)

STATIC_DOCTOR_PROFILES.push(
  profile(41, 'xalilov-n-a', {
    name: 'Dr. Xalilov N.A.',
    role: 'Terapevt',
    specialty: 'Terapiya',
    exp: '2 yil tajriba',
    about:
      'Xalilov Nurillo Abdug’ani o’g’li — Andijon davlat tibbiyot instituti «Davolash ishi» fakulteti (2015–2021) va terapiya yo’nalishlarida magistratura (2021–2024) bitiruvchisi. Ichki kasalliklarni diagnostika va davolash bilan shug’ullanadi.',
    education: [
      '2015–2021 — Andijon davlat tibbiyot instituti, «Davolash ishi» fakulteti',
      '2021–2024 — Andijon DTMI, terapiya (yo’nalishlar bo’yicha) magistraturasi',
    ],
    focuses: [
      'Terapiya',
      'Ichki kasalliklar',
      'Klinik diagnostika',
      'Ambulator yordam',
    ],
    languages: ["O’zbek"],
  }, {
    name: 'Др. Халилов Н.А.',
    role: 'Терапевт',
    specialty: 'Терапия',
    exp: '2 года опыта',
    about:
      'Халилов Нурилло Абдугани оглы — выпускник Андижанского государственного медицинского института, факультет «Лечебное дело» (2015–2021), магистратура по терапии (2021–2024). Занимается диагностикой и лечением внутренних заболеваний.',
    education: [
      '2015–2021 — Андижанский государственный медицинский институт, факультет «Лечебное дело»',
      '2021–2024 — Андижанский ГМИ, магистратура по терапии (по направлениям)',
    ],
    focuses: [
      'Терапия',
      'Внутренние болезни',
      'Клиническая диагностика',
      'Амбулаторная помощь',
    ],
    languages: ['Узбекский'],
  }, {
    name: 'Dr. Xalilov N.A.',
    role: 'General practitioner',
    specialty: 'Therapy',
    exp: '2 years experience',
    about:
      'Xalilov Nurillo Abdug’ani o’g’li — graduate of Andijan State Medical Institute, General Medicine faculty (2015–2021), and Therapy master’s programme (2021–2024). Focuses on diagnosis and treatment of internal medicine conditions.',
    education: [
      '2015–2021 — Andijan State Medical Institute, General Medicine faculty',
      '2021–2024 — Andijan SMI, Therapy master’s (by specialisations)',
    ],
    focuses: [
      'Therapy',
      'Internal medicine',
      'Clinical diagnostics',
      'Outpatient care',
    ],
    languages: ['Uzbek'],
  },   {
    name: "Dr. Xalilov N.A.",
    role: "Terapevt",
    specialty: "Terapiya",
    exp: "2 jıl tájiriybe",
    about:
      "Xalilov Nurillo Abdug’ani ulı — Andijon mámleket medicina institutı «Emlew isi» fakulteti (2015–2021) hám terapiya baǵdarlarında magistratura (2021–2024) bitiriwshisi. Ishki kesellikler diagnostikası hám emlewi menen shuǵıllanadı.",
    education: [
      "2015–2021 — Andijon mámleket medicina institutı, «Emlew isi» fakulteti",
      "2021–2024 — Andijon DTMI, terapiya (baǵdarlar boyınsha) magistraturası",
    ],
    focuses: [
      "Terapiya",
      "Ishki kesellikler",
      "Klinikalıq diagnostika",
      "Ambulator járdem",
    ],
    languages: ["Ózbek"],
  }, 8, 2),
)

STATIC_DOCTOR_PROFILES.push(
  profile(42, 'davlatov-s-q', {
    name: 'Dr. Davlatov S.Q.',
    role: 'Terapiya (UASh) kafedrasi assistenti',
    specialty: 'Kardiologiya',
    exp: '6 yil tajriba',
    about:
      'Davlatov Shohjaxonbek Qurbonbek o’g’li — Farg’ona jamoat salomatligi tibbiyot instituti Terapiya yo’nalishidagi fanlar (UASh) kafedrasi assistenti (2023 yil 4 sentyabrdan). Andijon DTMI (2020) va Toshkent tibbiyot akademiyasi kardiologiya magistraturasi (2020–2023) bitiruvchisi; Yozyovon tuman oilaviy poliklinikasi va tez tibbiy yordam stantsiyasida amaliy tajribaga ega.',
    education: [
      '2020 — Andijon davlat tibbiyot instituti, umumiy amaliyot shifokori',
      '2020–2023 — Toshkent tibbiyot akademiyasi, kardiologiya magistraturasi',
    ],
    focuses: [
      'Kardiologiya',
      'Terapiya (UASh)',
      'Tez tibbiy yordam',
      'Umumiy amaliyot shifokorligi',
    ],
    languages: ["O’zbek", 'English'],
  }, {
    name: 'Др. Давлатов Ш.К.',
    role: 'Ассистент кафедры терапии (UASh)',
    specialty: 'Кардиология',
    exp: '6 лет опыта',
    about:
      'Давлатов Шохжахонбек Курбонбек оглы — ассистент кафедры терапии (UASh) FJSTI (с 4 сентября 2023 г.). Окончил Андижанский ГМИ (2020) и магистратуру по кардиологии TTA (2020–2023); практика в сельской поликлинике Yozyovon и на станции скорой помощи Ташкента.',
    education: [
      '2020 — Андижанский государственный медицинский институт, врач общей практики',
      '2020–2023 — Ташкентская медицинская академия, магистратура по кардиологии',
    ],
    focuses: [
      'Кардиология',
      'Терапия (UASh)',
      'Скорая медицинская помощь',
      'Общая врачебная практика',
    ],
    languages: ['Узбекский', 'English'],
  }, {
    name: 'Dr. Davlatov S.Q.',
    role: 'Assistant, Therapy (UASh) department',
    specialty: 'Cardiology',
    exp: '6 years experience',
    about:
      'Davlatov Shohjaxonbek Qurbonbek o’g’li — assistant at the FJSTI Therapy (UASh) department (since 4 September 2023). Graduate of Andijan SMI (2020) and TTA cardiology master’s programme (2020–2023); experience at Yozyovon rural polyclinic and Tashkent emergency ambulance service.',
    education: [
      '2020 — Andijan State Medical Institute, general practice physician',
      '2020–2023 — Tashkent Medical Academy, cardiology master’s',
    ],
    focuses: [
      'Cardiology',
      'Therapy (UASh)',
      'Emergency medical care',
      'General practice',
    ],
    languages: ['Uzbek', 'English'],
  },   {
    name: "Dr. Davlatov S.Q.",
    role: "Terapiya (UASh) kafedrası assistenti",
    specialty: "Kardiologiya",
    exp: "6 jıl tájiriybe",
    about:
      "Davlatov Shohjaxonbek Qurbonbek ulı — Farg’ona jámiyet salamatlıǵı medicina institutı Terapiya baǵdarındaǵı pánler (UASh) kafedrası assistenti (2023-jıl 4-sentyabrdan). Andijon DTMI (2020) hám Tashkent medicina akademiyası kardiologiya magistraturası (2020–2023) bitiriwshisi; Yozyovon rayonı shańaraq poliklinikası hám tez medicinalıq járdem stanciyasında ámeliy tájiriybege iye.",
    education: [
      "2020 — Andijon mámleket medicina institutı, ulıwma ámeliyat shıpakeri",
      "2020–2023 — Tashkent medicina akademiyası, kardiologiya magistraturası",
    ],
    focuses: [
      "Kardiologiya",
      "Terapiya (UASh)",
      "Tez medicinalıq járdem",
      "Ulıwma ámeliyat shıpakerligi",
    ],
    languages: ["Ózbek", "Ingliz"],
  }, 12, 3),
)

STATIC_DOCTOR_PROFILES.push(
  profile(43, 'gayratjonova-f-g', {
    name: 'Dr. Gayratjonova F.G.',
    role: 'Terapiya (UASh) kafedrasi o’qituvchi stajyori',
    specialty: 'Terapiya',
    exp: '4 yil tajriba',
    about:
      'Gayratjonova Fotima Gofurjon qizi — Farg’ona jamoat salomatligi tibbiyot instituti Terapiya yo’nalishidagi fanlar (UASh) kafedrasi o’qituvchi stajyori (2025 yil 10 oktyabrdan). 2022 yilda TTA ni «Umumiy amaliyot shifokori» mutaxassisligi bo’yicha bitirgan; Toshkent pediatriya instituti terapiya fakulteti talabasi; Farg’ona shahar 1-sonli oilaviy poliklinikasida amaliy tajribaga ega.',
    education: [
      '2022 — Toshkent tibbiyot akademiyasi, umumiy amaliyot shifokori',
      '2022–hozir — Toshkent pediatriya instituti, terapiya fakulteti (talaba)',
    ],
    focuses: [
      'Terapiya (UASh)',
      'Umumiy amaliyot shifokorligi',
      'O’qituvchi stajyorlik',
      'Ambulator yordam',
    ],
    languages: ['Русский', 'English'],
  }, {
    name: 'Др. Гайратжонова Ф.Г.',
    role: 'Стажёр-преподаватель кафедры терапии (UASh)',
    specialty: 'Терапия',
    exp: '4 года опыта',
    about:
      'Гайратжонова Фотима Гофуржон кизи — стажёр-преподаватель кафедры терапии (UASh) FJSTI (с 10 октября 2025 г.). Окончила TTA по специальности «Врач общей практики» (2022); студентка факультета терапии Ташкентского педиатрического института; практика в поликлинике №1 г. Ферганы.',
    education: [
      '2022 — Ташкентская медицинская академия, врач общей практики',
      '2022–н.в. — Ташкентский педиатрический институт, факультет терапии (студентка)',
    ],
    focuses: [
      'Терапия (UASh)',
      'Общая врачебная практика',
      'Педагогическая стажировка',
      'Амбулаторная помощь',
    ],
    languages: ['Русский', 'English'],
  }, {
    name: 'Dr. Gayratjonova F.G.',
    role: 'Trainee lecturer, Therapy (UASh) department',
    specialty: 'Therapy',
    exp: '4 years experience',
    about:
      'Gayratjonova Fotima Gofurjon qizi — trainee lecturer at the FJSTI Therapy (UASh) department (since 10 October 2025). TTA graduate in general practice (2022); student at Tashkent Pediatric Institute therapy faculty; experience at Fergana City Polyclinic No. 1.',
    education: [
      '2022 — Tashkent Medical Academy, general practice physician',
      '2022–present — Tashkent Pediatric Institute, therapy faculty (student)',
    ],
    focuses: [
      'Therapy (UASh)',
      'General practice',
      'Trainee teaching',
      'Outpatient care',
    ],
    languages: ['Russian', 'English'],
  },   {
    name: "Dr. Gayratjonova F.G.",
    role: "Terapiya (UASh) kafedrası oqıtıwshı stajyorı",
    specialty: "Terapiya",
    exp: "4 jıl tájiriybe",
    about:
      "Gayratjonova Fotima Gofurjon qızı — Farg’ona jámiyet salamatlıǵı medicina institutı Terapiya baǵdarındaǵı pánler (UASh) kafedrası oqıtıwshı stajyorı (2025-jıl 10-oktyabrdan). 2022-jılda TTA nı «Ulıwma ámeliyat shıpakeri» mамanlıǵı boyınsha tamamlaǵan; Tashkent pediatriya institutı terapiya fakulteti studenti; Farg’ona qalası 1-sanlı shańaraq poliklinikasında ámeliy tájiriybege iye.",
    education: [
      "2022 — Tashkent medicina akademiyası, ulıwma ámeliyat shıpakeri",
      "2022–házir — Tashkent pediatriya institutı, terapiya fakulteti (student)",
    ],
    focuses: [
      "Terapiya (UASh)",
      "Ulıwma ámeliyat shıpakerligi",
      "Oqıtıwshı stajyorlıq",
      "Ambulator járdem",
    ],
    languages: ["Rus", "Ingliz"],
  }, 6, 1),
)

STATIC_DOCTOR_PROFILES.push(
  profile(44, 'mominov-j-z', {
    name: 'Dr. Mominov J.Z.',
    role: 'Terapiya yo’nalishidagi fanlar kafedrasi assistenti',
    specialty: 'Terapiya',
    exp: '5 yil tajriba',
    about:
      'Mominov Jahongir Zokirjon o’g’li — Farg’ona jamoat salomatligi tibbiyot instituti Terapiya yo’nalishidagi fanlar kafedrasi assistenti (2025 yildan). Andijon davlat tibbiyot instituti «Davolash ishi» (2015–2021) va terapiya magistraturasi (2021–2024) bitiruvchisi; 2021–2025 yillarda Andijon shahar 6-sonli oilaviy poliklinikasida oila shifokori sifatida ishlagan.',
    education: [
      '2015–2021 — Andijon davlat tibbiyot instituti, «Davolash ishi» fakulteti',
      '2021–2024 — Andijon DTMI, terapiya (yo’nalishlar bo’yicha) magistraturasi',
    ],
    focuses: [
      'Terapiya',
      'Oila shifokorligi',
      'Ichki kasalliklar',
      'Ambulator yordam',
    ],
    languages: ["O’zbek", 'Русский'],
  }, {
    name: 'Др. Моминов Ж.З.',
    role: 'Ассистент кафедры терапии',
    specialty: 'Терапия',
    exp: '5 лет опыта',
    about:
      'Моминов Жахонгир Зокиржон оглы — ассистент кафедры терапии FJSTI (с 2025 г.). Окончил Андижанский ГМИ «Лечебное дело» (2015–2021) и магистратуру по терапии (2021–2024); в 2021–2025 гг. работал семейным врачом в поликлинике №6 г. Андижана.',
    education: [
      '2015–2021 — Андижанский государственный медицинский институт, факультет «Лечебное дело»',
      '2021–2024 — Андижанский ГМИ, магистратура по терапии (по направлениям)',
    ],
    focuses: [
      'Терапия',
      'Семейная медицина',
      'Внутренние болезни',
      'Амбулаторная помощь',
    ],
    languages: ['Узбекский', 'Русский'],
  }, {
    name: 'Dr. Mominov J.Z.',
    role: 'Assistant, Therapy department',
    specialty: 'Therapy',
    exp: '5 years experience',
    about:
      'Mominov Jahongir Zokirjon o’g’li — assistant at the FJSTI Therapy department (since 2025). Graduate of Andijan SMI General Medicine (2015–2021) and therapy master’s (2021–2024); family physician at Andijan City Polyclinic No. 6 (2021–2025).',
    education: [
      '2015–2021 — Andijan State Medical Institute, General Medicine faculty',
      '2021–2024 — Andijan SMI, Therapy master’s (by specialisations)',
    ],
    focuses: [
      'Therapy',
      'Family medicine',
      'Internal medicine',
      'Outpatient care',
    ],
    languages: ['Uzbek', 'Russian'],
  },   {
    name: "Dr. Mominov J.Z.",
    role: "Terapiya baǵdarındaǵı pánler kafedrası assistenti",
    specialty: "Terapiya",
    exp: "5 jıl tájiriybe",
    about:
      "Mominov Jahongir Zokirjon ulı — Farg’ona jámiyet salamatlıǵı medicina institutı Terapiya baǵdarındaǵı pánler kafedrası assistenti (2025-jıldan). Andijon mámleket medicina institutı «Emlew isi» (2015–2021) hám terapiya magistraturası (2021–2024) bitiriwshisi; 2021–2025-jıllarda Andijon qalası 6-sanlı shańaraq poliklinikasında shańaraq shıpakeri sıpatında islegen.",
    education: [
      "2015–2021 — Andijon mámleket medicina institutı, «Emlew isi» fakulteti",
      "2021–2024 — Andijon DTMI, terapiya (baǵdarlar boyınsha) magistraturası",
    ],
    focuses: [
      "Terapiya",
      "Shańaraq shıpakerligi",
      "Ishki kesellikler",
      "Ambulator járdem",
    ],
    languages: ["Ózbek", "Rus"],
  }, 10, 2),
)

/**
 * CMS bridge: the admin panel is the source of truth for doctors once the
 * backend has data. `CmsProvider` calls `setCmsDoctorProfiles` whenever it
 * (re)fetches `/api/home/`; every helper below reads through
 * `getActiveDoctorProfiles()` so the whole module — and every component that
 * imports from it — picks up CMS content without a separate rewrite.
 * `STATIC_DOCTOR_PROFILES` remains the fallback when the CMS is unreachable,
 * empty, or the UI language is Karakalpak (the CMS has no `kaa` content).
 */
let cmsDoctorProfiles: DoctorProfile[] | null = null

export function setCmsDoctorProfiles(list: DoctorProfile[] | null): void {
  cmsDoctorProfiles = list
}

export function getActiveDoctorProfiles(): DoctorProfile[] {
  return cmsDoctorProfiles ?? STATIC_DOCTOR_PROFILES
}

/**
 * `/api/home/` resolves every text field to a single language per request
 * (whatever `?lang=` was sent), so one CMS doctor row only ever carries one
 * language's copy at a time. That's fine here: the same resolved strings are
 * mirrored into all four `content` keys, and `CmsProvider` re-maps + re-sets
 * this list whenever the UI language changes, so `content[contentLang]`
 * always reads the currently-fetched language.
 */
export function mapCmsDoctors(
  rows: Array<{
    slug: string
    staff_kind: string
    name: string
    role: string
    specialty: string
    exp: string
    about: string
    education: string[]
    focuses: string[]
    languages: string[]
    papers: string
    studies: string
    color: string
    photo: string
  }>,
): DoctorProfile[] {
  return rows.map((row) => {
    const staffKind: StaffKind =
      row.staff_kind === 'professor' || row.staff_kind === 'nurse' ? row.staff_kind : 'doctor'
    const resolved = {
      name: row.name,
      role: row.role,
      specialty: row.specialty,
      exp: row.exp,
      about: row.about,
      education: row.education,
      focuses: row.focuses,
      languages: row.languages,
    }
    return {
      slug: row.slug,
      photo: row.photo,
      color: row.color || '#0B3D6B',
      papers: Number(row.papers) || 0,
      studies: Number(row.studies) || 0,
      staffKind,
      content: { uz: resolved, ru: resolved, en: resolved, kaa: resolved },
    }
  })
}

/** Not shown in homepage doctor wall — Soliyev is center-only; Aliyeva card style mismatches the row. */
const HIDDEN_FROM_HOME_ORBIT = new Set(['soliyev-m-h', 'aliyeva-z-v'])

/** Curated homepage team — Nosirov replaces Ergashev in slot 2. */
export const HOME_FEATURED_DOCTOR_SLUGS = [
  'satvoldiyev-d-u',
  'nosirov-m-m',
  'mamatalieva-z-a',
  'abdullayeva-t-y',
  'ruzmatov-z-s',
  'xalilov-n-a',
  'alimova-d-k',
  'bobojonov-s-s',
] as const

export function getHomeFeaturedDoctors(
  count: number = HOME_FEATURED_DOCTOR_SLUGS.length,
): DoctorProfile[] {
  return HOME_FEATURED_DOCTOR_SLUGS.slice(0, count)
    .map((slug) => getActiveDoctorProfiles().find((p) => p.slug === slug))
    .filter((p): p is DoctorProfile => Boolean(p))
}

export function getHomeOrbitDoctors(max = 20): DoctorProfile[] {
  return getActiveDoctorProfiles()
    .filter((p) => p.staffKind !== 'nurse' && !HIDDEN_FROM_HOME_ORBIT.has(p.slug))
    .slice(0, max)
}

/** Center portrait in the “Har bir yo’nalishda o’z mutaxassisi” doctor wall. */
export const HOME_DOCTOR_WALL_CENTER_SLUG = 'soliyev-m-h' as const
/** Pinned to the right edge of the doctor wall row. */
export const HOME_DOCTOR_WALL_RIGHT_SLUG = 'jorayeva-s-a' as const

/** Fine-tune face alignment in the narrow wall columns (y-axis anchor). */
const DOCTOR_WALL_PORTRAIT_POSITION: Record<string, string> = {
  'satvoldiyev-d-u': '50% 10%',
  'mamatalieva-z-a': '50% 12%',
  'abdullayeva-t-y': '50% 14%',
  'soliyev-m-h': '50% 8%',
  'alimova-d-k': '50% 12%',
  'xojaeva-g-a': '50% 18%',
  'jorayeva-s-a': '50% 10%',
}

export function getDoctorWallPortraitPosition(slug: string): string {
  return DOCTOR_WALL_PORTRAIT_POSITION[slug] ?? '50% 12%'
}

/** Turn-video speed in the doctor wall hover row (1 = normal). */
const DOCTOR_WALL_PLAYBACK_RATE: Record<string, number> = {
  'soliyev-m-h': 0.55,
}

export function getDoctorWallPlaybackRate(slug: string): number {
  return DOCTOR_WALL_PLAYBACK_RATE[slug] ?? 1
}

export function getHomeDoctorWallDoctors(count = 7): DoctorProfile[] {
  const pool = getHomeOrbitDoctors(getActiveDoctorProfiles().length)
  const centerIndex = Math.floor(count / 2)
  const center = getActiveDoctorProfiles().find((p) => p.slug === HOME_DOCTOR_WALL_CENTER_SLUG)
  const pinnedRight = getActiveDoctorProfiles().find((p) => p.slug === HOME_DOCTOR_WALL_RIGHT_SLUG)
  if (!center) return pool.slice(0, count)

  const excluded = new Set<string>([HOME_DOCTOR_WALL_CENTER_SLUG])
  if (pinnedRight) excluded.add(HOME_DOCTOR_WALL_RIGHT_SLUG)
  const rest = pool.filter((p) => !excluded.has(p.slug))
  const sideCount = count - 1 - (pinnedRight ? 1 : 0)
  const left = rest.slice(0, centerIndex)
  const right = rest.slice(centerIndex, centerIndex + (sideCount - left.length))
  if (pinnedRight) right.push(pinnedRight)
  return [...left, center, ...right].slice(0, count)
}

export function getDoctorsBySpecialty(specialtyUz: string, excludeSlug?: string) {
  return getActiveDoctorProfiles().filter(
    (d) => d.content.uz.specialty === specialtyUz && d.slug !== excludeSlug,
  )
}

export function getStaffByKind(kind: StaffKind | 'all') {
  if (kind === 'all') return getActiveDoctorProfiles()
  return getActiveDoctorProfiles().filter((d) => d.staffKind === kind)
}

export function getSpecialtiesForStaff(
  lang: Lang,
  kind: StaffKind | 'all' = 'all',
): string[] {
  const list = getStaffByKind(kind)
  const seen = new Set<string>()
  const out: string[] = []
  for (const d of list) {
    const s = d.content[lang].specialty
    if (!seen.has(s)) {
      seen.add(s)
      out.push(s)
    }
  }
  return out.sort((a, b) => a.localeCompare(b, lang === 'ru' ? 'ru' : 'uz'))
}

/** Broad specialty buckets — keeps doctor filters readable */
export type SpecialtyGroup = 'therapy' | 'surgery' | 'women' | 'diagnostics'

const SPECIALTY_GROUP_BY_UZ: Record<string, SpecialtyGroup> = {
  Terapiya: 'therapy',
  Kardiologiya: 'therapy',
  Nevrologiya: 'therapy',
  Endokrinologiya: 'therapy',
  Gastroenterologiya: 'therapy',
  Pulmonologiya: 'therapy',
  Revmatologiya: 'therapy',
  'Infeksion kasalliklar': 'therapy',
  Dermatologiya: 'therapy',
  Nefrologiya: 'therapy',
  Gematologiya: 'therapy',
  Allergologiya: 'therapy',
  Psixiatriya: 'therapy',
  Jarrohlik: 'surgery',
  Travmatologiya: 'surgery',
  Ortopediya: 'surgery',
  Urologiya: 'surgery',
  Onkologiya: 'surgery',
  Anesteziologiya: 'surgery',
  Oftalmologiya: 'surgery',
  Otorinolaringologiya: 'surgery',
  Ginekologiya: 'women',
  Akusherlik: 'women',
  Pediatriya: 'women',
  Procedura: 'diagnostics',
  Reanimatsiya: 'diagnostics',
}

export function getSpecialtyGroup(profile: DoctorProfile): SpecialtyGroup {
  return SPECIALTY_GROUP_BY_UZ[profile.content.uz.specialty] ?? 'therapy'
}

export function getDoctorBySlug(slug: string) {
  const resolved = ({ 'qosimov-r-b': 'xaydaraliyev-s-a', 'ganiyeva-z-m': 'azimova-g-r', 'nazarov-i-v': 'ruzmatov-z-s', 'saidova-l-h': 'kojoeva-f-o', 'ergashev-b-m': 'nosirov-m-m', 'xolmatov-s-r': 'bobojonov-s-s', 'rahimova-m-t': 'mamatalieva-z-a', 'toshmatova-g-a': 'abdullayeva-t-y', 'azimova-n-k': 'shamsutdinova-g-b', 'yusupova-n-r': 'aliyeva-z-v', 'ismoilova-z-b': 'isaqjonova-m-n', 'karimov-a-s': 'satvoldiyev-d-u', 'abdullayev-j-o': 'xalilov-n-a', 'rahmonov-d-k': 'davlatov-s-q', 'sultanova-g-m': 'gayratjonova-f-g', 'hasanov-a-m': 'mominov-j-z', 'usmonov-q-a': 'aliyeva-z-v', 'qodirova-m-s': 'xojaeva-g-a' } as Record<string, string>)[slug] ?? slug
  const index = getActiveDoctorProfiles().findIndex((d) => d.slug === resolved)
  if (index < 0) return null
  return { profile: getActiveDoctorProfiles()[index], index }
}

export const doctorPageLabels: Record<
  Lang,
  {
    back: string
    about: string
    education: string
    focuses: string
    languages: string
    book: string
    papers: string
    studies: string
    experience: string
    related: string
    relatedSame: string
    relatedEmpty: string
    reviews: string
    booking: {
      title: string
      appointment: string
      patient: string
      clinic: string
      date: string
      time: string
      lastName: string
      firstName: string
      middleName: string
      noMiddleName: string
      birthDate: string
      phone: string
      comment: string
      privacy: string
      privacyLink: string
      submit: string
      submitting: string
      close: string
      successTitle: string
      successDesc: string
      successClose: string
      requestNumber: string
    }
  }
> = {
  uz: {
    back: 'Barcha shifokorlar',
    about: 'Haqida',
    education: 'Ta’lim',
    focuses: 'Yo’nalishlar',
    languages: 'Tillar',
    book: 'Qabulga yozilish',
    papers: 'Maqolalar',
    studies: 'Tadqiqotlar',
    experience: 'Tajriba',
    related: 'Boshqa mutaxassislar',
    relatedSame: 'Boshqa {specialty} shifokorlari',
    relatedEmpty: 'Hozircha shu yo’nalishda boshqa shifokor yo’q.',
    reviews: 'Bemorlar sharhlari',
    booking: {
      title: 'Shifokorga yozilish',
      appointment: 'Qabul ma’lumotlari',
      patient: 'Bemor ma’lumotlari',
      clinic: 'Klinika',
      date: 'Sana',
      time: 'Vaqt',
      lastName: 'Familiya',
      firstName: 'Ism',
      middleName: 'Otasining ismi',
      noMiddleName: 'Otasining ismi yo’q',
      birthDate: 'Tug’ilgan sana',
      phone: 'Telefon',
      comment: 'Izoh',
      privacy: '«Yozilish» tugmasini bosib, siz',
      privacyLink: 'maxfiylik siyosatini',
      submit: 'Davom etish',
      submitting: 'Yuborilmoqda…',
      close: 'Yopish',
      successTitle: 'Ariza qabul qilindi',
      successDesc: 'Koordinator tez orada telefon orqali bog’lanib, qabulni tasdiqlaydi.',
      successClose: 'Yopish',
      requestNumber: 'Ariza raqami',
    },
  },
  ru: {
    back: 'Все врачи',
    about: 'О враче',
    education: 'Образование',
    focuses: 'Направления',
    languages: 'Языки',
    book: 'Записаться',
    papers: 'Публикации',
    studies: 'Исследования',
    experience: 'Опыт',
    related: 'Другие специалисты',
    relatedSame: 'Другие врачи: {specialty}',
    relatedEmpty: 'Пока нет других врачей по этому направлению.',
    reviews: 'Отзывы пациентов',
    booking: {
      title: 'Запись на приём к врачу',
      appointment: 'Данные о приёме',
      patient: 'Данные пациента',
      clinic: 'Клиника',
      date: 'Дата',
      time: 'Время',
      lastName: 'Фамилия',
      firstName: 'Имя',
      middleName: 'Отчество',
      noMiddleName: 'Нет отчества',
      birthDate: 'Дата рождения',
      phone: 'Телефон',
      comment: 'Комментарий',
      privacy: 'Нажимая кнопку, вы принимаете',
      privacyLink: 'политику конфиденциальности',
      submit: 'Продолжить',
      submitting: 'Отправка…',
      close: 'Закрыть',
      successTitle: 'Заявка принята',
      successDesc: 'Координатор свяжется с вами для подтверждения приёма.',
      successClose: 'Закрыть',
      requestNumber: 'Номер заявки',
    },
  },
  en: {
    back: 'All doctors',
    about: 'About',
    education: 'Education',
    focuses: 'Focus areas',
    languages: 'Languages',
    book: 'Book appointment',
    papers: 'Publications',
    studies: 'Studies',
    experience: 'Experience',
    related: 'Other specialists',
    relatedSame: 'Other {specialty} doctors',
    relatedEmpty: 'No other doctors in this specialty yet.',
    reviews: 'Patient reviews',
    booking: {
      title: 'Book an appointment with',
      appointment: 'Appointment details',
      patient: 'Patient details',
      clinic: 'Clinic',
      date: 'Date',
      time: 'Time',
      lastName: 'Last name',
      firstName: 'First name',
      middleName: 'Patronymic',
      noMiddleName: 'No patronymic',
      birthDate: 'Date of birth',
      phone: 'Phone',
      comment: 'Comment',
      privacy: 'By continuing you accept the',
      privacyLink: 'privacy policy',
      submit: 'Continue',
      submitting: 'Sending…',
      close: 'Close',
      successTitle: 'Request received',
      successDesc: 'A coordinator will call you to confirm the appointment.',
      successClose: 'Close',
      requestNumber: 'Request ID',
    },
  },
  kaa: {
    back: 'Barlıq shıpakerler',
    about: 'Haqqında',
    education: 'Bilim',
    focuses: 'Baǵdarlar',
    languages: 'Tiller',
    book: 'Qabılǵa jazılıw',
    papers: 'Maqalalar',
    studies: 'Izertlewler',
    experience: 'Tájiriybe',
    related: 'Basqa mutaxassislar',
    relatedSame: 'Basqa {specialty} shıpakerleri',
    relatedEmpty: 'Ázirshe usı baǵdarda basqa shıpaker joq.',
    reviews: 'Nawqaslar pikirleri',
    booking: {
      title: 'Shıpakerge jazılıw',
      appointment: 'Qabıllaw maǵlıwmatları',
      patient: 'Nawqas maǵlıwmatları',
      clinic: 'Klinika',
      date: 'Sáne',
      time: 'Waqıt',
      lastName: 'Familiya',
      firstName: 'Atı',
      middleName: 'Ákesiniń atı',
      noMiddleName: 'Ákesiniń atı joq',
      birthDate: 'Tuwılǵan sáne',
      phone: 'Telefon',
      comment: 'Pikir',
      privacy: '«Jazılıw» túymesin basıp, siz',
      privacyLink: 'maxfiylik siyasatın',
      submit: 'Dawam etiw',
      submitting: 'Jiberilip atır…',
      close: 'Jabıw',
      successTitle: 'Ariza qabıl etildi',
      successDesc: 'Koordinator tez arada telefon arqalı baylanıp, qabıllawdı tastıyıqlaydı.',
      successClose: 'Jabıw',
      requestNumber: 'Ariza nomeri',
    },
  },
}
