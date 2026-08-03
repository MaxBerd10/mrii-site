import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  resetScrollTriggersOnRouteChange,
  scrollToPageTop,
  scrollToPageTopAfterLayout,
  unlockPageScroll,
} from '../lib/scrollRoute'

/** Emblem turn duration while the new route mounts under an opaque veil. */
export const PAGE_SPIN_MS = 720
const PAGE_SPIN_REDUCED_MS = 120
/** Commit the new route once the veil is fully painted. */
const ROUTE_COMMIT_MS = 40

type NavContextValue = {
  path: string
  busy: boolean
  /** True after in-app navigation; false on hard refresh / first paint. */
  routeEnter: boolean
  navigate: (to: string) => void
}

const NavContext = createContext<NavContextValue | null>(null)

export function normalizePath(pathname: string) {
  const clean = pathname.replace(/\/+$/, '') || '/'
  return clean
}

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
}

function shouldHandleLink(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== '_self') return false
  if (anchor.hasAttribute('download')) return false
  if (anchor.dataset.noTransition != null) return false
  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href === '#') return false
  try {
    const url = new URL(href, window.location.origin)
    if (url.origin !== window.location.origin) return false
    return true
  } catch {
    return false
  }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function spinDurationMs() {
  return prefersReducedMotion() ? PAGE_SPIN_REDUCED_MS : PAGE_SPIN_MS
}

function focusPageLandmark() {
  const main = document.querySelector('main')
  const heading = main?.querySelector('h1')
  const target = (heading instanceof HTMLElement ? heading : main) as HTMLElement | null
  if (!target) return
  if (!target.hasAttribute('tabindex')) target.tabIndex = -1
  target.focus({ preventScroll: true })
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))
  const [busy, setBusy] = useState(false)
  const [routeEnter, setRouteEnter] = useState(false)
  const timersRef = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }, [])

  const commitRoute = useCallback((nextPath: string, nextFull: string) => {
    window.history.pushState(null, '', nextFull)
    setRouteEnter(true)
    setPath(nextPath)
    scrollToPageTopAfterLayout()
  }, [])

  const finishTransition = useCallback(() => {
    setBusy(false)
    unlockPageScroll()
    scrollToPageTopAfterLayout()
    schedule(() => {
      scrollToPageTop()
      focusPageLandmark()
    }, 32)
  }, [schedule])

  const runTransition = useCallback(
    (nextPath: string, nextFull: string, { push = true }: { push?: boolean } = {}) => {
      clearTimers()
      unlockPageScroll()
      setBusy(true)

      const total = spinDurationMs()

      schedule(() => {
        if (push) commitRoute(nextPath, nextFull)
        else {
          setRouteEnter(true)
          setPath(nextPath)
          scrollToPageTopAfterLayout()
        }
      }, ROUTE_COMMIT_MS)

      schedule(finishTransition, total)
    },
    [clearTimers, commitRoute, finishTransition, schedule],
  )

  const navigate = useCallback(
    (to: string) => {
      let url: URL
      try {
        url = new URL(to, window.location.origin)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) {
        window.location.href = to
        return
      }

      const nextPath = normalizePath(url.pathname)
      const nextFull = `${nextPath}${url.search}${url.hash}`
      const currentFull = `${normalizePath(window.location.pathname)}${window.location.search}${window.location.hash}`

      // Same path, only hash — no logo spin
      if (nextPath === normalizePath(window.location.pathname) && url.hash) {
        if (window.location.hash !== url.hash) {
          window.history.pushState(null, '', nextFull)
          const el = document.querySelector(url.hash)
          if (el instanceof HTMLElement) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        return
      }

      if (busy) return

      // Choosing the page you are already on should return you to the top, the
      // way every other site behaves. Bailing out silently made "Bosh sahifa"
      // and the logo look broken once the reader had scrolled down. There is no
      // route change here, so this skips the logo spin.
      if (nextFull === currentFull) {
        unlockPageScroll()
        const reduceMotion = prefersReducedMotion()
        if (reduceMotion) scrollToPageTop()
        else window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        return
      }

      runTransition(nextPath, nextFull, { push: true })
    },
    [busy, runTransition],
  )

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    scrollToPageTop()
  }, [])

  useLayoutEffect(() => {
    unlockPageScroll()
    scrollToPageTop()
  }, [path])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedClick(event)) return
      const anchor = (event.target as Element | null)?.closest?.('a')
      if (!(anchor instanceof HTMLAnchorElement) || !shouldHandleLink(anchor)) return

      const url = new URL(anchor.href)
      const nextPath = normalizePath(url.pathname)

      // Allow true browser download / external already filtered
      event.preventDefault()
      navigate(`${nextPath}${url.search}${url.hash}`)
    }

    const onPopState = () => {
      clearTimers()
      setRouteEnter(true)
      setPath(normalizePath(window.location.pathname))
      setBusy(false)
      unlockPageScroll()
      // Back/forward: browser restores scroll — do not force top.
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPopState)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPopState)
    }
  }, [navigate, runTransition])

  // Lock page scroll while the transition veil is up — keyboard PageDown
  // otherwise still moves the outgoing page underneath. Always clear on exit:
  // restoring the previous inline value resurrected `hidden` from the mobile
  // menu and left new routes unscrollable until a hard refresh.
  useEffect(() => {
    if (!busy) {
      unlockPageScroll()
      return
    }
    document.body.style.overflow = 'hidden'
    return () => {
      unlockPageScroll()
    }
  }, [busy])

  useEffect(() => {
    resetScrollTriggersOnRouteChange()
    unlockPageScroll()
  }, [path])

  useEffect(() => () => clearTimers(), [clearTimers])

  // Legacy hash bookmarks → real pages
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash || path !== '/') return
    const map: Record<string, string> = {
      clinic: '/clinic',
      prices: '/prices',
      research: '/research',
      education: '/education',
      ai: '/ai',
      doctors: '/doctors',
      news: '/news',
      contacts: '/contacts',
      pillars: '/',
    }
    const target = map[hash]
    if (!target) return
    window.history.replaceState(null, '', target)
    setPath(normalizePath(target))
  }, [path])

  const value = useMemo(
    () => ({ path, busy, routeEnter, navigate }),
    [path, busy, routeEnter, navigate],
  )

  return (
    <NavContext.Provider value={value}>
      {children}
      <PageLoaderOverlay active={busy} />
    </NavContext.Provider>
  )
}

export function usePageNav() {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('usePageNav must be used within PageTransitionProvider')
  return ctx
}

function PageLoaderOverlay({ active }: { active: boolean }) {
  return (
    <div
      className={`page-loader${active ? ' page-loader--active' : ''}`}
      role="status"
      aria-live="polite"
      aria-hidden={!active}
      aria-busy={active}
    >
      <span className="sr-only">{active ? 'Sahifa yuklanmoqda' : ''}</span>
      <div className="page-loader__panel">
        <span className={`page-loader__emblem-frame${active ? ' page-loader__emblem-frame--turn' : ''}`}>
          <span className="page-loader__coin">
            <img
              src="/images/transition-medallion-v1.webp"
              alt=""
              className="page-loader__emblem page-loader__emblem--front"
              width={192}
              height={192}
              decoding="async"
            />
            <img
              src="/images/transition-medallion-v1.webp"
              alt=""
              className="page-loader__emblem page-loader__emblem--back"
              width={192}
              height={192}
              decoding="async"
            />
          </span>
        </span>
      </div>
    </div>
  )
}
