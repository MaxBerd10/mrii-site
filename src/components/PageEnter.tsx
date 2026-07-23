import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '../lib/animations'
import { usePageNav } from './PageTransition'

/** Route content entrance after page-loader spin — only on in-app navigation. */
export default function PageEnter({ path, children }: { path: string; children: ReactNode }) {
  const reduce = useReducedMotion()
  const { routeEnter } = usePageNav()

  if (reduce || !routeEnter) {
    return <div className="page-enter">{children}</div>
  }

  return (
    <motion.div
      key={path}
      className="page-enter"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}
