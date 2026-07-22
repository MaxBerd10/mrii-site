import { useEffect, useMemo, useState, type CSSProperties } from 'react'
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
import { blurUp, rise3d, staggerContainer, EASE_OUT } from '../lib/animations'
import SectionBackLink from '../components/ui/SectionBackLink'
import Magnetic from '../components/ui/Magnetic'
import NotFoundPage from './NotFoundPage'
import '../styles/specialty-world.css'

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

export default function SpecialtyPage({ slug }: { slug: string }) {
  const { lang, t } = useLanguage()
  const { home } = useCms()
  const reduce = useReducedMotion()
  const labels = specialtyPageLabels[lang]
  const worldLabels = specialtyWorldLabels[lang]
  const world = getSpecialtyWorld(slug)
  const staticMatch = getSpecialtyBySlug(slug)
  const [cmsDetail, setCmsDetail] = useState<CmsSpecialtyDetail | null>(null)
  const [triedCms, setTriedCms] = useState(!isCmsEnabled())
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setEntered(false)
    const id = window.setTimeout(() => setEntered(true), reduce ? 0 : 80)
    return () => window.clearTimeout(id)
  }, [slug, reduce])

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
    const content = detail.content[lang]
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

  const relatedFromCms = home?.specialties?.filter((item) => item.slug !== slug).slice(0, 3)
  const related = relatedFromCms?.length
    ? relatedFromCms.map((item, i) => ({
        slug: item.slug,
        name: item.name,
        image: item.image || getSpecialtyWorld(item.slug).organ || SPECIALTY_IMAGES[i],
        label: String(i + 1).padStart(2, '0'),
      }))
    : specialtyDetails
        .map((item, itemIndex) => ({ ...item, index: itemIndex }))
        .filter((item) => item.slug !== slug)
        .slice((view?.index ?? 0) % 3, ((view?.index ?? 0) % 3) + 3)
        .map((item) => ({
          slug: item.slug,
          name: t.clinic.specialties[item.index].name,
          image: getSpecialtyWorld(item.slug).organ || SPECIALTY_IMAGES[item.index],
          label: String(item.index + 1).padStart(2, '0'),
        }))

  if (!triedCms && isCmsEnabled() && !view) {
    return (
      <section className="specialty-not-found">
        <p>{labels.back}…</p>
      </section>
    )
  }

  if (!view) {
    return <NotFoundPage />
  }

  const ambientHint = worldLabels.ambientHint.replace('{name}', view.name)
  const themeStyle = {
    '--sw-accent': world.accent,
    '--sw-soft': world.accentSoft,
    '--sw-glow': world.glow,
  } as CSSProperties

  return (
    <main
      className={`specialty-world specialty-world--${world.mood}${entered ? ' specialty-world--entered' : ''}`}
      style={themeStyle}
      data-specialty={slug}
    >
      {!reduce && (
        <motion.div
          className="specialty-world__veil"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.05 }}
          aria-hidden
        />
      )}

      <div className="specialty-world__atmosphere" aria-hidden>
        <span className="specialty-world__pulse specialty-world__pulse--a" />
        <span className="specialty-world__pulse specialty-world__pulse--b" />
        <span className="specialty-world__pulse specialty-world__pulse--c" />
        <span className="specialty-world__breath" />
        <span className="specialty-world__orb specialty-world__orb--a" />
        <span className="specialty-world__orb specialty-world__orb--b" />
        <span className="specialty-world__dust" />
        <span className="specialty-world__dust specialty-world__dust--2" />
        <span className="specialty-world__dust specialty-world__dust--3" />
      </div>

      <section className="specialty-world__hero">
        <div className="container-main specialty-world__hero-grid">
          <motion.div
            className="specialty-world__stage"
            initial={reduce ? false : { opacity: 0, scale: 0.92, rotateY: -12 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.85, ease: EASE_OUT }}
          >
            <div className="specialty-world__stage-glow" />
            <div className="specialty-world__hud" aria-hidden>
              <span className="specialty-world__hud-corner specialty-world__hud-corner--tl" />
              <span className="specialty-world__hud-corner specialty-world__hud-corner--tr" />
              <span className="specialty-world__hud-corner specialty-world__hud-corner--bl" />
              <span className="specialty-world__hud-corner specialty-world__hud-corner--br" />
              <span className="specialty-world__scan" />
              <span className="specialty-world__hud-chip specialty-world__hud-chip--live">
                <i />
                {worldLabels.aiLive}
              </span>
              <span className="specialty-world__hud-chip specialty-world__hud-chip--metric">
                {worldLabels.aiConfidence} {world.aiMetric}
              </span>
              <span className="specialty-world__hud-readout">
                {worldLabels.aiSignal} · {slug.toUpperCase().slice(0, 8)}
              </span>
            </div>
            <span className="specialty-world__index">
              {String(view.index + 1).padStart(2, '0')} / 12
            </span>
            <motion.img
              src={view.image}
              alt=""
              className={`specialty-world__organ${world.mood === 'pulse' ? ' specialty-world__organ--pulse' : ''}`}
              animate={
                reduce
                  ? undefined
                  : world.mood === 'pulse'
                    ? { scale: [1, 1.08, 1.02, 1.12, 1, 1] }
                    : { y: [0, -14, 0], rotateY: [-4, 4, -4] }
              }
              transition={
                world.mood === 'pulse'
                  ? {
                      duration: 1.8,
                      times: [0, 0.1, 0.18, 0.28, 0.38, 1],
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : {
                      duration: 7,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            />
          </motion.div>

          <motion.div
            className="specialty-world__copy"
            variants={staggerContainer(0.09, 0.12)}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={blurUp}>
              <SectionBackLink href="/clinic" className="specialty-world__back">
                ← {labels.back}
              </SectionBackLink>
            </motion.div>
            <motion.p className="specialty-world__ambient" variants={blurUp}>
              {ambientHint}
            </motion.p>
            <motion.span className="specialty-world__eyebrow" variants={blurUp}>
              {labels.expertise}
            </motion.span>
            <motion.h1 variants={blurUp}>{view.name}</motion.h1>
            <motion.p className="specialty-world__lead" variants={blurUp}>
              {view.overview}
            </motion.p>
            <motion.div className="specialty-world__badges" variants={blurUp}>
              <span>
                {doctors.length || view.count} {t.clinic.doctorsCount}
              </span>
              <span>{labels.accredited}</span>
              <span>{labels.available}</span>
              <span className="specialty-world__badge-ai">{worldLabels.aiLive}</span>
            </motion.div>

            <motion.aside className="specialty-world__ai" variants={blurUp}>
              <div className="specialty-world__ai-head">
                <span className="specialty-world__ai-dot" />
                <strong>{worldLabels.aiTitle}</strong>
                <em>{worldLabels.aiScan}</em>
              </div>
              <p>{world.aiInsight[lang]}</p>
              <div className="specialty-world__ai-bar" aria-hidden>
                <motion.span
                  initial={reduce ? { scaleX: 1 } : { scaleX: 0.15 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.35 }}
                />
              </div>
              <a href={`/ai/${world.aiProductSlug}`} className="specialty-world__ai-link">
                {worldLabels.aiOpen}
              </a>
            </motion.aside>

            <motion.div className="specialty-world__actions" variants={blurUp}>
              <Magnetic href="/contacts" className="specialty-world__cta" strength={0.28}>
                {t.clinic.bookBtn}
              </Magnetic>
              <a href={`/ai/${world.aiProductSlug}`} className="specialty-world__ghost">
                AI Demo →
              </a>
              <a href="/prices" className="specialty-world__ghost">
                {t.clinic.prices} →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="specialty-world__team section">
        <div className="container-main">
          <RevealHead title={worldLabels.team} accent={world.accent} />
          {doctors.length === 0 ? (
            <p className="specialty-world__empty">{worldLabels.teamEmpty}</p>
          ) : (
            <motion.div
              className="specialty-world__doctors"
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {doctors.map((doc) => {
                const c = doc.content[lang]
                return (
                  <motion.article key={doc.slug} className="specialty-doc" variants={rise3d}>
                    <a href={`/doctors/${doc.slug}`} className="specialty-doc__media">
                      <img src={doc.photo} alt="" loading="lazy" />
                      <span className="specialty-doc__shade" />
                    </a>
                    <div className="specialty-doc__body">
                      <h3>{c.name}</h3>
                      <p>{c.role} · {c.exp}</p>
                      <div className="specialty-doc__actions">
                        <a href={`/doctors/${doc.slug}`}>{worldLabels.seeDoctor}</a>
                        <a href={`/doctors/${doc.slug}`}>{worldLabels.book}</a>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>

      <section className="specialty-world__care section">
        <div className="container-main">
          <RevealHead title={worldLabels.careTitle} accent={world.accent} />
          <motion.div
            className="specialty-world__care-grid"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {[
              { number: '01', title: labels.conditions, items: view.conditions },
              { number: '02', title: labels.services, items: view.services },
              { number: '03', title: labels.diagnostics, items: view.diagnostics },
            ].map((group) => (
              <motion.article key={group.number} className="specialty-world__card" variants={rise3d}>
                <span>{group.number}</span>
                <h2>{group.title}</h2>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>

          <div className="specialty-world__pathway">
            <div className="specialty-world__pathway-head">
              <span>{labels.pathway}</span>
              <h2>{labels.pathway}</h2>
              <p>{labels.pathwayText}</p>
            </div>
            <div className="specialty-world__pathway-steps">
              {t.process.steps.map((step, stepIndex) => (
                <motion.div
                  key={step.num}
                  className="specialty-world__step"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: stepIndex * 0.08, ease: EASE_OUT }}
                >
                  <span>{step.num}</span>
                  <strong>{step.title}</strong>
                  <small>{step.desc}</small>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="specialty-world__related">
            <div>
              <span className="specialty-world__eyebrow">{labels.back}</span>
              <h2>{t.clinic.title2}</h2>
            </div>
            <div className="specialty-world__related-grid">
              {related.map((item) => (
                <a key={item.slug} href={`/clinic/${item.slug}`} className="specialty-world__related-card">
                  <img src={item.image} alt="" />
                  <span>{item.label}</span>
                  <strong>{item.name}</strong>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function RevealHead({ title, accent }: { title: string; accent: string }) {
  return (
    <motion.div
      className="specialty-world__section-head"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      <span style={{ background: accent }} />
      <h2>{title}</h2>
    </motion.div>
  )
}
