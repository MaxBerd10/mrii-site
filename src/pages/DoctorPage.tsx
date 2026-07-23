import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import SectionBackLink from '../components/ui/SectionBackLink'
import DoctorReviews from '../components/DoctorReviews'
import DoctorBookingModal from '../components/DoctorBookingModal'
import NotFoundPage from './NotFoundPage'
import {
  doctorPageLabels,
  doctorProfiles,
  getDoctorBySlug,
  getDoctorsBySpecialty,
} from '../data/doctors'
import { getDoctorPortrait } from '../data/doctorTurnMedia'
import { blurUp } from '../lib/animations'

export default function DoctorPage({ slug }: { slug: string }) {
  const { contentLang, t } = useLanguage()
  const labels = doctorPageLabels[contentLang]
  const match = getDoctorBySlug(slug)
  const [bookOpen, setBookOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (!match) return
    document.title = `${match.profile.content[contentLang].name} — ${t.nav.brand}`
  }, [match, contentLang, t.nav.brand])

  if (!match) return <NotFoundPage />

  const { profile } = match
  const view = profile.content[contentLang]
  const portrait = getDoctorPortrait(profile.slug, profile.photo)
  const sameSpecialty = getDoctorsBySpecialty(profile.content.uz.specialty, slug)
  const relatedSafe =
    sameSpecialty.length > 0
      ? sameSpecialty.slice(0, 6)
      : doctorProfiles.filter((d) => d.slug !== slug).slice(0, 3)
  const relatedTitle =
    sameSpecialty.length > 0
      ? labels.relatedSame.replace('{specialty}', view.specialty)
      : labels.related

  const reviewLabels = {
    rating: t.doctors.rating,
    reviews: t.doctors.reviews,
    write: t.doctors.writeReview,
    empty: t.doctors.emptyReviews,
    name: t.doctors.reviewName,
    comment: t.doctors.reviewComment,
    submit: t.doctors.reviewSubmit,
    close: t.doctors.reviewClose,
    thanks: t.doctors.reviewThanks,
    yourRating: t.doctors.yourRating,
  }

  return (
    <main className="doctor-page doctor-page--wide">
      <div className="doctor-page__inner">
        <SectionBackLink href="/doctors" className="doctor-page__back">
          ← {labels.back}
        </SectionBackLink>

        <motion.div
          className="doctor-page__hero"
          variants={blurUp}
          initial="hidden"
          animate="show"
        >
          <DoctorHeroPhoto src={portrait} alt={view.name} accent={profile.color} />

          <div className="doctor-page__intro">
            <p className="doctor-page__specialty" style={{ color: profile.color }}>
              {view.specialty}
            </p>
            <h1 className="doctor-page__name">{view.name}</h1>
            <p className="doctor-page__role">{view.role}</p>
            <p className="doctor-page__exp">
              {labels.experience}: {view.exp}
            </p>

            <div className="doctor-page__stats">
              <div className="doctor-page__stat">
                <strong style={{ color: profile.color }}>{profile.papers}</strong>
                <span>{labels.papers}</span>
              </div>
              <div className="doctor-page__stat">
                <strong style={{ color: profile.color }}>{profile.studies}</strong>
                <span>{labels.studies}</span>
              </div>
            </div>

            <button
              type="button"
              className="hp-btn hp-btn--primary doctor-page__book"
              onClick={() => setBookOpen(true)}
            >
              {labels.book}
            </button>
          </div>
        </motion.div>

        <section className="doctor-page__reviews">
          <h2>{labels.reviews}</h2>
          <DoctorReviews
            doctorId={profile.slug}
            doctorName={view.name}
            accent={profile.color}
            labels={reviewLabels}
            inline
          />
        </section>

        <div className="doctor-page__grid">
          <section className="doctor-page__block">
            <h2>{labels.about}</h2>
            <p>{view.about}</p>
          </section>

          <section className="doctor-page__block">
            <h2>{labels.education}</h2>
            <ul>
              {view.education.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="doctor-page__block">
            <h2>{labels.focuses}</h2>
            <ul className="doctor-page__chips">
              {view.focuses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="doctor-page__block">
            <h2>{labels.languages}</h2>
            <ul className="doctor-page__chips">
              {view.languages.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="doctor-page__related">
          <h2>{relatedTitle}</h2>
          {relatedSafe.length === 0 ? (
            <p className="doctor-page__related-empty">{labels.relatedEmpty}</p>
          ) : (
            <div className="doctor-page__related-grid">
              {relatedSafe.map((doc) => {
                const c = doc.content[contentLang]
                return (
                  <a key={doc.slug} href={`/doctors/${doc.slug}`} className="doctor-page__related-card">
                    <img
                      src={getDoctorPortrait(doc.slug, doc.photo)}
                      alt={c.name}
                      loading="lazy"
                    />
                    <div>
                      <strong>{c.name}</strong>
                      <span>{c.specialty}</span>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </section>
      </div>

      <DoctorBookingModal
        open={bookOpen}
        doctorName={view.name}
        doctorSpecialty={view.specialty}
        accent={profile.color}
        labels={labels.booking}
        onClose={() => setBookOpen(false)}
      />
    </main>
  )
}

function DoctorHeroPhoto({
  src,
  alt,
  accent,
}: {
  src: string
  alt: string
  accent: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [looking, setLooking] = useState(false)
  const [look, setLook] = useState({ x: 0, y: 0 })

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) return
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    setLooking(true)
    setLook({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    })
  }

  const transform = `scale(${looking ? 1.08 : 1.02}) translate3d(${look.x * 18}px, ${look.y * 12}px, 0) rotateY(${look.x * 8}deg) rotateX(${-look.y * 6}deg)`

  return (
    <div
      ref={ref}
      className={`doctor-page__photo${looking ? ' is-looking' : ''}`}
      style={{ ['--accent' as string]: accent }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        setLooking(false)
        setLook({ x: 0, y: 0 })
      }}
    >
      <img src={src} alt={alt} style={{ transform }} draggable={false} />
    </div>
  )
}
