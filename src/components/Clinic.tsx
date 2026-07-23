import { useMemo, useState, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import { usePageNav } from './PageTransition'
import { staggerContainer, fadeUpSmall } from '../lib/animations'
import { media } from '../data/media'
import { specialtyDetails } from '../data/specialtyDetails'
import '../styles/clinic-catalog.css'

type ClinicCategory = 'all' | 'therapy' | 'surgery' | 'women' | 'diagnostics'

const SPECIALTY_IMAGES = Object.values(media.clinic)

const SPECIALTY_CATEGORIES: ClinicCategory[] = [
  'therapy',
  'therapy',
  'therapy',
  'therapy',
  'therapy',
  'surgery',
  'women',
  'women',
  'surgery',
  'diagnostics',
  'diagnostics',
  'surgery',
]

const CATEGORY_META: Record<
  Exclude<ClinicCategory, 'all'>,
  { color: string }
> = {
  therapy: { color: '#0EA5E9' },
  surgery: { color: '#6366F1' },
  women: { color: '#DB2777' },
  diagnostics: { color: '#059669' },
}

export default function Clinic() {
  const { t, lang } = useLanguage()
  const { home } = useCms()
  const { routeEnter } = usePageNav()
  const [filter, setFilter] = useState<ClinicCategory>('all')

  const specialties = useMemo(() => {
    const base = home?.specialties?.length
      ? home.specialties.map((sp, i) => ({
          slug: sp.slug,
          name: sp.name,
          desc: sp.desc,
          count: sp.count,
          image: sp.image || SPECIALTY_IMAGES[i % SPECIALTY_IMAGES.length],
          category: SPECIALTY_CATEGORIES[i] ?? 'therapy',
        }))
      : t.clinic.specialties.map((sp, i) => ({
          slug: specialtyDetails[i]?.slug ?? `specialty-${i}`,
          name: sp.name,
          desc: sp.desc,
          count: sp.count,
          image: SPECIALTY_IMAGES[i] ?? SPECIALTY_IMAGES[0],
          category: SPECIALTY_CATEGORIES[i] ?? 'therapy',
        }))
    return base
  }, [home, t.clinic.specialties])

  const filters = useMemo(() => {
    const counts = {
      all: specialties.length,
      therapy: specialties.filter((s) => s.category === 'therapy').length,
      surgery: specialties.filter((s) => s.category === 'surgery').length,
      women: specialties.filter((s) => s.category === 'women').length,
      diagnostics: specialties.filter((s) => s.category === 'diagnostics').length,
    }
    return [
      { id: 'all' as const, label: t.clinic.filters.all, count: counts.all, color: null },
      { id: 'therapy' as const, label: t.clinic.filters.therapy, count: counts.therapy, color: CATEGORY_META.therapy.color },
      { id: 'surgery' as const, label: t.clinic.filters.surgery, count: counts.surgery, color: CATEGORY_META.surgery.color },
      { id: 'women' as const, label: t.clinic.filters.women, count: counts.women, color: CATEGORY_META.women.color },
      { id: 'diagnostics' as const, label: t.clinic.filters.diagnostics, count: counts.diagnostics, color: CATEGORY_META.diagnostics.color },
    ]
  }, [specialties, t.clinic.filters])

  const filtered = filter === 'all' ? specialties : specialties.filter((s) => s.category === filter)

  const categoryLabel = (cat: ClinicCategory) => {
    if (cat === 'all') return ''
    return t.clinic.filters[cat]
  }

  return (
    <section id="clinic" className="clinic-section clinic-section--catalog">
      <div className="container-main clinic-catalog-page">
        <header className="clinic-hero">
          <div className="clinic-hero__copy">
            <span className="clinic-hero__label">
              <span className="clinic-hero__dot" aria-hidden />
              {t.clinic.label}
            </span>
            <h1 className="clinic-hero__title">
              {t.clinic.title1} <em>{t.clinic.title2}</em>
            </h1>
            <p className="clinic-hero__desc">{t.clinic.description}</p>
          </div>
          <div className="clinic-hero__aside">
            <a href="/contacts" className="clinic-hero__cta">
              {t.clinic.bookBtn}
            </a>
          </div>
        </header>

        <div className="clinic-toolbar" role="tablist" aria-label={t.clinic.label}>
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`clinic-toolbar__btn${filter === f.id ? ' is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.color ? (
                <span className="clinic-toolbar__dot" style={{ background: f.color }} aria-hidden />
              ) : null}
              <span className="clinic-toolbar__text">{f.label}</span>
              <span className="clinic-toolbar__count">{f.count}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={`${filter}-${lang}`}
          className="clinic-catalog"
          variants={staggerContainer(0.03, 0)}
          initial={routeEnter ? 'hidden' : false}
          animate="show"
        >
          {filtered.map((sp) => {
            const color = CATEGORY_META[sp.category as Exclude<ClinicCategory, 'all'>].color
            return (
              <motion.a
                key={sp.slug}
                href={`/clinic/${sp.slug}`}
                className="clinic-card"
                variants={fadeUpSmall}
                style={{ '--clinic-cat': color } as CSSProperties}
              >
                <div className="clinic-card__media">
                  <img src={sp.image} alt="" loading="lazy" />
                </div>
                <div className="clinic-card__body">
                  <span className="clinic-card__cat">
                    <span className="clinic-card__cat-dot" aria-hidden />
                    {categoryLabel(sp.category)}
                  </span>
                  <strong className="clinic-card__name">{sp.name}</strong>
                  <p className="clinic-card__desc">{sp.desc}</p>
                  <span className="clinic-card__meta">
                    {sp.count} {t.clinic.doctorsCount}
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </motion.a>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
