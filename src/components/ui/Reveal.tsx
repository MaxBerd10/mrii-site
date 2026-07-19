import type { CSSProperties, ElementType, ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { fadeUp } from '../../lib/animations'

type RevealProps = {
  children: ReactNode
  as?: ElementType
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
  const MotionTag = motion(as as ElementType)

  if (reduce) {
    const Tag = as as ElementType
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
