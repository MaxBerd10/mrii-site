import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { usePageNav } from '../components/PageTransition'
import { fetchClinicTourVideos, type CmsClinicTourVideo } from '../api/client'
import '../styles/clinic-tour.css'

const FALLBACK_VIDEOS = [
  { id: 'tour', src: '/videos/clinic-tour/virtual-tour.web.mp4', poster: '/images/clinic-gallery/courtyard.webp' },
  { id: 'officialVisit', src: '/videos/clinic-tour/official-visit.web.mp4', poster: '/images/clinic-gallery/entrance.webp' },
  { id: 'opening', src: '/videos/clinic-tour/clinic-opening.web.mp4', poster: '/images/clinic-gallery/campus.webp' },
  { id: 'openDoors', src: '/videos/clinic-tour/open-doors.web.mp4', poster: '/images/clinic-gallery/reception.webp' },
  { id: 'innovation', src: '/videos/clinic-tour/innovation-tour.web.mp4', poster: '/images/clinic-gallery/treatment-area.webp' },
] as const

type TourVideoId = typeof FALLBACK_VIDEOS[number]['id']

type TourVideo = {
  id: TourVideoId
  src: string
  poster: string
}

function mergeTourVideos(cms: CmsClinicTourVideo[] | null): TourVideo[] {
  const fallbackById = Object.fromEntries(FALLBACK_VIDEOS.map((video) => [video.id, video])) as Record<
    TourVideoId,
    (typeof FALLBACK_VIDEOS)[number]
  >

  if (!cms?.length) {
    return FALLBACK_VIDEOS.map((video) => ({ id: video.id, src: video.src, poster: video.poster }))
  }

  const merged: TourVideo[] = []
  const seen = new Set<TourVideoId>()

  for (const item of cms) {
    const id = item.id as TourVideoId
    if (!fallbackById[id]) continue
    merged.push({
      id,
      src: item.src || fallbackById[id].src,
      poster: item.poster || fallbackById[id].poster,
    })
    seen.add(id)
  }

  for (const video of FALLBACK_VIDEOS) {
    if (!seen.has(video.id)) {
      merged.push({ id: video.id, src: video.src, poster: video.poster })
    }
  }

  return merged
}

function PlayIcon() {
  return <svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="m10.5 8.5 9 5.5-9 5.5v-11Z" fill="currentColor" /></svg>
}

export default function ClinicTourPage() {
  const { t, lang } = useLanguage()
  const { routeEnter } = usePageNav()
  const reduceMotion = useReducedMotion()
  const shouldAnimate = routeEnter && !reduceMotion
  const [videos, setVideos] = useState<TourVideo[]>(() => mergeTourVideos(null))
  const [activeId, setActiveId] = useState<TourVideoId>('tour')
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let cancelled = false
    void fetchClinicTourVideos(lang).then((cms) => {
      if (cancelled) return
      setVideos(mergeTourVideos(cms))
    })
    return () => {
      cancelled = true
    }
  }, [lang])

  const activeVideo = videos.find((video) => video.id === activeId) ?? videos[0]

  const videoCopy = {
    tour: { title: t.clinic.tour.featuredTitle, description: t.clinic.tour.featuredDescription, label: t.clinic.tour.featuredLabel },
    officialVisit: { title: t.clinic.tour.officialVisit, description: t.clinic.tour.officialVisitDesc, label: t.clinic.tour.eventsLabel },
    opening: { title: t.clinic.tour.opening, description: t.clinic.tour.openingDesc, label: t.clinic.tour.eventsLabel },
    openDoors: { title: t.clinic.tour.openDoors, description: t.clinic.tour.openDoorsDesc, label: t.clinic.tour.eventsLabel },
    innovation: { title: t.clinic.tour.innovation, description: t.clinic.tour.innovationDesc, label: t.clinic.tour.eventsLabel },
  }
  const activeCopy = videoCopy[activeId]

  const startVideo = () => {
    setIsPlaying(true)
    void videoRef.current?.play()
  }

  const selectVideo = (id: TourVideoId) => {
    setActiveId(id)
    setIsPlaying(false)
  }

  if (!activeVideo) return null

  return (
    <main className="clinic-tour-page">
      <motion.header
        className="clinic-tour-page__intro"
        initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
      >
        <a className="clinic-tour-page__back" href="/clinic">← {t.nav.clinic}</a>
        <span>{t.clinic.tour.label}</span>
        <h1>{t.clinic.tour.title}</h1>
        <p>{t.clinic.tour.description}</p>
      </motion.header>

      <motion.section
        className="clinic-tour-page__stage"
        aria-label={activeCopy.title}
        initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <video
          key={activeVideo.id + activeVideo.src}
          ref={videoRef}
          className="clinic-tour-page__video"
          controls={isPlaying}
          playsInline
          preload="metadata"
          poster={activeVideo.poster}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={activeVideo.src} type="video/mp4" />
        </video>
        {!isPlaying && (
          <button className="clinic-tour-page__play-layer" type="button" onClick={startVideo} aria-label={`${t.clinic.tour.play}: ${activeCopy.title}`}>
            <span className="clinic-tour-page__play-button"><PlayIcon /></span>
            <span className="clinic-tour-page__stage-copy">
              <small>{activeCopy.label}</small>
              <strong>{activeCopy.title}</strong>
              <em>{activeCopy.description}</em>
            </span>
          </button>
        )}
      </motion.section>

      <section className="clinic-tour-page__selector" aria-labelledby="clinic-video-library-title">
        <div className="clinic-tour-page__selector-heading">
          <span>{t.clinic.tour.eventsLabel}</span>
          <h2 id="clinic-video-library-title">{t.clinic.tour.eventsTitle}</h2>
          <p>{t.clinic.tour.eventsDescription}</p>
        </div>
        <div className="clinic-tour-page__video-list" role="tablist" aria-label={t.clinic.tour.eventsTitle}>
          {videos.map((video, index) => {
            const copy = videoCopy[video.id]
            const isActive = video.id === activeId
            return (
              <button
                key={video.id}
                className={`clinic-tour-page__video-choice${isActive ? ' is-active' : ''}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectVideo(video.id)}
              >
                <span>0{index + 1}</span>
                <strong>{copy.title}</strong>
                <small>{copy.description}</small>
              </button>
            )
          })}
        </div>
        <p className="clinic-tour-page__note">{t.clinic.tour.note}</p>
      </section>
    </main>
  )
}
