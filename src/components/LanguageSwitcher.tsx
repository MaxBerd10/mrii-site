import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { LANG_LABELS, type Lang } from '../i18n/types'

const langs: Lang[] = ['uz', 'ru', 'en', 'kaa']
const languageAria: Record<Lang, string> = {
  uz: 'Tilni o‘zgartirish',
  ru: 'Изменить язык',
  en: 'Change language',
  kaa: 'Tildi ózgertiw',
}

export default function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={languageAria[lang]}
        aria-expanded={open}
        className={`lang-switcher ${compact ? 'lang-switcher--compact' : ''}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden style={{ opacity: 0.6 }}>
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M1.5 7h11M7 1.5c-1.2 1.6-1.8 3.2-1.8 5s0.6 3.4 1.8 5M7 1.5c1.2 1.6 1.8 3.2 1.8 5s-0.6 3.4-1.8 5" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        {LANG_LABELS[lang]}
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} aria-hidden />
          <div className="lang-menu">
            {langs.map(l => (
              <button
                key={l}
                type="button"
                className={`lang-menu__item ${lang === l ? 'lang-menu__item--active' : ''}`}
                onClick={() => { setLang(l); setOpen(false) }}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
