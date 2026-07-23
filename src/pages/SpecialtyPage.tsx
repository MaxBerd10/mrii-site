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
  const { lang, contentLang, t } = useLanguage()
  const { home } = useCms()
  const reduce = useReducedMotion()
  const labels = specialtyPageLabels[contentLang]
  const worldLabels = specialtyWorldLabels[contentLang]
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
  const doctorCount = doctors.length || view.count
  const themeStyle = {
    '--sw-accent': world.accent,
    '--sw-soft': world.accentSoft,
    '--sw-glow': world.glow,
  } as CSSProperties

  const careGroups = [
    { number: '01', title: labels.conditions, items: view.conditions },
    { number: '02', title: labels.services, items: view.services },
    { number: '03', title: labels.diagnostics, items: view.diagnostics },
  ]

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

      {/* 1 — Hero: one composition */}
      <section className="specialty-world__hero">
        <div className="specialty-world__hero-frame">
          <motion.div
            className="specialty-world__stage"
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
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
                  : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
              }
            />
          </motion.div>

          <motion.div
            className="specialty-world__copy"
            variants={staggerContainer(0.08, 0.1)}
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
            <motion.h1 variants={blurUp}>{view.name}</motion.h1>
            <motion.p className="specialty-world__lead" variants={blurUp}>
              {view.overview}
            </motion.p>
            <motion.p className="specialty-world__meta" variants={blurUp}>
              <span>
                {doctorCount} {t.clinic.doctorsCount}
              </span>
              <span aria-hidden>·</span>
              <span>{labels.accredited}</span>
              <span aria-hidden>·</span>
              <span>{labels.available}</span>
            </motion.p>
            <motion.div className="specialty-world__actions" variants={blurUp}>
              <Magnetic href="/contacts" className="specialty-world__cta" strength={0.28}>
                {t.clinic.bookBtn}
              </Magnetic>
              <a href={`/ai/${world.aiProductSlug}`} className="specialty-world__ghost">
                {worldLabels.aiOpen}
              </a>
            </motion.div>
          </motion.div>
        </div>
        <a href="#specialty-care" className="specialty-world__scroll" aria-label={worldLabels.careTitle}>
          <span />
        </a>
      </section>

      {/* 2 — Care */}
      <section id="specialty-care" className="specialty-world__band specialty-world__care">
        <div className="container-main">
          <RevealHead kicker={labels.expertise} title={worldLabels.careTitle} />
          <motion.div
            className="specialty-world__care-grid"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            {careGroups.map((group) => (
              <motion.article key={group.number} className="specialty-world__rail" variants={rise3d}>
                <span className="specialty-world__rail-num">{group.number}</span>
                <h2>{group.title}</h2>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3 — Pathway */}
      <section className="specialty-world__band specialty-world__pathway-screen">
        <div className="container-main">
          <RevealHead title={labels.pathway} desc={labels.pathwayText} />
          <div className="specialty-world__timeline" aria-label={labels.pathway}>
            {t.process.steps.map((step, stepIndex) => (
              <motion.div
                key={step.num}
                className="specialty-world__timeline-step"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: stepIndex * 0.07, ease: EASE_OUT }}
              >
                <span className="specialty-world__timeline-dot">{step.num}</span>
                <strong>{step.title}</strong>
                <small>{step.desc}</small>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Doctors */}
      <section className="specialty-world__band specialty-world__team">
        <div className="container-main">
          <RevealHead
            kicker={`${doctorCount} ${t.clinic.doctorsCount}`}
            title={worldLabels.team}
          />
          {doctors.length === 0 ? (
            <p className="specialty-world__empty">{worldLabels.teamEmpty}</p>
          ) : (
            <motion.div
              className="specialty-world__doctors"
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {doctors.map((doc) => {
                const c = doc.content[contentLang]
                return (
                  <motion.article key={doc.slug} className="specialty-doc" variants={rise3d}>
                    <a href={`/doctors/${doc.slug}`} className="specialty-doc__media">
                      <img src={doc.photo} alt="" loading="lazy" />
                    </a>
                    <div className="specialty-doc__body">
                      <h3>
                        <a href={`/doctors/${doc.slug}`}>{c.name}</a>
                      </h3>
                      <p>
                        {c.role} · {c.exp}
                      </p>
                      <a href={`/doctors/${doc.slug}`} className="specialty-doc__link">
                        {worldLabels.seeDoctor} →
                      </a>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* 5 — Related */}
      <section className="specialty-world__band specialty-world__related-screen">
        <div className="container-main">
          <RevealHead kicker={labels.back} title={t.clinic.title2} />
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
      </section>
    </main>
  )
}

function RevealHead({
  kicker,
  title,
  desc,
}: {
  kicker?: string
  title: string
  desc?: string
}) {
  return (
    <motion.header
      className="specialty-world__section-head"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      {kicker ? <p className="specialty-world__section-kicker">{kicker}</p> : null}
      <h2>{title}</h2>
      {desc ? <p className="specialty-world__section-desc">{desc}</p> : null}
    </motion.header>
  )
}
