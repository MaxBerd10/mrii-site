import { useMemo, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { fadeUp } from '../../lib/animations'

/** Tags Reveal can render — narrowed so `as` stays type-safe for the props we pass. */
type RevealTag = ElementType<{
  id?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}>

type RevealProps = {
  children: ReactNode
  as?: RevealTag
  variants?: Variants
  className?: string
  delay?: number
  amount?: number
  once?: boolean
  id?: string
  style?: CSSProperties
}

export default function Reveal({
  children,
  as = 'div',
  variants = fadeUp,
  className,
  delay = 0,
  amount = 0.08,
  once = true,
  id,
  style,
}: RevealProps) {
  const reduce = useReducedMotion()
  // motion.create() must not run on every render — a fresh component identity remounts the subtree.
  const MotionTag = useMemo(() => motion.create(as as ElementType), [as])

  if (reduce) {
    const Tag = as
    return (
      <Tag className={className} id={id} style={style}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      id={id}
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: '120px 0px' }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  )
}
