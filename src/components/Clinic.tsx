import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import { usePageNav } from './PageTransition'
import { staggerContainer, fadeUpSmall } from '../lib/animations'
import { buildClinicSpecialties } from '../data/clinicSpecialties'
import { useCmsContent } from '../lib/cmsLocalized'
import '../styles/clinic-catalog.css'

/**
 * THESIS: The clinic page is a care finder, not an institutional brochure.
 * OWN-WORLD: Daylight paper, deep clinical navy, sky-blue signals, large
 * medical atlas renders, and direct text links instead of decorative chrome.
 * STORY: A patient searches or filters, understands the available department,
 * opens its details, then reaches a doctor, price, or appointment.
 * FIRST VIEWPORT: Compact title and booking action, then one dominant search
 * field with three practical shortcuts — no brochure photo hero.
 * FORM: Finder-led specialty catalog, confirmed in the patient-first shape;
 * no concept seed was needed because the interaction path was specified.
 */

type ClinicCategory = 'all' | 'therapy' | 'surgery' | 'women' | 'diagnostics' | 'emergency'
type QuickActionKind = 'doctor' | 'price' | 'calendar'
type ClinicView = 'overview' | 'services' | 'diagnostics'

const CATEGORY_META: Record<Exclude<ClinicCategory, 'all'>, { color: string }> = {
  therapy: { color: '#087CA7' },
  surgery: { color: '#4E5AC7' },
  women: { color: '#B84072' },
  diagnostics: { color: '#168264' },
  emergency: { color: '#E85D04' },
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function QuickActionIcon({ kind }: { kind: QuickActionKind }) {
  const paths: Record<QuickActionKind, ReactNode> = {
    doctor: (
      <>
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M5.5 20c.5-4.1 2.7-6.2 6.5-6.2s6 2.1 6.5 6.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
    price: (
      <>
        <path d="M5 7.5h14v11H5zM7.5 4.5h9v3" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M8 13h8M8 16h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
    calendar: (
      <>
        <rect x="4.5" y="6" width="15" height="13.5" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 4v4M16 4v4M4.5 10h15M9 14h2v2H9z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {paths[kind]}
    </svg>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Clinic({ view = 'overview' }: { view?: ClinicView }) {
  const { t, lang } = useLanguage()
  const { home } = useCms()
  const preferCms = useCmsContent(lang)
  const { routeEnter } = usePageNav()
  const reduceMotion = useReducedMotion()
  const [filter, setFilter] = useState<ClinicCategory>(
    view === 'diagnostics' ? 'diagnostics' : 'all',
  )
  const [query, setQuery] = useState('')
  const [courtyardTime, setCourtyardTime] = useState<'day' | 'evening'>('day')
  const isFocusedView = view !== 'overview'
  const isEvening = courtyardTime === 'evening'
  const focusedTitle =
    view === 'diagnostics' ? t.nav.children.diagnostics : t.nav.children.services

  useEffect(() => {
    setFilter(view === 'diagnostics' ? 'diagnostics' : 'all')
    setQuery('')
  }, [view])

  const specialties = useMemo(
    () =>
      buildClinicSpecialties(
        t.clinic.specialties,
        preferCms ? home?.specialties : null,
      ),
    [home, preferCms, t.clinic.specialties],
  )

  const filters = useMemo(() => {
    const counts = {
      all: specialties.length,
      therapy: specialties.filter((s) => s.category === 'therapy').length,
      surgery: specialties.filter((s) => s.category === 'surgery').length,
      women: specialties.filter((s) => s.category === 'women').length,
      diagnostics: specialties.filter((s) => s.category === 'diagnostics').length,
      emergency: specialties.filter((s) => s.category === 'emergency').length,
    }
    return [
      { id: 'all' as const, label: t.clinic.filters.all, count: counts.all, color: null },
      { id: 'therapy' as const, label: t.clinic.filters.therapy, count: counts.therapy, color: CATEGORY_META.therapy.color },
      { id: 'surgery' as const, label: t.clinic.filters.surgery, count: counts.surgery, color: CATEGORY_META.surgery.color },
      { id: 'women' as const, label: t.clinic.filters.women, count: counts.women, color: CATEGORY_META.women.color },
      { id: 'diagnostics' as const, label: t.clinic.filters.diagnostics, count: counts.diagnostics, color: CATEGORY_META.diagnostics.color },
      { id: 'emergency' as const, label: t.clinic.filters.emergency, count: counts.emergency, color: CATEGORY_META.emergency.color },
    ]
  }, [specialties, t.clinic.filters])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()

    return specialties.filter((specialty) => {
      const matchesCategory = filter === 'all' || specialty.category === filter
      const matchesQuery =
        !normalizedQuery ||
        `${specialty.name} ${specialty.desc}`.toLocaleLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [filter, query, specialties])

  const categoryLabel = (category: ClinicCategory) => {
    if (category === 'all') return ''
    return t.clinic.filters[category]
  }

  const clearSearch = () => {
    setQuery('')
    setFilter('all')
  }

  const quickActions = [
    {
      href: '/doctors',
      kind: 'doctor' as const,
      title: t.clinic.findDoctor,
      description: t.clinic.findDoctorDesc,
    },
    {
      href: '/prices',
      kind: 'price' as const,
      title: t.clinic.viewPrices,
      description: t.clinic.viewPricesDesc,
    },
    {
      href: '/contacts?intent=booking',
      kind: 'calendar' as const,
      title: t.clinic.bookNow,
      description: t.clinic.bookNowDesc,
    },
  ]

  return (
    <section id="clinic" className="clinic-section clinic-section--catalog">
      <div className="container-main clinic-catalog-page">
        <div className="clinic-opening">
          {!isFocusedView ? (
            <section className={`clinic-courtyard${isEvening ? ' is-evening' : ''}`} aria-label={t.clinic.gallery.title}>
              <div className="clinic-courtyard__scene">
                <motion.img
                  className="clinic-courtyard__image"
                  src="/images/clinic-gallery/courtyard-day.webp"
                  alt={t.clinic.gallery.items.courtyardDay}
                  fetchPriority="high"
                  decoding="async"
                  initial={false}
                  animate={{ opacity: isEvening ? 0 : 1, scale: isEvening ? 1.025 : 1 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.img
                  className="clinic-courtyard__image"
                  src="/images/clinic-gallery/courtyard-evening.webp"
                  alt={t.clinic.gallery.items.courtyardEvening}
                  loading="eager"
                  decoding="async"
                  initial={false}
                  animate={{ opacity: isEvening ? 1 : 0, scale: isEvening ? 1 : 1.025 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
                <span className="clinic-courtyard__lights" aria-hidden />
                <div className="clinic-courtyard__shade" aria-hidden />
                <div className="clinic-courtyard__controls">
                  <div>
                    <span>{t.clinic.gallery.label}</span>
                    <strong>{isEvening ? t.clinic.gallery.items.courtyardEvening : t.clinic.gallery.items.courtyardDay}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCourtyardTime((current) => (current === 'day' ? 'evening' : 'day'))}
                    aria-pressed={isEvening}
                  >
                    <i aria-hidden>{isEvening ? '☀' : '☾'}</i>
                    {isEvening ? t.clinic.gallery.items.courtyardDay : t.clinic.gallery.items.courtyardEvening}
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          <header className={`clinic-intro${isFocusedView ? ' clinic-intro--focused' : ''}`}>
            {isFocusedView ? (
              <div className="clinic-intro__meta">
                <a href="/clinic" className="clinic-intro__back">
                  <span aria-hidden>←</span>
                  {t.nav.clinic}
                </a>
                <span className="clinic-intro__label">
                  <span className="clinic-intro__dot" aria-hidden />
                  {t.clinic.label}
                </span>
              </div>
            ) : (
              <span className="clinic-intro__label">
                <span className="clinic-intro__dot" aria-hidden />
                {t.clinic.label}
              </span>
            )}
            <h1 className="clinic-intro__title">
              {isFocusedView ? (
                focusedTitle
              ) : (
                <>
                  {t.clinic.title1} <em>{t.clinic.title2}</em>
                </>
              )}
            </h1>
            <p className="clinic-intro__desc">
              {isFocusedView ? t.clinic.catalogDescription : t.clinic.description}
            </p>
            <a href="/contacts?intent=booking" className="clinic-intro__cta">
              {t.clinic.bookBtn}
              <Arrow />
            </a>
          </header>

          {!isFocusedView ? (
            <div className="clinic-portal">
              <a href="/clinic/services" className="clinic-portal__primary">
                <span className="clinic-portal__eyebrow">{t.clinic.catalogTitle}</span>
                <strong className="clinic-portal__count">
                  {specialties.length}
                  <small>{t.clinic.resultsLabel}</small>
                </strong>
                <p className="clinic-portal__desc">{t.clinic.catalogDescription}</p>
                <span className="clinic-portal__cats" aria-hidden>
                  {filters
                    .filter((item) => item.id !== 'all' && item.count > 0)
                    .map((item) => (
                      <span key={item.id} className="clinic-portal__cat">
                        <span className="clinic-portal__cat-dot" style={{ background: item.color ?? undefined }} />
                        {item.label}
                      </span>
                    ))}
                </span>
                <span className="clinic-portal__cta">
                  {t.nav.children.services}
                  <Arrow />
                </span>
              </a>

              <nav className="clinic-quick-actions clinic-quick-actions--portal" aria-label={t.clinic.label}>
                {quickActions.map((action) => (
                  <a key={action.href} href={action.href} className="clinic-quick-action">
                    <span className="clinic-quick-action__icon">
                      <QuickActionIcon kind={action.kind} />
                    </span>
                    <span>
                      <strong>{action.title}</strong>
                      <small>{action.description}</small>
                    </span>
                    <Arrow />
                  </a>
                ))}
              </nav>
            </div>
          ) : null}
        </div>

        {isFocusedView ? (
          <>
            <div className="clinic-results-head">
              <h2>{t.clinic.catalogTitle}</h2>
              <span className="clinic-results-count" aria-live="polite">
                <strong>{filtered.length}</strong> {t.clinic.resultsLabel}
              </span>
            </div>

            <div className="clinic-catalog-controls">
              <div className="clinic-toolbar" role="tablist" aria-label={t.clinic.catalogTitle}>
                {filters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={filter === item.id}
                    className={`clinic-toolbar__btn${filter === item.id ? ' is-active' : ''}`}
                    onClick={() => setFilter(item.id)}
                  >
                    {item.color ? (
                      <span className="clinic-toolbar__dot" style={{ background: item.color }} aria-hidden />
                    ) : null}
                    <span className="clinic-toolbar__text">{item.label}</span>
                    <span className="clinic-toolbar__count">{item.count}</span>
                  </button>
                ))}
              </div>

              <label className="clinic-catalog-search">
                <SearchIcon />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.clinic.searchPlaceholder}
                  autoComplete="off"
                  aria-label={t.clinic.searchLabel}
                />
                {query ? (
                  <button type="button" onClick={() => setQuery('')} aria-label={t.clinic.clearSearch}>
                    ×
                  </button>
                ) : null}
              </label>
            </div>

            {filtered.length ? (
          <motion.div
            key={`${filter}-${lang}`}
            className="clinic-catalog"
            variants={staggerContainer(0.035, 0)}
            initial={routeEnter ? 'hidden' : false}
            animate="show"
          >
            {filtered.map((specialty) => {
              const color =
                CATEGORY_META[specialty.category as Exclude<ClinicCategory, 'all'>].color
              return (
                <motion.a
                  layout
                  key={specialty.slug}
                  href={`/clinic/${specialty.slug}`}
                  className="clinic-card"
                  variants={fadeUpSmall}
                  style={{ '--clinic-cat': color } as CSSProperties}
                >
                  <div className="clinic-card__body">
                    <span className="clinic-card__cat">
                      <span className="clinic-card__cat-dot" aria-hidden />
                      {categoryLabel(specialty.category)}
                    </span>
                    <strong className="clinic-card__name">{specialty.name}</strong>
                    <p className="clinic-card__desc">{specialty.desc}</p>
                    <span className="clinic-card__meta">
                      <span>
                        {specialty.count} {t.clinic.doctorsCount}
                      </span>
                      <span className="clinic-card__link">
                        {t.clinic.viewSpecialty}
                        <Arrow />
                      </span>
                    </span>
                  </div>
                  <div className="clinic-card__media" aria-hidden>
                    <span />
                    <img src={specialty.image} alt="" loading="lazy" decoding="async" />
                  </div>
                </motion.a>
              )
            })}
          </motion.div>
        ) : (
          <div className="clinic-empty" role="status">
            <SearchIcon />
            <h3>{t.clinic.emptyTitle}</h3>
            <p>{t.clinic.emptyDescription}</p>
            <button type="button" onClick={clearSearch}>
              {t.clinic.clearSearch}
            </button>
          </div>
        )}
          </>
        ) : null}
      </div>
    </section>
  )
}
