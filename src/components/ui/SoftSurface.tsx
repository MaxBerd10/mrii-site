import type { CSSProperties, ReactNode } from 'react'
import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { rise3d } from '../../lib/animations'

type SoftSurfaceProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'div' | 'article'
  tilt?: boolean
  maxTilt?: number
  /** When false, parent stagger controls visibility */
  selfReveal?: boolean
}

/** Soft extruded surface — Devini-like clean 3D card */
export default function SoftSurface({
  children,
  className = '',
  style,
  as = 'div',
  tilt = true,
  maxTilt = 6,
  selfReveal = false,
}: SoftSurfaceProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 180,
    damping: 22,
  })
  const ry = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 180,
    damping: 22,
  })

  const Tag = as === 'article' ? motion.article : motion.div

  if (reduce) {
    const Static = as
    return (
      <Static className={`soft-surface ${className}`.trim()} style={style}>
        {children}
      </Static>
    )
  }

  return (
    <Tag
      ref={ref}
      className={`soft-surface ${className}`.trim()}
      style={{
        ...style,
        ...(tilt
          ? {
              rotateX: rx,
              rotateY: ry,
              transformStyle: 'preserve-3d' as const,
              transformPerspective: 1000,
            }
          : {}),
      }}
      variants={rise3d}
      {...(selfReveal
        ? {
            initial: 'hidden' as const,
            whileInView: 'show' as const,
            viewport: { once: true, amount: 0.25 },
          }
        : {})}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 280, damping: 20 } }}
      onMouseMove={
        tilt
          ? (e) => {
              const el = ref.current
              if (!el) return
              const rect = el.getBoundingClientRect()
              px.set((e.clientX - rect.left) / rect.width)
              py.set((e.clientY - rect.top) / rect.height)
            }
          : undefined
      }
      onMouseLeave={
        tilt
          ? () => {
              px.set(0.5)
              py.set(0.5)
            }
          : undefined
      }
    >
      {children}
    </Tag>
  )
}
