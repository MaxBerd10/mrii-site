import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '../lib/animations'
import { usePageNav } from './PageTransition'

/** Route content entrance after page-loader spin — only on in-app navigation. */
export default function PageEnter({ path, children }: { path: string; children: ReactNode }) {
  const reduce = useReducedMotion()
  const { routeEnter, busy } = usePageNav()

  if (reduce || !routeEnter) {
    return <div className="page-enter">{children}</div>
  }

  // Stay fully opaque while the loader covers the swap, then ease in slightly
  // so the veil never reveals a blank/faded shell underneath.
  return (
    <motion.div
      key={path}
      className="page-enter"
      initial={{ opacity: 1, y: 10 }}
      animate={{ opacity: 1, y: busy ? 10 : 0 }}
      transition={{ duration: 0.32, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}
