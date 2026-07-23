import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import SectionHeader from './ui/SectionHeader'
import { staggerContainer, rise3d, blurUp } from '../lib/animations'
import { doctorProfiles, getSpecialtyGroup, type SpecialtyGroup, type StaffKind } from '../data/doctors'
import { averageRating, getDoctorReviews } from '../lib/doctorReviews'
import { getDoctorTurnMedia } from '../data/doctorTurnMedia'
import '../styles/doctor-turn.css'
import '../styles/doctor-filters.css'

type Doc = {
  id: string
  slug: string
  name: string
  role: string
  specialty: string
  specialtyGroup: SpecialtyGroup
  exp: string
  papers: number
  studies: number
  color: string
  photo: string
  video?: string
  staffKind: StaffKind
}

type StaffFilter = 'all' | StaffKind
type GroupFilter = 'all' | SpecialtyGroup

const GROUP_COLORS: Record<SpecialtyGroup, string> = {
  therapy: '#38BDF8',
  surgery: '#8B5CF6',
  women: '#EC4899',
  diagnostics: '#22C55E',
}

export default function Doctors() {
  const { contentLang, t } = useLanguage()
  const [staffFilter, setStaffFilter] = useState<StaffFilter>('all')
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('all')

  const doctors: Doc[] = doctorProfiles.map((p) => {
    const c = p.content[contentLang]
    const turn = getDoctorTurnMedia(p.slug)
    return {
      id: p.slug,
      slug: p.slug,
      name: c.name,
      role: c.role,
      specialty: c.specialty,
      specialtyGroup: getSpecialtyGroup(p),
      exp: c.exp,
      papers: p.papers,
      studies: p.studies,
      color: p.color,
      // Prefer turn poster so list matches doctor detail page
      photo: turn?.poster ?? p.photo,
      video: turn?.video,
      staffKind: p.staffKind,
    }
  })

  const kindCounts = useMemo(() => {
    const counts = { all: doctors.length, professor: 0, doctor: 0, nurse: 0 }
    for (const d of doctors) counts[d.staffKind] += 1
    return counts
  }, [doctors])

  const byStaff = useMemo(() => {
    if (staffFilter === 'all') return doctors
    return doctors.filter((d) => d.staffKind === staffFilter)
  }, [doctors, staffFilter])

  const groupCounts = useMemo(() => {
    const counts = { all: byStaff.length, therapy: 0, surgery: 0, women: 0, diagnostics: 0 }
    for (const d of byStaff) counts[d.specialtyGroup] += 1
    return counts
  }, [byStaff])

  const filtered = useMemo(() => {
    if (groupFilter === 'all') return byStaff
    return byStaff.filter((d) => d.specialtyGroup === groupFilter)
  }, [byStaff, groupFilter])

  /** Specialty groups only when a staff kind is chosen — avoids chip clutter on "All" */
  const showGroups = staffFilter === 'doctor' || staffFilter === 'professor'

  const staffTabs: Array<{ id: StaffFilter; label: string; count: number; color: string | null }> = [
    { id: 'all', label: t.doctors.filters.all, count: kindCounts.all, color: null },
    { id: 'professor', label: t.doctors.filters.professors, count: kindCounts.professor, color: '#6366F1' },
    { id: 'doctor', label: t.doctors.filters.doctors, count: kindCounts.doctor, color: '#0EA5E9' },
    { id: 'nurse', label: t.doctors.filters.nurses, count: kindCounts.nurse, color: '#10B981' },
  ]

  const groupTabs = (
    [
      { id: 'all' as const, label: t.doctors.filters.allSpecialties, count: groupCounts.all, color: null },
      { id: 'therapy' as const, label: t.doctors.filters.therapy, count: groupCounts.therapy, color: GROUP_COLORS.therapy },
      { id: 'surgery' as const, label: t.doctors.filters.surgery, count: groupCounts.surgery, color: GROUP_COLORS.surgery },
      { id: 'women' as const, label: t.doctors.filters.women, count: groupCounts.women, color: GROUP_COLORS.women },
      { id: 'diagnostics' as const, label: t.doctors.filters.diagnostics, count: groupCounts.diagnostics, color: GROUP_COLORS.diagnostics },
    ] satisfies Array<{ id: GroupFilter; label: string; count: number; color: string | null }>
  ).filter((tab) => tab.id === 'all' || tab.count > 0)

  const setKind = (id: StaffFilter) => {
    setStaffFilter(id)
    setGroupFilter('all')
  }

  return (
    <section id="doctors" className="section section--muted doctors-section">
      <div className="container-main">
        <motion.div
          variants={blurUp}
          initial="hidden"
          animate="show"
        >
          <SectionHeader
            label={t.doctors.label}
            title={
              <>
                {t.doctors.title1}
                <br />
                {t.doctors.title2}
              </>
            }
          />
        </motion.div>

        <div className="doctor-filters-panel">
          <div className="doctor-filters" role="tablist" aria-label={t.doctors.filters.staffLabel}>
            {staffTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={staffFilter === tab.id}
                className={`doctor-filters__btn${staffFilter === tab.id ? ' is-active' : ''}`}
                onClick={() => setKind(tab.id)}
              >
                {tab.color ? (
                  <span className="doctor-filters__dot" style={{ background: tab.color }} aria-hidden />
                ) : null}
                {tab.label}
                <span className="doctor-filters__count">{tab.count}</span>
              </button>
            ))}
          </div>

          {showGroups ? (
            <div className="doctor-filters doctor-filters--groups" role="tablist" aria-label={t.doctors.filters.specialtyLabel}>
              {groupTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={groupFilter === tab.id}
                  className={`doctor-filters__btn doctor-filters__btn--soft${groupFilter === tab.id ? ' is-active' : ''}`}
                  onClick={() => setGroupFilter(tab.id)}
                >
                  {tab.color ? (
                    <span className="doctor-filters__dot" style={{ background: tab.color }} aria-hidden />
                  ) : null}
                  {tab.label}
                  <span className="doctor-filters__count">{tab.count}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <p className="doctors-section__empty">{t.doctors.filters.empty}</p>
        ) : (
          <motion.div
            className="doctor-grid doctor-grid--all"
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="show"
            key={`${staffFilter}-${groupFilter}`}
          >
            {filtered.map((doc) => (
              <DoctorCard
                key={doc.id}
                doc={doc}
                bookLabel={t.doctors.bookBtn}
                papersLabel={t.doctors.papers}
                studiesLabel={t.doctors.studies}
                reviewsLabel={t.doctors.reviews}
                noReviewsLabel={t.doctors.writeReview}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
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

function DoctorPortrait({
  src,
  alt,
  specialty,
  video,
}: {
  src: string
  alt: string
  specialty: string
  video?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = usePrefersReducedMotion()
  const [looking, setLooking] = useState(false)
  const [look, setLook] = useState({ x: 0, y: 0 })
  const [failed, setFailed] = useState(false)
  const useVideo = Boolean(video) && !reduceMotion && !failed

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || useVideo) return
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

  const playVideo = () => {
    const el = videoRef.current
    if (!el || !useVideo) return
    const start = () => {
      el.play().catch(() => setFailed(true))
    }
    // Seek to start first — otherwise short clips can look frozen on the rest frame
    if (el.currentTime > 0.05) {
      const onSeeked = () => {
        el.removeEventListener('seeked', onSeeked)
        start()
      }
      el.addEventListener('seeked', onSeeked)
      el.currentTime = 0
    } else {
      start()
    }
  }

  const stopVideo = () => {
    const el = videoRef.current
    if (!el) return
    el.pause()
    // Rest on last frame (facing camera), not the looking-away start
    if (el.duration && Number.isFinite(el.duration)) {
      el.currentTime = Math.max(0, el.duration - 0.05)
    }
  }

  const transform = reduceMotion || useVideo
    ? undefined
    : `scale(${looking ? 1.1 : 1.04}) translate3d(${look.x * 14}px, ${look.y * 10}px, 0) rotateY(${look.x * 9}deg) rotateX(${-look.y * 7}deg)`

  return (
    <div
      ref={ref}
      className={`doctor-card__media${looking ? ' is-looking' : ''}${useVideo ? ' doctor-card__media--video' : ''}`}
      onPointerMove={onMove}
      onPointerEnter={() => {
        if (useVideo) playVideo()
      }}
      onPointerLeave={() => {
        setLooking(false)
        setLook({ x: 0, y: 0 })
        if (useVideo) stopVideo()
      }}
    >
      {useVideo ? (
        <video
          ref={videoRef}
          className="doctor-card__photo doctor-card__video"
          muted
          playsInline
          preload="auto"
          poster={src}
          onLoadedMetadata={() => {
            const el = videoRef.current
            if (!el?.duration) return
            el.currentTime = Math.max(0, el.duration - 0.05)
          }}
          onError={() => setFailed(true)}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="doctor-card__photo"
          style={transform ? { transform } : undefined}
          draggable={false}
        />
      )}
      <span className="doctor-card__badge">{specialty}</span>
    </div>
  )
}

function DoctorCardRating({
  doctorId,
  accent,
  reviewsLabel,
  noReviewsLabel,
}: {
  doctorId: string
  accent: string
  reviewsLabel: string
  noReviewsLabel: string
}) {
  const [avg, setAvg] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const sync = () => {
      const list = getDoctorReviews(doctorId)
      setCount(list.length)
      setAvg(averageRating(list))
    }
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('focus', sync)
    window.addEventListener('fjsti-doctor-reviews', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('focus', sync)
      window.removeEventListener('fjsti-doctor-reviews', sync)
    }
  }, [doctorId])

  return (
    <div className="doctor-card__rating" aria-label={reviewsLabel}>
      <span className="doctor-card__stars" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={n <= Math.round(avg) ? 'is-on' : ''}>
            ★
          </span>
        ))}
      </span>
      <span className="doctor-card__rating-meta">
        {count > 0 ? (
          <>
            <strong style={{ color: accent }}>{avg.toFixed(1)}</strong>
            <span>
              ({count} {reviewsLabel})
            </span>
          </>
        ) : (
          <span>{noReviewsLabel}</span>
        )}
      </span>
    </div>
  )
}

function DoctorCard({
  doc,
  bookLabel,
  papersLabel,
  studiesLabel,
  reviewsLabel,
  noReviewsLabel,
  animated = true,
}: {
  doc: Doc
  bookLabel: string
  papersLabel: string
  studiesLabel: string
  reviewsLabel: string
  noReviewsLabel: string
  animated?: boolean
}) {
  const href = `/doctors/${doc.slug}`
  const body = (
    <>
      <DoctorPortrait
        src={doc.photo}
        alt={doc.name}
        specialty={doc.specialty}
        video={doc.video}
      />
      <div className="doctor-card__body">
        <h3 className="doctor-card__name">{doc.name}</h3>
        <p className="doctor-card__role">{doc.role}</p>
        <p className="doctor-card__exp">{doc.exp}</p>
        <DoctorCardRating
          doctorId={doc.slug}
          accent={doc.color}
          reviewsLabel={reviewsLabel}
          noReviewsLabel={noReviewsLabel}
        />
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
        <span className="doctor-card__cta">{bookLabel}</span>
      </div>
    </>
  )

  if (!animated) {
    return (
      <a href={href} className="doctor-card doctor-card--link">
        {body}
      </a>
    )
  }

  return (
    <motion.a
      href={href}
      className="doctor-card doctor-card--link"
      variants={rise3d}
      whileHover={{ y: -7, transition: { type: 'spring', stiffness: 260, damping: 20 } }}
      style={{ transformStyle: 'preserve-3d', height: '100%' }}
    >
      {body}
    </motion.a>
  )
}
