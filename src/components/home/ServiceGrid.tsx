import { useMemo, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useCms } from '../../cms/CmsContext'
import { buildClinicSpecialties } from '../../data/clinicSpecialties'
import HdHead from './HdHead'
import { settle, settleStagger, inView } from '../../lib/homeDarkMotion'

/**
 * Signal by clinical family, not by variety:
 * care is clinical blue, procedures are research violet, women & children are
 * vitals green, and imaging is machine cyan — that is where the AI actually is.
 */
const SIGNAL_BY_SLUG: Record<string, string> = {
  ent: 'var(--hd-blue)',
  cardiology: 'var(--hd-blue)',
  neurology: 'var(--hd-blue)',
  therapy: 'var(--hd-blue)',
  gastroenterology: 'var(--hd-blue)',
  pulmonology: 'var(--hd-blue)',
  rheumatology: 'var(--hd-blue)',
  gynecology: 'var(--hd-green)',
  surgery: 'var(--hd-violet-lt)',
  laboratory: 'var(--hd-cyan)',
  'intensive-care': 'var(--hd-violet-lt)',
}

/** CH.06 — all clinical departments. The one dense passage on the page. */
export default function ServiceGrid() {
  const { t, lang } = useLanguage()
  const { home } = useCms()
  const copy = t.homeDark.services

  const specialties = useMemo(() => {
    const base = buildClinicSpecialties(t.clinic.specialties, home?.specialties)

    return base.map((specialty) => ({
      ...specialty,
      signal: SIGNAL_BY_SLUG[specialty.slug] ?? 'var(--hd-blue)',
    }))
  }, [home, t.clinic.specialties])

  return (
    <section className="hd-section hd-services" aria-labelledby="hd-services-title">
      <div className="container-main">
        <HdHead
          channel={copy.channel}
          title={
            <span id="hd-services-title">
              {copy.title1} <em>{copy.titleEm}</em>
            </span>
          }
          description={copy.description}
          action={
            <a href="/clinic" className="hd-more">
              {copy.viewAll} <span aria-hidden>→</span>
            </a>
          }
        />

        <motion.div
          key={lang}
          className="hd-services__grid"
          variants={settleStagger(0.04)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          {specialties.map((specialty) => (
            <motion.a
              key={specialty.slug}
              href={`/clinic/${specialty.slug}`}
              className="hd-panel hd-panel--link hd-service"
              style={{ '--hd-signal': specialty.signal } as CSSProperties}
              variants={settle}
            >
              <span className="hd-service__media" aria-hidden>
                <img src={specialty.image} alt="" loading="lazy" className="hd-service__img" />
              </span>
              <span className="hd-service__body">
                <strong className="hd-service__name">{specialty.name}</strong>
                <span className="hd-service__desc">{specialty.desc}</span>
                <span className="hd-service__foot">
                  <span>
                    {specialty.count} {copy.doctorsLabel}
                  </span>
                  <span aria-hidden>→</span>
                </span>
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
