/** Official clinic contact from FJSTI ko‘p tarmoqli klinikasi signage. */
export const CLINIC_PHONE_DISPLAY = '+998 73 245-58-20'
/** Local number without area prefix — for in-region call buttons. */
export const CLINIC_PHONE_LOCAL = '245-58-20'
export const CLINIC_PHONE_TEL = '+998732455820'
export const CLINIC_TELEGRAM_URL = 'https://t.me/ferghana_medical_institute'
export const CLINIC_TELEGRAM_HANDLE = '@ferghana_medical_institute'
export const CLINIC_WEBSITE = 'https://fjsti.uz'
export const CLINIC_SPECIALTY_COUNT = 11

/** Slugs in the order shown on clinic signage. */
export const CLINIC_SPECIALTY_SLUGS = [
  'ent',
  'gastroenterology',
  'pulmonology',
  'rheumatology',
  'cardiology',
  'laboratory',
  'intensive-care',
  'gynecology',
  'neurology',
  'surgery',
  'therapy',
] as const

export type ClinicSpecialtySlug = (typeof CLINIC_SPECIALTY_SLUGS)[number]
