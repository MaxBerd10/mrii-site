import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageNav } from '../components/PageTransition'

/** Clear scroll locks left by nav drawer, page transitions, or GSAP. */
export function unlockPageScroll() {
  document.body.style.removeProperty('overflow')
  document.body.style.removeProperty('position')
  document.body.style.removeProperty('padding-right')
  document.body.style.removeProperty('touch-action')
  document.documentElement.style.removeProperty('overflow')
  document.documentElement.style.removeProperty('position')
}

/** Hard reset — iOS Safari sometimes ignores window.scrollTo alone. */
export function scrollToPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

/** Repeat after layout so route swaps cannot land mid-page. */
export function scrollToPageTopAfterLayout() {
  scrollToPageTop()
  requestAnimationFrame(() => {
    scrollToPageTop()
    requestAnimationFrame(scrollToPageTop)
  })
}

/** Drop homepage ScrollTrigger instances when leaving a route. */
export function resetScrollTriggersOnRouteChange() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  requestAnimationFrame(() => {
    unlockPageScroll()
    ScrollTrigger.refresh()
    scrollToPageTop()
    requestAnimationFrame(scrollToPageTop)
  })
}

/** Scroll to top only after in-app navigation — skip on hard refresh / first paint. */
export function useScrollToTopOnRoute(routeKey: string) {
  const { routeEnter } = usePageNav()

  useEffect(() => {
    if (!routeEnter) return
    scrollToPageTopAfterLayout()
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
