import type { CSSProperties, ReactNode } from 'react'

type SectionHeaderProps = {
  label: string
  title: ReactNode
  description?: string
  action?: ReactNode
  accent?: string
  stack?: boolean
  /** Page-level headers (own route) should pass "h1"; embedded sections keep h2. */
  as?: 'h1' | 'h2'
}

export default function SectionHeader({
  label,
  title,
  description,
  action,
  accent = 'var(--accent)',
  stack = false,
  as: Heading = 'h2',
}: SectionHeaderProps) {
  const style = { '--section-accent': accent } as CSSProperties

  return (
    <div className={`section-head ${stack ? 'section-head--stack' : ''}`} style={style}>
      <div className="section-head__main">
        <span className="section-label">
          <span className="section-label__dot" />
          {label}
        </span>
        <Heading className="section-title">{title}</Heading>
        {description && <p className="section-desc section-head__desc">{description}</p>}
      </div>
      {action && <div className="section-head__action">{action}</div>}
    </div>
  )
}
