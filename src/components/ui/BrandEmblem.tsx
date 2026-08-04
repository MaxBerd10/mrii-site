import type { CSSProperties } from 'react'

const MEDALLION_SRC = '/images/transition-medallion-v1.webp'

type BrandEmblemProps = {
  /** Coin diameter in px — 40 for nav, ~178 for page transition. */
  size?: number
  /** Play the 3D turn (route change overlay or nav sync). */
  spinning?: boolean
  className?: string
}

/** Institute medallion — same asset as the page-transition loader. */
export default function BrandEmblem({ size = 40, spinning = false, className = '' }: BrandEmblemProps) {
  const border = Math.max(2, Math.round(size * 0.022))
  const imgSize = Math.round(size * 2)

  return (
    <span
      className={`brand-emblem${spinning ? ' brand-emblem--turn' : ''}${className ? ` ${className}` : ''}`}
      style={
        {
          '--brand-emblem-size': `${size}px`,
          '--brand-emblem-border': `${border}px`,
        } as CSSProperties
      }
      aria-hidden
    >
      <span className="brand-emblem__coin">
        <img
          src={MEDALLION_SRC}
          alt=""
          className="brand-emblem__face brand-emblem__face--front"
          width={imgSize}
          height={imgSize}
          decoding="async"
        />
        <img
          src={MEDALLION_SRC}
          alt=""
          className="brand-emblem__face brand-emblem__face--back"
          width={imgSize}
          height={imgSize}
          decoding="async"
        />
      </span>
    </span>
  )
}

export { MEDALLION_SRC }
