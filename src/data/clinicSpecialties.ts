import type { CmsHome } from '../api/client'
import type { ClinicSpecialtySlug } from './clinicContact'
import { CLINIC_SPECIALTY_SLUGS } from './clinicContact'
import {
  CLINIC_SPECIALTY_CATEGORIES,
  getClinicSpecialtyImage,
} from './specialtyImages'

export type ClinicSpecialtyCategory = (typeof CLINIC_SPECIALTY_CATEGORIES)[number]

export type ClinicSpecialtyListItem = {
  slug: ClinicSpecialtySlug
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

/** Canonical 11 departments — signage order, CMS extras ignored. */
export function buildClinicSpecialties(
  translations: ClinicSpecialtyTranslation[],
  cms?: CmsSpecialty[] | null,
): ClinicSpecialtyListItem[] {
  const cmsBySlug = new Map(cms?.map((item) => [item.slug, item]) ?? [])

  return CLINIC_SPECIALTY_SLUGS.map((slug, index) => {
    const fallback = translations[index]
    const fromCms = cmsBySlug.get(slug)

    return {
      slug,
      name: fromCms?.name ?? fallback?.name ?? slug,
      desc: fromCms?.desc ?? fallback?.desc ?? '',
      count: fromCms?.count ?? fallback?.count ?? 0,
      image: fromCms?.image || getClinicSpecialtyImage(slug),
      category: CLINIC_SPECIALTY_CATEGORIES[index] ?? 'therapy',
    }
  })
}
