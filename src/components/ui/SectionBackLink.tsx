import type { ReactNode } from 'react'

type SectionBackLinkProps = {
  href: string
  className?: string
  children: ReactNode
}

/** Open a section/list page (multi-page site, not in-page hash). */
export default function SectionBackLink({ href, className, children }: SectionBackLinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
