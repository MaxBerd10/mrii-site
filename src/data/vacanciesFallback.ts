import type { CmsVacancy, VacancyCategory, VacancyEmployment } from '../api/client'
import type { Lang } from '../i18n/types'

export type FallbackVacancy = {
  id: string
  category: VacancyCategory
  employment: VacancyEmployment
  title: string
  department: string
  location: string
  experience: string
  description: string
  requirements: string[]
  deadline: string | null
  order: number
}

export const FALLBACK_VACANCIES: FallbackVacancy[] = [
  {
    id: 'terapevt',
    category: 'doctor',
    employment: 'full_time',
    title: 'Terapevt',
    department: 'Terapiya bo’limi',
    location: 'Farg’ona, FJSTI klinikasi',
    experience: '3+ yil',
    description: 'Ambulator qabul, kasallik tarixi va davolash rejasi yuritish.',
    requirements: ['Tibbiyot oliy ma’lumoti', 'Tibbiyot sertifikati', 'UZ/RU tilida erkin muloqot'],
    deadline: '2026-12-31',
    order: 1,
  },
  {
    id: 'klinik-hamshira',
    category: 'nurse',
    employment: 'full_time',
    title: 'Klinik hamshira',
    department: 'Statsionar bo’lim',
    location: 'Farg’ona, FJSTI klinikasi',
    experience: '1+ yil',
    description: 'Statsionarda bemor parvarishi va shifokor bilan hamkorlik.',
    requirements: ['O’rta maxsus tibbiy ma’lumot', 'Hamshiralik sertifikati', 'Navbatli ishga tayyorlik'],
    deadline: '2026-12-31',
    order: 2,
  },
  {
    id: 'laboratoriya-mutaxassisi',
    category: 'other',
    employment: 'full_time',
    title: 'Laboratoriya mutaxassisi',
    department: 'Laboratoriya',
    location: 'Farg’ona, FJSTI klinikasi',
    experience: '2+ yil',
    description: 'Klinik tahlillar o’tkazish va natijalarni rasmiylashtirish.',
    requirements: ['Laboratoriya bo’yicha ma’lumot', 'Tahlil uskunalari bilan ishlash tajribasi', 'Diqqat va tartib'],
    deadline: '2026-12-31',
    order: 3,
  },
]

const KAA_FALLBACK_VACANCIES: FallbackVacancy[] = [
  {
    id: 'terapevt',
    category: 'doctor',
    employment: 'full_time',
    title: 'Terapevt',
    department: 'Terapiya bólimi',
    location: 'Farg’ona, FJSTI klinikası',
    experience: '3+ jıl',
    description: 'Ambulator qabıl, kesellik tarihi hám emlew rejesi júrgiziw.',
    requirements: ['Medicina joqarı ma’lumotı', 'Medicina sertifikatı', 'Qaraqalpaq/O’zbek/Rus tilinde erkin sóylesiw'],
    deadline: '2026-12-31',
    order: 1,
  },
  {
    id: 'klinik-hamshira',
    category: 'nurse',
    employment: 'full_time',
    title: 'Klinikalıq hamshira',
    department: 'Statsionar bólim',
    location: 'Farg’ona, FJSTI klinikası',
    experience: '1+ jıl',
    description: 'Statsionarda nawqas parvarish hám shıpaker menen birgelikte islew.',
    requirements: ['O’rta arnalǵan medicina ma’lumotı', 'Hamshiralıq sertifikatı', 'Navbatlı jumısqa dayarlıq'],
    deadline: '2026-12-31',
    order: 2,
  },
  {
    id: 'laboratoriya-mutaxassisi',
    category: 'other',
    employment: 'full_time',
    title: 'Laboratoriya mutaxassisi',
    department: 'Laboratoriya',
    location: 'Farg’ona, FJSTI klinikası',
    experience: '2+ jıl',
    description: 'Klinikalıq tahliller ótkeriw hám nátiyjelerdi rasmiylestiriw.',
    requirements: ['Laboratoriya boyınsha ma’lumot', 'Tahlil uskunalari menen islew tájiriybesi', 'Diqqat hám tartip'],
    deadline: '2026-12-31',
    order: 3,
  },
]

export function getFallbackVacancies(lang: Lang): CmsVacancy[] {
  if (lang === 'kaa') return KAA_FALLBACK_VACANCIES
  return FALLBACK_VACANCIES
}
