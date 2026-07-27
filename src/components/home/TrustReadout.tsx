import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useCountUp } from '../../hooks/useCountUp'
import { settle, settleStagger, inView } from '../../lib/homeDarkMotion'

/** One channel of the readout. Counts up once, when it first comes into view. */
function Channel({ value, label, sub, active }: {
  value: string
  label: string
  sub: string
  active: boolean
}) {
  const display = useCountUp(value, active)
  return (
    <motion.div className="hd-readout__cell" variants={settle}>
      <strong className="hd-value">{display}</strong>
      <span className="hd-readout__label">{label}</span>
      <span className="hd-readout__sub">{sub}</span>
    </motion.div>
  )
}

/** Resting sinus rhythm. The strip scrolls at exactly this rate. */
const BPM = 72
const BEAT_PX = 190          // one cardiac cycle, in pixels of strip
const SPEED = (BEAT_PX * BPM) / 60 // px per second

/**
 * QRS complex as phase-of-cycle → deflection. Sharp and angular, which is the
 * one part of an ECG that genuinely is. Spans 83ms at 72 bpm.
 */
const QRS: [number, number][] = [
  [0.268, 0],
  [0.293, 0.1],   // Q
  [0.311, -1],    // R
  [0.334, 0.32],  // S
  [0.368, 0],
]

/**
 * One PQRST complex, as deflection from the isoelectric line at phase `t` (0-1).
 * Positive is downward on the canvas, so the R spike is negative.
 *
 * P and T are smooth rounded waves — gaussians, not the straight segments that
 * made the old trace read as a zig-zag. Measured against a normal trace at
 * 72 bpm: P 70ms, PR 129ms, QRS 83ms, T 140ms, QT 330ms.
 */
function pqrst(t: number): number {
  const gauss = (centre: number, width: number, amp: number) =>
    amp * Math.exp(-((t - centre) ** 2) / (2 * width * width))

  // P wave, and the broader, taller T wave
  let y = gauss(0.155, 0.021, -0.13) + gauss(0.58, 0.042, -0.26)

  if (t >= QRS[0][0] && t <= QRS[QRS.length - 1][0]) {
    for (let i = 1; i < QRS.length; i += 1) {
      const [ax, ay] = QRS[i - 1]
      const [bx, by] = QRS[i]
      if (t >= ax && t <= bx) {
        y += ay + ((by - ay) * (t - ax)) / (bx - ax)
        break
      }
    }
  }
  return y
}

/**
 * The ECG behind the numbers — a real 72 bpm sinus rhythm on a scrolling strip,
 * not a decorative squiggle. Stops entirely when off-screen or reduced.
 */
function EcgTrace({ run }: { run: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let width = 0
    let height = 0
    let offset = 0
    let elapsed = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const mid = height * 0.52
      // Breathing modulates R-wave height on a real trace; keep it subtle.
      const amp = height * 0.42 * (1 + 0.045 * Math.sin(elapsed * 0.9))

      ctx.beginPath()
      for (let x = -2; x <= width + 2; x += 1) {
        const phase = ((((x + offset) % BEAT_PX) + BEAT_PX) % BEAT_PX) / BEAT_PX
        const y = mid + pqrst(phase) * amp
        if (x === -2) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }

      // Older signal fades to the left, the way a strip chart's ink does.
      const rgb = '4, 120, 87'
      const grad = ctx.createLinearGradient(0, 0, width, 0)
      grad.addColorStop(0, `rgba(${rgb}, 0)`)
      grad.addColorStop(0.22, `rgba(${rgb}, 0.34)`)
      grad.addColorStop(1, `rgba(${rgb}, 0.62)`)

      ctx.strokeStyle = grad
      ctx.lineWidth = 1.4
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.stroke()
    }

    resize()
    draw()

    const observer = new ResizeObserver(() => {
      resize()
      draw()
    })
    observer.observe(canvas)

    if (!run) {
      return () => observer.disconnect()
    }

    // Time-based, so the rhythm is 72 bpm on a 60Hz and a 120Hz display alike.
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      elapsed += dt
      offset = (offset + SPEED * dt) % BEAT_PX
      draw()
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [run])

  return <canvas ref={canvasRef} className="hd-readout__trace" aria-hidden />
}

/** CH.01 — the institute's real annual figures, read as instrument channels. */
export default function TrustReadout() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, { once: false, amount: 0.1 })
  const [counted, setCounted] = useState(false)

  useEffect(() => {
    if (visible) setCounted(true)
  }, [visible])

  const copy = t.homeDark.readout

  return (
    <section ref={ref} className="hd-readout" aria-label={copy.title}>
      <EcgTrace run={!reduce && visible} />
      <div className="container-main">
        <div className="hd-readout__head">
          <p className="hd-channel">
            <span className="hd-channel__dot" aria-hidden />
            {copy.channel}
          </p>
          <p className="hd-readout__live">
            <span className="hd-readout__pulse" aria-hidden />
            {copy.live}
          </p>
        </div>

        <motion.div
          className="hd-readout__grid"
          variants={settleStagger(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          {t.stats.items.map((item) => (
            <Channel
              key={item.label}
              value={item.value}
              label={item.label}
              sub={item.sub}
              active={reduce ? false : counted}
            />
          ))}
        </motion.div>

        <p className="hd-readout__note">{copy.note}</p>
      </div>
    </section>
  )
}
