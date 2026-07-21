import { useLayoutEffect } from 'react'
import ScrollProgress from './components/ScrollProgress'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Pillars from './components/Pillars'
import ProcessSteps from './components/ProcessSteps'
import Clinic from './components/Clinic'
import Research from './components/Research'
import AISection from './components/AISection'
import Education from './components/Education'
import Doctors from './components/Doctors'
import NewsSection from './components/NewsSection'
import Partners from './components/Partners'
import International from './components/International'
import FooterSection from './components/FooterSection'
import BackToTop from './components/BackToTop'
import SpecialtyPage from './pages/SpecialtyPage'
import NewsPage from './pages/NewsPage'
import AIProductPage from './pages/AIProductPage'
import NotFoundPage from './pages/NotFoundPage'

/** Ideal breathing room under nav / above viewport bottom — same for every section. */
const FRAME_TOP = 36
const FRAME_BOTTOM = 36

function getNavBottom() {
  const nav = document.querySelector('.hp-nav')
  if (nav instanceof HTMLElement) {
    return Math.ceil(nav.getBoundingClientRect().bottom)
  }
  return 72
}

function getSection(hash: string): HTMLElement | null {
  const section = document.querySelector(hash)
  return section instanceof HTMLElement ? section : null
}

/** Anchor to the visible title row. */
function getSectionHead(section: HTMLElement): HTMLElement {
  const head = section.querySelector(
    '.section-head, .clinic-section__head, .hp-book__title, .hp-footer__brand',
  )
  return head instanceof HTMLElement ? head : section
}

/** Bottom of the primary content block used for framing. */
function getSectionFrameEnd(section: HTMLElement): HTMLElement {
  const end = section.querySelector(
    [
      '.research-console',
      '.education-tracks',
      '.ai-console',
      '.doctor-grid',
      '.clinic-bento',
      '.hp-book',
      '.news-grid',
    ].join(', '),
  )
  return end instanceof HTMLElement ? end : section
}

function scrollInstant(top: number) {
  const y = Math.max(0, Math.round(top))
  if (Math.abs(window.scrollY - y) < 1) return
  window.scrollTo({ top: y, left: 0, behavior: 'auto' })
}

/**
 * Frame every section the same way:
 * - fits in viewport → center between nav and bottom pad
 * - taller than viewport → pin title under nav with FRAME_TOP
 */
function targetForHash(hash: string): number | null {
  const section = getSection(hash)
  if (!section) return null

  const head = getSectionHead(section)
  const end = getSectionFrameEnd(section)
  const navBottom = getNavBottom()
  const vh = window.innerHeight
  const y = window.scrollY

  const headDoc = head.getBoundingClientRect().top + y
  const endDoc = end.getBoundingClientRect().bottom + y
  const frameH = Math.max(0, endDoc - headDoc)

  const bandTop = navBottom + FRAME_TOP
  const bandBottom = vh - FRAME_BOTTOM
  const bandH = Math.max(0, bandBottom - bandTop)

  // Contacts sits at page end — pin under nav. Others center when they fit.
  const canCenter = hash !== '#contacts' && frameH <= bandH
  const headScreen = canCenter ? bandTop + (bandH - frameH) / 2 : bandTop

  const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh)
  return Math.min(maxScroll, Math.max(0, Math.round(headDoc - headScreen)))
}

function jumpToHash() {
  const hash = window.location.hash
  if (!hash) return
  const top = targetForHash(hash)
  if (top == null) return

  document.documentElement.classList.add('no-smooth-scroll')
  scrollInstant(top)
  window.dispatchEvent(new Event('scroll'))
}

function restorePendingHash() {
  let pending = ''
  try {
    pending = sessionStorage.getItem('mrii-hash') ?? ''
    if (pending) sessionStorage.removeItem('mrii-hash')
  } catch {
    pending = ''
  }
  if (!pending || pending === '#') return
  if (!document.querySelector(pending)) return
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${window.location.search}${pending}`,
  )
}

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const specialtyMatch = pathname.match(/^\/clinic\/([^/]+)$/)
  const specialtySlug = specialtyMatch?.[1] ?? null
  const newsMatch = pathname.match(/^\/news\/([^/]+)$/)
  const newsSlug = newsMatch?.[1] ?? null
  const aiMatch = pathname.match(/^\/ai\/([^/]+)$/)
  const aiSlug = aiMatch?.[1] ?? null
  const isHome = pathname === '/'
  const isKnownInner = Boolean(specialtySlug || newsSlug || aiSlug)
  const isNotFound = !isHome && !isKnownInner

  useLayoutEffect(() => {
    if (!isHome) {
      document.documentElement.classList.remove('no-smooth-scroll')
      return
    }

    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    restorePendingHash()

    /** Single instant jump — no delayed rejump (that was the bounce). */
    const startJump = () => {
      if (!window.location.hash) {
        document.documentElement.classList.remove('no-smooth-scroll')
        return
      }
      document.documentElement.classList.add('no-smooth-scroll')
      jumpToHash()
    }

    const onHashClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (event.button !== 0) return

      const anchor = (event.target as Element | null)?.closest?.('a')
      if (!(anchor instanceof HTMLAnchorElement)) return

      const href = anchor.getAttribute('href')
      if (!href || href === '#') return

      let hash = ''
      if (href.startsWith('#')) {
        hash = href
      } else {
        try {
          const url = new URL(href, window.location.origin)
          if (url.origin !== window.location.origin) return
          if (url.pathname !== '/' && url.pathname !== window.location.pathname) return
          if (!url.hash || url.hash === '#') return
          // Home hash links from other routes: full navigation.
          if (url.pathname === '/' && window.location.pathname !== '/') return
          hash = url.hash
        } catch {
          return
        }
      }

      if (!document.querySelector(hash)) return

      event.preventDefault()
      if (window.location.hash !== hash) {
        window.history.pushState(
          null,
          '',
          `${window.location.pathname}${window.location.search}${hash}`,
        )
      }
      startJump()
    }

    startJump()
    window.addEventListener('popstate', startJump)
    document.addEventListener('click', onHashClick, true)

    return () => {
      window.removeEventListener('popstate', startJump)
      document.removeEventListener('click', onHashClick, true)
      window.history.scrollRestoration = previous
    }
  }, [isHome])

  return (
    <div className="site-shell min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <ScrollProgress />
      <Nav />
      {isNotFound ? (
        <NotFoundPage />
      ) : specialtySlug ? (
        <SpecialtyPage slug={specialtySlug} />
      ) : newsSlug ? (
        <NewsPage slug={newsSlug} />
      ) : aiSlug ? (
        <AIProductPage slug={aiSlug} />
      ) : (
        <main className="site-main">
          <Hero />
          <Pillars />
          <ProcessSteps />
          <Clinic />
          <Research />
          <Education />
          <AISection />
          <Doctors />
          <NewsSection />
          <Partners />
          <International />
        </main>
      )}
      <FooterSection />
      <BackToTop />
    </div>
  )
}
