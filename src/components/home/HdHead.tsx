import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { trace, inView } from '../../lib/homeDarkMotion'

type HdHeadProps = {
  /** Instrument channel identifier, e.g. "CH.02 · Artificial intelligence". Always names a real thing. */
  channel: string
  title: ReactNode
  description?: string
  action?: ReactNode
  center?: boolean
}

/** Shared section head for the instrument: channel strip, title, description. */
export default function HdHead({ channel, title, description, action, center }: HdHeadProps) {
  const head = (
    <div className={`hd-head${center ? ' hd-head--center' : ''}`}>
      <motion.p
        className="hd-channel"
        variants={trace}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <span className="hd-channel__dot" aria-hidden />
        {channel}
      </motion.p>
      <motion.h2
        className="hd-title"
        variants={trace}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        transition={{ delay: 0.08 }}
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p
          className="hd-desc"
          variants={trace}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          transition={{ delay: 0.14 }}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  )

  if (!action) return head

  return (
    <div className="hd-headrow">
      {head}
      <motion.div variants={trace} initial="hidden" whileInView="show" viewport={inView}>
        {action}
      </motion.div>
    </div>
  )
}
