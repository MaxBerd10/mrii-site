import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import Reveal from './ui/Reveal'
import SoftSurface from './ui/SoftSurface'
import Parallax from './ui/Parallax'
import { staggerContainer, blurUp } from '../lib/animations'

const STEP_ACCENTS = ['#5B4CDB', '#0EA5E9', '#059669', '#D97706']
const STEP_MEDIA = [
  '/images/process/process-booking-3d.png',
  '/images/process/process-diagnostics-3d.png',
  '/images/process/process-treatment-plan-3d.png',
  '/images/process/process-recovery-3d.png',
]

function ProcessVisual({ index }: { index: number }) {
  const reduce = useReducedMotion()

  return (
    <div className="process-story__visual">
      <motion.img
        src={STEP_MEDIA[index]}
        alt=""
        loading="lazy"
        className="process-story__object"
        animate={reduce ? undefined : {
          y: [0, -10, 0],
          rotateY: [-4, 4, -4],
          scale: [1, 1.045, 1],
        }}
        transition={{ duration: 6 + index, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="process-story__orbit" aria-hidden><i /></span>
      <span className="process-story__watermark" aria-hidden>0{index + 1}</span>
    </div>
  )
}

export default function ProcessSteps() {
  const { t } = useLanguage()

  return (
    <section className="process-section process-section--soft">
      <Parallax className="process-section__orb process-section__orb--a" offset={60}>
        <span aria-hidden />
      </Parallax>
      <Parallax className="process-section__orb process-section__orb--b" offset={-40}>
        <span aria-hidden />
      </Parallax>

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
          {t.process.steps.map((step, index) => (
            <SoftSurface
              key={step.num}
              as="article"
              className={`process-story-card process-story-card--${index + 1}`}
              style={{ '--step-accent': STEP_ACCENTS[index] } as CSSProperties}
            >
              <ProcessVisual index={index} />
              <div className="process-story-card__body">
                <span className="process-story-card__num">{step.num}</span>
                <h3 className="process-story-card__title">{step.title}</h3>
                <p className="process-story-card__text">{step.desc}</p>
                <span className="process-story-card__arrow" aria-hidden>↗</span>
              </div>
            </SoftSurface>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
