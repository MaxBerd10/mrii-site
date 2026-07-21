import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import { useCountUp } from '../hooks/useCountUp'
import { media } from '../data/media'

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : 'tel:+998712345678'
}

const THUMBS = Object.values(media.hero.thumbs)
const ACTION_HREFS = ['#contacts', '#research', '#education', '#ai']
const CLINIC_CORRIDOR = '/images/clinic/mrii-clinic-hero-centered-sharp.webp'
const HERO_VIDEO = media.hero.video

function HeroStat({ value, label, active }: { value: string; label: string; active: boolean }) {
  const display = useCountUp(value, active)
  return (
    <div className="hp-stat">
      <div className="hp-stat__value">{display}</div>
      <div className="hp-stat__label">{label}</div>
    </div>
  )
}

export default function Hero() {
  const { t } = useLanguage()
  const { home } = useCms()
  const reduce = useReducedMotion()
  const [statsActive, setStatsActive] = useState(false)
  const [ready, setReady] = useState(false)
  const [videoOk, setVideoOk] = useState(!reduce)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -16])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 1, .88])
  const cameraScale = useTransform(scrollYProgress, [0, .45, 1], [1, 1.08, 1.18])
  const settings = home?.settings
  const hero = home?.hero
  const instituteName = t.hero.instituteName.replace(' (MRII)', '')
  const slogan = settings?.slogan || t.hero.instituteSlogan
  const certs = hero?.certs || t.hero.certs
  const phone = settings?.phone || t.topBar.phone
  const badge = settings?.badge || t.topBar.badge
  const heroImage = hero?.image || CLINIC_CORRIDOR

  useEffect(() => {
    setStatsActive(true)
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (reduce) {
      setVideoOk(false)
      return
    }
    const el = videoRef.current
    if (!el) return
    el.play().catch(() => setVideoOk(false))
  }, [reduce, videoOk])

  return (
    <section ref={sectionRef} className="hp-hero">
      <div className="hp-hero__sticky">
      <motion.div
        className="hp-hero__background"
        style={reduce || !ready ? undefined : { scale: cameraScale }}
        aria-hidden
      >
        {videoOk ? (
          <video
            ref={videoRef}
            className="hp-hero__video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroImage}
            onError={() => setVideoOk(false)}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <img
            src={heroImage}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="media-alive media-alive--slow"
          />
        )}
      </motion.div>
      <div className="hp-hero__background-shade" aria-hidden />
      <div className="hp-hero__scan" aria-hidden />
      <div className="container-main">
        <div className="hp-hero__grid">
          <motion.div
            className="hp-hero__copy"
            style={reduce || !ready ? undefined : { y: copyY, opacity: heroOpacity }}
          >
            <p className="hp-hero__eyebrow">
              {t.hero.since} · {certs}
            </p>

            <h1 className="hp-hero__title hp-hero__title--brand">
              {instituteName}
              <br />
              <span>(MRII)</span>
            </h1>

            <p className="hp-hero__desc hp-hero__slogan">
              «{slogan}»
            </p>

            <div className="hp-hero__cta-row">
              <a href="#ai" className="hp-btn hp-btn--primary">
                {t.ai.sellBtn}
              </a>
              <a href={telHref(phone)} className="hp-emergency">
                <span className="hp-emergency__icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1.4 1.4 0 011.5-.3c1.6.5 3.4.8 5.2.8a1.4 1.4 0 011.4 1.4V21a1.4 1.4 0 01-1.4 1.4C11.2 22.4 1.6 12.8 1.6 1.4A1.4 1.4 0 013 0h3.9A1.4 1.4 0 018.3 1.4c0 1.8.3 3.6.8 5.2a1.4 1.4 0 01-.3 1.5L6.6 10.8z" fill="currentColor"/>
                  </svg>
                </span>
                <span>
                  <small>{badge}</small>
                  <strong>{phone}</strong>
                </span>
              </a>
            </div>

            <div className="hp-hero__thumbs">
              {THUMBS.map((src, i) => (
                <a key={i} href={ACTION_HREFS[i]} className="hp-hero__thumb" title={t.hero.slides[i].caption}>
                  <img src={src} alt={t.hero.slides[i].alt} loading="lazy" className="media-alive" />
                </a>
              ))}
            </div>

            <div className="hp-hero__links">
              {t.hero.buttons.slice(1).map((item, i) => (
                <a
                  key={item}
                  href={ACTION_HREFS[i + 1]}
                  className="hp-hero__link"
                >
                  {item} →
                </a>
              ))}
            </div>
          </motion.div>

        </div>

        <div className="hp-hero__film-progress" aria-hidden>
          <motion.span style={reduce ? { scaleX: 1 } : { scaleX: scrollYProgress }} />
          <small>{t.hero.scrollDown}</small>
        </div>

        <div className="hp-hero__stats">
          {t.stats.items.map((s, i) => (
            <HeroStat key={i} value={s.value} label={s.label} active={statsActive} />
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}
