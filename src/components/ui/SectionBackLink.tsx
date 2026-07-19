import type { ReactNode } from 'react'

type SectionBackLinkProps = {
  href: string
  className?: string
  children: ReactNode
}

/** Always open the section hash so landing is predictable (no history.back jump). */
export default function SectionBackLink({ href, className, children }: SectionBackLinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
