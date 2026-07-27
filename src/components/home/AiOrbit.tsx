import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { media } from '../../data/media'
import HdHead from './HdHead'
import { EASE_OUT } from '../../lib/animations'

/**
 * The twelve clinical organs, in the order the specialties are named in i18n.
 * Rotating through them at the centre of the orbit reads as "everything the
 * clinic covers" without a wall of icons.
 */
const ORGANS = [
  { src: media.clinic.cardiology, signal: 'var(--hd-blue)' },
  { src: media.clinic.neurology, signal: 'var(--hd-blue)' },
  { src: media.clinic.therapy, signal: 'var(--hd-blue)' },
  { src: media.clinic.endocrinology, signal: 'var(--hd-blue)' },
  { src: media.clinic.urology, signal: 'var(--hd-violet-lt)' },
  { src: media.clinic.gynecology, signal: 'var(--hd-green)' },
  { src: media.clinic.pediatrics, signal: 'var(--hd-green)' },
  { src: media.clinic.surgery, signal: 'var(--hd-violet-lt)' },
  { src: media.clinic.rehabilitation, signal: 'var(--hd-green)' },
  { src: media.clinic.diagnostics, signal: 'var(--hd-cyan)' },
  { src: media.clinic.oncology, signal: 'var(--hd-violet-lt)' },
  { src: media.clinic.gastroenterology, signal: 'var(--hd-blue)' },
] as const

/** Endpoints for the SVG connector lines, in the ring viewBox's -100..100
 *  coordinate system. They point at the cards' inner corners so the hairlines
 *  meet the panel edge rather than crossing over it. */
const CARD_TARGETS = [
  { x: -78, y: -55 },
  { x: 78, y: -55 },
  { x: -78, y: 55 },
  { x: 78, y: 55 },
] as const

/**
 * CH.03 — the institute at a glance.
 *
 * Centre: a rotating gallery of the twelve organ artworks — one every 2.4s.
 * Around it: four stat cards, connected to the centre by hairline paths. Each
 * connection carries a slow pulse of light travelling outward, so the
 * relationship reads as "everything flows from one institute" without needing
 * a legend or a caption to explain it.
 */
export default function AiOrbit() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: false, amount: 0.25 })
  const copy = t.homeDark.orbit

  const [organIdx, setOrganIdx] = useState(0)
  useEffect(() => {
    if (reduce || !visible) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'hidden') return
      setOrganIdx((i) => (i + 1) % ORGANS.length)
    }, 2400)
    return () => window.clearInterval(id)
  }, [reduce, visible])

  const organ = ORGANS[organIdx]
  const organName = copy.organs[organIdx]

  return (
    <section className="hd-section hd-orbit" aria-labelledby="hd-orbit-title">
      <div className="container-main">
        <HdHead
          channel={copy.channel}
          title={
            <span id="hd-orbit-title">
              {copy.title1} <em>{copy.titleEm}</em>
            </span>
          }
          description={copy.description}
          center
        />

        <div className="hd-orbit__stage" ref={ref}>
          {/* concentric calibration rings — the field is measured */}
          <svg
            className="hd-orbit__rings"
            viewBox="-100 -100 200 200"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <defs>
              <radialGradient id="hd-orbit-fade" cx="50%" cy="50%" r="50%">
                <stop offset="55%" stopColor="var(--hd-edge-hi)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--hd-edge)" stopOpacity="0" />
              </radialGradient>
            </defs>
            {[38, 60, 82].map((r) => (
              <circle
                key={r}
                cx="0"
                cy="0"
                r={r}
                fill="none"
                stroke="url(#hd-orbit-fade)"
                strokeWidth="0.35"
                strokeDasharray="0.6 1.2"
              />
            ))}

            {/* connections from centre to each card */}
            {CARD_TARGETS.map((p, i) => (
              <g key={i}>
                <line
                  x1="0"
                  y1="0"
                  x2={p.x}
                  y2={p.y}
                  stroke="var(--hd-edge-hi)"
                  strokeWidth="0.4"
                />
                {!reduce && visible ? (
                  <circle r="1.3" fill="var(--hd-cyan)" className="hd-orbit__pulse">
                    <animateMotion
                      dur="3.4s"
                      repeatCount="indefinite"
                      begin={`${i * 0.85}s`}
                      path={`M 0 0 L ${p.x} ${p.y}`}
                    />
                  </circle>
                ) : null}
              </g>
            ))}
          </svg>

          {/* the organ gallery at the centre */}
          <div className="hd-orbit__core">
            <span className="hd-orbit__glow" aria-hidden />
            <div className="hd-orbit__organ" aria-hidden>
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={organIdx}
                  src={organ.src}
                  alt=""
                  loading="lazy"
                  className="hd-orbit__organ-img"
                  initial={reduce ? false : { opacity: 0, scale: 0.86, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={reduce ? undefined : { opacity: 0, scale: 1.06, filter: 'blur(6px)' }}
                  transition={{ duration: 0.55, ease: EASE_OUT }}
                />
              </AnimatePresence>
            </div>
            <span className="hd-orbit__label" aria-live="polite">{organName}</span>
          </div>

          {/* four stat cards, anchored to the stage corners so they never
              overlap the centre no matter the aspect ratio */}
          {copy.cards.map((card, i) => (
            <motion.div
              key={card.label}
              className={`hd-orbit__card hd-orbit__card--${i}`}
              initial={reduce ? false : { opacity: 0, y: i < 2 ? -14 : 14, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.08 * i + 0.1, duration: 0.55, ease: EASE_OUT }}
            >
              <strong className="hd-orbit__card-value">{card.value}</strong>
              <span className="hd-orbit__card-label">{card.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
