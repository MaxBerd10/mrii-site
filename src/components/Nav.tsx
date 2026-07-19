import { useEffect, useState, type MouseEvent } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

type NavChild = { label: string; href: string }
type NavItem = { label: string; href: string; children: NavChild[]; isHome?: boolean }

export default function Nav() {
  const { t } = useLanguage()
  const [open, setOpen] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const homeHref = (hash: string) => `${window.location.pathname === '/' ? '' : '/'}${hash}`

  const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname !== '/') return
    event.preventDefault()
    setOpen(null)
    setMobileOpen(false)
    document.documentElement.classList.add('no-smooth-scroll')
    window.history.pushState(null, '', '/')
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    window.dispatchEvent(new Event('scroll'))
  }

  const navItems: NavItem[] = [
    { label: t.nav.home, href: '/', children: [], isHome: true },
    { label: t.nav.clinic, href: homeHref('#clinic'), children: [
      { label: t.nav.children.services, href: homeHref('#clinic') },
      { label: t.nav.children.doctors, href: homeHref('#doctors') },
      { label: t.nav.children.diagnostics, href: homeHref('#clinic') },
    ]},
    { label: t.nav.research, href: homeHref('#research'), children: [
      { label: t.nav.children.forPatients, href: homeHref('#research') },
      { label: t.nav.children.forSponsors, href: homeHref('#research') },
      { label: t.nav.children.forCRO, href: homeHref('#research') },
    ]},
    { label: t.nav.education, href: homeHref('#education'), children: [
      { label: t.nav.children.residency, href: homeHref('#education') },
      { label: t.nav.children.courses, href: homeHref('#education') },
    ]},
    { label: t.nav.ai, href: homeHref('#ai'), children: [] },
    { label: t.nav.children.doctors, href: homeHref('#doctors'), children: [] },
    { label: t.nav.contacts, href: homeHref('#contacts'), children: [] },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(null)
      setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className={`hp-nav ${scrolled ? 'hp-nav--scrolled' : ''}`}>
      <div className="container-main hp-nav__bar">
        <a href="/" className="hp-nav__logo" onClick={goHome}>
          <span className="hp-nav__mark" aria-hidden>M</span>
          <span className="hp-nav__brand">MRII</span>
        </a>

        <nav className="hp-nav__menu" aria-label={t.nav.institute}>
          {navItems.map((item, i) => (
            <div
              key={i}
              className="hp-nav__item"
              onMouseEnter={() => item.children.length > 0 && setOpen(i)}
              onMouseLeave={() => setOpen(null)}
              onFocus={() => item.children.length > 0 && setOpen(i)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpen(null)
              }}
            >
              <a
                href={item.href}
                className={`hp-nav__link ${open === i ? 'is-active' : ''}`}
                aria-haspopup={item.children.length > 0 ? 'menu' : undefined}
                aria-expanded={item.children.length > 0 ? open === i : undefined}
                onClick={item.isHome ? goHome : undefined}
              >
                {item.label}
              </a>
              {item.children.length > 0 && open === i && (
                <div className="hp-nav__dropdown">
                  {item.children.map((child, j) => (
                    <a key={j} href={child.href}>{child.label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hp-nav__actions">
          <LanguageSwitcher />
          <a href={homeHref('#doctors')} className="hp-btn hp-btn--ghost hp-btn--sm">{t.nav.children.doctors}</a>
          <a href={homeHref('#contacts')} className="hp-btn hp-btn--primary hp-btn--sm">{t.nav.bookAppointment}</a>
        </div>

        <div className="hp-nav__mobile">
          <LanguageSwitcher compact />
          <button
            type="button"
            className="hp-nav__burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={mobileOpen}
          >
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
              {mobileOpen
                ? <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                : <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              }
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="container-main hp-nav__drawer">
          {navItems.map((item, i) => (
            <div key={i}>
              <a
                href={item.href}
                onClick={item.isHome ? goHome : closeMobile}
                className="hp-nav__drawer-link"
              >
                {item.label}
              </a>
              {item.children.map((child, j) => (
                <a key={j} href={child.href} onClick={closeMobile} className="hp-nav__drawer-sub">{child.label}</a>
              ))}
            </div>
          ))}
          <a href={homeHref('#contacts')} onClick={closeMobile} className="hp-btn hp-btn--primary" style={{ marginTop: 20 }}>
            {t.nav.bookAppointment}
          </a>
        </div>
      )}
    </header>
  )
}
