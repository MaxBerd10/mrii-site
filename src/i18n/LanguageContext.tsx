import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ContentLang, Lang } from './types'
import { toContentLang } from './types'
import { translations, type Translations } from './translations'
import { applyTextOverrides, type TextOverrides } from './textOverrides'
import { fetchSiteConfig, type SiteConfig } from '../api/client'
import { setAssetOverrides } from '../lib/assetOverrides'
import { applyContacts, resolveContacts, type ContactOverrides, type Contacts } from '../lib/contacts'

const STORAGE_KEY = 'fjsti-lang'
const OVERRIDES_KEY = 'fjsti-site-config-v2'

type LanguageContextValue = {
  lang: Lang
  contentLang: ContentLang
  setLang: (lang: Lang) => void
  t: Translations
  /** Texts edited in the admin; other static copy modules apply them with useCopy(). */
  textOverrides: TextOverrides | null
  /** Phone / Telegram / site / email / map address (admin-set values over the built-in ones). */
  contacts: Contacts
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function detectLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
  if (saved && translations[saved]) return saved
  return 'uz'
}

export function readCachedConfig(): SiteConfig | null {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY)
    return raw ? (JSON.parse(raw) as SiteConfig) : null
  } catch {
    return null
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)
  // Last known admin edits are applied instantly (no flash of old text), then refreshed.
  const [config, setConfig] = useState<SiteConfig | null>(readCachedConfig)

  useEffect(() => {
    let cancelled = false
    fetchSiteConfig().then((data) => {
      if (cancelled || !data) return
      setConfig(data)
      setAssetOverrides(data.assets)
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

  const textOverrides = (config?.texts as TextOverrides | undefined) ?? null
  const contacts = useMemo(() => resolveContacts(config?.contacts as ContactOverrides | undefined), [config])
  const t = useMemo(
    () => applyContacts(applyTextOverrides(translations[lang], textOverrides, lang), contacts),
    [lang, textOverrides, contacts],
  )

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
      value={{ lang, contentLang: toContentLang(lang), setLang, t, textOverrides, contacts }}
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
