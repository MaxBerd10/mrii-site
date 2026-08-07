import { CLINIC_SPECIALTY_SLUGS, type ClinicSpecialtySlug } from './clinicContact'

/** Stable slug → image map for the 11 clinic departments on signage. */
export const CLINIC_SPECIALTY_IMAGES: Record<ClinicSpecialtySlug, string> = {
  ent: '/images/medical/thyroid-transparent-3d.png',
  gastroenterology: '/images/medical/digestive-transparent-3d.png',
  pulmonology: '/images/medical/pulmonology-transparent-3d.png',
  rheumatology: '/images/medical/rehabilitation-transparent-3d.png',
  cardiology: '/images/medical/anatomical-heart-transparent.png',
  laboratory: '/images/medical/dna-isolated-v2.png',
  'intensive-care': '/images/medical/diagnostics-transparent-3d.png',
  gynecology: '/images/medical/gynecology-transparent-3d.png',
  neurology: '/images/medical/brain-transparent-3d.png',
  surgery: '/images/medical/surgery-transparent-3d.png',
  therapy: '/images/medical/therapy-transparent-3d.png',
}

export function getClinicSpecialtyImage(slug: string): string {
  if (slug in CLINIC_SPECIALTY_IMAGES) {
    return CLINIC_SPECIALTY_IMAGES[slug as ClinicSpecialtySlug]
  }
  return CLINIC_SPECIALTY_IMAGES.therapy
}

/** Filter categories aligned with CLINIC_SPECIALTY_SLUGS order. */
export const CLINIC_SPECIALTY_CATEGORIES = [
  'therapy',
  'therapy',
  'therapy',
  'therapy',
  'therapy',
  'diagnostics',
  'emergency',
  'women',
  'therapy',
  'surgery',
  'therapy',
] as const

export type ClinicSpecialtyCategoryValue = (typeof CLINIC_SPECIALTY_CATEGORIES)[number]

/** Category for CMS specialties beyond the original 11 (keyed by slug). */
const EXTRA_SPECIALTY_CATEGORIES: Record<string, ClinicSpecialtyCategoryValue> = {
  pediatrics: 'women',
  rehabilitation: 'therapy',
  diagnostics: 'diagnostics',
  oncology: 'surgery',
  urology: 'surgery',
  endocrinology: 'therapy',
}

export function getClinicSpecialtyCategory(slug: string): ClinicSpecialtyCategoryValue {
  const knownIndex = CLINIC_SPECIALTY_SLUGS.indexOf(slug as ClinicSpecialtySlug)
  if (knownIndex >= 0) return CLINIC_SPECIALTY_CATEGORIES[knownIndex]
  return EXTRA_SPECIALTY_CATEGORIES[slug] ?? 'therapy'
}

export { CLINIC_SPECIALTY_SLUGS }
