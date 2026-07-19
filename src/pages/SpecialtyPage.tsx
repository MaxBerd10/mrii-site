import { useEffect } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { media } from '../data/media'
import { getSpecialtyBySlug, specialtyDetails, specialtyPageLabels } from '../data/specialtyDetails'
import { blurUp, rise3d, staggerContainer } from '../lib/animations'
import SectionBackLink from '../components/ui/SectionBackLink'

const SPECIALTY_IMAGES = Object.values(media.clinic)
const OBJECT_SPECIALTIES = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11]

export default function SpecialtyPage({ slug }: { slug: string }) {
  const { lang, t } = useLanguage()
  const match = getSpecialtyBySlug(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (match) document.title = `${t.clinic.specialties[match.index].name} — MRII`
  }, [match, t])

  if (!match) {
    return (
      <section className="specialty-not-found">
        <h1>404</h1>
        <SectionBackLink href="/#clinic">{specialtyPageLabels[lang].back}</SectionBackLink>
      </section>
    )
  }

  const { detail, index } = match
  const content = detail.content[lang]
  const labels = specialtyPageLabels[lang]
  const specialty = t.clinic.specialties[index]
  const image = SPECIALTY_IMAGES[index]
  const related = specialtyDetails
    .map((item, itemIndex) => ({ ...item, index: itemIndex }))
    .filter((item) => item.index !== index)
    .slice(index % 3, index % 3 + 3)

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
            <span className="specialty-hero__number">0{index + 1} / 12</span>
            <motion.img
              src={image}
              alt={specialty.name}
              className={OBJECT_SPECIALTIES.includes(index) ? 'specialty-hero__object' : 'specialty-hero__photo'}
              animate={OBJECT_SPECIALTIES.includes(index) ? { y: [0, -12, 0], rotateY: [-3, 3, -3] } : undefined}
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
            <motion.h1 variants={blurUp}>{specialty.name}</motion.h1>
            <motion.p className="specialty-hero__lead" variants={blurUp}>{content.overview}</motion.p>
            <motion.div className="specialty-hero__badges" variants={blurUp}>
              <span>{specialty.count} {t.clinic.doctorsCount}</span>
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
              { number: '01', title: labels.conditions, items: content.conditions.split('|') },
              { number: '02', title: labels.services, items: content.services.split('|') },
              { number: '03', title: labels.diagnostics, items: content.diagnostics.split('|') },
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
                  <img src={SPECIALTY_IMAGES[item.index]} alt="" />
                  <span>0{item.index + 1}</span>
                  <strong>{t.clinic.specialties[item.index].name}</strong>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
