import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '../lib/animations'

/** Route content entrance after page-loader spin — prevents jarring swap. */
export default function PageEnter({ path, children }: { path: string; children: ReactNode }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className="page-enter">{children}</div>
  }

  return (
    <motion.div
      key={path}
      className="page-enter"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}
