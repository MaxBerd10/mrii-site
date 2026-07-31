import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { Check, MaskedText } from './careUi'

const DNA_IMAGE = '/images/medical/dna-isolated-v2.webp'
const DNA_IMAGE_FALLBACK = '/images/medical/dna-isolated-v2.png'

const DNA_PARTICLES = [
  { x: 19, y: 17, size: 4, delay: -1.4, duration: 8.4 },
  { x: 31, y: 8, size: 3, delay: -5.1, duration: 10.2 },
  { x: 72, y: 13, size: 5, delay: -2.8, duration: 9.1 },
  { x: 83, y: 29, size: 3, delay: -6.2, duration: 11.5 },
  { x: 15, y: 39, size: 3, delay: -3.7, duration: 9.8 },
  { x: 89, y: 48, size: 4, delay: -0.8, duration: 8.7 },
  { x: 24, y: 58, size: 5, delay: -4.5, duration: 12.1 },
  { x: 77, y: 66, size: 3, delay: -7.2, duration: 10.8 },
  { x: 10, y: 75, size: 4, delay: -2.2, duration: 9.4 },
  { x: 91, y: 83, size: 5, delay: -5.8, duration: 11.2 },
  { x: 38, y: 91, size: 3, delay: -1.1, duration: 8.9 },
  { x: 66, y: 94, size: 4, delay: -6.6, duration: 10.5 },
] as const

const Cpu = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
    <path
      d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * A scroll-led 2.5D genomic scene.
 *
 * The isolated DNA cutout is the only rotating visual. Rings, particles and
 * light live on separate layers, so no rectangular source-image plane can
 * appear. Continuous motion is paused whenever the scene is offscreen.
 */
export default function CareHarmony() {
  const { t } = useLanguage()
  const c = t.homeCare.harmony
  const sectionRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [isPageVisible, setIsPageVisible] = useState(true)

  const pointerRotateX = useMotionValue(0)
  const pointerRotateY = useMotionValue(0)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(pointerRotateX, { stiffness: 130, damping: 24, mass: 0.7 })
  const rotateY = useSpring(pointerRotateY, { stiffness: 130, damping: 24, mass: 0.7 })
  const parallaxX = useSpring(pointerX, { stiffness: 120, damping: 26, mass: 0.8 })
  const parallaxY = useSpring(pointerY, { stiffness: 120, damping: 26, mass: 0.8 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 34,
    restDelta: 0.001,
  })

  const dnaScale = useTransform(progress, [0, 0.48, 1], [0.94, 1.035, 1.09])
  const dnaY = useTransform(progress, [0, 1], ['2%', '-3%'])
  // Horizontal travel tracks the raw scroll position instead of the softened
  // spring, so the helix responds immediately and sweeps from left to right
  // even during a short scroll.
  const dnaX = useTransform(
    scrollYProgress,
    [0, 0.16, 0.55, 1],
    ['0%', '22%', '84%', '142%'],
  )
  const dnaOpacity = useTransform(progress, [0, 0.38, 0.72, 1], [0.94, 0.88, 0.5, 0.32])
  const introOpacity = useTransform(progress, [0, 0.28, 0.46], [1, 1, 0])
  const introY = useTransform(progress, [0, 0.46], [0, -38])
  const detailOpacity = useTransform(progress, [0.38, 0.57, 1], [0, 1, 1])
  const detailY = useTransform(progress, [0.38, 0.62], [42, 0])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { rootMargin: '12% 0px 12% 0px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updateVisibility = () => setIsPageVisible(!document.hidden)
    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  const resetPointer = () => {
    pointerRotateX.set(0)
    pointerRotateY.set(0)
    pointerX.set(0)
    pointerY.set(0)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5

    pointerRotateX.set(y * -5)
    pointerRotateY.set(x * 7)
    pointerX.set(x * 18)
    pointerY.set(y * 14)
  }

  const isAnimating = Boolean(!reduce && isIntersecting && isPageVisible)

  return (
    <section
      ref={sectionRef}
      className={`hc-harmony-gallery${reduce ? ' is-static' : ''}${
        isAnimating ? ' is-animating' : ''
      }`}
      aria-labelledby="hc-harmony-title"
    >
      <div
        className="hc-harmony-gallery__sticky"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <div className="hc-dna-scene" aria-hidden>
          <div className="hc-dna-scene__grid" />
          <div className="hc-dna-scene__beam hc-dna-scene__beam--one" />
          <div className="hc-dna-scene__beam hc-dna-scene__beam--two" />

          <motion.div
            className="hc-dna-hologram"
            style={
              reduce
                ? undefined
                : {
                    scale: dnaScale,
                    x: dnaX,
                    y: dnaY,
                    opacity: dnaOpacity,
                    rotateX,
                    rotateY,
                  }
            }
          >
            <div className="hc-dna-hologram__shadow" />
            <motion.div
              className="hc-dna-hologram__parallax"
              style={reduce ? undefined : { x: parallaxX, y: parallaxY }}
            >
              <div className="hc-dna-hologram__float">
                <div className="hc-dna-hologram__rings">
                  <i className="hc-dna-hologram__ring hc-dna-hologram__ring--one" />
                  <i className="hc-dna-hologram__ring hc-dna-hologram__ring--two" />
                  <i className="hc-dna-hologram__ring hc-dna-hologram__ring--three" />
                </div>

                <div className="hc-dna-hologram__rotor">
                  <picture>
                    <source srcSet={DNA_IMAGE} type="image/webp" />
                    <img
                      className="hc-dna-hologram__image hc-dna-hologram__image--front"
                      src={DNA_IMAGE_FALLBACK}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>

                <div className="hc-dna-hologram__reflection" />
                <div className="hc-dna-hologram__particles">
                  {DNA_PARTICLES.map((particle, index) => (
                    <i
                      key={`${particle.x}-${particle.y}`}
                      style={
                        {
                          '--particle-x': `${particle.x}%`,
                          '--particle-y': `${particle.y}%`,
                          '--particle-size': `${particle.size}px`,
                          '--particle-delay': `${particle.delay}s`,
                          '--particle-duration': `${particle.duration}s`,
                          '--particle-depth': index % 3,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <span className="hc-dna-hologram__hud hc-dna-hologram__hud--top">
              <i />
              FJSTI · 2008
            </span>
            <span className="hc-dna-hologram__hud hc-dna-hologram__hud--bottom">
              AiShifokor
              <i />
            </span>
          </motion.div>
        </div>

        <div className="hc-harmony-gallery__shade" aria-hidden />

        <motion.div
          className="hc-harmony-gallery__intro"
          style={reduce ? undefined : { opacity: introOpacity, y: introY }}
        >
          <MaskedText as="p" className="hc-harmony-gallery__eyebrow">
            {c.eyebrow}
          </MaskedText>
          <MaskedText as="h2" id="hc-harmony-title">
            {c.title1} <em>{c.titleEm}</em>
          </MaskedText>
          <MaskedText as="p">{c.description}</MaskedText>
        </motion.div>

        <motion.div
          className="hc-harmony-gallery__details"
          style={reduce ? undefined : { opacity: detailOpacity, y: detailY }}
        >
          <div className="hc-harmony-gallery__columns">
            <article>
              <span className="hc-harmony-gallery__tag">
                <Cpu />
                {c.machineTag}
              </span>
              <h3>{c.machineLede}</h3>
              <ul>
                {c.machineItems.map((item) => (
                  <li key={item}>
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <span className="hc-harmony-gallery__tag">{c.clinicalTag}</span>
              <h3>{c.clinicalLede}</h3>
              <ul>
                {c.clinicalItems.map((item) => (
                  <li key={item}>
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <p className="hc-harmony-gallery__verdict">
            <Check />
            {c.verdict}
          </p>
        </motion.div>

        <span className="hc-harmony-gallery__cue" aria-hidden>
          <i />
          Scroll
        </span>
      </div>
    </section>
  )
}
