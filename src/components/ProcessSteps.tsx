import { useRef, useState, type CSSProperties } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import Reveal from './ui/Reveal'
import SoftSurface from './ui/SoftSurface'
import { blurUp, staggerContainer } from '../lib/animations'

const STEP_ACCENTS = ['#5B4CDB', '#0EA5E9', '#059669', '#D97706']
const STEP_MEDIA = [
  '/images/process/process-booking-3d.png',
  '/images/process/process-diagnostics-3d.png',
  '/images/process/process-treatment-plan-3d.png',
  '/images/process/process-recovery-3d.png',
]

export default function ProcessSteps({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const trackRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const steps = t.process.steps

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce || compact) return
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)))
    setActive((prev) => (prev === next ? prev : next))
  })

  if (reduce || compact) {
    return (
      <section className="process-section process-section--soft">
        <div className="container-main process-section__inner">
          <Reveal variants={blurUp}>
            <div className="process-section__head process-section__head--center">
              <span className="process-section__label">
                <span className="process-section__dot" />
                {t.process.label}
              </span>
              <h2 className="process-section__title">
                {t.process.title} <em>{t.process.titleEm}</em>
              </h2>
              <p className="process-section__desc">{t.process.description}</p>
            </div>
          </Reveal>
          <motion.div
            className="process-story-grid"
            variants={staggerContainer(0.14, 0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {steps.map((step, index) => (
              <SoftSurface
                key={step.num}
                as="article"
                className={`process-story-card process-story-card--${index + 1}`}
                style={{ '--step-accent': STEP_ACCENTS[index] } as CSSProperties}
              >
                <div className="process-story__visual">
                  <img src={STEP_MEDIA[index]} alt="" loading="lazy" className="process-story__object" />
                </div>
                <div className="process-story-card__body">
                  <span className="process-story-card__num">{step.num}</span>
                  <h3 className="process-story-card__title">{step.title}</h3>
                  <p className="process-story-card__text">{step.desc}</p>
                </div>
              </SoftSurface>
            ))}
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={trackRef}
      className="process-pin"
      aria-label={t.process.label}
      style={{ '--step-accent': STEP_ACCENTS[active] } as CSSProperties}
    >
      <div className="process-pin__sticky">
        <div className="container-main process-pin__frame">
          <header className="process-pin__head">
            <span className="process-section__label">
              <span className="process-section__dot" />
              {t.process.label}
            </span>
            <h2 className="process-section__title">
              {t.process.title} <em>{t.process.titleEm}</em>
            </h2>
            <p className="process-section__desc">{t.process.description}</p>
          </header>

          <div className="process-pin__body">
            <div className="process-pin__visual" aria-hidden>
              {STEP_MEDIA.map((src, i) => (
                <motion.img
                  key={src}
                  src={src}
                  alt=""
                  className="process-pin__img"
                  initial={false}
                  animate={{
                    opacity: active === i ? 1 : 0,
                    scale: active === i ? 1 : 0.9,
                    y: active === i ? 0 : 20,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
              <span className="process-pin__watermark">{steps[active]?.num}</span>
            </div>

            <div className="process-pin__copy">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  className="process-pin__step"
                  initial={false}
                  animate={{
                    opacity: active === i ? 1 : 0,
                    y: active === i ? 0 : 16,
                    pointerEvents: active === i ? 'auto' : 'none',
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden={active !== i}
                >
                  <span className="process-pin__num">{step.num}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </motion.div>
              ))}

              <ol className="process-pin__list">
                {steps.map((step, i) => (
                  <li key={step.num} className={active === i ? 'is-active' : undefined}>
                    <button
                      type="button"
                      onClick={() => {
                        const el = trackRef.current
                        if (!el) return
                        const top = window.scrollY + el.getBoundingClientRect().top
                        const travel = el.offsetHeight - window.innerHeight
                        window.scrollTo({
                          top: top + (travel * (i + 0.45)) / steps.length,
                          behavior: 'smooth',
                        })
                      }}
                    >
                      <em>{step.num}</em>
                      <span>{step.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="process-pin__rail" aria-hidden>
            <motion.span style={{ scaleX: barScale }} />
          </div>
        </div>
      </div>
    </section>
  )
}
