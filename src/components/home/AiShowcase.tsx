import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { doctorProfiles, getSpecialtyGroup } from '../../data/doctors'
import { getDoctorTurnMedia } from '../../data/doctorTurnMedia'
import { trace, inView } from '../../lib/homeDarkMotion'

const SIGNAL_BY_COLOR: Record<string, string> = {
  '#0EA5E9': 'var(--hd-cyan)',
  '#6366F1': 'var(--hd-violet-lt)',
  '#10B981': 'var(--hd-green)',
  '#F59E0B': 'var(--hd-blue-lt)',
}

/** Rolling live-activity ticker — a new event slides in every ~2.6s. */
function useTicker(length: number, running: boolean, intervalMs = 2600) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (!running || length < 2) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'hidden') return
      setIndex((i) => (i + 1) % length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [running, length, intervalMs])
  return index
}

/**
 * The screen inside the tablet — an authored product interface, not a stock
 * photo. It's the AiShifokor console surface: today's queue and
 * physicians on the left, live activity feed and AI panel on the right. Built
 * from the app's own doctor data so it reads as the product.
 *
 * Small, tasteful motion inside the screen: a rolling event ticker, a live dot,
 * and a pulsing queue count. Nothing loops that would compete with the tablet's
 * own tilt animation on scroll.
 */
function ConsoleMockup({ animate }: { animate: boolean }) {
  const { t, contentLang } = useLanguage()
  const ui = t.homeShowcase.ui
  const filters = t.clinic.filters

  const doctors = doctorProfiles
    .filter((p) => p.staffKind !== 'nurse')
    .slice(0, 3)
    .map((p) => {
      const c = p.content[contentLang]
      const turn = getDoctorTurnMedia(p.slug)
      return {
        slug: p.slug,
        name: c.name,
        specialty: c.specialty,
        photo: turn?.poster ?? p.photo,
        signal: SIGNAL_BY_COLOR[p.color] ?? 'var(--hd-blue-lt)',
        group: getSpecialtyGroup(p),
      }
    })

  const tabs = [filters.all, filters.therapy, filters.surgery, filters.women]
  const currentEvent = useTicker(ui.events.length, animate)
  const event = ui.events[currentEvent]

  return (
    <div className="hd-mock" aria-hidden>
      <div className="hd-mock__bar">
        <span className="hd-mock__brand">
          <i className="hd-mock__brand-dot" />
          {ui.app}
        </span>
        <span className="hd-mock__live">
          <i className="hd-mock__live-dot" />
          {ui.live}
        </span>
      </div>

      {/* header metrics — the KPIs the app opens on */}
      <div className="hd-mock__kpis">
        {ui.headMetrics.map((m) => (
          <div key={m.l} className="hd-mock__kpi">
            <strong>{m.v}</strong>
            <span>{m.l}</span>
          </div>
        ))}
      </div>

      <div className="hd-mock__body">
        <div className="hd-mock__main">
          <div className="hd-mock__section">{ui.section}</div>
          <div className="hd-mock__tabs">
            {tabs.map((tab, i) => (
              <span key={tab} className={`hd-mock__tab${i === 0 ? ' is-active' : ''}`}>
                {tab}
              </span>
            ))}
          </div>

          <div className="hd-mock__docs">
            {doctors.map((doc, i) => (
              <div
                key={doc.slug}
                className="hd-mock__doc"
                style={{ ['--sig' as string]: doc.signal }}
              >
                <span className="hd-mock__doc-photo">
                  <img src={doc.photo} alt="" loading="lazy" />
                </span>
                <span className="hd-mock__doc-info">
                  <strong className="hd-mock__doc-name">{doc.name}</strong>
                  <span className="hd-mock__doc-spec">{doc.specialty}</span>
                </span>
                {i === 0 ? <span className="hd-mock__doc-ai">{ui.recommend}</span> : null}
                <span className="hd-mock__doc-book">{ui.book}</span>
              </div>
            ))}
          </div>

          {/* live event feed — one row that swaps in place */}
          <div className="hd-mock__activity">
            <div className="hd-mock__activity-head">
              <span className="hd-mock__activity-title">{ui.activity}</span>
              <span className="hd-mock__activity-count">
                <i className="hd-mock__live-dot" />
                {ui.events.length}
              </span>
            </div>
            <div className="hd-mock__events">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentEvent}
                  className="hd-mock__event"
                  initial={animate ? { opacity: 0, y: -12, filter: 'blur(4px)' } : false}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={animate ? { opacity: 0, y: 12, filter: 'blur(4px)' } : undefined}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="hd-mock__event-dot" />
                  <span className="hd-mock__event-text">{event.text}</span>
                  <span className="hd-mock__event-meta">{event.meta}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <aside className="hd-mock__aside">
          <div className="hd-mock__ai-head">
            <span className="hd-mock__ai-title">{ui.aiTitle}</span>
            <span className="hd-mock__ai-hint">{ui.aiHint}</span>
          </div>

          <svg className="hd-mock__ecg" viewBox="0 0 220 44" preserveAspectRatio="none" aria-hidden>
            <path
              d="M0 22 H70 l4 0 l3 -6 l3 12 l4 -30 l4 40 l4 -16 l3 0 H130 l4 0 l3 -9 l3 9 H220"
              fill="none"
              stroke="var(--hd-green)"
              strokeWidth="1.6"
            />
          </svg>

          <div className="hd-mock__metrics">
            {ui.metrics.map((m) => (
              <div key={m.l} className="hd-mock__metric">
                <strong>{m.v}</strong>
                <span>{m.l}</span>
              </div>
            ))}
          </div>

          <div className="hd-mock__queue">
            <span className="hd-mock__queue-label">{ui.queue}</span>
            <span className="hd-mock__queue-value">
              <strong>27</strong> <em>{ui.queueCount}</em>
            </span>
            <span className="hd-mock__queue-bar" aria-hidden>
              <i style={{ width: '62%' }} />
            </span>
          </div>

          <span className="hd-mock__cta">{ui.book}</span>
        </aside>
      </div>
    </div>
  )
}

/**
 * A scroll-driven showcase: the tablet begins face-down on the surface, then
 * rises and rotates *toward the reader* as it scrolls into view. Kept on one
 * motion axis — rotateX — so the composition never feels drunk.
 *
 * Rebuilt from the Aceternity "container scroll" idea in this stack:
 * `motion/react` (not framer-motion), an authored interface (not a stock photo),
 * the instrument bezel, and a deep opening tilt.
 */
export default function AiShowcase() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const deviceRef = useRef<HTMLDivElement>(null)
  const [inViewNow, setInViewNow] = useState(false)
  const copy = t.homeShowcase

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })

  // The tablet opens across 0 → 0.5 of the section's scroll range. Held flat at
  // its resting tilt for the second half so the reader can actually read it.
  const rotateX = useTransform(progress, [0, 0.5, 1], [72, 4, 4])
  const scale = useTransform(progress, [0, 0.5, 1], [0.78, 1, 1])
  const lift = useTransform(progress, [0, 0.5, 1], [80, 0, -20])
  const glow = useTransform(progress, [0, 0.5, 1], [0, 0.9, 0.6])

  // Once the device has landed in view we let the interior interactions play.
  useEffect(() => {
    const el = deviceRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInViewNow(entry.isIntersecting),
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const flat = { rotateX: 4, scale: 1 }

  return (
    <section ref={sectionRef} className="hd-section hd-showcase" aria-labelledby="hd-showcase-title">
      <div className="container-main">
        <motion.div className="hd-showcase__head" style={reduce ? undefined : { y: lift }}>
          <motion.p
            className="hd-channel"
            variants={trace}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <span className="hd-channel__dot" aria-hidden />
            {copy.channel}
          </motion.p>
          <motion.h2
            id="hd-showcase-title"
            className="hd-title hd-showcase__title"
            variants={trace}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            transition={{ delay: 0.08 }}
          >
            {copy.title1} <em>{copy.titleEm}</em>
          </motion.h2>
        </motion.div>

        {/* Perspective on the wrapper so the tablet rotates in real depth */}
        <div className="hd-showcase__stage">
          <motion.div
            ref={deviceRef}
            className="hd-showcase__device"
            style={reduce ? flat : { rotateX, scale }}
          >
            <div className="hd-showcase__bezel">
              <div className="hd-showcase__screen">
                <ConsoleMockup animate={!reduce && inViewNow} />
                <motion.span
                  className="hd-showcase__sheen"
                  aria-hidden
                  style={reduce ? { opacity: 0.25 } : { opacity: glow }}
                />
              </div>
            </div>
            <span className="hd-showcase__camera" aria-hidden />
          </motion.div>
        </div>
      </div>

      {/* Extra scroll room so the tablet has real distance to open across */}
      <div className="hd-showcase__runway" aria-hidden />
    </section>
  )
}
