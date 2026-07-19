import type { CSSProperties, ReactNode } from 'react'

type SectionHeaderProps = {
  label: string
  title: ReactNode
  description?: string
  action?: ReactNode
  accent?: string
  stack?: boolean
}

export default function SectionHeader({
  label,
  title,
  description,
  action,
  accent = 'var(--accent)',
  stack = false,
}: SectionHeaderProps) {
  const style = { '--section-accent': accent } as CSSProperties

  return (
    <div className={`section-head ${stack ? 'section-head--stack' : ''}`} style={style}>
      <div className="section-head__main">
        <span className="section-label">
          <span className="section-label__dot" />
          {label}
        </span>
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-desc section-head__desc">{description}</p>}
      </div>
      {action && <div className="section-head__action">{action}</div>}
    </div>
  )
}
