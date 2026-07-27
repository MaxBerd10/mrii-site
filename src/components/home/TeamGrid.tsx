import { useRef, type CSSProperties } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { doctorProfiles } from '../../data/doctors'
import { getDoctorTurnMedia } from '../../data/doctorTurnMedia'
import HdHead from './HdHead'
import { trace, inView } from '../../lib/homeDarkMotion'

const SIGNAL_BY_COLOR: Record<string, string> = {
  '#0EA5E9': 'var(--hd-cyan)',
  '#6366F1': 'var(--hd-violet-lt)',
  '#10B981': 'var(--hd-green)',
  '#F59E0B': 'var(--hd-blue-lt)',
}

/**
 * The five doctors that assemble into the group. Order matters:
 * index 0 is the anchor (centre, front) and starts visible; the rest arrive
 * one by one as the reader scrolls. Values are the seating layout — an x
 * offset in stage-half-widths and a depth `z` in stage-half-heights.
 *
 * A real group photo isn't symmetric: the person in front stands out, others
 * fan out at slightly different depths so the composition doesn't look staged.
 */
const SEATING: {
  slugIndex: number
  x: number   // -1..1, negative = left
  z: number   // 0..1, higher = further back and smaller
  scale: number
}[] = [
  { slugIndex: 0, x: 0,     z: 0,    scale: 1.0 },  // centre — the anchor
  { slugIndex: 1, x: -0.62, z: 0.35, scale: 0.86 }, // near-left
  { slugIndex: 2, x: 0.62,  z: 0.35, scale: 0.86 }, // near-right
  { slugIndex: 3, x: -1.15, z: 0.62, scale: 0.74 }, // far-left
  { slugIndex: 4, x: 1.15,  z: 0.62, scale: 0.74 }, // far-right
]

/** CH.07 — the team as a group portrait that assembles on scroll. */
export default function TeamGrid() {
  const { t, contentLang } = useLanguage()
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const copy = t.homeDark.team

  // A tall section gives real distance to assemble across; the sticky stage
  // stays pinned while progress advances from 0 → 1.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })

  const doctors = doctorProfiles
    .filter((p) => p.staffKind !== 'nurse')
    .slice(0, SEATING.length)
    .map((p) => {
      const c = p.content[contentLang]
      const turn = getDoctorTurnMedia(p.slug)
      return {
        slug: p.slug,
        name: c.name,
        role: c.role,
        specialty: c.specialty,
        photo: turn?.poster ?? p.photo,
        signal: SIGNAL_BY_COLOR[p.color] ?? 'var(--hd-blue-lt)',
      }
    })

  return (
    <section ref={sectionRef} className="hd-team hd-team--group" aria-labelledby="hd-team-title">
      <div className="hd-team__pin">
        <div className="container-main">
          <HdHead
            channel={copy.channel}
            title={
              <span id="hd-team-title">
                {copy.title1} <em>{copy.titleEm}</em>
              </span>
            }
            description={copy.description}
            center
          />

          <div className="hd-team__stage">
            <div className="hd-team__floor" aria-hidden />

            {SEATING.map((seat, i) => {
              const doc = doctors[seat.slugIndex]
              if (!doc) return null

              // The centre figure sits still; the others glide in from their side.
              // Each occupies a scroll slice; slice `i` opens at (i-1)/(N-1) and
              // completes at i/(N-1), so they arrive strictly in order.
              const start = i === 0 ? 0 : (i - 1) / (SEATING.length - 1)
              const end = i / (SEATING.length - 1)

              // Off-screen entry offset — negatives fly in from the left, positives
              // from the right. Kept as a CSS variable (rather than motion's `x`)
              // because the recentring `translate(-50%)` lives on the same axis and
              // the two would fight in a single `transform`.
              const enterX = seat.x < 0 ? -240 : seat.x > 0 ? 240 : 0
              const x = useTransform(progress, [start, end], [`${enterX}px`, '0px'])
              const opacity = useTransform(
                progress,
                [start, start + (end - start) * 0.35, end],
                [i === 0 ? 1 : 0, i === 0 ? 1 : 1, 1],
              )

              return (
                <motion.figure
                  key={doc.slug}
                  className="hd-team__portrait"
                  style={
                    reduce
                      ? ({
                          left: `${50 + seat.x * 22}%`,
                          zIndex: 100 - Math.round(seat.z * 100),
                          ['--seat-scale']: String(seat.scale),
                          ['--seat-depth']: String(seat.z),
                          ['--seat-signal']: doc.signal,
                        } as CSSProperties)
                      : ({
                          left: `${50 + seat.x * 22}%`,
                          zIndex: 100 - Math.round(seat.z * 100),
                          opacity,
                          ['--x']: x,
                          ['--seat-scale']: String(seat.scale),
                          ['--seat-depth']: String(seat.z),
                          ['--seat-signal']: doc.signal,
                        } as unknown as CSSProperties)
                  }
                >
                  <span className="hd-team__portrait-frame">
                    <img
                      src={doc.photo}
                      alt=""
                      className="hd-team__portrait-img"
                      loading="lazy"
                      draggable={false}
                    />
                  </span>
                  <figcaption className="hd-team__caption">
                    <strong>{doc.name}</strong>
                    <span>{doc.specialty}</span>
                  </figcaption>
                </motion.figure>
              )
            })}
          </div>

          <motion.p
            className="hd-team__hint"
            variants={trace}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <span className="hd-channel__dot" aria-hidden />
            {copy.groupHint}
          </motion.p>

          <div className="hd-team__foot">
            <a href="/doctors" className="hd-more">
              {copy.viewAll} <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
