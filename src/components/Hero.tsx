import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import { heroItem, heroStagger } from '../lib/animations'
import Magnetic from './ui/Magnetic'
import '../styles/home-patient.css'

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : 'tel:+998712345678'
}

const FRAME_COUNT = 50
const FRAME_W = 1280
const FRAME_H = 720

/**
 * The hero plate is dark in BOTH renditions, on purpose.
 *
 * This footage is lit against black: the spark burst, the lens flare, the rim
 * light on the robot are all *additive* light that only exists because the
 * backdrop is dark. Keying the backdrop to white was tried and abandoned — a
 * flare has no light-background equivalent, it just becomes a dark smear, and
 * the drifting debris turns into specks of dirt. So by day the page opens on a
 * dark cinematic plate and the light page begins below it.
 */
const FRAME_DIR = '/images/touch-frames'
const HERO_POSTER = `${FRAME_DIR}/poster.jpg`

function frameSrc(index: number) {
  return `${FRAME_DIR}/frame-${String(index + 1).padStart(3, '0')}.jpg`
}

export default function Hero() {
  const { t } = useLanguage()
  const { home } = useCms()
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [framesReady, setFramesReady] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<(HTMLImageElement | ImageBitmap | null)[]>([])
  const drawnRef = useRef(-1)
  const rafRef = useRef(0)
  const pendingFrameRef = useRef(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -16])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 1, 0.88])

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current
    const frame = framesRef.current[index]
    if (!canvas || !frame || drawnRef.current === index) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return
    ctx.drawImage(frame, 0, 0, FRAME_W, FRAME_H)
    drawnRef.current = index
  }

  const queueDraw = (index: number) => {
    pendingFrameRef.current = index
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      drawFrame(pendingFrameRef.current)
    })
  }

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (reduce) return
    let cancelled = false
    const controller = new AbortController()

    const loadOne = async (
      i: number,
      bitmaps: (ImageBitmap | HTMLImageElement | null)[],
    ) => {
      const res = await fetch(frameSrc(i), { signal: controller.signal })
      const blob = await res.blob()
      if ('createImageBitmap' in window) {
        bitmaps[i] = await createImageBitmap(blob)
      } else {
        const img = new Image()
        const url = URL.createObjectURL(blob)
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject(new Error('frame load failed'))
          img.src = url
        })
        bitmaps[i] = img
        URL.revokeObjectURL(url)
      }
    }

    const load = async () => {
      const bitmaps: (ImageBitmap | HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null)
      try {
        await loadOne(0, bitmaps)
        if (cancelled) return
        framesRef.current = bitmaps
        setFramesReady(true)
        queueDraw(0)

        await Promise.all(
          Array.from({ length: FRAME_COUNT - 1 }, (_, n) => loadOne(n + 1, bitmaps)),
        )
        if (cancelled) return
        framesRef.current = bitmaps
        queueDraw(pendingFrameRef.current)
      } catch {
        /* aborted */
      }
    }

    void load()
    return () => {
      cancelled = true
      controller.abort()
      cancelAnimationFrame(rafRef.current)
      framesRef.current.forEach((f) => {
        if (f && typeof (f as ImageBitmap).close === 'function') {
          ;(f as ImageBitmap).close()
        }
      })
    }
  }, [reduce])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce) return
    // Hands start apart (0) and meet near the end of the hero scroll
    const next = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(v * (FRAME_COUNT - 1))))
    queueDraw(next)
  })

  const settings = home?.settings
  const hero = home?.hero
  const instituteName = t.hero.instituteName
  const slogan = settings?.slogan || t.hero.instituteSlogan
  const certs = hero?.certs || t.hero.certs
  const phone = settings?.phone || t.topBar.phone
  const badge = settings?.badge || t.topBar.badge

  return (
    <section ref={sectionRef} className="hp-hero hp-hero--touch hp-hero--patient">
      <div className="hp-hero__sticky">
        <div className={`hp-hero__background${framesReady ? ' is-ready' : ''}`} aria-hidden>
          {!reduce ? (
            <canvas
              ref={canvasRef}
              className="hp-hero__touch-canvas"
              width={FRAME_W}
              height={FRAME_H}
            />
          ) : null}
          <img
            src={HERO_POSTER}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="hp-hero__touch-poster"
          />
        </div>
        <div className="hp-hero__background-shade" aria-hidden />
        <div className="container-main">
          <div className="hp-hero__grid">
            <motion.div
              className="hp-hero__copy"
              style={reduce || !ready ? undefined : { y: copyY, opacity: heroOpacity }}
              variants={reduce ? undefined : heroStagger}
              initial={reduce ? undefined : 'hidden'}
              animate={reduce ? undefined : 'show'}
            >
              <motion.p className="hp-hero__eyebrow" variants={reduce ? undefined : heroItem}>
                {t.hero.since} · {certs}
              </motion.p>

              <motion.h1 className="hp-hero__title hp-hero__title--brand" variants={reduce ? undefined : heroItem}>
                {instituteName}
              </motion.h1>

              <motion.p className="hp-hero__slogan" variants={reduce ? undefined : heroItem}>
                {slogan}
              </motion.p>

              <motion.p className="hp-hero__lead" variants={reduce ? undefined : heroItem}>
                {t.hero.description}
              </motion.p>

              <motion.div className="hp-hero__cta-row" variants={reduce ? undefined : heroItem}>
                <Magnetic href="/contacts" className="hp-btn hp-btn--primary" strength={0.3}>
                  {t.nav.bookAppointment}
                </Magnetic>
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
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
