import { useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { media } from '../data/media'
import '../styles/medical-scroll.css'

const CHAPTER_VISUALS = [
  { image: media.clinic.cardiology, accent: '#E11D48' },
  { image: media.clinic.neurology, accent: '#7C3AED' },
  { image: media.clinic.diagnostics, accent: '#0EA5E9' },
  { image: media.clinic.therapy, accent: '#059669' },
] as const

export default function MedicalScrollStory() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const trackRef = useRef<HTMLElement>(null)
  const chapters = t.scrollStory.chapters
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const chapterCount = chapters.length
  const progressScale = useTransform(scrollYProgress, [0, 1], [0.08, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce) return
    const next = Math.min(chapterCount - 1, Math.max(0, Math.floor(v * chapterCount)))
    setActive((prev) => (prev === next ? prev : next))
  })

  const visuals = useMemo(() => CHAPTER_VISUALS, [])

  if (reduce) {
    return (
      <section className="med-scroll med-scroll--static" aria-label={t.scrollStory.label}>
        <div className="container-main med-scroll__static">
          <header className="med-scroll__intro">
            <span className="med-scroll__label">{t.scrollStory.label}</span>
            <h2>
              {t.scrollStory.title} <em>{t.scrollStory.titleEm}</em>
            </h2>
          </header>
          <div className="med-scroll__static-grid">
            {chapters.map((chapter, i) => (
              <article key={chapter.kicker} className="med-scroll__static-card">
                <img src={visuals[i].image} alt="" loading="lazy" />
                <span style={{ color: visuals[i].accent }}>{chapter.kicker}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.desc}</p>
                <a href={chapter.href}>{chapter.link} →</a>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={trackRef}
      className="med-scroll"
      aria-label={t.scrollStory.label}
      style={{ '--med-accent': visuals[active].accent } as CSSProperties}
    >
      <div className="med-scroll__sticky">
        <div className="med-scroll__frame">
          <header className="med-scroll__intro">
            <span className="med-scroll__label">{t.scrollStory.label}</span>
            <h2>
              {t.scrollStory.title} <em>{t.scrollStory.titleEm}</em>
            </h2>
          </header>

          <div className="med-scroll__stage" aria-hidden>
            <div className="med-scroll__glow" />
            {visuals.map((visual, i) => (
              <motion.img
                key={visual.image}
                src={visual.image}
                alt=""
                className="med-scroll__organ"
                initial={false}
                animate={{
                  opacity: active === i ? 1 : 0,
                  scale: active === i ? 1 : 0.88,
                  y: active === i ? 0 : 28,
                  filter: active === i ? 'blur(0px)' : 'blur(12px)',
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
            <span className="med-scroll__index">
              {String(active + 1).padStart(2, '0')} / {String(chapterCount).padStart(2, '0')}
            </span>
          </div>

          <div className="med-scroll__copy">
            {chapters.map((chapter, i) => (
              <motion.div
                key={chapter.kicker}
                className="med-scroll__chapter"
                initial={false}
                animate={{
                  opacity: active === i ? 1 : 0,
                  y: active === i ? 0 : 18,
                  pointerEvents: active === i ? 'auto' : 'none',
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden={active !== i}
              >
                <span className="med-scroll__kicker">{chapter.kicker}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.desc}</p>
                <a href={chapter.href} className="med-scroll__link">
                  {chapter.link} →
                </a>
              </motion.div>
            ))}
          </div>

          <div className="med-scroll__rail" aria-hidden>
            <motion.span style={{ scaleX: progressScale }} />
          </div>

          <div className="med-scroll__dots" role="tablist" aria-label={t.scrollStory.label}>
            {chapters.map((chapter, i) => (
              <button
                key={chapter.kicker}
                type="button"
                role="tab"
                aria-selected={active === i}
                className={active === i ? 'is-active' : undefined}
                onClick={() => {
                  const el = trackRef.current
                  if (!el) return
                  const rect = el.getBoundingClientRect()
                  const top = window.scrollY + rect.top
                  const travel = el.offsetHeight - window.innerHeight
                  const target = top + (travel * (i + 0.5)) / chapterCount
                  window.scrollTo({ top: target, behavior: 'smooth' })
                }}
              >
                <span className="sr-only">{chapter.kicker}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
