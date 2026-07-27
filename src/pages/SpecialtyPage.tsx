import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import { fetchSpecialty, isCmsEnabled, type CmsSpecialtyDetail } from '../api/client'
import { media } from '../data/media'
import { getSpecialtyBySlug, specialtyDetails, specialtyPageLabels } from '../data/specialtyDetails'
import {
  getSpecialtyDoctors,
  getSpecialtyWorld,
  specialtyWorldLabels,
} from '../data/specialtyWorld'
import { staggerContainer, fadeUpSmall, EASE_OUT } from '../lib/animations'
import SectionBackLink from '../components/ui/SectionBackLink'
import Magnetic from '../components/ui/Magnetic'
import NotFoundPage from './NotFoundPage'
import '../styles/specialty-world.css'

/**
 * THESIS: A specialty page is a clear care plan, not an AI control room.
 * OWN-WORLD: Daylight paper, clinical navy, one department accent, open rails,
 * real doctor portraits, and one atlas-scale organ image.
 * STORY: The patient understands the department, checks conditions, services,
 * and diagnostics, sees the visit pathway and doctors, then books.
 * FIRST VIEWPORT: Plain-language department copy and actions sit beside one
 * large medical image; verified practical facts are visible without scrolling.
 * FORM: Patient pathway detail, extending the confirmed finder-led clinic
 * catalog; no concept seed was needed because the task sequence is fixed.
 */

const SPECIALTY_IMAGES = Object.values(media.clinic)

type ViewModel = {
  slug: string
  name: string
  count: number
  image: string
  overview: string
  conditions: string[]
  services: string[]
  diagnostics: string[]
  index: number
}

type CareIconKind = 'conditions' | 'services' | 'diagnostics'
type ActiveSection = 'specialty-care' | 'specialty-pathway' | 'specialty-doctors'

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CareIcon({ kind }: { kind: CareIconKind }) {
  const paths: Record<CareIconKind, ReactNode> = {
    conditions: (
      <path d="M12 20s-7-4.2-7-10.2A4.3 4.3 0 0 1 12 6.5a4.3 4.3 0 0 1 7 3.3C19 15.8 12 20 12 20Z" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" />
    ),
    services: (
      <>
        <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
    diagnostics: (
      <>
        <path d="M5 19h14M8 16h8M9 5h6v8H9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M7 5h10M12 2v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {paths[kind]}
    </svg>
  )
}

export default function SpecialtyPage({ slug }: { slug: string }) {
  const { lang, contentLang, t } = useLanguage()
  const { home } = useCms()
  const reduce = useReducedMotion()
  const labels = specialtyPageLabels[contentLang]
  const worldLabels = specialtyWorldLabels[contentLang]
  const world = getSpecialtyWorld(slug)
  const staticMatch = getSpecialtyBySlug(slug)
  const [cmsDetail, setCmsDetail] = useState<CmsSpecialtyDetail | null>(null)
  const [triedCms, setTriedCms] = useState(!isCmsEnabled())
  const [activeSection, setActiveSection] = useState<ActiveSection>('specialty-care')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (!isCmsEnabled()) {
      setCmsDetail(null)
      setTriedCms(true)
      return
    }

    let cancelled = false
    setTriedCms(false)
    fetchSpecialty(slug, lang).then((data) => {
      if (!cancelled) {
        setCmsDetail(data)
        setTriedCms(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [slug, lang])

  const view: ViewModel | null = (() => {
    if (cmsDetail) {
      const staticIndex = specialtyDetails.findIndex((item) => item.slug === slug)
      const index = staticIndex >= 0 ? staticIndex : 0
      return {
        slug: cmsDetail.slug,
        name: cmsDetail.name,
        count: cmsDetail.count,
        image: cmsDetail.image || world.organ || SPECIALTY_IMAGES[index] || SPECIALTY_IMAGES[0],
        overview: cmsDetail.overview,
        conditions: cmsDetail.conditions,
        services: cmsDetail.services,
        diagnostics: cmsDetail.diagnostics,
        index,
      }
    }
    if (!triedCms && isCmsEnabled()) return null
    if (!staticMatch) return null

    const { detail, index } = staticMatch
    const content = detail.content[contentLang]
    return {
      slug: detail.slug,
      name: t.clinic.specialties[index].name,
      count: t.clinic.specialties[index].count,
      image: world.organ || SPECIALTY_IMAGES[index],
      overview: content.overview,
      conditions: content.conditions.split('|'),
      services: content.services.split('|'),
      diagnostics: content.diagnostics.split('|'),
      index,
    }
  })()

  useEffect(() => {
    if (view) document.title = `${view.name} — ${t.nav.brand}`
  }, [view?.name, t.nav.brand])

  const doctors = useMemo(() => getSpecialtyDoctors(slug), [slug])

  useEffect(() => {
    const sectionIds: ActiveSection[] = [
      'specialty-care',
      'specialty-pathway',
      'specialty-doctors',
    ]
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id as ActiveSection)
      },
      { rootMargin: '-24% 0px -62% 0px', threshold: [0, 0.15, 0.4] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [slug, triedCms])

  const relatedFromCms = home?.specialties?.filter((item) => item.slug !== slug).slice(0, 3)
  const related = relatedFromCms?.length
    ? relatedFromCms.map((item, i) => ({
        slug: item.slug,
        name: item.name,
        image: item.image || getSpecialtyWorld(item.slug).organ || SPECIALTY_IMAGES[i],
        accent: getSpecialtyWorld(item.slug).accent,
      }))
    : specialtyDetails
        .map((item, itemIndex) => ({ ...item, index: itemIndex }))
        .filter((item) => item.slug !== slug)
        .slice((view?.index ?? 0) % 3, ((view?.index ?? 0) % 3) + 3)
        .map((item) => ({
          slug: item.slug,
          name: t.clinic.specialties[item.index].name,
          image: getSpecialtyWorld(item.slug).organ || SPECIALTY_IMAGES[item.index],
          accent: getSpecialtyWorld(item.slug).accent,
        }))

  if (!triedCms && isCmsEnabled() && !view) {
    return (
      <section className="specialty-not-found">
        <p>{labels.back}…</p>
      </section>
    )
  }

  if (!view) return <NotFoundPage />

  const doctorCount = doctors.length || view.count
  const themeStyle = {
    '--sw-accent': world.accent,
    '--sw-soft': world.accentSoft,
    '--sw-glow': world.glow,
  } as CSSProperties

  const careGroups: Array<{
    kind: CareIconKind
    title: string
    items: string[]
  }> = [
    { kind: 'conditions', title: labels.conditions, items: view.conditions },
    { kind: 'services', title: labels.services, items: view.services },
    { kind: 'diagnostics', title: labels.diagnostics, items: view.diagnostics },
  ]

  return (
    <main className="specialty-detail" style={themeStyle} data-specialty={slug}>
      <section className="specialty-detail__hero">
        <div className="container-main">
          <SectionBackLink href="/clinic" className="specialty-detail__back">
            ← {labels.back}
          </SectionBackLink>

          <div className="specialty-detail__hero-grid">
            <motion.div
              className="specialty-detail__hero-copy"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <p className="specialty-detail__eyebrow">{labels.expertise}</p>
              <h1>{view.name}</h1>
              <p className="specialty-detail__lead">{view.overview}</p>

              <div className="specialty-detail__facts">
                <span>
                  <strong>{doctorCount}</strong>
                  {t.clinic.doctorsCount}
                </span>
                <span>{t.topBar.phone}</span>
                <span>{t.topBar.hours}</span>
              </div>

              <div className="specialty-detail__actions">
                <Magnetic href="/contacts?intent=booking" className="specialty-detail__cta" strength={0.24}>
                  {t.clinic.bookBtn}
                  <Arrow />
                </Magnetic>
                <a href="#specialty-doctors" className="specialty-detail__text-link">
                  {t.clinic.specialists}
                  <Arrow />
                </a>
              </div>
            </motion.div>

            <motion.div
              className="specialty-detail__visual"
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.08 }}
              aria-hidden
            >
              <span className="specialty-detail__visual-ring specialty-detail__visual-ring--one" />
              <span className="specialty-detail__visual-ring specialty-detail__visual-ring--two" />
              {slug === 'cardiology' ? (
                <svg
                  className="specialty-detail__signal"
                  viewBox="0 0 800 180"
                  preserveAspectRatio="none"
                >
                  <path d="M0 95h132l25-2 18-22 20 66 28-112 28 145 29-75h92l17-2 20-31 23 82 26-121 29 148 30-76h283" />
                </svg>
              ) : null}
              <span className="specialty-detail__visual-label">{view.name}</span>
              <span className="specialty-detail__visual-status">
                <i />
                {t.topBar.badge}
              </span>
              <img src={view.image} alt="" />
            </motion.div>
          </div>
        </div>
      </section>

      <nav className="specialty-detail__nav" aria-label={view.name}>
        <div className="container-main">
          <a
            href="#specialty-care"
            className={activeSection === 'specialty-care' ? 'is-active' : undefined}
            aria-current={activeSection === 'specialty-care' ? 'location' : undefined}
          >
            {worldLabels.careTitle}
          </a>
          <a
            href="#specialty-pathway"
            className={activeSection === 'specialty-pathway' ? 'is-active' : undefined}
            aria-current={activeSection === 'specialty-pathway' ? 'location' : undefined}
          >
            {labels.pathway}
          </a>
          <a
            href="#specialty-doctors"
            className={activeSection === 'specialty-doctors' ? 'is-active' : undefined}
            aria-current={activeSection === 'specialty-doctors' ? 'location' : undefined}
          >
            {worldLabels.team}
          </a>
          <a href="/prices">{t.clinic.prices}</a>
          <a href="/contacts" className="specialty-detail__nav-book">
            {t.clinic.bookBtn}
          </a>
        </div>
      </nav>

      <section id="specialty-care" className="specialty-detail__section specialty-detail__care">
        <div className="container-main">
          <SectionTitle eyebrow={labels.expertise} title={worldLabels.careTitle} />

          <motion.div
            className="specialty-detail__care-grid"
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {careGroups.map((group) => (
              <motion.article
                key={group.kind}
                className="specialty-detail__care-column"
                variants={fadeUpSmall}
              >
                <span className="specialty-detail__care-icon">
                  <CareIcon kind={group.kind} />
                </span>
                <h2>{group.title}</h2>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {group.kind === 'services' ? (
                  <a href="/prices">
                    {t.clinic.prices}
                    <Arrow />
                  </a>
                ) : null}
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="specialty-pathway" className="specialty-detail__section specialty-detail__pathway">
        <div className="container-main">
          <SectionTitle title={labels.pathway} description={labels.pathwayText} inverse />
          <div className="specialty-detail__steps">
            {t.process.steps.map((step, index) => (
              <motion.article
                key={step.num}
                className="specialty-detail__step"
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.45, ease: EASE_OUT }}
              >
                <span>{step.num}</span>
                <strong>{step.title}</strong>
                <p>{step.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="specialty-doctors" className="specialty-detail__section specialty-detail__team">
        <div className="container-main">
          <div className="specialty-detail__team-head">
            <SectionTitle
              eyebrow={`${doctorCount} ${t.clinic.doctorsCount}`}
              title={worldLabels.team}
              description={labels.teamText}
            />
            <a href="/doctors" className="specialty-detail__all-doctors">
              {t.clinic.specialists}
              <Arrow />
            </a>
          </div>

          {doctors.length === 0 ? (
            <div className="specialty-detail__empty">
              <p>{worldLabels.teamEmpty}</p>
              <a href="/contacts">{t.clinic.bookBtn}</a>
            </div>
          ) : (
            <motion.div
              className="specialty-detail__doctors"
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.16 }}
            >
              {doctors.map((doctor) => {
                const content = doctor.content[contentLang]
                return (
                  <motion.article key={doctor.slug} className="specialty-doctor" variants={fadeUpSmall}>
                    <a href={`/doctors/${doctor.slug}`} className="specialty-doctor__media">
                      <img src={doctor.photo} alt={content.name} loading="lazy" decoding="async" />
                    </a>
                    <div className="specialty-doctor__body">
                      <h3>
                        <a href={`/doctors/${doctor.slug}`}>{content.name}</a>
                      </h3>
                      <p>{content.role}</p>
                      <small>{content.exp}</small>
                      <a href={`/doctors/${doctor.slug}`} className="specialty-doctor__link">
                        {worldLabels.seeDoctor}
                        <Arrow />
                      </a>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>

      <section className="specialty-detail__section specialty-detail__related">
        <div className="container-main">
          <SectionTitle eyebrow={labels.back} title={labels.related} />
          <div className="specialty-detail__related-grid">
            {related.map((item) => (
              <a
                key={item.slug}
                href={`/clinic/${item.slug}`}
                className="specialty-detail__related-card"
                style={{ '--related-accent': item.accent } as CSSProperties}
              >
                <span>
                  <small>{labels.expertise}</small>
                  <strong>{item.name}</strong>
                  <i>
                    <Arrow />
                  </i>
                </span>
                <img src={item.image} alt="" loading="lazy" decoding="async" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="specialty-detail__closing">
        <div className="container-main">
          <div>
            <p>{labels.available}</p>
            <h2>{labels.closingTitle}</h2>
            <span>{labels.closingText}</span>
          </div>
          <div className="specialty-detail__closing-actions">
            <a href="/contacts">
              {t.clinic.bookBtn}
              <Arrow />
            </a>
            <a href="/prices">{t.clinic.prices}</a>
          </div>
        </div>
      </section>
    </main>
  )
}

function SectionTitle({
  eyebrow,
  title,
  description,
  inverse = false,
}: {
  eyebrow?: string
  title: string
  description?: string
  inverse?: boolean
}) {
  return (
    <motion.header
      className={`specialty-detail__section-title${inverse ? ' is-inverse' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      {eyebrow ? <p>{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <span>{description}</span> : null}
    </motion.header>
  )
}
