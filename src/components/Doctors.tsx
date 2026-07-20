import { useState } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { staggerContainer, rise3d, blurUp } from '../lib/animations'
import { media } from '../data/media'

const DOCTOR_IMAGES = Object.values(media.doctors)

export default function Doctors() {
  const { t } = useLanguage()
  const { home } = useCms()
  const [showAll, setShowAll] = useState(false)
  const [reverse, setReverse] = useState(false)

  const doctors = home?.doctors?.length
    ? [...home.doctors]
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

  const loop = doctors.length > 1 ? [...doctors, ...doctors] : doctors
  const durationSec = Math.max(28, doctors.length * 7)

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
          <div
            className={`doctor-carousel${reverse ? ' doctor-carousel--reverse' : ''}`}
          >
            {doctors.length > 1 && (
              <>
                <button
                  type="button"
                  className="doctor-carousel__side doctor-carousel__side--prev"
                  onClick={() => setReverse(true)}
                  aria-label="Orqaga"
                >
                  <Chevron dir="left" />
                </button>
                <button
                  type="button"
                  className="doctor-carousel__side doctor-carousel__side--next"
                  onClick={() => setReverse(false)}
                  aria-label="Oldinga"
                >
                  <Chevron dir="right" />
                </button>
              </>
            )}

            <div className="doctor-carousel__viewport">
              <div
                className="doctor-carousel__track"
                style={{ animationDuration: `${durationSec}s` }}
              >
                {loop.map((doc, i) => (
                  <DoctorCard
                    key={`${doc.id}-${i}`}
                    doc={doc}
                    bookLabel={t.doctors.bookBtn}
                    papersLabel={t.doctors.papers}
                    studiesLabel={t.doctors.studies}
                    animated={false}
                  />
                ))}
              </div>
            </div>
          </div>
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
