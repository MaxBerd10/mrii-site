import type { Lang } from '../i18n/types'

/** CMS stores uz/ru/en only — use CMS text on uz; all other UI langs use i18n. */
export function cmsLocalizedText(
  lang: Lang,
  cmsValue: string | undefined,
  fallback: string,
): string {
  return lang === 'uz' && cmsValue ? cmsValue : fallback
}

export function useCmsContent(lang: Lang): boolean {
  return lang === 'uz'
}
