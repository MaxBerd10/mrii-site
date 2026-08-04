import { useEffect, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCms } from '../../cms/CmsContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { CLINIC_PHONE_TEL } from '../../data/clinicContact'
import { refreshScrollTriggersPreservingScroll } from '../../lib/scrollRoute'
import { cn } from '../../lib/utils'
import '../../styles/motion-footer.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(pointer: fine)')
    if (reduceMotion.matches || !finePointer.matches) return

    const moveX = gsap.quickTo(element, 'x', { duration: 0.45, ease: 'power3.out' })
    const moveY = gsap.quickTo(element, 'y', { duration: 0.45, ease: 'power3.out' })
    const rotateX = gsap.quickTo(element, 'rotationX', { duration: 0.45, ease: 'power3.out' })
    const rotateY = gsap.quickTo(element, 'rotationY', { duration: 0.45, ease: 'power3.out' })
    const scale = gsap.quickTo(element, 'scale', { duration: 0.45, ease: 'power3.out' })

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left - rect.width / 2
      const y = event.clientY - rect.top - rect.height / 2

      moveX(x * 0.22)
      moveY(y * 0.22)
      rotateX(-y * 0.08)
      rotateY(x * 0.08)
      scale(1.035)
    }

    const handlePointerLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.9,
        ease: 'elastic.out(1, 0.45)',
        overwrite: true,
      })
    }

    element.addEventListener('pointermove', handlePointerMove)
    element.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      element.removeEventListener('pointermove', handlePointerMove)
      element.removeEventListener('pointerleave', handlePointerLeave)
      gsap.killTweensOf(element)
    }
  }, [])

  return ref
}

function MagneticLink({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useMagnetic<HTMLAnchorElement>()

  return (
    <a ref={ref} className={cn('motion-footer__magnetic', className)} {...props}>
      {children}
    </a>
  )
}

function MagneticButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useMagnetic<HTMLButtonElement>()

  return (
    <button ref={ref} className={cn('motion-footer__magnetic', className)} {...props}>
      {children}
    </button>
  )
}

function MarqueeItem({ items }: { items: string[] }) {
  return (
    <div className="motion-footer__marquee-set" aria-hidden="true">
      {items.map((item, index) => (
        <span className="motion-footer__marquee-item" key={`${item}-${index}`}>
          {item}
          <span className="motion-footer__spark">✦</span>
        </span>
      ))}
    </div>
  )
}

export function CinematicFooter() {
  const { t } = useLanguage()
  const { home } = useCms()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const giantTextRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const settings = home?.settings
  const phone = settings?.phone || t.topBar.phone
  const copyright = settings?.copyright || t.footer.copyright
  const license = settings?.license || t.footer.license
  const phoneHref = `tel:${CLINIC_PHONE_TEL}`
  const marqueeItems = [
    t.nav.clinic,
    t.nav.children.doctors,
    t.nav.ai,
    t.nav.research,
    license,
  ]

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 760px)').matches

    const revealContent = () => {
      gsap.set([giantTextRef.current, headingRef.current, contentRef.current], {
        opacity: 1,
        y: 0,
        yPercent: 0,
        scale: 1,
      })
    }

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          wrapper.classList.toggle('is-active', self.isActive)
          if (self.isActive) revealContent()
        },
        onEnter: revealContent,
      })

      if (reduceMotion || isMobile) {
        revealContent()
        return
      }

      gsap.fromTo(
        giantTextRef.current,
        { yPercent: 18, scale: 0.92 },
        {
          yPercent: 0,
          scale: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 88%',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      )

      gsap.fromTo(
        [headingRef.current, contentRef.current],
        { y: 40 },
        {
          y: 0,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 78%',
            end: 'top 30%',
            scrub: 0.8,
            invalidateOnRefresh: true,
            onLeave: revealContent,
            onEnterBack: revealContent,
          },
        },
      )
    }, wrapper)

    // Lazy images below the fold finish loading long after ScrollTrigger first
    // measures the document, so its cached start/end positions go stale and the
    // scrubbed reveal never reaches its end state — the footer then sits blank
    // at the bottom of the page. Re-measure whenever the height actually
    // changes; comparing against the last value keeps refresh() (which does not
    // resize anything) from feeding the observer back into itself.
    let lastHeight = document.documentElement.scrollHeight
    let refreshFrame = 0
    const observer = new ResizeObserver(() => {
      const height = document.documentElement.scrollHeight
      if (height === lastHeight) return
      lastHeight = height
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => refreshScrollTriggersPreservingScroll())
    })
    observer.observe(document.body)

    // If the footer is already in view on load (short viewport / deep link), show copy immediately.
    requestAnimationFrame(() => {
      const rect = wrapper.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.92) revealContent()
    })

    return () => {
      wrapper.classList.remove('is-active')
      cancelAnimationFrame(refreshFrame)
      observer.disconnect()
      context.revert()
    }
  }, [])

  return (
    <div ref={wrapperRef} className="motion-footer-reveal">
      <footer className="motion-footer" aria-labelledby="motion-footer-title">
        <div className="motion-footer__aurora" aria-hidden="true" />

        <div ref={giantTextRef} className="motion-footer__giant" aria-hidden="true">
          FJSTI
        </div>

        <div className="motion-footer__marquee" aria-hidden="true">
          <div className="motion-footer__marquee-track">
            <MarqueeItem items={marqueeItems} />
            <MarqueeItem items={marqueeItems} />
          </div>
        </div>

        <div className="motion-footer__main">
          <a href="/" className="motion-footer__brand" aria-label={t.nav.home}>
            <img src="/images/fjsti-logo.png" alt="" width="42" height="42" />
            <span>{t.nav.brand}</span>
          </a>

          <h2 ref={headingRef} id="motion-footer-title" className="motion-footer__heading">
            {t.footer.ready}
          </h2>

          <div ref={contentRef} className="motion-footer__content">
            <p className="motion-footer__lead">{t.footer.readyDesc}</p>

            <div className="motion-footer__primary-actions">
              <MagneticLink href={phoneHref} className="motion-footer__pill motion-footer__pill--primary">
                {t.footer.bookBtn}
                <span aria-hidden="true">↗</span>
              </MagneticLink>
              <MagneticLink href="/contacts" className="motion-footer__pill">
                {phone}
              </MagneticLink>
            </div>

            <nav className="motion-footer__nav" aria-label={t.nav.home}>
              <MagneticLink href="/clinic" className="motion-footer__mini-pill">
                {t.nav.clinic}
              </MagneticLink>
              <MagneticLink href="/doctors" className="motion-footer__mini-pill">
                {t.nav.children.doctors}
              </MagneticLink>
              <MagneticLink href="/ai" className="motion-footer__mini-pill">
                {t.nav.ai}
              </MagneticLink>
              <MagneticLink href="/research" className="motion-footer__mini-pill">
                {t.nav.research}
              </MagneticLink>
            </nav>
          </div>
        </div>

        <div className="motion-footer__bottom">
          <p>{copyright}</p>

          <div className="motion-footer__legal">
            <a href="/contacts">{t.footer.privacy}</a>
            <a href="/contacts">{t.footer.terms}</a>
            <a href="/contacts">{t.footer.contactsLink}</a>
          </div>

          <MagneticButton
            type="button"
            className="motion-footer__top-button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={t.backToTop}
            title={t.backToTop}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 11l7-7 7 7M12 4v16" />
            </svg>
          </MagneticButton>
        </div>
      </footer>
    </div>
  )
}

export default CinematicFooter
