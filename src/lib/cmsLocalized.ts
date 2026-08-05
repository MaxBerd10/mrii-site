import type { ContentLang } from '../i18n/types'

/** CMS pick() falls back to Uzbek when RU/EN fields are empty — keep i18n off uz. */
export function cmsLocalizedText(
  contentLang: ContentLang,
  cmsValue: string | undefined,
  fallback: string,
): string {
  return contentLang === 'uz' && cmsValue ? cmsValue : fallback
}
