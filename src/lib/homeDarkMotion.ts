import type { Variants } from 'motion/react'
import { EASE_OUT } from './animations'

/**
 * THE TRACE — the instrument's one authored motion.
 *
 * Content arrives the way a signal draws onto a monitor: a masked left-to-right
 * reveal with a soft blur resolving to zero. Used for headings, rules, and
 * anything that reads as a written line. Not a fade-up on every section.
 */
export const trace: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)', filter: 'blur(5px)' },
  show: {
    opacity: 1,
    clipPath: 'inset(0 0% 0 0)',
    filter: 'blur(0px)',
    transition: { duration: 0.68, ease: EASE_OUT },
  },
}

/** Vertical trace — for spines, rules, and columns that draw downward. */
export const traceDown: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
  show: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.9, ease: EASE_OUT },
  },
}

/**
 * Panels settle rather than draw — clip-path on a bezel would cut its bloom.
 * Kept to transform + opacity + blur so a grid of twelve stays smooth.
 */
export const settle: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: EASE_OUT },
  },
}

export const settleStagger = (stagger = 0.06, delayChildren = 0.05): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
})

/** Standard viewport trigger — fires once, a little before the element is centred. */
export const inView = { once: true, amount: 0.15, margin: '0px 0px -80px 0px' } as const
