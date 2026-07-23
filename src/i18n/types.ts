export type Lang = 'uz' | 'ru' | 'en' | 'kaa'

/** Long-form content languages. Karakalpak UI falls back to Uzbek for these. */
export type ContentLang = 'uz' | 'ru' | 'en'

export function toContentLang(lang: Lang): ContentLang {
  return lang === 'kaa' ? 'uz' : lang
}

export const LANG_LABELS: Record<Lang, string> = {
  uz: "O'ZB",
  ru: 'РУС',
  en: 'ENG',
  kaa: 'QARA',
}

export const LANG_NAMES: Record<Lang, string> = {
  uz: "O'zbek",
  ru: 'Русский',
  en: 'English',
  kaa: 'Qaraqalpaq',
}
