import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { usePageNav } from './PageTransition'
import Magnetic from './ui/Magnetic'
import { EASE_OUT } from '../lib/animations'

type NavChild = { label: string; href: string }
type NavItem = { label: string; href: string; children: NavChild[] }

export default function Nav() {
  const { t } = useLanguage()
  const { path } = usePageNav()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems: NavItem[] = [
    { label: t.nav.home, href: '/', children: [] },
    {
      label: t.nav.clinic,
      href: '/clinic',
      children: [
        { label: t.nav.children.services, href: '/prices' },
        { label: t.nav.children.prices, href: '/prices' },
        { label: t.nav.children.doctors, href: '/doctors' },
        { label: t.nav.children.diagnostics, href: '/clinic' },
      ],
    },
    {
      label: t.nav.research,
      href: '/research',
      children: [
        { label: t.nav.children.forPatients, href: '/research' },
        { label: t.nav.children.forSponsors, href: '/research' },
        { label: t.nav.children.forCRO, href: '/research' },
      ],
    },
    {
      label: t.nav.education,
      href: '/education',
      children: [
        { label: t.nav.children.residency, href: '/education' },
        { label: t.nav.children.courses, href: '/education' },
      ],
    },
    { label: t.nav.ai, href: '/ai', children: [] },
    { label: t.nav.children.doctors, href: '/doctors', children: [] },
    { label: t.nav.contacts, href: '/contacts', children: [] },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
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

  const closeMenus = () => {
    setOpen(null)
    setMobileOpen(false)
  }

  const isActive = (href: string) => {
    if (href === '/') return path === '/'
    return path === href || path.startsWith(`${href}/`)
  }

  return (
    <header className={`hp-nav ${scrolled ? 'hp-nav--scrolled' : ''}`}>
      <div className="container-main hp-nav__bar">
        <a href="/" className="hp-nav__logo" onClick={closeMenus}>
          <img src="/images/fjsti-logo.png" alt="" className="hp-nav__logo-img" width={36} height={36} />
          <span className="hp-nav__brand">{t.nav.brand}</span>
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
                className={`hp-nav__link ${open === i || isActive(item.href) ? 'is-active' : ''}`}
                aria-haspopup={item.children.length > 0 ? 'menu' : undefined}
                aria-expanded={item.children.length > 0 ? open === i : undefined}
                onClick={closeMenus}
              >
                {item.label}
              </a>
              <AnimatePresence>
                {item.children.length > 0 && open === i && (
                  <motion.div
                    className="hp-nav__dropdown"
                    key={`dd-${i}`}
                    initial={reduce ? false : { opacity: 0, y: -6, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={reduce ? undefined : { opacity: 0, y: -4, x: '-50%' }}
                    transition={{ duration: 0.16, ease: EASE_OUT }}
                    style={{ transformOrigin: 'top center' }}
                  >
                    {item.children.map((child, j) => (
                      <a key={j} href={child.href} onClick={closeMenus}>
                        {child.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="hp-nav__actions">
          <LanguageSwitcher />
          <a href="/doctors" className="hp-btn hp-btn--ghost hp-btn--sm">
            {t.nav.children.doctors}
          </a>
          <Magnetic href="/contacts" className="hp-btn hp-btn--primary hp-btn--sm" strength={0.28}>
            {t.nav.bookAppointment}
          </Magnetic>
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
              {mobileOpen ? (
                <path
                  d="M4 4L18 18M18 4L4 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h16M3 11h16M3 16h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="container-main hp-nav__drawer"
            key="mobile-drawer"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
          >
            {navItems.map((item, i) => (
              <div key={i}>
                <a href={item.href} onClick={closeMenus} className="hp-nav__drawer-link">
                  {item.label}
                </a>
                {item.children.map((child, j) => (
                  <a key={j} href={child.href} onClick={closeMenus} className="hp-nav__drawer-sub">
                    {child.label}
                  </a>
                ))}
              </div>
            ))}
            <a href="/contacts" onClick={closeMenus} className="hp-btn hp-btn--primary" style={{ marginTop: 20 }}>
              {t.nav.bookAppointment}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
