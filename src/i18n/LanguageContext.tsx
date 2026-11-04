import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ContentLang, Lang } from './types'
import { toContentLang } from './types'
import { translations, type Translations } from './translations'
import { applyTextOverrides, type TextOverrides } from './textOverrides'
import { fetchTextOverrides } from '../api/client'

const STORAGE_KEY = 'fjsti-lang'
const OVERRIDES_KEY = 'fjsti-text-overrides-v1'

type LanguageContextValue = {
  lang: Lang
  contentLang: ContentLang
  setLang: (lang: Lang) => void
  t: Translations
  /** Texts edited in the admin; other static copy modules apply them with useCopy(). */
  textOverrides: TextOverrides | null
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function detectLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
  if (saved && translations[saved]) return saved
  return 'uz'
}

function readCachedOverrides(): TextOverrides | null {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY)
    return raw ? (JSON.parse(raw) as TextOverrides) : null
  } catch {
    return null
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)
  // Last known admin edits are applied instantly (no flash of old text), then refreshed.
  const [textOverrides, setTextOverrides] = useState<TextOverrides | null>(readCachedOverrides)

  useEffect(() => {
    let cancelled = false
    fetchTextOverrides().then((data) => {
      if (cancelled || !data) return
      setTextOverrides(data as TextOverrides)
      try {
        localStorage.setItem(OVERRIDES_KEY, JSON.stringify(data))
      } catch {
        /* storage full or blocked: the in-memory copy still works */
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const t = useMemo(() => applyTextOverrides(translations[lang], textOverrides, lang), [lang, textOverrides])

  const setLang = (next: Lang) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.lang = next === 'kaa' ? 'kaa' : next
  }

  useEffect(() => {
    document.documentElement.lang = lang === 'kaa' ? 'kaa' : lang
  }, [lang])

  return (
    <LanguageContext.Provider
      value={{ lang, contentLang: toContentLang(lang), setLang, t, textOverrides }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
