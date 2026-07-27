import { useEffect, useRef, useState } from 'react'

type Parsed = {
  prefix: string
  num: number
  suffix: string
  /** Separator taken from the source string, so uz/ru "50 000+" and en "50,000+" each keep their own. */
  separator: string
}

const SEPARATORS = /[\s ,]/g

function parseStatValue(value: string): Parsed {
  const match = value.match(/^(\D*?)(\d[\d\s ,]*)(.*)$/)
  if (!match) return { prefix: '', num: 0, suffix: value, separator: ' ' }

  const digits = match[2]
  return {
    prefix: match[1],
    num: parseInt(digits.replace(SEPARATORS, ''), 10),
    suffix: match[3],
    separator: digits.match(SEPARATORS)?.[0] ?? ' ',
  }
}

function group(n: number, separator: string) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

/** Counts a stat string up to its final value, preserving its prefix, suffix, and digit grouping. */
export function useCountUp(value: string, active: boolean, duration = 1800) {
  const { prefix, num, suffix, separator } = parseStatValue(value)
  const [display, setDisplay] = useState(value)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current || num === 0) return
    started.current = true

    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(`${prefix}${group(Math.round(num * eased), separator)}${suffix}`)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [active, num, prefix, suffix, separator, duration])

  return display
}
