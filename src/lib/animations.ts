import type { Variants } from 'motion/react'

export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const EASE_SPRING = [0.16, 1, 0.3, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0.92, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
}

export const fadeUpSmall: Variants = {
  hidden: { opacity: 0.94, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
}

/** Soft rise — no blur (blur caused refresh blink) */
export const rise3d: Variants = {
  hidden: {
    opacity: 0.9,
    y: 16,
    scale: 0.99,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
}

export const softPop: Variants = {
  hidden: { opacity: 0.92, scale: 0.98, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0.94, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0.94, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_OUT } },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0.94, x: 12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_OUT } },
}

export const staggerContainer = (stagger = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

export const blurUp: Variants = {
  hidden: { opacity: 0.92, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
}
