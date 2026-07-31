import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageNav } from '../components/PageTransition'

/** Scroll to top only after in-app navigation — skip on hard refresh / first paint. */
export function useScrollToTopOnRoute(routeKey: string) {
  const { routeEnter } = usePageNav()

  useEffect(() => {
    if (!routeEnter) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [routeKey, routeEnter])
}

/** Keep window scroll stable when ScrollTrigger recalculates layout. */
export function refreshScrollTriggersPreservingScroll() {
  const y = window.scrollY
  ScrollTrigger.refresh()
  if (Math.abs(window.scrollY - y) > 1) {
    window.scrollTo(0, y)
  }
}
