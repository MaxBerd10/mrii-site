import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import { fetchSpecialty, isCmsEnabled, type CmsSpecialtyDetail } from '../api/client'
import { media } from '../data/media'
import { getSpecialtyBySlug, specialtyDetails, specialtyPageLabels } from '../data/specialtyDetails'
import { blurUp, rise3d, staggerContainer } from '../lib/animations'
import SectionBackLink from '../components/ui/SectionBackLink'
import NotFoundPage from './NotFoundPage'

const SPECIALTY_IMAGES = Object.values(media.clinic)
const OBJECT_SPECIALTIES = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11]

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
  const labels = specialtyPageLabels[lang]
  const staticMatch = getSpecialtyBySlug(slug)
  const [cmsDetail, setCmsDetail] = useState<CmsSpecialtyDetail | null>(null)
  const [triedCms, setTriedCms] = useState(!isCmsEnabled())

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
        image: cmsDetail.image || SPECIALTY_IMAGES[index] || SPECIALTY_IMAGES[0],
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
      image: SPECIALTY_IMAGES[index],
      overview: content.overview,
      conditions: content.conditions.split('|'),
      services: content.services.split('|'),
      diagnostics: content.diagnostics.split('|'),
      index,
    }
  })()

  useEffect(() => {
    if (view) document.title = `${view.name} — MRII`
  }, [view?.name])

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

  const relatedFromCms = home?.specialties?.filter((item) => item.slug !== slug).slice(0, 3)
  const related = relatedFromCms?.length
    ? relatedFromCms.map((item, i) => ({
        slug: item.slug,
        name: item.name,
        image: item.image || SPECIALTY_IMAGES[i],
        label: String(i + 1).padStart(2, '0'),
      }))
    : specialtyDetails
        .map((item, itemIndex) => ({ ...item, index: itemIndex }))
        .filter((item) => item.slug !== slug)
        .slice(view.index % 3, view.index % 3 + 3)
        .map((item) => ({
          slug: item.slug,
          name: t.clinic.specialties[item.index].name,
          image: SPECIALTY_IMAGES[item.index],
          label: String(item.index + 1).padStart(2, '0'),
        }))

  return (
    <main className="specialty-page">
      <section className="specialty-hero">
        <div className="specialty-page__orb specialty-page__orb--one" aria-hidden />
        <div className="specialty-page__orb specialty-page__orb--two" aria-hidden />
        <div className="container-main specialty-hero__grid">
          <motion.div
            className="specialty-hero__visual"
            initial={{ opacity: 0, x: -36, rotateY: -7 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="specialty-hero__number">0{view.index + 1} / 12</span>
            <motion.img
              src={view.image}
              alt={view.name}
              className={OBJECT_SPECIALTIES.includes(view.index) ? 'specialty-hero__object' : 'specialty-hero__photo'}
              animate={OBJECT_SPECIALTIES.includes(view.index) ? { y: [0, -12, 0], rotateY: [-3, 3, -3] } : undefined}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          <motion.div
            className="specialty-hero__copy"
            variants={staggerContainer(.09, .05)}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={blurUp}>
              <SectionBackLink href="/#clinic" className="specialty-page__back">
                ← {labels.back}
              </SectionBackLink>
            </motion.div>
            <motion.span className="specialty-page__eyebrow" variants={blurUp}>
              {labels.expertise}
            </motion.span>
            <motion.h1 variants={blurUp}>{view.name}</motion.h1>
            <motion.p className="specialty-hero__lead" variants={blurUp}>{view.overview}</motion.p>
            <motion.div className="specialty-hero__badges" variants={blurUp}>
              <span>{view.count} {t.clinic.doctorsCount}</span>
              <span>{labels.accredited}</span>
              <span>{labels.available}</span>
            </motion.div>
            <motion.div className="specialty-hero__actions" variants={blurUp}>
              <a href="/#contacts" className="clinic-section__cta">{t.clinic.bookBtn}</a>
              <a href="/#contacts">{t.clinic.prices} →</a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="specialty-content section">
        <div className="container-main">
          <motion.div
            className="specialty-info-grid"
            variants={staggerContainer(.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: .18 }}
          >
            {[
              { number: '01', title: labels.conditions, items: view.conditions },
              { number: '02', title: labels.services, items: view.services },
              { number: '03', title: labels.diagnostics, items: view.diagnostics },
            ].map((group) => (
              <motion.article key={group.number} className="specialty-info-card" variants={rise3d}>
                <span>{group.number}</span>
                <h2>{group.title}</h2>
                <ul>
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </motion.article>
            ))}
          </motion.div>

          <div className="specialty-pathway">
            <div className="specialty-pathway__head">
              <span>{labels.pathway}</span>
              <h2>{labels.pathway}</h2>
              <p>{labels.pathwayText}</p>
            </div>
            <div className="specialty-pathway__steps">
              {t.process.steps.map((step, stepIndex) => (
                <motion.div
                  key={step.num}
                  className="specialty-pathway__step"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: stepIndex * .08 }}
                >
                  <span>{step.num}</span>
                  <strong>{step.title}</strong>
                  <small>{step.desc}</small>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="specialty-related">
            <div>
              <span className="specialty-page__eyebrow">{labels.back}</span>
              <h2>{t.clinic.title2}</h2>
            </div>
            <div className="specialty-related__grid">
              {related.map((item) => (
                <a key={item.slug} href={`/clinic/${item.slug}`} className="specialty-related__card">
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
