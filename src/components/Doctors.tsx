import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { staggerContainer, rise3d, blurUp } from '../lib/animations'
import { media } from '../data/media'

const DOCTOR_IMAGES = Object.values(media.doctors)
const GAP_PX = 18
const AUTO_SPEED = 42 // px per second

export default function Doctors() {
  const { t } = useLanguage()
  const { home } = useCms()
  const [showAll, setShowAll] = useState(false)

  const doctors = home
    ? [...(home.doctors ?? [])]
        .sort((a, b) => a.order - b.order)
        .map((d) => ({
          id: String(d.id),
          name: d.name,
          role: d.role,
          specialty: d.specialty,
          exp: d.exp,
          papers: d.papers,
          studies: d.studies,
          color: d.color || '#5B4CDB',
          photo: d.photo || DOCTOR_IMAGES[0],
        }))
    : t.doctors.list.map((d, i) => ({
        id: `static-${i}`,
        ...d,
        photo: DOCTOR_IMAGES[i] || DOCTOR_IMAGES[0],
      }))

  return (
    <section id="doctors" className="section section--muted doctors-section">
      <div className="container-main">
        <Reveal variants={blurUp}>
          <SectionHeader
            label={t.doctors.label}
            title={<>{t.doctors.title1}<br />{t.doctors.title2}</>}
            action={
              <button
                type="button"
                className="btn-ghost doctors-section__all"
                onClick={() => setShowAll((v) => !v)}
                aria-expanded={showAll}
              >
                {showAll ? t.doctors.collapseBtn : t.doctors.allBtn}
              </button>
            }
          />
        </Reveal>

        {showAll ? (
          doctors.length ? (
            <motion.div
              className="doctor-grid doctor-grid--all"
              variants={staggerContainer(0.08)}
              initial="hidden"
              animate="show"
            >
              {doctors.map((doc) => (
                <DoctorCard
                  key={doc.id}
                  doc={doc}
                  bookLabel={t.doctors.bookBtn}
                  papersLabel={t.doctors.papers}
                  studiesLabel={t.doctors.studies}
                />
              ))}
            </motion.div>
          ) : (
            <p className="doctors-section__empty">Hozircha shifokorlar qo‘shilmagan.</p>
          )
        ) : doctors.length ? (
          <DoctorCarousel
            doctors={doctors}
            bookLabel={t.doctors.bookBtn}
            papersLabel={t.doctors.papers}
            studiesLabel={t.doctors.studies}
          />
        ) : (
          <p className="doctors-section__empty">Hozircha shifokorlar qo‘shilmagan.</p>
        )}
      </div>
    </section>
  )
}

type Doc = {
  id: string
  name: string
  role: string
  specialty: string
  exp: string
  papers: number | string
  studies: number | string
  color: string
  photo: string
}

function DoctorCarousel({
  doctors,
  bookLabel,
  papersLabel,
  studiesLabel,
}: {
  doctors: Doc[]
  bookLabel: string
  papersLabel: string
  studiesLabel: string
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const dirRef = useRef(1)
  const pauseUntilRef = useRef(0)
  const reduceMotion = usePrefersReducedMotion()
  const loop = doctors.length > 1 ? [...doctors, ...doctors] : doctors

  useEffect(() => {
    if (reduceMotion || doctors.length < 2) return
    const viewport = viewportRef.current
    if (!viewport) return

    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.048, (now - last) / 1000)
      last = now
      const half = viewport.scrollWidth / 2

      if (half > 0) {
        if (viewport.scrollLeft >= half) viewport.scrollLeft -= half
        if (viewport.scrollLeft < 0) viewport.scrollLeft += half
      }

      if (now >= pauseUntilRef.current && half > 0) {
        viewport.scrollLeft += AUTO_SPEED * dirRef.current * dt
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [doctors.length, reduceMotion])

  const cardStep = () => {
    const viewport = viewportRef.current
    const card = viewport?.querySelector('.doctor-card')
    if (!card) return 280 + GAP_PX
    return card.getBoundingClientRect().width + GAP_PX
  }

  const nudge = (dir: 1 | -1) => {
    const viewport = viewportRef.current
    if (!viewport) return
    dirRef.current = dir
    pauseUntilRef.current = performance.now() + 900
    const step = cardStep()
    const half = viewport.scrollWidth / 2
    let next = viewport.scrollLeft + dir * step
    if (half > 0) {
      if (next >= half) next -= half
      if (next < 0) next += half
    }
    viewport.scrollTo({ left: next, behavior: 'smooth' })
  }

  return (
    <div className="doctor-carousel">
      {doctors.length > 1 && (
        <>
          <button
            type="button"
            className="doctor-carousel__side doctor-carousel__side--prev"
            onClick={() => nudge(-1)}
            aria-label="Orqaga"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            className="doctor-carousel__side doctor-carousel__side--next"
            onClick={() => nudge(1)}
            aria-label="Oldinga"
          >
            <Chevron dir="right" />
          </button>
        </>
      )}

      <div
        ref={viewportRef}
        className="doctor-carousel__viewport"
        onPointerDown={() => {
          pauseUntilRef.current = performance.now() + 1600
        }}
        onWheel={() => {
          pauseUntilRef.current = performance.now() + 1600
        }}
      >
        <div className="doctor-carousel__track">
          {loop.map((doc, i) => (
            <DoctorCard
              key={`${doc.id}-${i}`}
              doc={doc}
              bookLabel={bookLabel}
              papersLabel={papersLabel}
              studiesLabel={studiesLabel}
              animated={false}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M11.25 4.5 6.75 9l4.5 4.5' : 'M6.75 4.5 11.25 9l-4.5 4.5'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DoctorCard({
  doc,
  bookLabel,
  papersLabel,
  studiesLabel,
  animated = true,
}: {
  doc: Doc
  bookLabel: string
  papersLabel: string
  studiesLabel: string
  animated?: boolean
}) {
  const body = (
    <>
      <div className="doctor-card__media">
        <img src={doc.photo} alt={doc.name} loading="lazy" />
        <span className="doctor-card__badge">{doc.specialty}</span>
      </div>

      <div className="doctor-card__body">
        <h3 className="doctor-card__name">{doc.name}</h3>
        <p className="doctor-card__role">{doc.role}</p>
        <p className="doctor-card__exp">{doc.exp}</p>

        <div className="doctor-card__stats">
          <div className="doctor-card__stat">
            <strong style={{ color: doc.color }}>{doc.papers}</strong>
            <span>{papersLabel}</span>
          </div>
          <div className="doctor-card__stat">
            <strong style={{ color: doc.color }}>{doc.studies}</strong>
            <span>{studiesLabel}</span>
          </div>
        </div>

        <a href="#contacts" className="doctor-card__cta">
          {bookLabel}
        </a>
      </div>
    </>
  )

  if (!animated) {
    return <article className="doctor-card">{body}</article>
  }

  return (
    <motion.article
      className="doctor-card"
      variants={rise3d}
      whileHover={{ y: -7, transition: { type: 'spring', stiffness: 260, damping: 20 } }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {body}
    </motion.article>
  )
}
