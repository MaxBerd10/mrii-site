import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'

/**
 * Shared scaffolding for the light homepage.
 *
 * The reveal is deliberately CSS-driven rather than a motion library: this page
 * has one arrival gesture repeated everywhere, so an IntersectionObserver that
 * flips a single class is both lighter and easier to keep consistent than a
 * variant per section.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(
    () => typeof document !== 'undefined' && document.hidden,
  )

  useEffect(() => {
    const node = ref.current
    if (!node || seen) return

    // Browsers pause observers in hidden tabs; a page opened in the background
    // would otherwise stay blank until it is focused.
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(node)

    const revealWhenHidden = () => {
      if (!document.hidden) return
      setSeen(true)
      io.disconnect()
    }
    document.addEventListener('visibilitychange', revealWhenHidden)

    return () => {
      document.removeEventListener('visibilitychange', revealWhenHidden)
      io.disconnect()
    }
  }, [seen, threshold])

  return { ref, seen }
}

type MaskedTextTag = 'h1' | 'h2' | 'p' | 'span'

type MaskedTextProps = {
  as?: MaskedTextTag
  children: ReactNode
  className?: string
  id?: string
  style?: CSSProperties
  threshold?: number
}

function textContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textContent).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textContent(node.props.children)
  return ''
}

function maskedWords(node: ReactNode, counter: { value: number }, path = 'text'): ReactNode {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
      .split(/(\s+)/)
      .map((part, index) => {
        if (!part || /^\s+$/.test(part)) return part

        const wordIndex = Math.min(counter.value++, 18)
        return (
          <span className="hc-word-mask" key={`${path}-${index}`}>
            <span
              className="hc-word-mask__inner"
              style={{ '--hc-word-index': wordIndex } as CSSProperties}
            >
              {part}
            </span>
          </span>
        )
      })
  }

  if (Array.isArray(node)) {
    return Children.map(node, (child, index) =>
      maskedWords(child, counter, `${path}-${index}`),
    )
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return cloneElement(
      node as ReactElement<{ children?: ReactNode }>,
      undefined,
      maskedWords(node.props.children, counter, `${path}-child`),
    )
  }

  return node
}

function useMaskedTextReveal(threshold: number) {
  const ref = useRef<HTMLElement>(null)
  // A hidden tab pauses both rAF and observers, so copy that mounts in the
  // background would stay masked even after the reader switches to it. Match
  // `useReveal` and show it outright rather than risk an invisible headline.
  const [seen, setSeen] = useState(
    () => typeof document !== 'undefined' && document.hidden,
  )

  useEffect(() => {
    const node = ref.current
    if (!node || seen) return

    let observer: IntersectionObserver | null = null
    let cancelled = false

    const observe = () => {
      if (cancelled || observer) return

      if (typeof IntersectionObserver === 'undefined') {
        setSeen(true)
        return
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          setSeen(true)
          observer?.disconnect()
        },
        { threshold, rootMargin: '0px 0px -6% 0px' },
      )
      observer.observe(node)
    }

    // Observe right away. Fonts load with `display: swap`, so the copy paints in
    // the fallback face immediately and swaps in place — waiting on
    // `document.fonts.ready` here was the main cause of the hero text arriving
    // late on first load.
    const resumeWhenVisible = () => {
      if (!document.hidden) observe()
    }

    document.addEventListener('visibilitychange', resumeWhenVisible)
    observe()

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', resumeWhenVisible)
      observer?.disconnect()
    }
  }, [seen, threshold])

  return { ref, seen }
}

/**
 * Cuberto-inspired masked word reveal.
 *
 * The visible copy is split only for motion; assistive technology receives one
 * uninterrupted text node, so the animation never harms reading order.
 */
export function MaskedText({
  as: Tag = 'span',
  children,
  className = '',
  id,
  style,
  threshold = 0.16,
}: MaskedTextProps) {
  const { ref, seen } = useMaskedTextReveal(threshold)
  const counter = { value: 0 }

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`hc-masked-text${seen ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      <span className="hc-masked-text__visual" aria-hidden="true">
        {maskedWords(children, counter)}
      </span>
      <span className="sr-only">{textContent(children)}</span>
    </Tag>
  )
}

export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li'
}) {
  const { ref, seen } = useReveal<HTMLDivElement>()
  return (
    <Tag
      ref={ref as never}
      className={`hc-reveal${seen ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

export function SectionHead({
  eyebrow,
  title,
  description,
  action,
  id,
}: {
  eyebrow: string
  title: ReactNode
  description?: string
  action?: ReactNode
  id?: string
}) {
  return (
    <div className={`hc-head${action ? ' hc-head--split' : ''}`}>
      <div>
        <MaskedText as="p" className="hc-eyebrow">
          {eyebrow}
        </MaskedText>
        <MaskedText
          as="h2"
          className="hc-title"
          id={id}
          style={{ marginBlockStart: 18 }}
        >
          {title}
        </MaskedText>
        {description ? (
          <MaskedText as="p" className="hc-lead" style={{ marginBlockStart: 16 }}>
            {description}
          </MaskedText>
        ) : null}
      </div>
      {action}
    </div>
  )
}

export const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const Star = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2l2.9 6.2 6.6.9-4.8 4.7 1.2 6.7L12 17.3 6.1 20.5l1.2-6.7-4.8-4.7 6.6-.9z" />
  </svg>
)
