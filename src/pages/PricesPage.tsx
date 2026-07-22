import { useMemo, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import { specialtyDetails } from '../data/specialtyDetails'
import { filterEntries, groupByLetter, type PriceEntry } from '../lib/priceDirectory'
import '../styles/prices.css'

export default function PricesPage() {
  const { t } = useLanguage()
  const { home } = useCms()
  const [query, setQuery] = useState('')

  const entries = useMemo<PriceEntry[]>(() => {
    if (home?.specialties?.length) {
      return home.specialties.map((sp) => ({
        name: sp.name,
        slug: sp.slug,
      }))
    }
    return t.clinic.specialties.map((sp, i) => ({
      name: sp.name,
      slug: specialtyDetails[i]?.slug ?? `specialty-${i}`,
    }))
  }, [home?.specialties, t.clinic.specialties])

  const groups = useMemo(
    () => groupByLetter(filterEntries(entries, query)),
    [entries, query],
  )

  return (
    <section id="prices" className="prices-page">
      <div className="prices-page__glow" aria-hidden />
      <div className="container-main prices-page__inner">
        <header className="prices-page__head">
          <p className="prices-page__eyebrow">{t.clinic.prices}</p>
          <h1 className="prices-page__title">{t.prices.title}</h1>
          <p className="prices-page__note">{t.prices.note1}</p>
          <p className="prices-page__note">{t.prices.note2}</p>
        </header>

        <div className="prices-page__search">
          <svg className="prices-page__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.prices.searchPlaceholder}
            aria-label={t.prices.searchPlaceholder}
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>

        {groups.length === 0 ? (
          <p className="prices-page__empty" role="status">
            {t.prices.empty}
          </p>
        ) : (
          <div className="prices-dir" role="navigation" aria-label={t.prices.title}>
            {groups.map((group) => (
              <div key={group.letter} className="prices-dir__group">
                <h2 className="prices-dir__letter">{group.letter}</h2>
                <ul className="prices-dir__list">
                  {group.items.map((item) => (
                    <li key={item.slug}>
                      <a href={`/clinic/${item.slug}`} className="prices-dir__link">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
