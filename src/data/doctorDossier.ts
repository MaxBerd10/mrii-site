import type { Lang } from '../i18n/types'
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
  languages: string[]
  academicTitle: string
  /** Grade/title typed in the admin; empty = no badge is shown. */
  grade: string
}

export const DOSSIER_LOCALES: Record<Lang, DossierLocale> = {
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
  kaa: {
    profileLabel: 'Klinika mutaxassisi',
    available: 'Qabıllawǵa ariza ashıq',
    careerTitle: 'Kásiplik jol',
    careerDescription: 'Tájiriybe, jumıs orınları hám juwapkershilik dárejesi',
    education: 'Bilim hám maliyke',
    languages: 'Qabıllaw tilleri',
    science: 'Ilimiy iskerlik',
    focus: 'Járdem baǵdarları',
    current: 'házir',
    native: 'ana tili',
    fluent: 'erkin',
    training: 'Klinikalıq tayarlıq',
    regionalCenter: 'Wálayat medicina orayı',
    specialistCenter: 'Mamanlasqan klinikalıq ámeliyat',
    instituteClinic: 'FJSTI kóp tarmaqlı klinikası',
    seniorSpecialist: 'Jetekshi mutaxassis',
    demoNote: 'Jumıs orınları demo maǵlıwmat. CMS profili menen jańalanadı.',
    academicDoctor: 'Klinikalıq mutaxassis',
    academicNurse: 'Klinikalıq qamqorlıq mutaxassisi',
    academicProfessor: 'Medicina pánleri doktorı',
    seniorGrade: 'Joqarı dárejeli',
    clinicalMentor: 'Ilimiy basshı',
    patientCount: 'nawqas qabıl etildi',
    patientPeriod: 'Sońǵı 12 ay · klinika esabatı',
    quote: 'Nawqasqa tashxis túsindirilmey turıp emlew baslanbaydı. Túsingen nawqas — jobaǵa ámel qılatuǵın nawqas.',
    visit: {
      title: 'Qabıllaw qalay ótedi',
      address: 'Mánzil',
      addressValue: 'FJSTI klinikası, 2-korpus',
      addressNote: 'Farg’ona q., Marg’ilon jolı 2A · 3-qabat, 312-bólme',
      hours: 'Jumıs waqtı',
      hoursValue: 'Dú–Shá, 08:00–18:00',
      hoursNote: 'Jeksembi — gezekshi mutaxassis',
      firstVisit: 'Birinshi qabıllaw',
      firstVisitValue: '180 000 sum',
      firstVisitNote: 'Baslanǵısh tallaw baha ishinde · ~40 minut',
      followUp: 'Qayta qabıllaw',
      followUpValue: '120 000 sum',
      followUpNote: '30 kún ishinde — tegin qayta kóriw',
      insurance: 'Sug’urta',
      insuranceValue: 'Gross, Apex, Kafolat',
      insuranceNote: 'Jollama menen qabıl etiledi',
    },
  },
}

/** Years of practice as typed in the admin ("12 yil"); 0 when the doctor has none filled in. */
function parseExperience(value: string) {
  const match = (value || '').match(/\d+/)
  return match ? Number(match[0]) : 0
}

/**
 * Only facts typed in the admin are shown: grade, career entries, languages, experience.
 * Nothing is generated (no invented career steps, language levels, patient counts or quotes).
 */
export function getDoctorDossier(
  profile: DoctorProfile,
  lang: Lang,
  uiOverride?: DossierLocale,
): DoctorDossier {
  const ui = uiOverride ?? DOSSIER_LOCALES[lang]
  const view = profile.content[lang]
  const career = view.career ?? []

  return {
    ui,
    experienceYears: parseExperience(view.exp),
    milestones: career.map((entry, index) => ({
      range: entry.range,
      place: entry.place,
      role: entry.role,
      current: index === career.length - 1 && /[–-]\s*$/.test(entry.range),
    })),
    languages: view.languages,
    academicTitle:
      profile.staffKind === 'professor'
        ? ui.academicProfessor
        : profile.staffKind === 'nurse'
          ? ui.academicNurse
          : ui.academicDoctor,
    grade: view.grade ?? '',
  }
}
