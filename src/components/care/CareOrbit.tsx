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
import { getHomeFeaturedDoctors, getHomeDoctorWallDoctors, getDoctorWallPlaybackRate, getDoctorWallPortraitPosition, getHomeOrbitDoctors } from '../../data/doctors'
import { getDoctorCardPortrait, getDoctorTurnMedia } from '../../data/doctorTurnMedia'
import { isSafari } from '../../lib/browser'
import { useMobileLayout } from '../../hooks/useMobileLayout'
import { MaskedText, SectionHead } from './careUi'

/**
 * Doctor wall cards label each portrait with a role, not a department —
 * "Kardiolog", not "Kardiologiya" (mirrors how nurses already show a role
 * like "Bosh hamshira" rather than their department). Doctor.role text is
 * too inconsistent in length to use directly (some are a single word,
 * others long institutional phrases), so this maps the specialty text to
 * a short practitioner title instead. Unmapped specialties — including all
 * of Karakalpak, which this intentionally doesn't cover — fall back to the
 * specialty name unchanged, same as before this map existed.
 */
const SPECIALTY_PRACTITIONER_TITLE: Partial<Record<'uz' | 'ru' | 'en', Record<string, string>>> = {
  uz: {
    'Akusherlik': 'Akusher',
    'Anesteziologiya': 'Anesteziolog',
    'Dermatologiya': 'Dermatolog',
    'Endokrinologiya': 'Endokrinolog',
    'Jarrohlik': 'Jarroh',
    'Kardiologiya': 'Kardiolog',
    'Nevrologiya': 'Nevrolog',
    'Onkologiya': 'Onkolog',
    'Ortopediya': 'Ortoped',
    'Otorinolaringologiya': 'LOR',
    'Pediatriya': 'Pediatr',
    'Pulmonologiya': 'Pulmonolog',
    'Terapiya': 'Terapevt',
    'Ultratovush diagnostikasi': 'UTT vrachi',
    'Urologiya': 'Urolog',
  },
  ru: {
    'Акушерство': 'Акушер',
    'Анестезиология': 'Анестезиолог',
    'Дерматология': 'Дерматолог',
    'Эндокринология': 'Эндокринолог',
    'Хирургия': 'Хирург',
    'Кардиология': 'Кардиолог',
    'Неврология': 'Невролог',
    'Онкология': 'Онколог',
    'Ортопедия': 'Ортопед',
    'Оториноларингология': 'ЛОР',
    'Педиатрия': 'Педиатр',
    'Пульмонология': 'Пульмонолог',
    'Терапия': 'Терапевт',
    'УЗ-диагностика': 'Врач УЗД',
    'Урология': 'Уролог',
  },
  en: {
    'Obstetrics': 'Obstetrician',
    'Anesthesiology': 'Anesthesiologist',
    'Dermatology': 'Dermatologist',
    'Endocrinology': 'Endocrinologist',
    'Surgery': 'Surgeon',
    'Cardiology': 'Cardiologist',
    'Neurology': 'Neurologist',
    'Oncology': 'Oncologist',
    'Orthopedics': 'Orthopedist',
    'Otolaryngology': 'ENT specialist',
    'Pediatrics': 'Pediatrician',
    'Pulmonology': 'Pulmonologist',
    'Therapy': 'Therapist',
    'Ultrasound diagnostics': 'Ultrasound specialist',
    'Urology': 'Urologist',
  },
}

function practitionerTitle(specialty: string, lang: string): string {
  return SPECIALTY_PRACTITIONER_TITLE[lang as 'uz' | 'ru' | 'en']?.[specialty] ?? specialty
}

const CARD_W = 76
const CARD_H = 104

type Doctor = {
  slug: string
  name: string
  specialty: string
  photo: string
}

function ringPosition(index: number, total: number, size: { w: number; h: number }) {
  const isPhone = size.w < 768
  const ringRadius = isPhone
    ? Math.min(size.w * 0.38, size.h * 0.3)
    : Math.min(Math.min(size.w, size.h) * 0.33, 320)
  const ringAngle = (index / total) * 360 - 90
  const ringRad = (ringAngle * Math.PI) / 180
  return {
    ringX: Math.cos(ringRad) * ringRadius,
    ringY: Math.sin(ringRad) * ringRadius,
  }
}

function StaticOrbitCard({
  doctor,
  index,
  total,
  size,
}: {
  doctor: Doctor
  index: number
  total: number
  size: { w: number; h: number }
}) {
  const { ringX, ringY } = ringPosition(index, total, size)
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

/**
 * One portrait on the ring (scroll-driven desktop only).
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
}: {
  doctor: Doctor
  index: number
  total: number
  progress: MotionValue<number>
  size: { w: number; h: number }
}) {
  const isMobile = size.w < 768
  const { ringX, ringY } = ringPosition(index, total, size)
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
        loading="lazy"
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
 * The doctors, as a ring that opens into an arch on scroll (desktop only).
 */
function CareOrbitAnimated() {
  const { t, lang } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  const copy = t.homeDark.team

  // Twenty portraits need roughly 1160px of ring to sit side by side. A phone
  // only offers ~780px of circumference, so all twenty overlap into a rosette
  // and the heading has no hole left to sit in. Eleven matches clinic signage;
  // the section links to the full doctor list anyway.
  const count = size.w > 0 && size.w < 768 ? 12 : 20

  const doctors: Doctor[] = getHomeOrbitDoctors(count).map((p) => ({
      slug: p.slug,
      name: p.content[lang].name,
      specialty: p.content[lang].specialty,
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
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 32, restDelta: 0.001 })

  // The ring's own caption sits in the hole and leaves once the shape opens;
  // the section heading takes over as the arch forms.
  const ringCopyOpacity = useTransform(progress, [0, 0.22], [1, 0])
  const archCopyOpacity = useTransform(progress, [0.42, 0.72], [0, 1])
  const archCopyY = useTransform(progress, [0.42, 0.72], [24, 0])
  const skipMorph = () => {
    const section = sectionRef.current
    if (!section) return
    const top = section.offsetTop + section.offsetHeight
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <section ref={sectionRef} className="hc-orbit" aria-labelledby="hc-orbit-title">
      <button type="button" className="hc-orbit__skip" onClick={skipMorph}>
        {t.homeCare.orbitSkip}
      </button>
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
                />
              ))
            : null}

          <motion.div className="hc-orbit__center" style={{ opacity: ringCopyOpacity }}>
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
        </div>
      </div>
    </section>
  )
}

function CareOrbitMobile() {
  const { t, lang } = useLanguage()
  const copy = t.homeDark.team
  const featured = getHomeFeaturedDoctors(4)

  useEffect(() => {
    featured.forEach((doc) => {
      const img = new Image()
      img.src = getDoctorCardPortrait(doc.slug, doc.photo)
    })
  }, [featured])

  return (
    <section
      className="hc-section hc-section--tint hc-orbit hc-orbit--mobile"
      aria-labelledby="hc-orbit-title"
    >
      <div className="hc-shell">
        <SectionHead
          eyebrow={t.homeCare.doctorsEyebrow}
          id="hc-orbit-title"
          title={
            <>
              {t.homeCare.orbitTitle1} <em>{t.homeCare.orbitTitleEm}</em>
            </>
          }
          description={t.homeCare.orbitReveal}
          action={
            <a className="hc-more" href="/doctors">
              {copy.viewAll} <span aria-hidden>→</span>
            </a>
          }
        />

        <div className="hc-docs__grid hc-orbit__mobile-grid">
          {featured.map((doc) => {
            const info = doc.content[lang]
            return (
              <a key={doc.slug} className="hc-doc" href={`/doctors/${doc.slug}`}>
                <span className="hc-doc__media">
                  <img
                    className="hc-doc__photo"
                    src={getDoctorCardPortrait(doc.slug, doc.photo)}
                    alt={info.name}
                    width={400}
                    height={500}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                </span>
                <span className="hc-doc__body">
                  <span className="hc-doc__name">{info.name}</span>
                  <span className="hc-doc__spec">{info.specialty}</span>
                  <span className="hc-doc__exp">{info.exp}</span>
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CareOrbitStatic() {
  const { t, lang } = useLanguage()
  const stageRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const copy = t.homeDark.team

  const count = size.w > 0 && size.w < 768 ? 12 : 20
  const doctors: Doctor[] = getHomeOrbitDoctors(count).map((p) => ({
      slug: p.slug,
      name: p.content[lang].name,
      specialty: p.content[lang].specialty,
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

  return (
    <section className="hc-orbit is-static" aria-labelledby="hc-orbit-title">
      <div className="hc-orbit__sticky">
        <div className="hc-orbit__stage" ref={stageRef}>
          {size.w > 0
            ? doctors.map((doctor, i) => (
                <StaticOrbitCard
                  key={doctor.slug}
                  doctor={doctor}
                  index={i}
                  total={doctors.length}
                  size={size}
                />
              ))
            : null}

          <div className="hc-orbit__center">
            <MaskedText as="h2" className="hc-title" id="hc-orbit-title">
              {t.homeCare.orbitTitle1} <em>{t.homeCare.orbitTitleEm}</em>
            </MaskedText>
            <MaskedText as="p" className="hc-orbit__hint">
              {t.homeCare.orbitHint}
            </MaskedText>
          </div>

          <div className="hc-orbit__reveal">
            <p className="hc-eyebrow">{t.homeCare.doctorsEyebrow}</p>
            <p className="hc-orbit__reveal-title">{t.homeCare.orbitReveal}</p>
            <a className="hc-btn" href="/doctors">
              {copy.viewAll}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/** A focused doctor picker: selecting a name changes the single lead profile. */
function CareDoctorNavigator() {
  const { t, lang } = useLanguage()
  const doctors = getHomeOrbitDoctors(6).map((doctor) => ({
    slug: doctor.slug,
    photo: getDoctorCardPortrait(doctor.slug, doctor.photo),
    ...doctor.content[lang],
  }))
  const [activeSlug, setActiveSlug] = useState(doctors[0]?.slug ?? '')
  const active = doctors.find((doctor) => doctor.slug === activeSlug) ?? doctors[0]

  if (!active) return null

  return (
    <section className="hc-section hc-section--tint hc-doctor-navigator" aria-labelledby="hc-doctor-navigator-title">
      <div className="hc-shell">
        <div className="hc-doctor-navigator__head">
          <div>
            <p className="hc-eyebrow">{t.homeCare.doctorsEyebrow}</p>
            <h2 className="hc-display" id="hc-doctor-navigator-title">
              {t.homeCare.orbitTitle1} <em>{t.homeCare.orbitTitleEm}</em>
            </h2>
          </div>
          <p className="hc-lead">{t.homeCare.orbitReveal}</p>
        </div>

        <div className="hc-doctor-navigator__layout">
          <nav className="hc-doctor-navigator__list" aria-label={t.homeCare.doctorsEyebrow}>
            {doctors.map((doctor, index) => {
              const isActive = doctor.slug === active.slug
              return (
                <button
                  key={doctor.slug}
                  type="button"
                  className={`hc-doctor-navigator__item${isActive ? ' is-active' : ''}`}
                  onClick={() => setActiveSlug(doctor.slug)}
                  aria-pressed={isActive}
                >
                  <span className="hc-doctor-navigator__number">0{index + 1}</span>
                  <span>
                    <strong>{doctor.name}</strong>
                    <small>{doctor.specialty}</small>
                  </span>
                  <span className="hc-doctor-navigator__arrow" aria-hidden>↗</span>
                </button>
              )
            })}
            <a className="hc-doctor-navigator__all" href="/doctors">
              {t.homeDark.team.viewAll} <span aria-hidden>→</span>
            </a>
          </nav>

          <article className="hc-doctor-navigator__profile">
            <div className="hc-doctor-navigator__copy">
              <p className="hc-doctor-navigator__specialty">{active.specialty}</p>
              <h3>{active.name}</h3>
              <p className="hc-doctor-navigator__role">{active.role}</p>
              <p className="hc-doctor-navigator__about">{active.about}</p>
              <dl className="hc-doctor-navigator__facts">
                <div><dt>{active.exp}</dt><dd>{t.homeCare.doctorsEyebrow}</dd></div>
                <div><dt>{active.languages.length}</dt><dd>{active.languages.join(' · ')}</dd></div>
              </dl>
              <a className="hc-btn" href={`/doctors/${active.slug}`}>{t.doctors.bookBtn}</a>
            </div>
            <div className="hc-doctor-navigator__photo-wrap">
              <img src={active.photo} alt={active.name} className="hc-doctor-navigator__photo" />
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function primeWallVideo(el: HTMLVideoElement | null, slug: string) {
  if (!el) return
  el.playbackRate = getDoctorWallPlaybackRate(slug)
  const showFirstFrame = () => {
    el.pause()
    el.currentTime = 0.001
  }
  if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) showFirstFrame()
  else el.addEventListener('loadeddata', showFirstFrame, { once: true })
}

/** One doctor card — turn poster matches video framing (no crop jump on hover). */
function DoctorWallCard({
  doctor,
  isCenter,
  index,
  bookLabel,
  registerVideo,
}: {
  doctor: {
    slug: string
    name: string
    specialty: string
    wallLabel: string
    exp: string
    portrait: string
    fallbackPortrait: string
    video?: string
  }
  isCenter: boolean
  index: number
  bookLabel: string
  registerVideo: (slug: string, el: HTMLVideoElement | null) => void
}) {
  const [portraitSrc, setPortraitSrc] = useState(doctor.portrait)

  useEffect(() => {
    setPortraitSrc(doctor.portrait)
  }, [doctor.portrait])

  return (
    <a
      href={`/doctors/${doctor.slug}`}
      className={`hc-doctor-wall__card${isCenter ? ' is-center' : ''}`}
      aria-label={`${doctor.name}, ${doctor.wallLabel}`}
      style={{
        ['--wall-order' as string]: index,
        ['--wall-photo-position' as string]: getDoctorWallPortraitPosition(doctor.slug),
        ['--wall-portrait' as string]: `url("${portraitSrc}")`,
      }}
    >
      {doctor.video ? (
        <>
          <img
            src={portraitSrc}
            alt=""
            aria-hidden
            className="hc-doctor-wall__photo hc-doctor-wall__poster"
            loading="eager"
            decoding={isSafari() ? 'sync' : 'async'}
            onError={() => {
              if (portraitSrc !== doctor.fallbackPortrait) setPortraitSrc(doctor.fallbackPortrait)
            }}
          />
          <video
            ref={(element) => {
              registerVideo(doctor.slug, element)
              primeWallVideo(element, doctor.slug)
            }}
            className="hc-doctor-wall__photo hc-doctor-wall__video"
            muted
            playsInline
            preload="auto"
            poster={portraitSrc}
            aria-label={doctor.name}
            onLoadedData={(event) => primeWallVideo(event.currentTarget, doctor.slug)}
          >
            <source src={doctor.video} type="video/mp4" />
          </video>
        </>
      ) : (
        <img
          src={portraitSrc}
          alt={doctor.name}
          className="hc-doctor-wall__photo hc-doctor-wall__poster"
          loading="eager"
          decoding={isSafari() ? 'sync' : 'async'}
          fetchPriority="high"
          onError={() => {
            if (portraitSrc !== doctor.fallbackPortrait) setPortraitSrc(doctor.fallbackPortrait)
          }}
        />
      )}
      <span className="hc-doctor-wall__specialty">{doctor.wallLabel}</span>
      <span className="hc-doctor-wall__scrim" aria-hidden />
      <span className="hc-doctor-wall__meta">
        <small>{doctor.specialty}</small>
        <strong>{doctor.name}</strong>
        <em>{doctor.exp}</em>
        <b>
          {bookLabel} <span aria-hidden>→</span>
        </b>
      </span>
    </a>
  )
}

/** A living staff wall: one portrait expands while the rest yield around it. */
function CareDoctorWall() {
  const { t, lang } = useLanguage()
  const doctors = getHomeDoctorWallDoctors(7).map((doctor) => {
    const turn = getDoctorTurnMedia(doctor.slug)
    const portrait = turn?.poster ?? doctor.photo
    const content = doctor.content[lang]
    const wallLabel =
      doctor.staffKind === 'nurse' ? content.role : practitionerTitle(content.specialty, lang)
    return {
      slug: doctor.slug,
      portrait,
      fallbackPortrait: portrait,
      video: turn?.video,
      wallLabel,
      ...content,
    }
  })
  const isMobile = useMobileLayout()
  const reduce = useReducedMotion()
  const hoverOk = !isMobile && !reduce
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  const registerVideo = (slug: string, el: HTMLVideoElement | null) => {
    videoRefs.current[slug] = el
  }

  const playAll = () => {
    if (!hoverOk) return
    Object.entries(videoRefs.current).forEach(([slug, video]) => {
      if (!video) return
      video.playbackRate = getDoctorWallPlaybackRate(slug)
      const start = () => {
        video.currentTime = 0
        video.play().catch(() => undefined)
      }
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) start()
      else {
        video.load()
        video.addEventListener('loadeddata', start, { once: true })
      }
    })
  }

  const resetAll = () => {
    Object.entries(videoRefs.current).forEach(([slug, video]) => {
      primeWallVideo(video, slug)
    })
  }

  return (
    <section className="hc-section hc-section--tint hc-doctor-wall" aria-labelledby="hc-doctor-wall-title">
      <div className="hc-shell">
        <div className="hc-doctor-wall__head">
          <p className="hc-eyebrow">{t.homeCare.doctorsEyebrow}</p>
          <h2 className="hc-display" id="hc-doctor-wall-title">
            {t.homeCare.orbitTitle1} <em>{t.homeCare.orbitTitleEm}</em>
          </h2>
          <p className="hc-lead">{t.homeCare.orbitReveal}</p>
        </div>

        <div
          className="hc-doctor-wall__stage"
          onPointerEnter={playAll}
          onPointerLeave={resetAll}
        >
          {doctors.map((doctor, index) => (
            <DoctorWallCard
              key={doctor.slug}
              doctor={doctor}
              isCenter={index === Math.floor(doctors.length / 2)}
              index={index}
              bookLabel={t.doctors.bookBtn}
              registerVideo={registerVideo}
            />
          ))}
        </div>

        <div className="hc-doctor-wall__foot">
          <span className="hc-doctor-wall__hint">{t.homeCare.orbitHint}</span>
          <a href="/doctors">{t.homeDark.team.viewAll} <span aria-hidden>→</span></a>
        </div>
      </div>
    </section>
  )
}

export default function CareOrbit() {
  const isMobile = useMobileLayout()
  const reduce = useReducedMotion()
  const useLegacyOrbit = false
  const useNavigator = false

  // The original ring-to-arch scene stays in this file for a fast rollback.
  if (useLegacyOrbit) {
    if (isMobile) return <CareOrbitMobile />
    if (reduce) return <CareOrbitStatic />
    return <CareOrbitAnimated />
  }

  return useNavigator ? <CareDoctorNavigator /> : <CareDoctorWall />
}

export { CARD_W, CARD_H }
