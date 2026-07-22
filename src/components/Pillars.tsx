import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import SectionHeader from './ui/SectionHeader'
import { PillarIcon } from './ui/SpecialtyIcon'
import Reveal from './ui/Reveal'
import { staggerContainer, rise3d, blurUp } from '../lib/animations'
import { media } from '../data/media'
import '../styles/pillar-videos.css'

const PILLAR_HREFS = ['/clinic', '/research', '/education', '/ai'] as const
const ACCENTS = ['#5B4CDB', '#3B82F6', '#14B8A6', '#8B5CF6'] as const
const PILLARS = [media.pillars.clinic, media.pillars.research, media.pillars.education, media.pillars.ai]

function PillarMedia({
  image,
  video,
}: {
  image: string
  video: string
}) {
  const reduce = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const showVideo = !reduce && !failed

  useEffect(() => {
    if (!showVideo) return
    const el = videoRef.current
    const wrap = wrapRef.current
    if (!el || !wrap) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => setFailed(true))
        } else {
          el.pause()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(wrap)
    return () => io.disconnect()
  }, [showVideo, video])

  return (
    <div className="hp-service-card__media" ref={wrapRef} aria-hidden>
      {showVideo ? (
        <video
          ref={videoRef}
          className="hp-service-card__video media-alive media-alive--slow"
          muted
          loop
          playsInline
          preload="metadata"
          poster={image}
          onError={() => setFailed(true)}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <img src={image} alt="" loading="lazy" className="media-alive media-alive--slow" />
      )}
      <div className="hp-service-card__shade" />
    </div>
  )
}

export default function Pillars() {
  const { t } = useLanguage()

  return (
    <section id="pillars" className="section section--white" style={{ perspective: 1200 }}>
      <div className="container-main">
        <Reveal variants={blurUp}>
          <SectionHeader
            label={t.pillars.label}
            title={<>{t.pillars.title1} <em>{t.pillars.titleEm}</em></>}
            description={t.pillars.description}
            accent="#5B4CDB"
          />
        </Reveal>

        <motion.div
          className="hp-services"
          variants={staggerContainer(0.12, 0.04)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {t.pillars.items.map((p, idx) => {
            const asset = PILLARS[idx]
            return (
              <motion.article
                key={p.num}
                className="hp-service-card hp-service-card--photo hp-service-card--video"
                variants={rise3d}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 280, damping: 20 } }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <PillarMedia image={asset.image} video={asset.video} />

                <div className="hp-service-card__body">
                  <div className="hp-service-card__icon" style={{ background: `${ACCENTS[idx]}18`, color: ACCENTS[idx] }}>
                    <PillarIcon index={idx} color={ACCENTS[idx]} />
                  </div>
                  <div className="hp-service-card__content">
                    <span className="hp-service-card__num">{p.num}</span>
                    <h3 className="hp-service-card__title">{p.title}</h3>
                    <p className="hp-service-card__desc">{p.desc}</p>
                    <a href={PILLAR_HREFS[idx]} className="hp-service-card__link">
                      {p.link} →
                    </a>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
