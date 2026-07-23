import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/** One full logo spin during page change. */
export const PAGE_SPIN_MS = 900

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

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))
  const [busy, setBusy] = useState(false)
  const [routeEnter, setRouteEnter] = useState(false)

  const navigate = useCallback((to: string) => {
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

    if (nextFull === currentFull || busy) return

    setBusy(true)
    window.setTimeout(() => {
      window.history.pushState(null, '', nextFull)
      setRouteEnter(true)
      setPath(nextPath)
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      window.setTimeout(() => setBusy(false), 80)
    }, PAGE_SPIN_MS)
  }, [busy])

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
      setBusy(true)
      window.setTimeout(() => {
        setRouteEnter(true)
        setPath(normalizePath(window.location.pathname))
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        window.setTimeout(() => setBusy(false), 80)
      }, PAGE_SPIN_MS)
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPopState)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPopState)
    }
  }, [navigate])

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
      aria-hidden={!active}
      aria-busy={active}
    >
      <div className="page-loader__panel">
        <span className="page-loader__ring" aria-hidden />
        <img
          src="/images/fjsti-logo.png"
          alt=""
          className={`page-loader__logo${active ? ' page-loader__logo--spin' : ''}`}
          width={148}
          height={148}
          decoding="async"
        />
      </div>
    </div>
  )
}
