import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useCms } from '../../cms/CmsContext'
import { useMobileLayout } from '../../hooks/useMobileLayout'
import { MaskedText } from './careUi'
import { FEATURE_ICONS, IconCalendar, TRUST_ICONS } from './CareHeroIcons'

import { CLINIC_PHONE_TEL } from '../../data/clinicContact'
import { cmsLocalizedText } from '../../lib/cmsLocalized'

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : `tel:${CLINIC_PHONE_TEL}`
}

/**
 * The clinical claim is present from the first frame. The institute's real
 * staff identities anchor the right side while scroll adds a restrained
 * camera push-in without moving or tilting individual faces.
 */
export default function CareHero() {
  const { contentLang, t } = useLanguage()
  const c = t.homeCare
  const { home } = useCms()
  const cms = home?.homepage
  const cmsText = (value: string | undefined, fallback: string) =>
    cmsLocalizedText(contentLang, value, fallback)
  const cmsTrust =
    contentLang === 'uz' && cms?.metrics?.every((item) => item.value && item.label)
      ? cms.metrics
      : c.trust
  const hero = {
    eyebrow: cmsText(cms?.eyebrow, c.eyebrow),
    titleLead: cmsText(cms?.title_lead, c.titleLead),
    titleEm: cmsText(cms?.title_em, c.titleEm),
    lead: cmsText(cms?.lead, c.lead),
    image: cms?.team_image || '/images/medical/fjsti-real-team-collage-flat-smooth-white-v3.webp',
    trust: cmsTrust,
  }
  const reduce = useReducedMotion()
  const isMobile = useMobileLayout()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const resetMobile = () => {
      section.style.setProperty('--hero-progress', '0')
      section.style.setProperty('--hero-dna-opacity', '1')
    }

    if (isMobile) {
      resetMobile()
      return
    }

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
  }, [isMobile, reduce])

  return (
    <section ref={sectionRef} className="hc-hero hc-hero--dna" aria-labelledby="hc-hero-title">
      <div ref={trackRef} className="hc-hero__track">
        <div className="hc-hero__sticky">
          <div className="hc-hero__aurora" aria-hidden />

          <div className="hc-hero__blobs" aria-hidden>
            <span className="hc-hero__blob hc-hero__blob--a" />
            <span className="hc-hero__blob hc-hero__blob--b" />
            <span className="hc-hero__blob hc-hero__blob--c" />
            <span className="hc-hero__dots hc-hero__dots--a" />
            <span className="hc-hero__dots hc-hero__dots--b" />
            <svg className="hc-hero__spark hc-hero__spark--a" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12z" />
            </svg>
            <svg className="hc-hero__spark hc-hero__spark--b" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12z" />
            </svg>
            <svg className="hc-hero__spark hc-hero__spark--c" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12z" />
            </svg>
            <span className="hc-hero__plus hc-hero__plus--a">+</span>
            <span className="hc-hero__plus hc-hero__plus--b">+</span>
            <span className="hc-hero__plus hc-hero__plus--c">+</span>
            <span className="hc-hero__plus hc-hero__plus--d">+</span>
          </div>

          <div className="hc-hero__dna hc-hero__team">
            <img
              src={hero.image}
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
              <MaskedText as="p" className="hc-eyebrow" immediate>
                {hero.eyebrow}
              </MaskedText>
              <MaskedText as="h1" id="hc-hero-title" className="hc-display" immediate>
                {hero.titleLead} <em>{hero.titleEm}</em>
              </MaskedText>
              <MaskedText as="p" className="hc-lead" immediate>
                {hero.lead}
              </MaskedText>

              <div className="hc-hero__cta">
                <a className="hc-btn" href="/contacts?intent=booking">
                  <IconCalendar />
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

              <dl className="hc-trust hc-trust--hero">
                {hero.trust.map((item, index) => {
                  const Icon = TRUST_ICONS[index] ?? TRUST_ICONS[0]
                  return (
                    <div key={item.label} className="hc-trust__item">
                      <span className="hc-trust__icon" aria-hidden>
                        <Icon />
                      </span>
                      <dt className="hc-trust__value">{item.value}</dt>
                      <dd className="hc-trust__label">{item.label}</dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          </div>

          <div className="hc-shell hc-hero__features" aria-label={c.heroFeatures[0]?.title}>
            {c.heroFeatures.map((feature, index) => {
              const Icon = FEATURE_ICONS[index] ?? FEATURE_ICONS[0]
              return (
                <article key={feature.title} className="hc-hero__feature">
                  <span className="hc-hero__feature-icon" aria-hidden>
                    <Icon />
                  </span>
                  <h2 className="hc-hero__feature-title">{feature.title}</h2>
                  <p className="hc-hero__feature-desc">{feature.desc}</p>
                </article>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
