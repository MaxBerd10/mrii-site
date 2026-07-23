import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ContentLang, Lang } from './types'
import { toContentLang } from './types'
import { translations, type Translations } from './translations'

const STORAGE_KEY = 'mrii-lang'

type LanguageContextValue = {
  lang: Lang
  contentLang: ContentLang
  setLang: (lang: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function detectLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
  if (saved && translations[saved]) return saved
  return 'uz'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

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
      value={{ lang, contentLang: toContentLang(lang), setLang, t: translations[lang] }}
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
