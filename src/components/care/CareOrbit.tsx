import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { doctorProfiles } from '../../data/doctors'
import { MaskedText } from './careUi'

const CARD_W = 76
const CARD_H = 104

type Doctor = {
  slug: string
  name: string
  specialty: string
  photo: string
}

/**
 * One portrait on the ring.
 *
 * Each card owns its own `useTransform` calls rather than the parent computing
 * every position on a state update. That keeps the whole morph on the
 * compositor — the parent never re-renders while you scroll — and it keeps the
 * hook order stable, which mapping transforms inside the parent's loop would
 * not guarantee.
 */
function OrbitCard({
  doctor,
  index,
  total,
  progress,
  size,
  reduce,
}: {
  doctor: Doctor
  index: number
  total: number
  progress: MotionValue<number>
  size: { w: number; h: number }
  reduce: boolean | null
}) {
  const isMobile = size.w < 768

  // --- Ring: portraits evenly spaced, each turned to face outward. The phone
  // ring runs wider relative to the screen so the heading keeps a clear hole.
  const ringRadius = isMobile
    ? Math.min(size.w * 0.38, size.h * 0.3)
    : Math.min(Math.min(size.w, size.h) * 0.33, 320)
  const ringAngle = (index / total) * 360 - 90
  const ringRad = (ringAngle * Math.PI) / 180
  const ringX = Math.cos(ringRad) * ringRadius
  const ringY = Math.sin(ringRad) * ringRadius

  // Portraits stay upright on the ring. Turning each card to face outward is
  // what the original effect does, but it inverts everything on the lower half
  // — and an upside-down photograph of a named doctor reads as a broken page,
  // not as a composition. The arch tilts instead, and never past ~60°, where a
  // face is still legible.
  const ringRotation = 0

  // --- Arch: the ring opens upward into a crown.
  //
  // The radius is derived from the viewport rather than picked, because the
  // arch's half-width is exactly `radius · sin(spread/2)` — guessing a radius
  // put the end portraits 1400px off either side of a 1425px screen, so most
  // of the team was invisible at the one moment the section is about them.
  // Solving for the width we actually want keeps all twenty on screen at any
  // size.
  const spread = isMobile ? 140 : 120
  const halfSpreadRad = ((spread / 2) * Math.PI) / 180
  // 0.44 rather than 0.48: the end cards are scaled up and rotated, so their
  // corners reach past the nominal half-width and were clipping on the stage
  // edge — the two doctors most likely to be cut are the ones at the ends.
  const archHalfWidth = size.w * (isMobile ? 0.46 : 0.44)
  const archRadius = archHalfWidth / Math.sin(halfSpreadRad)

  const step = spread / (total - 1)
  const archAngle = -90 - spread / 2 + index * step
  const archRad = (archAngle * Math.PI) / 180
  const archApexY = -size.h * 0.16
  const archX = Math.cos(archRad) * archRadius
  const archY = Math.sin(archRad) * archRadius + archApexY + archRadius

  // The outer cards travel furthest, so they are given slightly more of the
  // scroll to cover it — without the offset the arch snaps together at the
  // ends and drifts at the centre.
  const edge = Math.abs(index - (total - 1) / 2) / ((total - 1) / 2)
  const start = 0.04 + edge * 0.06
  const end = Math.min(start + 0.62, 0.92)
  // A straight ring→arch interpolation sends the lower portraits through the
  // middle of the stage, producing a dense pile-up. A quadratic path gives
  // every portrait an outside control point instead, so it travels around the
  // care core before settling into the crown.
  const curve = start + (end - start) * 0.46
  const span: [number, number, number] = [start, curve, end]
  const orbitLift = size.h * (isMobile ? 0.045 : 0.065)
  const routeSide = Math.sign(archX) || Math.sign(ringX) || 1
  const controlX = ringX * 1.28 + routeSide * size.w * (isMobile ? 0.05 : 0.075)
  const controlY = ringY * 1.14 - orbitLift
  const pathProgress = (value: number) =>
    Math.max(0, Math.min(1, (value - start) / Math.max(end - start, 0.001)))
  const x = useTransform(progress, (value) => {
    const t = pathProgress(value)
    const inv = 1 - t
    return inv * inv * ringX + 2 * inv * t * controlX + t * t * archX
  })
  const y = useTransform(progress, (value) => {
    const t = pathProgress(value)
    const inv = 1 - t
    return inv * inv * ringY + 2 * inv * t * controlY + t * t * archY
  })
  const rotate = useTransform(progress, span, [
    ringRotation,
    ringRotation,
    archAngle + 90,
  ])
  // Cards sit ~66px apart on the arch. At 1.4 they overlapped enough to fuse
  // into one continuous mural — the rounded corners vanished and the crown
  // stopped reading as twenty separate people, which is the whole point. 1.15
  // keeps each portrait its own card while still overlapping into a deck.
  const scale = useTransform(progress, span, [1, 1.03, isMobile ? 1.05 : 1.15])
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`

  if (reduce) {
    return (
      <a
        className="hc-orbit__card"
        href={`/doctors/${doctor.slug}`}
        style={{ transform: `translate(${ringX}px, ${ringY}px)` }}
      >
        <CardFace doctor={doctor} />
      </a>
    )
  }

  return (
    <motion.a
      className="hc-orbit__card"
      href={`/doctors/${doctor.slug}`}
      style={{ transform }}
    >
      <CardFace doctor={doctor} />
    </motion.a>
  )
}

function CardFace({ doctor }: { doctor: Doctor }) {
  return (
    <>
      <img
        className="hc-orbit__photo"
        src={doctor.photo}
        alt={doctor.name}
        loading="eager"
        fetchPriority="low"
        decoding="async"
      />
      {/* The label rides with the card and only appears on hover/focus, so the
          ring stays a shape at rest and becomes a directory on approach. */}
      <span className="hc-orbit__label">
        <strong>{doctor.name}</strong>
        <em>{doctor.specialty}</em>
      </span>
    </>
  )
}

/**
 * The doctors, as a ring that opens into an arch on scroll.
 *
 * Driven by the page's own scroll against a tall section with a sticky stage —
 * the idiom already used by the dark homepage's team section. Nothing captures
 * the wheel: a visitor who wants the phone number can always keep scrolling,
 * which matters more here than on a portfolio site.
 */
export default function CareOrbit() {
  const { t, contentLang } = useLanguage()
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  const copy = t.homeDark.team

  // Twenty portraits need roughly 1160px of ring to sit side by side. A phone
  // only offers ~780px of circumference, so all twenty overlap into a rosette
  // and the heading has no hole left to sit in. Twelve fits with gaps, and the
  // section links to the full list anyway.
  const count = size.w > 0 && size.w < 768 ? 12 : 20

  const doctors: Doctor[] = doctorProfiles
    .filter((p) => p.staffKind !== 'nurse')
    .slice(0, count)
    .map((p) => ({
      slug: p.slug,
      name: p.content[contentLang].name,
      specialty: p.content[contentLang].specialty,
      photo: p.photo,
    }))

  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    const sync = () => setSize({ w: node.offsetWidth, h: node.offsetHeight })
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })

  // The ring's own caption sits in the hole and leaves once the shape opens;
  // the section heading takes over as the arch forms.
  const ringCopyOpacity = useTransform(progress, [0, 0.22], [1, 0])
  const archCopyOpacity = useTransform(progress, [0.42, 0.72], [0, 1])
  const archCopyY = useTransform(progress, [0.42, 0.72], [24, 0])
  return (
    <section
      ref={sectionRef}
      className={`hc-orbit${reduce ? ' is-static' : ''}`}
      aria-labelledby="hc-orbit-title"
    >
      <div className="hc-orbit__sticky">
        <div className="hc-orbit__stage" ref={stageRef}>
          {size.w > 0
            ? doctors.map((doctor, i) => (
                <OrbitCard
                  key={doctor.slug}
                  doctor={doctor}
                  index={i}
                  total={doctors.length}
                  progress={progress}
                  size={size}
                  reduce={reduce}
                />
              ))
            : null}

          <motion.div
            className="hc-orbit__center"
            style={reduce ? undefined : { opacity: ringCopyOpacity }}
          >
            {/* The hole stays empty apart from the words. An image here was
                tried and cut: the ring of twenty real faces is already the
                picture, and anything in the middle either fought the portraits
                for attention or dragged a second palette onto the page.

                The ring has its own copy rather than borrowing the dark
                homepage's team heading: this page talks to a patient deciding
                where to book, not to a reader being told about an institute.
                It also has to not pre-empt the arch line that follows it. */}
            <MaskedText as="h2" className="hc-title" id="hc-orbit-title">
              {t.homeCare.orbitTitle1} <em>{t.homeCare.orbitTitleEm}</em>
            </MaskedText>
            <MaskedText as="p" className="hc-orbit__hint">
              {t.homeCare.orbitHint}
            </MaskedText>
          </motion.div>

          {reduce ? null : (
            <motion.div
              className="hc-orbit__reveal"
              style={{ opacity: archCopyOpacity, y: archCopyY }}
            >
              <p className="hc-eyebrow">{t.homeCare.doctorsEyebrow}</p>
              <p className="hc-orbit__reveal-title">{t.homeCare.orbitReveal}</p>
              <a className="hc-btn" href="/doctors">
                {copy.viewAll}
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export { CARD_W, CARD_H }
