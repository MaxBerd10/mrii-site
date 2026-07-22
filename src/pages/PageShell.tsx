import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Extra top padding under fixed nav */
  className?: string
}

export default function PageShell({ children, className = '' }: Props) {
  return (
    <main className={`page-shell ${className}`.trim()}>
      {children}
    </main>
  )
}
