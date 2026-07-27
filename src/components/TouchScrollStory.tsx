import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import '../styles/touch-scroll.css'

const FRAME_COUNT = 50
const FRAME_W = 1280
const FRAME_H = 720

function frameSrc(index: number) {
  return `/images/touch-frames/frame-${String(index + 1).padStart(3, '0')}.jpg`
}

export default function TouchScrollStory() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const trackRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<(HTMLImageElement | ImageBitmap | null)[]>([])
  const drawnRef = useRef(-1)
  const rafRef = useRef(0)
  const pendingFrameRef = useRef(0)
  const [ready, setReady] = useState(false)
  const copy = t.touchScroll

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
    if (reduce) return
    let cancelled = false
    const controller = new AbortController()

    const load = async () => {
      const bitmaps: (ImageBitmap | HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null)

      const loadOne = async (i: number) => {
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

      try {
        await loadOne(0)
        if (cancelled) return
        framesRef.current = bitmaps
        setReady(true)
        queueDraw(0)

        await Promise.all(
          Array.from({ length: FRAME_COUNT - 1 }, (_, n) => loadOne(n + 1)),
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

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const railScale = useTransform(scrollYProgress, [0, 1], [0.06, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce) return
    const next = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(v * (FRAME_COUNT - 1))))
    queueDraw(next)
  })

  if (reduce) {
    return (
      <section className="touch-scroll touch-scroll--static" aria-label={copy.label}>
        <div className="container-main touch-scroll__static">
          <header className="touch-scroll__intro">
            <span>{copy.label}</span>
            <h2>
              {copy.title} <em>{copy.titleEm}</em>
            </h2>
            <p>{copy.desc}</p>
          </header>
          <img src={frameSrc(24)} alt="" className="touch-scroll__still" loading="lazy" />
          <a href={copy.href} className="touch-scroll__link">
            {copy.link} →
          </a>
        </div>
      </section>
    )
  }

  return (
    <section ref={trackRef} className="touch-scroll" aria-label={copy.label}>
      <div className="touch-scroll__sticky">
        <div className="touch-scroll__frame">
          <header className="touch-scroll__intro">
            <span>{copy.label}</span>
            <h2>
              {copy.title} <em>{copy.titleEm}</em>
            </h2>
            <p>{copy.desc}</p>
          </header>

          <div className={`touch-scroll__stage${ready ? ' is-ready' : ''}`}>
            <canvas
              ref={canvasRef}
              className="touch-scroll__canvas"
              width={FRAME_W}
              height={FRAME_H}
              aria-hidden
            />
            <img
              src="/images/touch-frames/poster.jpg"
              alt=""
              className="touch-scroll__poster"
              draggable={false}
            />
          </div>

          <div className="touch-scroll__footer">
            <a href={copy.href} className="touch-scroll__link">
              {copy.link} →
            </a>
            <div className="touch-scroll__rail" aria-hidden>
              <motion.span style={{ scaleX: railScale }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
