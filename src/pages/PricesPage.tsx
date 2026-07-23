import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import {
  CHECKUP_DIRECTIONS,
  PRICE_CATALOG,
  PRICE_CATEGORIES,
  PRICE_LIST_UPDATED,
  formatSom,
  type CheckupTier,
  type PriceTier,
} from '../data/clinicPrices'
import '../styles/prices.css'

type Tab = 'packages' | 'catalog'

const TIER_ORDER: PriceTier[] = ['Layt', 'Standart', 'Premium']

export default function PricesPage() {
  const { lang, t } = useLanguage()
  const [tab, setTab] = useState<Tab>('packages')
  const [directionId, setDirectionId] = useState(CHECKUP_DIRECTIONS[0].id)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [expandedTier, setExpandedTier] = useState<Record<string, boolean>>({})

  const direction = CHECKUP_DIRECTIONS.find((d) => d.id === directionId) ?? CHECKUP_DIRECTIONS[0]

  const tiers = useMemo(() => {
    const map = new Map(direction.tiers.map((tier) => [tier.tier, tier]))
    return TIER_ORDER.map((key) => map.get(key)).filter(Boolean) as CheckupTier[]
  }, [direction])

  const filteredCatalog = useMemo(() => {
    const q = query.trim().toLocaleLowerCase()
    return PRICE_CATALOG.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (!q) return true
      return (
        item.name.toLocaleLowerCase().includes(q) ||
        item.category.toLocaleLowerCase().includes(q)
      )
    })
  }, [query, category])

  const catalogGroups = useMemo(() => {
    const map = new Map<string, typeof filteredCatalog>()
    for (const item of filteredCatalog) {
      const bucket = map.get(item.category)
      if (bucket) bucket.push(item)
      else map.set(item.category, [item])
    }
    return [...map.entries()]
  }, [filteredCatalog])

  const updatedLabel = useMemo(() => {
    const [y, m, d] = PRICE_LIST_UPDATED.split('-')
    if (lang === 'en') {
      return `${d} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(m) - 1]} ${y}`
    }
    if (lang === 'ru') {
      return `${Number(d)} ${['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][Number(m) - 1]} ${y}`
    }
    return `${Number(d)}.${m}.${y}`
  }, [lang])

  return (
    <section id="prices" className="prices-page">
      <div className="prices-page__atmosphere" aria-hidden />
      <div className="container-main prices-page__inner">
        <header className="prices-page__head">
          <p className="prices-page__eyebrow">{t.prices.eyebrow}</p>
          <h1 className="prices-page__title">{t.prices.title}</h1>
          <p className="prices-page__lead">{t.prices.lead}</p>
          <p className="prices-page__updated">
            {t.prices.updated}: {updatedLabel}
          </p>
        </header>

        <div className="prices-tabs" role="tablist" aria-label={t.prices.title}>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'packages'}
            className={`prices-tabs__btn${tab === 'packages' ? ' is-active' : ''}`}
            onClick={() => setTab('packages')}
          >
            {t.prices.tabPackages}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'catalog'}
            className={`prices-tabs__btn${tab === 'catalog' ? ' is-active' : ''}`}
            onClick={() => setTab('catalog')}
          >
            {t.prices.tabCatalog}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'packages' ? (
            <motion.div
              key="packages"
              className="prices-packages"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="prices-dirs" role="tablist" aria-label={t.prices.directionsLabel}>
                {CHECKUP_DIRECTIONS.map((dir) => (
                  <button
                    key={dir.id}
                    type="button"
                    role="tab"
                    aria-selected={directionId === dir.id}
                    className={`prices-dirs__btn${directionId === dir.id ? ' is-active' : ''}`}
                    style={{ ['--dir-accent' as string]: dir.accent }}
                    onClick={() => setDirectionId(dir.id)}
                  >
                    {dir.title}
                  </button>
                ))}
              </div>

              <p className="prices-packages__hint">{t.prices.packagesHint}</p>

              <div className="prices-tier-grid">
                {tiers.map((tier) => {
                  const featured = tier.tier === 'Standart'
                  const key = `${direction.id}-${tier.tier}`
                  const expanded = expandedTier[key] ?? false
                  const previewCount = 5
                  const visible = expanded ? tier.includes : tier.includes.slice(0, previewCount)
                  const hiddenCount = tier.includes.length - previewCount

                  return (
                    <article
                      key={key}
                      className={`prices-tier${featured ? ' prices-tier--featured' : ''}`}
                      style={{ ['--tier-accent' as string]: direction.accent }}
                    >
                      {featured ? (
                        <span className="prices-tier__badge">{t.prices.recommended}</span>
                      ) : null}
                      <header className="prices-tier__head">
                        <h2 className="prices-tier__name">{tier.tier}</h2>
                        <p className="prices-tier__price">
                          <strong>{formatSom(tier.price)}</strong>
                          <span>{t.prices.currency}</span>
                        </p>
                        <p className="prices-tier__per">{t.prices.perPerson}</p>
                      </header>

                      <ul className="prices-tier__list">
                        {visible.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>

                      {hiddenCount > 0 ? (
                        <button
                          type="button"
                          className="prices-tier__more"
                          onClick={() =>
                            setExpandedTier((prev) => ({ ...prev, [key]: !expanded }))
                          }
                        >
                          {expanded
                            ? t.prices.showLess
                            : t.prices.showMore.replace('{n}', String(hiddenCount))}
                        </button>
                      ) : null}

                      {tier.notes.length > 0 ? (
                        <p className="prices-tier__note">{tier.notes[0]}</p>
                      ) : null}

                      <a href="/doctors" className="prices-tier__cta">
                        {t.prices.book}
                      </a>
                    </article>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="catalog"
              className="prices-catalog"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="prices-catalog__toolbar">
                <div className="prices-page__search">
                  <svg
                    className="prices-page__search-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M16.5 16.5L21 21"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
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

                <label className="prices-catalog__filter">
                  <span className="sr-only">{t.prices.categoryLabel}</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label={t.prices.categoryLabel}
                  >
                    <option value="all">{t.prices.allCategories}</option>
                    {PRICE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="prices-catalog__legend" aria-hidden>
                <span>{t.prices.colService}</span>
                <span>{t.prices.colCitizen}</span>
                <span>{t.prices.colForeign}</span>
              </div>

              {catalogGroups.length === 0 ? (
                <p className="prices-page__empty" role="status">
                  {t.prices.empty}
                </p>
              ) : (
                <div className="prices-catalog__groups">
                  {catalogGroups.map(([cat, items]) => (
                    <section key={cat} className="prices-cat">
                      <h2 className="prices-cat__title">{cat}</h2>
                      <ul className="prices-cat__list">
                        {items.map((item) => (
                          <li key={item.id} className="prices-cat__row">
                            <div className="prices-cat__name">
                              <span>{item.name}</span>
                              {item.location ? (
                                <small>{item.location}</small>
                              ) : null}
                            </div>
                            <div className="prices-cat__citizen" data-label={t.prices.colCitizen}>
                              <em className="prices-cat__mobile-label">{t.prices.colCitizen}</em>
                              <strong>{formatSom(item.citizen)}</strong>
                              <span>{t.prices.currency}</span>
                            </div>
                            <div className="prices-cat__foreign" data-label={t.prices.colForeign}>
                              <em className="prices-cat__mobile-label">{t.prices.colForeign}</em>
                              {item.foreign != null ? (
                                <>
                                  <strong>{formatSom(item.foreign)}</strong>
                                  <span>{t.prices.currency}</span>
                                </>
                              ) : (
                                <span className="prices-cat__dash">—</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}

              <p className="prices-catalog__footnote">{t.prices.catalogNote}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
