import type { CmsHome } from '../api/client'
import { CLINIC_SPECIALTY_SLUGS } from './clinicContact'
import {
  CLINIC_SPECIALTY_CATEGORIES,
  getClinicSpecialtyCategory,
  getClinicSpecialtyImage,
} from './specialtyImages'

export type ClinicSpecialtyCategory = (typeof CLINIC_SPECIALTY_CATEGORIES)[number]

export type ClinicSpecialtyListItem = {
  slug: string
  name: string
  desc: string
  count: number
  image: string
  category: ClinicSpecialtyCategory
}

type ClinicSpecialtyTranslation = {
  name: string
  desc: string
  count: number
}

type CmsSpecialty = CmsHome['specialties'][number]

/**
 * CMS is the source of truth once it has data: every `is_active` Specialty
 * row shows up, in admin `order`, whether it's one of the original 11 or a
 * department added later — no frontend redeploy needed. The static
 * `translations` (11 departments, signage order) only cover the days the
 * CMS is unreachable or empty.
 */
export function buildClinicSpecialties(
  translations: ClinicSpecialtyTranslation[],
  cms?: CmsSpecialty[] | null,
): ClinicSpecialtyListItem[] {
  if (cms && cms.length > 0) {
    return cms.map((item) => ({
      slug: item.slug,
      name: item.name,
      desc: item.desc,
      count: item.count,
      image: item.image || getClinicSpecialtyImage(item.slug),
      category: getClinicSpecialtyCategory(item.slug),
    }))
  }

  return CLINIC_SPECIALTY_SLUGS.map((slug, index) => {
    const fallback = translations[index]
    return {
      slug,
      name: fallback?.name ?? slug,
      desc: fallback?.desc ?? '',
      count: fallback?.count ?? 0,
      image: getClinicSpecialtyImage(slug),
      category: CLINIC_SPECIALTY_CATEGORIES[index] ?? 'therapy',
    }
  })
}
