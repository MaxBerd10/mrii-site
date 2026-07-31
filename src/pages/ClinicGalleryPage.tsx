import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { usePageNav } from '../components/PageTransition'
import '../styles/clinic-gallery.css'

const GALLERY_IMAGES = [
  { id: 'courtyard', src: '/images/clinic-gallery/courtyard.webp' },
  { id: 'reception', src: '/images/clinic-gallery/reception.webp' },
  { id: 'ultrasound', src: '/images/clinic-gallery/ultrasound.webp' },
  { id: 'ct', src: '/images/clinic-gallery/ct.webp' },
  { id: 'operating', src: '/images/clinic-gallery/operating-room.webp' },
  { id: 'ward', src: '/images/clinic-gallery/ward.webp' },
  { id: 'conference', src: '/images/clinic-gallery/conference.webp' },
  { id: 'corridor', src: '/images/clinic-gallery/corridor.webp' },
  { id: 'lobby', src: '/images/clinic-gallery/lobby.webp' },
  { id: 'entrance', src: '/images/clinic-gallery/entrance.webp' },
  { id: 'campus', src: '/images/clinic-gallery/campus.webp' },
  { id: 'mainCorridor', src: '/images/clinic-gallery/main-corridor.webp' },
  { id: 'consultation', src: '/images/clinic-gallery/consultation.webp' },
  { id: 'procedure', src: '/images/clinic-gallery/procedure-room.webp' },
  { id: 'treatment', src: '/images/clinic-gallery/treatment-area.webp' },
  { id: 'gynecology', src: '/images/clinic-gallery/gynecology.webp' },
  { id: 'inpatient', src: '/images/clinic-gallery/inpatient-ward.webp' },
  { id: 'intensiveCare', src: '/images/clinic-gallery/intensive-care.webp' },
  { id: 'surgicalSuite', src: '/images/clinic-gallery/surgical-suite.webp' },
  { id: 'education', src: '/images/clinic-gallery/education-room.webp' },
] as const

type GalleryImageId = typeof GALLERY_IMAGES[number]['id']

function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={direction === 'left' ? 'M16 10H5m4-4-4 4 4 4' : 'M4 10h11m-4-4 4 4-4 4'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function ClinicGalleryPage() {
  const { t } = useLanguage()
  const { routeEnter } = usePageNav()
  const reduceMotion = useReducedMotion()
  const shouldAnimate = routeEnter && !reduceMotion
  const [activeId, setActiveId] = useState<GalleryImageId>('courtyard')
  const activeIndex = GALLERY_IMAGES.findIndex((image) => image.id === activeId)
  const activeImage = GALLERY_IMAGES[activeIndex]

  const move = (direction: 1 | -1) => {
    const nextIndex = (activeIndex + direction + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
    setActiveId(GALLERY_IMAGES[nextIndex].id)
  }

  return (
    <main className="clinic-gallery-page">
      <motion.header
        className="clinic-gallery-page__intro"
        initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
      >
        <a className="clinic-gallery-page__back" href="/clinic">← {t.nav.clinic}</a>
        <span className="clinic-gallery-page__eyebrow">{t.clinic.gallery.label}</span>
        <h1>{t.clinic.gallery.title}</h1>
        <p>{t.clinic.gallery.description}</p>
      </motion.header>

      <motion.section
        className="clinic-gallery-page__stage"
        aria-label={t.clinic.gallery.items[activeImage.id]}
        initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <img key={activeImage.id} src={activeImage.src} alt={t.clinic.gallery.items[activeImage.id]} fetchPriority="high" decoding="async" />
        <div className="clinic-gallery-page__shade" aria-hidden="true" />
        <div className="clinic-gallery-page__stage-copy">
          <span>{String(activeIndex + 1).padStart(2, '0')} / {String(GALLERY_IMAGES.length).padStart(2, '0')}</span>
          <strong>{t.clinic.gallery.items[activeImage.id]}</strong>
        </div>
        <div className="clinic-gallery-page__stage-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Oldingi rasm"><Arrow direction="left" /></button>
          <button type="button" onClick={() => move(1)} aria-label="Keyingi rasm"><Arrow direction="right" /></button>
        </div>
      </motion.section>

      <section className="clinic-gallery-page__selector" aria-label={t.clinic.gallery.title}>
        <div className="clinic-gallery-page__selector-copy">
          <span>{t.clinic.gallery.label}</span>
          <h2>Klinikani bo‘limma-bo‘lim ko‘ring</h2>
        </div>
        <div className="clinic-gallery-page__image-list">
          {GALLERY_IMAGES.map((image, index) => {
            const isActive = image.id === activeId
            return (
              <button key={image.id} type="button" className={isActive ? 'is-active' : ''} onClick={() => setActiveId(image.id)} aria-pressed={isActive}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{t.clinic.gallery.items[image.id]}</strong>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}
