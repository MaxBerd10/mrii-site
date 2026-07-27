import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import HdHead from './HdHead'
import { EASE_OUT } from '../../lib/animations'

const ROTATE_MS = 7000

const SIGNAL_BY_COLOR: Record<string, string> = {
  '#0EA5E9': 'var(--hd-cyan)',
  '#10B981': 'var(--hd-green)',
  '#6366F1': 'var(--hd-violet-lt)',
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

/** CH.08 — testimonials from sponsors, coordinators, and physicians. */
export default function Voices() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const copy = t.homeDark.voices
  const quotes = t.partners.testimonials

  const [index, setIndex] = useState(0)
  // Paused by hover, by focus inside the carousel, and by reduced motion.
  const [paused, setPaused] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  const go = useCallback(
    (next: number) => setIndex((next + quotes.length) % quotes.length),
    [quotes.length],
  )

  useEffect(() => {
    if (reduce || paused || quotes.length < 2) return
    const id = window.setInterval(() => {
      // Browsers pause rAF in a hidden tab, so the slide transition would stall
      // mid-exit and the index would run ahead of what is on screen.
      if (document.visibilityState === 'hidden') return
      setIndex((i) => (i + 1) % quotes.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [reduce, paused, quotes.length])

  const active = quotes[index]
  const signal = SIGNAL_BY_COLOR[active.color] ?? 'var(--hd-violet-lt)'

  return (
    <section className="hd-section hd-voices" aria-labelledby="hd-voices-title">
      <div className="container-main">
        <HdHead
          channel={copy.channel}
          title={
            <span id="hd-voices-title">
              {copy.title1} <em>{copy.titleEm}</em>
            </span>
          }
          description={copy.description}
        />

        <div
          ref={stageRef}
          className="hd-voices__stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!stageRef.current?.contains(event.relatedTarget as Node)) setPaused(false)
          }}
        >
          <div className="hd-voices__viewport" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={index}
                className="hd-panel hd-quote"
                style={{ '--hd-quote': signal, '--hd-signal': signal } as CSSProperties}
                initial={reduce ? false : { opacity: 0, y: 16, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduce ? undefined : { opacity: 0, y: -12, filter: 'blur(6px)' }}
                transition={{ duration: 0.44, ease: EASE_OUT }}
              >
                <span className="hd-quote__mark" aria-hidden>
                  “
                </span>
                <blockquote className="hd-quote__text">{active.quote}</blockquote>
                <figcaption className="hd-quote__by">
                  <span className="hd-quote__avatar" aria-hidden>
                    {initials(active.author)}
                  </span>
                  <span>
                    <span className="hd-quote__author">{active.author}</span>
                    <span className="hd-quote__role">{active.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="hd-voices__controls">
            <button
              type="button"
              className="hd-voices__btn"
              onClick={() => go(index - 1)}
              aria-label={copy.prev}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="hd-voices__btn"
              onClick={() => go(index + 1)}
              aria-label={copy.next}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="hd-voices__dots">
              {quotes.map((quote, i) => (
                <button
                  key={quote.author}
                  type="button"
                  className={`hd-voices__dot${i === index ? ' is-active' : ''}`}
                  onClick={() => go(i)}
                  aria-label={`${quote.author} — ${copy.goTo}`}
                  aria-current={i === index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
