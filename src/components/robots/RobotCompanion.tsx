import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'

const RobotWanderCanvas = lazy(() => import('./RobotWanderCanvas'))

/** Viewport % waypoints — robot patrols the page like a clinic corridor. */
const WAYPOINTS = [
  { x: 82, y: 68 },
  { x: 88, y: 38 },
  { x: 70, y: 16 },
  { x: 28, y: 14 },
  { x: 10, y: 36 },
  { x: 12, y: 70 },
  { x: 48, y: 78 },
]

type Props = {
  enabled?: boolean
}

export default function RobotCompanion({ enabled = true }: Props) {
  const { lang } = useLanguage()
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)

  const label = useMemo(() => {
    if (lang === 'ru') return 'Робот патрулирует клинику'
    if (lang === 'en') return 'Robot patrolling the clinic'
    return 'Robot klinika bo‘ylab patrul qilmoqda'
  }, [lang])

  useEffect(() => {
    if (!enabled || reduce) return
    const boot = window.setTimeout(() => setReady(true), 600)
    return () => window.clearTimeout(boot)
  }, [enabled, reduce])

  useEffect(() => {
    if (!ready || reduce) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % WAYPOINTS.length)
    }, 5200)
    return () => window.clearInterval(id)
  }, [ready, reduce])

  if (!enabled || reduce || !ready) return null

  const point = WAYPOINTS[index]
  const prev = WAYPOINTS[(index + WAYPOINTS.length - 1) % WAYPOINTS.length]
  const facing = point.x >= prev.x ? 1 : -1

  return (
    <motion.div
      className="robot-companion"
      aria-hidden
      initial={false}
      animate={{
        left: `${point.x}%`,
        top: `${point.y}%`,
      }}
      transition={{ duration: 4.6, ease: [0.22, 1, 0.36, 1] }}
      title={label}
    >
      <div className="robot-companion__bubble">{label}</div>
      <div className="robot-companion__stage" data-facing={facing}>
        <Suspense fallback={<div className="robot-companion__fallback" />}>
          <RobotWanderCanvas facing={facing} />
        </Suspense>
      </div>
    </motion.div>
  )
}
