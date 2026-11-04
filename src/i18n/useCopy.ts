import { useMemo } from 'react'
import { useLanguage } from './LanguageContext'
import { applyTextOverrides } from './textOverrides'
import type { Lang } from './types'

/**
 * Per-language static copy (e.g. CONTACT_COPY) with the clinic's admin edits applied.
 * `prefix` is the catalogue namespace used by scripts/export-site-texts.mjs.
 */
export function useCopy<T>(prefix: string, source: Record<Lang, T>): T {
  const { lang, textOverrides } = useLanguage()
  return useMemo(() => applyTextOverrides(source[lang] ?? source.uz, textOverrides, lang, prefix), [source, lang, textOverrides, prefix])
}

/** Same for a value that is computed per language (e.g. footer columns), wrapped as { cols: … }. */
export function useComputedCopy<T>(prefix: string, build: (lang: Lang) => T): T {
  const { lang, textOverrides } = useLanguage()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => applyTextOverrides(build(lang), textOverrides, lang, prefix), [lang, textOverrides, prefix])
}
