import { useMemo, type CSSProperties } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { buildClinicSpecialties } from '../../data/clinicSpecialties'
import { doctorProfiles } from '../../data/doctors'
import { AISHIFOKOR_URL } from '../../data/aiPlatform'
import { Check, Reveal, SectionHead, Star, useReveal } from './careUi'

const STEP_ACCENTS = ['#79c8ff', '#6fa8ff', '#8f8cff', '#55d7c1', '#37d1a4']

function splitCompareLine(text: string): { lead: string; detail?: string } {
  const dash = text.includes(' — ') ? ' — ' : text.includes(' – ') ? ' – ' : null
  if (!dash) return { lead: text }
  const [lead, detail] = text.split(dash)
  if (!detail?.trim()) return { lead: text }
  return { lead: lead.trim(), detail: detail.trim() }
}

function CompareCellLabel({ children, ours }: { children: string; ours?: boolean }) {
  return (
    <span className={`hc-compare__cell-label${ours ? ' is-ours' : ''}`}>{children}</span>
  )
}

function CompareBeforeText({ text }: { text: string }) {
  return (
    <span className="hc-compare__before-copy">
      <span className="hc-compare__before-lead">{text}</span>
    </span>
  )
}

function CompareAfterText({ text }: { text: string }) {
  const { lead, detail } = splitCompareLine(text)
  return (
    <span className="hc-compare__after-body">
      <Check />
      <span className="hc-compare__after-copy">
        <strong className="hc-compare__after-lead">{lead}</strong>
        {detail ? <span className="hc-compare__after-detail">{detail}</span> : null}
      </span>
    </span>
  )
}

const AI_FEATURE_ICONS = [
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 4h8l2 4v12a2 2 0 01-2 2H8a2 2 0 01-2-2V8l2-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10h3l2 3 3-5 2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 4h10v16H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 8h6M10 12h6M10 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
]

const AI_CLINIC_PHOTO = '/images/clinic-gallery/consultation.webp'

/* ======================================================================
 * AiShifokor — clinic-first, but with real photo and readable feature tiles.
 * ==================================================================== */

export function CareAi() {
  const { t } = useLanguage()
  const platform = t.homeCare.aiPlatform
  const features = t.homeCare.aiFeatures

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
        />

        <Reveal>
          <div className="hc-ai-showcase">
            <div className="hc-ai-showcase__card">
              <p className="hc-ai-showcase__eyebrow">{platform.brand}</p>
              <h3 className="hc-ai-showcase__title">{platform.title}</h3>
              <p className="hc-ai-showcase__lead">{platform.lead}</p>
              <ul className="hc-ai-showcase__points">
                {platform.points.map((point) => (
                  <li key={point}>
                    <Check />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="hc-ai-showcase__actions">
                <a className="hc-btn" href={AISHIFOKOR_URL}>
                  {platform.cta}
                </a>
                <a className="hc-more" href="/ai">
                  {platform.secondary} <span aria-hidden>→</span>
                </a>
              </div>
            </div>

            <figure className="hc-ai-showcase__visual">
              <img
                src={AI_CLINIC_PHOTO}
                alt={t.homeCare.aiPhotoAlt}
                width={960}
                height={1200}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{t.homeCare.aiPhotoCaption}</figcaption>
            </figure>
          </div>
        </Reveal>

        <div className="hc-ai-features">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 70}>
              <article className="hc-ai-feature">
                <span className="hc-ai-feature__icon">{AI_FEATURE_ICONS[i]}</span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </article>
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
                      <td className="hc-compare__before">
                        <CompareCellLabel>{c.colA}</CompareCellLabel>
                        <CompareBeforeText text={row.before} />
                      </td>
                      <td className="hc-compare__after">
                        <CompareCellLabel ours>{c.colB}</CompareCellLabel>
                        <CompareAfterText text={row.after} />
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

  const specialties = useMemo(
    () => buildClinicSpecialties(t.clinic.specialties),
    [t.clinic.specialties],
  )

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
