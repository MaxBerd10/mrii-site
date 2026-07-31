import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { usePageNav } from './PageTransition'
import Magnetic from './ui/Magnetic'
import { EASE_OUT } from '../lib/animations'

type NavChild = { label: string; href: string }
type NavItem = { label: string; href: string; children: NavChild[] }

/** The highlight slides between items on a spring — the nav's one signature motion. */
const HIGHLIGHT_SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 } as const

export default function Nav() {
  const { t } = useLanguage()
  const { path } = usePageNav()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems: NavItem[] = [
    { label: t.nav.home, href: '/', children: [] },
    {
      label: t.nav.clinic,
      href: '/clinic',
      children: [
        { label: t.nav.children.services, href: '/clinic/services' },
        { label: t.nav.children.tour, href: '/clinic/tour' },
        { label: t.nav.children.gallery, href: '/clinic/gallery' },
        { label: t.nav.children.prices, href: '/prices' },
      ],
    },
    { label: t.nav.children.doctors, href: '/doctors', children: [] },
    { label: t.nav.ai, href: '/ai', children: [] },
    {
      label: t.nav.research,
      href: '/research',
      children: [
        { label: t.nav.children.forPatients, href: '/research#patients' },
        { label: t.nav.children.forSponsors, href: '/research#sponsors' },
        { label: t.nav.children.forCRO, href: '/research#cro' },
      ],
    },
    {
      label: t.nav.education,
      href: '/education',
      children: [
        { label: t.nav.children.residency, href: '/education#ordinatura' },
        { label: t.nav.children.courses, href: '/education#kurslar' },
      ],
    },
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

  const activeIndex = navItems.findIndex((item) => isActive(item.href))
  const highlighted = hovered ?? activeIndex
  const isDoctorProfile = path.startsWith('/doctors/')

  return (
    <header className={`hp-nav${scrolled ? ' hp-nav--scrolled' : ''}${mobileOpen ? ' is-menu-open' : ''}`}>
      <div className="hp-nav__bar">
        <a href="/" className="hp-nav__logo" onClick={closeMenus} aria-label={t.nav.brand}>
          <img src="/images/fjsti-logo.png" alt="" className="hp-nav__logo-img" width={36} height={36} />
          <span className="hp-nav__brand">{t.nav.brand}</span>
        </a>

        <nav
          className="hp-nav__menu"
          aria-label={t.nav.institute}
          onMouseLeave={() => {
            setHovered(null)
            setOpen(null)
          }}
        >
          {navItems.map((item, i) => (
            <div
              key={i}
              className="hp-nav__item"
              onMouseEnter={() => {
                setHovered(i)
                if (item.children.length > 0) setOpen(i)
                else setOpen(null)
              }}
              onFocus={() => {
                setHovered(i)
                if (item.children.length > 0) setOpen(i)
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setOpen(null)
                  setHovered(null)
                }
              }}
            >
              {highlighted === i && (
                <motion.span
                  layoutId="nav-highlight"
                  className="hp-nav__highlight"
                  transition={reduce ? { duration: 0 } : HIGHLIGHT_SPRING}
                  aria-hidden
                />
              )}
              <a
                href={item.href}
                className={`hp-nav__link${item.children.length > 0 ? ' hp-nav__link--parent' : ''}${isActive(item.href) ? ' is-active' : ''}`}
                aria-haspopup={item.children.length > 0 ? 'menu' : undefined}
                aria-expanded={item.children.length > 0 ? open === i : undefined}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={closeMenus}
              >
                <span>{item.label}</span>
                {item.children.length > 0 && (
                  <svg
                    className="hp-nav__chevron"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="m4.25 5.5 2.75 2.75L9.75 5.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
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
                      <a
                        key={j}
                        href={child.href}
                        onClick={closeMenus}
                        className={isActive(child.href) ? 'is-active' : undefined}
                      >
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
          {!isDoctorProfile && (
            <Magnetic href="/contacts" className="hp-btn hp-btn--primary hp-btn--sm" strength={0.28}>
              {t.nav.bookAppointment}
            </Magnetic>
          )}
        </div>

        <div className="hp-nav__mobile">
          <LanguageSwitcher compact />
          <button
            type="button"
            className={`hp-nav__burger${mobileOpen ? ' is-open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={mobileOpen}
            aria-controls="hp-mobile-menu"
          >
            <span className="hp-nav__burger-lines" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {mobileOpen ? (
            <div className="hp-nav__portal" key="mobile-portal">
              <motion.button
                key="mobile-scrim"
                type="button"
                className="hp-nav__scrim"
                aria-label={t.nav.closeMenu}
                onClick={closeMenus}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
              <motion.nav
                id="hp-mobile-menu"
                className="hp-nav__drawer"
                key="mobile-drawer"
                aria-label={t.nav.institute}
                initial={reduce ? false : { y: -18 }}
                animate={{ y: 0 }}
                exit={reduce ? undefined : { y: -12 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
              >
                <div className="hp-nav__drawer-list">
                  {navItems.map((item, i) => (
                    <div key={i} className="hp-nav__drawer-group">
                      <a
                        href={item.href}
                        onClick={closeMenus}
                        className={`hp-nav__drawer-link${isActive(item.href) ? ' is-active' : ''}`}
                      >
                        {item.label}
                      </a>
                      {item.children.length > 0 ? (
                        <div className="hp-nav__drawer-subs">
                          {item.children.map((child, j) => (
                            <a
                              key={j}
                              href={child.href}
                              onClick={closeMenus}
                              className={`hp-nav__drawer-sub${isActive(child.href) ? ' is-active' : ''}`}
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                {!isDoctorProfile ? (
                  <div className="hp-nav__drawer-foot">
                    <a
                      className="hp-nav__drawer-phone"
                      href={`tel:${t.topBar.phone.replace(/[^\d+]/g, '')}`}
                    >
                      {t.topBar.phone}
                    </a>
                    <a
                      href="/contacts?intent=booking"
                      onClick={closeMenus}
                      className="hp-btn hp-btn--primary hp-nav__drawer-cta"
                    >
                      {t.nav.bookAppointment}
                    </a>
                  </div>
                ) : null}
              </motion.nav>
            </div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </header>
  )
}
