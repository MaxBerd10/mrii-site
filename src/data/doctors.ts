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
    content: { uz, ru, en },
  }
}

export const doctorProfiles: DoctorProfile[] = [
  profile(0, 'karimov-a-s', {
    name: 'Dr. Karimov A.S.', role: 'Terapevt', specialty: 'Terapiya', exp: '18 yil tajriba',
    about: 'Umumiy terapiya bo‘yicha tajribali mutaxassis. Surunkali kasalliklarni kuzatish, profilaktika va bemorga tushunarli davolash rejasini tuzishga e’tibor qaratadi.',
    education: ['Toshkent tibbiyot akademiyasi', 'Klinik ordinatura — terapiya'],
    focuses: ['Gipertoniya', 'Diabet monitoring', 'Profilaktik ko‘riklar'],
    languages: ["O‘zbek", 'Русский'],
  }, {
    name: 'Др. Каримов А.С.', role: 'Терапевт', specialty: 'Терапия', exp: '18 лет опыта',
    about: 'Опытный терапевт. Ведёт хронические заболевания, профилактику и понятные планы лечения.',
    education: ['Ташкентская медицинская академия', 'Клиническая ординатура — терапия'],
    focuses: ['Гипертония', 'Мониторинг диабета', 'Профилактические осмотры'],
    languages: ['Узбекский', 'Русский'],
  }, {
    name: 'Dr. Karimov A.S.', role: 'General practitioner', specialty: 'Therapy', exp: '18 years experience',
    about: 'Experienced physician focused on chronic care, prevention, and clear treatment plans.',
    education: ['Tashkent Medical Academy', 'Residency — Internal medicine'],
    focuses: ['Hypertension', 'Diabetes monitoring', 'Preventive checkups'],
    languages: ['Uzbek', 'Russian'],
  }, 24, 4),

  profile(1, 'yusupova-n-r', {
    name: 'Dr. Yusupova N.R.', role: 'Pediatr', specialty: 'Pediatriya', exp: '14 yil tajriba',
    about: 'Bolalar salomatligi, emlash va o‘sish monitoringi bo‘yicha ishlaydi. Ota-onalar bilan ochiq muloqotni muhim deb biladi.',
    education: ['Samarqand davlat tibbiyot instituti', 'Pediatriya ordinaturasi'],
    focuses: ['Bolalar infeksiyalari', 'O‘sish nazorati', 'Emlash'],
    languages: ["O‘zbek", 'Русский', 'English'],
  }, {
    name: 'Др. Юсупова Н.Р.', role: 'Педиатр', specialty: 'Педиатрия', exp: '14 лет опыта',
    about: 'Занимается здоровьем детей, вакцинацией и мониторингом роста.',
    education: ['Самаркандский мединститут', 'Ординатура — педиатрия'],
    focuses: ['Детские инфекции', 'Контроль роста', 'Вакцинация'],
    languages: ['Узбекский', 'Русский', 'English'],
  }, {
    name: 'Dr. Yusupova N.R.', role: 'Pediatrician', specialty: 'Pediatrics', exp: '14 years experience',
    about: 'Works with child health, vaccination, and growth monitoring.',
    education: ['Samarkand Medical Institute', 'Residency — Pediatrics'],
    focuses: ['Childhood infections', 'Growth tracking', 'Vaccination'],
    languages: ['Uzbek', 'Russian', 'English'],
  }, 19, 3),

  profile(2, 'rahimova-m-t', {
    name: 'Dr. Rahimova M.T.', role: 'Ginekolog', specialty: 'Ginekologiya', exp: '16 yil tajriba',
    about: 'Ayollar salomatligi, profilaktika va zamonaviy diagnostika yondashuvlariga asoslanadi.',
    education: ['Andijon davlat tibbiyot instituti', 'Ginekologiya ordinaturasi'],
    focuses: ['Profilaktik ko‘rik', 'Homiladorlik kuzatuvi', 'Ultratovush'],
    languages: ["O‘zbek", 'Русский'],
  }, {
    name: 'Др. Рахимова М.Т.', role: 'Гинеколог', specialty: 'Гинекология', exp: '16 лет опыта',
    about: 'Специализируется на женском здоровье, профилактике и современной диагностике.',
    education: ['Андижанский мединститут', 'Ординатура — гинекология'],
    focuses: ['Профилактика', 'Ведение беременности', 'УЗИ'],
    languages: ['Узбекский', 'Русский'],
  }, {
    name: 'Dr. Rahimova M.T.', role: 'Gynecologist', specialty: 'Gynecology', exp: '16 years experience',
    about: 'Focuses on women’s health, prevention, and modern diagnostics.',
    education: ['Andijan Medical Institute', 'Residency — Gynecology'],
    focuses: ['Preventive care', 'Pregnancy follow-up', 'Ultrasound'],
    languages: ['Uzbek', 'Russian'],
  }, 28, 5),

  profile(3, 'toshmatova-g-a', {
    name: 'Dr. Toshmatova G.A.', role: 'Kardiolog', specialty: 'Kardiologiya', exp: '20 yil tajriba',
    about: 'Yurak-qon tomir kasalliklarini erta aniqlash va uzoq muddatli kuzatuv bo‘yicha ishlaydi.',
    education: ['Toshkent tibbiyot akademiyasi', 'Kardiologiya ordinaturasi'],
    focuses: ['EKG', 'Arterial gipertenziya', 'Reabilitatsiya'],
    languages: ["O‘zbek", 'Русский', 'English'],
  }, {
    name: 'Др. Тошматова Г.А.', role: 'Кардиолог', specialty: 'Кардиология', exp: '20 лет опыта',
    about: 'Работает с ранней диагностикой и долгосрочным наблюдением сердечно-сосудистых заболеваний.',
    education: ['Ташкентская медицинская академия', 'Ординатура — кардиология'],
    focuses: ['ЭКГ', 'Артериальная гипертензия', 'Реабилитация'],
    languages: ['Узбекский', 'Русский', 'English'],
  }, {
    name: 'Dr. Toshmatova G.A.', role: 'Cardiologist', specialty: 'Cardiology', exp: '20 years experience',
    about: 'Specializes in early detection and long-term follow-up of cardiovascular disease.',
    education: ['Tashkent Medical Academy', 'Residency — Cardiology'],
    focuses: ['ECG', 'Hypertension', 'Cardiac rehab'],
    languages: ['Uzbek', 'Russian', 'English'],
  }, 41, 8),
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
  { slug: 'ergashev-b-m', uzName: 'Dr. Ergashev B.M.', ruName: 'Др. Эргашев Б.М.', roleUz: 'Jarroh', roleRu: 'Хирург', roleEn: 'Surgeon', specUz: 'Jarrohlik', specRu: 'Хирургия', specEn: 'Surgery', papers: 35, studies: 6 },
  { slug: 'saidova-l-h', uzName: 'Dr. Saidova L.H.', ruName: 'Др. Саидова Л.Х.', roleUz: 'Endokrinolog', roleRu: 'Эндокринолог', roleEn: 'Endocrinologist', specUz: 'Endokrinologiya', specRu: 'Эндокринология', specEn: 'Endocrinology', papers: 22, studies: 4 },
  { slug: 'nazarov-i-v', uzName: 'Dr. Nazarov I.V.', ruName: 'Др. Назаров И.В.', roleUz: 'Travmatolog', roleRu: 'Травматолог', roleEn: 'Traumatologist', specUz: 'Travmatologiya', specRu: 'Травматология', specEn: 'Traumatology', papers: 18, studies: 3 },
  { slug: 'usmonov-q-a', uzName: 'Prof. Usmonov Q.A.', ruName: 'Проф. Усмонов К.А.', roleUz: 'Onkolog', roleRu: 'Онколог', roleEn: 'Oncologist', specUz: 'Onkologiya', specRu: 'Онкология', specEn: 'Oncology', papers: 64, studies: 11, staffKind: 'professor' },
  { slug: 'xolmatov-s-r', uzName: 'Prof. Xolmatov S.R.', ruName: 'Проф. Холматов С.Р.', roleUz: 'Kardiolog', roleRu: 'Кардиолог', roleEn: 'Cardiologist', specUz: 'Kardiologiya', specRu: 'Кардиология', specEn: 'Cardiology', papers: 72, studies: 14, staffKind: 'professor' },
  { slug: 'ismoilova-z-b', uzName: 'Dr. Ismoilova Z.B.', ruName: 'Др. Исмоилова З.Б.', roleUz: 'Terapevt', roleRu: 'Терапевт', roleEn: 'General practitioner', specUz: 'Terapiya', specRu: 'Терапия', specEn: 'Therapy', papers: 15, studies: 2 },
  { slug: 'abdullayev-j-o', uzName: 'Dr. Abdullayev J.O.', ruName: 'Др. Абдуллаев Ж.О.', roleUz: 'Urolog', roleRu: 'Уролог', roleEn: 'Urologist', specUz: 'Urologiya', specRu: 'Урология', specEn: 'Urology', papers: 26, studies: 5 },
  { slug: 'qodirova-m-s', uzName: 'Dr. Qodirova M.S.', ruName: 'Др. Кодирова М.С.', roleUz: 'Oftalmolog', roleRu: 'Офтальмолог', roleEn: 'Ophthalmologist', specUz: 'Oftalmologiya', specRu: 'Офтальмология', specEn: 'Ophthalmology', papers: 12, studies: 2 },
  { slug: 'mirzayeva-a-n', uzName: 'Dr. Mirzayeva A.N.', ruName: 'Др. Мирзаева А.Н.', roleUz: 'Dermatolog', roleRu: 'Дерматолог', roleEn: 'Dermatologist', specUz: 'Dermatologiya', specRu: 'Дерматология', specEn: 'Dermatology', papers: 11, studies: 1 },
  { slug: 'hamidova-f-t', uzName: 'Dr. Hamidova F.T.', ruName: 'Др. Хамидова Ф.Т.', roleUz: 'LOR', roleRu: 'ЛОР', roleEn: 'ENT', specUz: 'Otorinolaringologiya', specRu: 'Оториноларингология', specEn: 'Otolaryngology', papers: 16, studies: 3 },
  { slug: 'sobirova-n-m', uzName: 'Dr. Sobirova N.M.', ruName: 'Др. Собирова Н.М.', roleUz: 'Akusher-ginekolog', roleRu: 'Акушер-гинеколог', roleEn: 'OB-GYN', specUz: 'Akusherlik', specRu: 'Акушерство', specEn: 'Obstetrics', papers: 33, studies: 7 },
  { slug: 'jorayeva-s-a', uzName: 'Dr. Joʻrayeva S.A.', ruName: 'Др. Жураева С.А.', roleUz: 'Pediatr', roleRu: 'Педиатр', roleEn: 'Pediatrician', specUz: 'Pediatriya', specRu: 'Педиатрия', specEn: 'Pediatrics', papers: 9, studies: 1 },
  { slug: 'rasulova-d-i', uzName: 'Dr. Rasulova D.I.', ruName: 'Др. Расулова Д.И.', roleUz: 'Nevrolog', roleRu: 'Невролог', roleEn: 'Neurologist', specUz: 'Nevrologiya', specRu: 'Неврология', specEn: 'Neurology', papers: 14, studies: 2 },
  { slug: 'toxtayeva-h-r', uzName: 'Dr. Toʻxtayeva H.R.', ruName: 'Др. Тухтаева Х.Р.', roleUz: 'Terapevt', roleRu: 'Терапевт', roleEn: 'General practitioner', specUz: 'Terapiya', specRu: 'Терапия', specEn: 'Therapy', papers: 20, studies: 3 },
  { slug: 'karimova-o-b', uzName: 'Dr. Karimova O.B.', ruName: 'Др. Каримова О.Б.', roleUz: 'Endokrinolog', roleRu: 'Эндокринолог', roleEn: 'Endocrinologist', specUz: 'Endokrinologiya', specRu: 'Эндокринология', specEn: 'Endocrinology', papers: 21, studies: 4 },
  { slug: 'hasanov-a-m', uzName: 'Dr. Hasanov A.M.', ruName: 'Др. Хасанов А.М.', roleUz: 'Anesteziolog', roleRu: 'Анестезиолог', roleEn: 'Anesthesiologist', specUz: 'Anesteziologiya', specRu: 'Анестезиология', specEn: 'Anesthesiology', papers: 18, studies: 3 },
  { slug: 'rahmonov-d-k', uzName: 'Dr. Rahmonov D.K.', ruName: 'Др. Рахмонов Д.К.', roleUz: 'Gastroenterolog', roleRu: 'Гастроэнтеролог', roleEn: 'Gastroenterologist', specUz: 'Gastroenterologiya', specRu: 'Гастроэнтерология', specEn: 'Gastroenterology', papers: 23, studies: 4 },
  { slug: 'sultanova-g-m', uzName: 'Dr. Sultanova G.M.', ruName: 'Др. Султанова Г.М.', roleUz: 'Revmatolog', roleRu: 'Ревматолог', roleEn: 'Rheumatologist', specUz: 'Revmatologiya', specRu: 'Ревматология', specEn: 'Rheumatology', papers: 16, studies: 2 },
  { slug: 'yusupov-b-t', uzName: 'Dr. Yusupov B.T.', ruName: 'Др. Юсупов Б.Т.', roleUz: 'Pulmonolog', roleRu: 'Пульмонолог', roleEn: 'Pulmonologist', specUz: 'Pulmonologiya', specRu: 'Пульмонология', specEn: 'Pulmonology', papers: 31, studies: 6 },
  { slug: 'azimova-n-k', uzName: 'Dr. Azimova N.K.', ruName: 'Др. Азимова Н.К.', roleUz: 'Infeksionist', roleRu: 'Инфекционист', roleEn: 'Infectious disease specialist', specUz: 'Infeksion kasalliklar', specRu: 'Инфекционные болезни', specEn: 'Infectious diseases', papers: 19, studies: 3 },
  { slug: 'nigmatova-s-a', uzName: 'Hamshira Nigmatova S.A.', ruName: 'Медсестра Нигматова С.А.', roleUz: 'Reanimatsiya hamshirasi', roleRu: 'Медсестра реанимации', roleEn: 'ICU nurse', specUz: 'Reanimatsiya', specRu: 'Реанимация', specEn: 'Intensive care', papers: 4, studies: 0, staffKind: 'nurse' },
  { slug: 'boboyeva-m-r', uzName: 'Hamshira Boboyeva M.R.', ruName: 'Медсестра Бобоева М.Р.', roleUz: 'Procedura hamshirasi', roleRu: 'Процедурная медсестра', roleEn: 'Procedure nurse', specUz: 'Procedura', specRu: 'Процедурный кабинет', specEn: 'Procedures', papers: 3, studies: 0, staffKind: 'nurse' },
  { slug: 'sharipova-d-a', uzName: 'Hamshira Sharipova D.A.', ruName: 'Медсестра Шарипова Д.А.', roleUz: 'Operatsion hamshira', roleRu: 'Операционная медсестра', roleEn: 'Operating nurse', specUz: 'Jarrohlik', specRu: 'Хирургия', specEn: 'Surgery', papers: 5, studies: 0, staffKind: 'nurse' },
  { slug: 'madaminova-l-k', uzName: 'Hamshira Madaminova L.K.', ruName: 'Медсестра Мадаминова Л.К.', roleUz: 'Bosh hamshira', roleRu: 'Старшая медсестра', roleEn: 'Head nurse', specUz: 'Terapiya', specRu: 'Терапия', specEn: 'Therapy', papers: 6, studies: 0, staffKind: 'nurse' },
  { slug: 'tursunov-a-r', uzName: 'Prof. Tursunov A.R.', ruName: 'Проф. Турсунов А.Р.', roleUz: 'Jarroh', roleRu: 'Хирург', roleEn: 'Surgeon', specUz: 'Jarrohlik', specRu: 'Хирургия', specEn: 'Surgery', papers: 48, studies: 9, staffKind: 'professor' },
  { slug: 'soliyev-m-h', uzName: 'Dr. Soliyev M.H.', ruName: 'Др. Солиев М.Х.', roleUz: 'Anesteziolog', roleRu: 'Анестезиолог', roleEn: 'Anesthesiologist', specUz: 'Anesteziologiya', specRu: 'Анестезиология', specEn: 'Anesthesiology', papers: 27, studies: 5 },
  { slug: 'xolmatov-a-s', uzName: 'Dr. Xolmatov A.S.', ruName: 'Др. Холматов А.С.', roleUz: 'Ortoped', roleRu: 'Ортопед', roleEn: 'Orthopedist', specUz: 'Ortopediya', specRu: 'Ортопедия', specEn: 'Orthopedics', papers: 21, studies: 4 },
  { slug: 'ganiyeva-z-m', uzName: 'Hamshira Ganiyeva Z.M.', ruName: 'Медсестра Ганиева З.М.', roleUz: 'Pediatriya hamshirasi', roleRu: 'Детская медсестра', roleEn: 'Pediatric nurse', specUz: 'Pediatriya', specRu: 'Педиатрия', specEn: 'Pediatrics', papers: 4, studies: 0, staffKind: 'nurse' },
  { slug: 'qosimov-r-b', uzName: 'Dr. Qosimov R.B.', ruName: 'Др. Косимов Р.Б.', roleUz: 'Kardiolog', roleRu: 'Кардиолог', roleEn: 'Cardiologist', specUz: 'Kardiologiya', specRu: 'Кардиология', specEn: 'Cardiology', papers: 29, studies: 6 },
]

for (let i = 0; i < REST.length; i++) {
  const r = REST[i]
  const idx = i + 4
  doctorProfiles.push(
    profile(idx, r.slug, {
      name: r.uzName,
      role: r.roleUz,
      specialty: r.specUz,
      exp: `${10 + (i % 12)} yil tajriba`,
      about: `${r.uzName} — ${r.specUz.toLowerCase()} yo‘nalishida bemorlarga klinik yordam ko‘rsatadi. Aniq diagnostika, individual yondashuv va doimiy kuzatuvga e’tibor beradi.`,
      education: ['Tibbiyot oliy ta’lim muassasasi', `${r.specUz} bo‘yicha klinik tayyorgarlik`],
      focuses: ['Diagnostika', 'Davolash rejasi', 'Kuzatuv'],
      languages: ["O‘zbek", 'Русский'],
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
    }, r.papers, r.studies, r.staffKind),
  )
}

export function getDoctorsBySpecialty(specialtyUz: string, excludeSlug?: string) {
  return doctorProfiles.filter(
    (d) => d.content.uz.specialty === specialtyUz && d.slug !== excludeSlug,
  )
}

export function getStaffByKind(kind: StaffKind | 'all') {
  if (kind === 'all') return doctorProfiles
  return doctorProfiles.filter((d) => d.staffKind === kind)
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
  const index = doctorProfiles.findIndex((d) => d.slug === slug)
  if (index < 0) return null
  return { profile: doctorProfiles[index], index }
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
    focuses: 'Yo‘nalishlar',
    languages: 'Tillar',
    book: 'Qabulga yozilish',
    papers: 'Maqolalar',
    studies: 'Tadqiqotlar',
    experience: 'Tajriba',
    related: 'Boshqa mutaxassislar',
    relatedSame: 'Boshqa {specialty} shifokorlari',
    relatedEmpty: 'Hozircha shu yo‘nalishda boshqa shifokor yo‘q.',
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
      noMiddleName: 'Otasining ismi yo‘q',
      birthDate: 'Tug‘ilgan sana',
      phone: 'Telefon',
      comment: 'Izoh',
      privacy: '«Yozilish» tugmasini bosib, siz',
      privacyLink: 'maxfiylik siyosatini',
      submit: 'Davom etish',
      submitting: 'Yuborilmoqda…',
      close: 'Yopish',
      successTitle: 'Ariza qabul qilindi',
      successDesc: 'Koordinator tez orada telefon orqali bog‘lanib, qabulni tasdiqlaydi.',
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
}
