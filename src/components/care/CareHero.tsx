import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { MaskedText } from './careUi'

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : 'tel:+998902732301'
}

/**
 * The clinical claim is present from the first frame. The institute's real
 * staff identities anchor the right side while scroll adds a restrained
 * camera push-in without moving or tilting individual faces.
 */
export default function CareHero() {
  const { t } = useLanguage()
  const c = t.homeCare
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    let frame = 0

    const render = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const travel = Math.max(rect.height - window.innerHeight, 1)
      const progress = reduce ? 0 : Math.min(1, Math.max(0, -rect.top / travel))

      section.style.setProperty('--hero-progress', progress.toFixed(4))
      section.style.setProperty('--hero-dna-opacity', '1')
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    render()

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [reduce])

  return (
    <section ref={sectionRef} className="hc-hero hc-hero--dna" aria-labelledby="hc-hero-title">
      <div ref={trackRef} className="hc-hero__track">
        <div className="hc-hero__sticky">
          <div className="hc-hero__aurora" aria-hidden />

          <div className="hc-hero__dna hc-hero__team">
            <img
              src="/images/medical/fjsti-real-team-collage-flat-v1.webp"
              alt={c.imageAlt}
              width={1800}
              height={1970}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <span aria-hidden />
          </div>

          <div className="hc-shell hc-hero__stage">
            <div className="hc-hero__copy">
              <MaskedText as="p" className="hc-eyebrow">
                {c.eyebrow}
              </MaskedText>
              <MaskedText as="h1" id="hc-hero-title" className="hc-display">
                {c.titleLead} <em>{c.titleEm}</em>
              </MaskedText>
              <MaskedText as="p" className="hc-lead">
                {c.lead}
              </MaskedText>

              <div className="hc-hero__cta">
                <a className="hc-btn" href="/contacts?intent=booking">
                  {c.ctaPrimary}
                </a>
                <a
                  className="hc-btn hc-btn--ghost"
                  href={telHref(t.topBar.phone)}
                  aria-label={`${t.topBar.badge}: ${t.topBar.phone}`}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M7.2 3.5l2.1 4.1-1.8 1.8c1.1 2.4 3 4.3 5.4 5.4l1.8-1.8 4.1 2.1-.8 4a2 2 0 01-2 1.6C8.9 20.7 3.3 15.1 3.3 8a2 2 0 011.6-2z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t.topBar.phone}
                </a>
              </div>
            </div>

            <div className="hc-hero__cue" aria-hidden>
              <span />
              Scroll
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
