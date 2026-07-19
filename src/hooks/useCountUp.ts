import { useEffect, useRef, useState } from 'react'

function parseStatValue(value: string): { num: number; suffix: string; prefix: string } {
  const match = value.match(/^(\D*)([\d\s]+)(.*)$/)
  if (!match) return { prefix: '', num: 0, suffix: value }
  return {
    prefix: match[1],
    num: parseInt(match[2].replace(/[\s,]/g, ''), 10),
    suffix: match[3],
  }
}

export function useCountUp(value: string, active: boolean, duration = 1800) {
  const { prefix, num, suffix } = parseStatValue(value)
  const [display, setDisplay] = useState(value)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current || num === 0) return
    started.current = true

    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(num * eased)
      const formatted = current.toLocaleString('ru-RU')
      setDisplay(`${prefix}${formatted}${suffix}`)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, num, prefix, suffix, duration])

  return display
}
