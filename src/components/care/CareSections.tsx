import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { media } from '../../data/media'
import { specialtyDetails } from '../../data/specialtyDetails'
import { doctorProfiles } from '../../data/doctors'
import { Check, Reveal, SectionHead, Star, useReveal } from './careUi'

type ClinicImageKey = keyof typeof media.clinic

/**
 * The AI products get line icons rather than the `-3d.png` renders used
 * elsewhere: those have baked-in backgrounds and read as muddy dark chips at
 * card size, which is the opposite of what this page is trying to feel like.
 * The organ renders in the departments grid are transparent, so they stay.
 */
const AI_ICONS: Record<string, ReactNode> = {
  doctor: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 13a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  radiology: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M7 13h2l1.6-3.5L13 16l1.4-3H17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ultrasound: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 18c3-9 13-9 16 0M8 18c1.8-5 6.2-5 8 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  'clinical-research': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 3v6.5L4.5 18A2 2 0 006.3 21h11.4a2 2 0 001.8-3L15 9.5V3M8 3h8M7.5 15h9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

const STEP_ACCENTS = ['#79c8ff', '#6fa8ff', '#8f8cff', '#55d7c1', '#37d1a4']

function pointAiCard(event: ReactPointerEvent<HTMLAnchorElement>) {
  if (event.pointerType === 'touch') return

  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))

  card.classList.add('is-pointing')
  card.style.setProperty('--card-light-x', `${(x * 100).toFixed(2)}%`)
  card.style.setProperty('--card-light-y', `${(y * 100).toFixed(2)}%`)
  card.style.setProperty('--card-rotate-x', `${((0.5 - y) * 5).toFixed(2)}deg`)
  card.style.setProperty('--card-rotate-y', `${((x - 0.5) * 6).toFixed(2)}deg`)
}

function clearAiCard(card: HTMLAnchorElement) {
  card.classList.remove('is-pointing')
  card.style.setProperty('--card-light-x', '50%')
  card.style.setProperty('--card-light-y', '50%')
  card.style.setProperty('--card-rotate-x', '0deg')
  card.style.setProperty('--card-rotate-y', '0deg')
}

function resetAiCard(event: SyntheticEvent<HTMLAnchorElement>) {
  clearAiCard(event.currentTarget)
}

/* ======================================================================
 * AI systems — what the machine half actually is, as four real products.
 * ==================================================================== */

export function CareAi() {
  const { t } = useLanguage()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resetActiveCard = (event?: PointerEvent) => {
      const active = gridRef.current?.querySelector<HTMLAnchorElement>('.hc-card.is-pointing')
      if (!active) return
      if (event?.target instanceof Node && active.contains(event.target)) return
      clearAiCard(active)
    }
    const resetOnExit = () => resetActiveCard()

    document.addEventListener('pointermove', resetActiveCard, { passive: true })
    window.addEventListener('scroll', resetOnExit, { passive: true })
    window.addEventListener('blur', resetOnExit)

    return () => {
      document.removeEventListener('pointermove', resetActiveCard)
      window.removeEventListener('scroll', resetOnExit)
      window.removeEventListener('blur', resetOnExit)
    }
  }, [])

  return (
    <section className="hc-section hc-section--ai" aria-labelledby="hc-ai-title">
      <div className="hc-shell">
        <SectionHead
          eyebrow={t.homeCare.aiEyebrow}
          id="hc-ai-title"
          title={
            <>
              {t.homeCare.aiTitle1} <em>{t.homeCare.aiTitleEm}</em>
            </>
          }
          description={t.homeCare.aiDescription}
          action={
            <a className="hc-more" href="/ai">
              {t.homeDark.ai.viewAll} <span aria-hidden>→</span>
            </a>
          }
        />

        <div ref={gridRef} className="hc-ai__grid">
          {t.ai.products.map((product, i) => (
            <Reveal key={product.id} delay={i * 70}>
              <a
                className="hc-card"
                href={`/ai/${product.id === 'doctor' ? 'doctor-assistant' : product.id}`}
                style={{ height: '100%' }}
                onPointerMove={pointAiCard}
                onPointerLeave={resetAiCard}
                onPointerCancel={resetAiCard}
                onMouseLeave={resetAiCard}
                onBlur={resetAiCard}
              >
                <span className="hc-card__icon">{AI_ICONS[product.id] ?? AI_ICONS.doctor}</span>
                <h3 className="hc-card__name">{product.name}</h3>
                <p className="hc-card__desc">{product.desc}</p>
                <p className="hc-card__metric">
                  <strong>{product.metric}</strong>
                  <span>{product.metricLabel}</span>
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ======================================================================
 * Comparison — a real table, because these are paired facts and the reader
 * is scanning row by row for the one that matches their own experience.
 * ==================================================================== */

export function CareCompare() {
  const { t } = useLanguage()
  const c = t.homeDark.compare

  return (
    <section className="hc-section hc-section--tint hc-section--compare" aria-labelledby="hc-compare-title">
      <div className="hc-shell">
        <SectionHead
          eyebrow={t.homeCare.compareEyebrow}
          id="hc-compare-title"
          title={
            <>
              {c.title1} <em>{c.titleEm}</em>
            </>
          }
          description={c.description}
        />

        <Reveal>
          <div className="hc-compare">
            <div className="hc-compare__scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="sr-only">—</span>
                    </th>
                    <th scope="col">{c.colA}</th>
                    <th scope="col" className="is-ours">
                      {c.colB}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {c.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td className="hc-compare__before">{row.before}</td>
                      <td className="hc-compare__after">
                        <span>
                          <Check />
                          {row.after}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ======================================================================
 * Patient journey — the numbers earn their place here: this is a real
 * sequence and the reader needs to know what happens next.
 * ==================================================================== */

function Step({
  step,
  index,
}: {
  step: { num: string; title: string; meta: string; desc: string }
  index: number
}) {
  const { ref, seen } = useReveal<HTMLDivElement>(0.4)

  return (
    <div
      ref={ref}
      className={`hc-step${seen ? ' is-in' : ''}`}
      style={{ '--step-accent': STEP_ACCENTS[index % STEP_ACCENTS.length] } as CSSProperties}
    >
      <span className="hc-step__dot" aria-hidden>
        {step.num}
      </span>
      <div>
        <h3 className="hc-step__title">{step.title}</h3>
        <span className="hc-step__meta">{step.meta}</span>
      </div>
      <p className="hc-step__desc">{step.desc}</p>
    </div>
  )
}

export function CarePath() {
  const { t } = useLanguage()
  const c = t.homeDark.path

  return (
    <section className="hc-section hc-section--path" aria-labelledby="hc-path-title">
      <div className="hc-shell">
        <SectionHead
          eyebrow={t.homeCare.pathEyebrow}
          id="hc-path-title"
          title={
            <>
              {c.title1} <em>{c.titleEm}</em>
            </>
          }
          description={c.description}
        />

        <div className="hc-path">
          {c.steps.map((step, index) => (
            <Step key={step.num} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ======================================================================
 * Departments — the one dense passage, so it is followed by a quiet one.
 * ==================================================================== */

export function CareServices() {
  const { t } = useLanguage()
  const c = t.homeDark.services

  const specialties = useMemo(() => {
    const slugs = specialtyDetails.map((d) => d.slug)
    return t.clinic.specialties.map((s, i) => {
      const slug = slugs[i] ?? `specialty-${i}`
      return {
        slug,
        name: s.name,
        count: s.count,
        image: media.clinic[slug as ClinicImageKey] ?? media.clinic.therapy,
      }
    })
  }, [t.clinic.specialties])

  return (
    <section className="hc-section hc-section--tint hc-section--services" aria-labelledby="hc-services-title">
      <div className="hc-shell">
        <SectionHead
          eyebrow={t.homeCare.servicesEyebrow}
          id="hc-services-title"
          title={
            <>
              {c.title1} <em>{c.titleEm}</em>
            </>
          }
          description={c.description}
          action={
            <a className="hc-more" href="/clinic">
              {c.viewAll} <span aria-hidden>→</span>
            </a>
          }
        />

        <div className="hc-services__grid">
          {specialties.map((s, i) => (
            <Reveal key={s.slug} delay={Math.min(i, 8) * 40}>
              <a className="hc-svc" href={`/clinic/${s.slug}`}>
                <img className="hc-svc__img" src={s.image} alt="" loading="lazy" decoding="async" />
                <span>
                  <span className="hc-svc__name">{s.name}</span>
                  <span className="hc-svc__count">
                    {s.count} {c.doctorsLabel}
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ======================================================================
 * Doctors — the heroes. Portraits are large and uncropped at the face,
 * because this is the section that answers "who will actually see me".
 * ==================================================================== */

export function CareDoctors() {
  const { t, contentLang } = useLanguage()
  const c = t.homeDark.team
  const featured = doctorProfiles.slice(0, 8)

  return (
    <section className="hc-section" aria-labelledby="hc-docs-title">
      <div className="hc-shell">
        <SectionHead
          eyebrow={t.homeCare.doctorsEyebrow}
          id="hc-docs-title"
          title={
            <>
              {c.title1} <em>{c.titleEm}</em>
            </>
          }
          description={c.description}
          action={
            <a className="hc-more" href="/doctors">
              {c.viewAll} <span aria-hidden>→</span>
            </a>
          }
        />

        <div className="hc-docs__grid">
          {featured.map((doc, i) => {
            const info = doc.content[contentLang]
            return (
              <Reveal key={doc.slug} delay={Math.min(i, 6) * 60}>
                <a className="hc-doc" href={`/doctors/${doc.slug}`} style={{ height: '100%' }}>
                  <img
                    className="hc-doc__photo"
                    src={doc.photo}
                    alt={info.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="hc-doc__body">
                    <span className="hc-doc__name">{info.name}</span>
                    <span className="hc-doc__spec">{info.specialty}</span>
                    <span className="hc-doc__exp">{info.exp}</span>
                  </span>
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ======================================================================
 * Voices
 * ==================================================================== */

export function CareVoices() {
  const { t } = useLanguage()
  const c = t.homeDark.voices

  return (
    <section className="hc-section hc-section--tint hc-section--voices" aria-labelledby="hc-voices-title">
      <div className="hc-shell">
        <SectionHead
          eyebrow={t.homeCare.voicesEyebrow}
          id="hc-voices-title"
          title={
            <>
              {c.title1} <em>{c.titleEm}</em>
            </>
          }
          description={c.description}
        />

        <div className="hc-voices__grid">
          {t.partners.testimonials.map((q, i) => (
            <Reveal key={q.author} delay={i * 90}>
              <figure className="hc-quote" style={{ height: '100%', margin: 0 }}>
                <span className="hc-quote__stars" aria-label="5 / 5">
                  {Array.from({ length: 5 }, (_, n) => (
                    <Star key={n} />
                  ))}
                </span>
                <blockquote className="hc-quote__text">{q.quote}</blockquote>
                <figcaption className="hc-quote__who">
                  <span className="hc-quote__avatar" style={{ background: q.color }} aria-hidden>
                    {q.author.charAt(0)}
                  </span>
                  <span>
                    <span className="hc-quote__name">{q.author}</span>
                    <span className="hc-quote__role">{q.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ======================================================================
 * FAQ — native <details>, so it works before hydration and with a
 * screen reader without any state of our own.
 * ==================================================================== */

export function CareFaq() {
  const { t } = useLanguage()
  const c = t.homeDark.faq

  return (
    <section className="hc-section hc-section--faq" aria-labelledby="hc-faq-title">
      <div className="hc-shell">
        <SectionHead
          eyebrow={t.homeCare.faqEyebrow}
          id="hc-faq-title"
          title={
            <>
              {c.title1} <em>{c.titleEm}</em>
            </>
          }
          description={c.description}
        />

        <div className="hc-faq">
          {c.items.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <details name="hc-faq">
                <summary>{item.q}</summary>
                <p className="hc-faq__answer">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
