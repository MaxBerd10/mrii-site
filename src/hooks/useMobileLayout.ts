import { useEffect, useState } from 'react'

/** True at phone widths where scroll-theater sections should stay static. */
export function useMobileLayout(breakpoint = 760) {
  const query = `(max-width: ${breakpoint}px)`

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [query])

  return isMobile
}
