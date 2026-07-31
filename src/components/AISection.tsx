import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import Reveal from './ui/Reveal'
import { blurUp } from '../lib/animations'
import { AI_PRODUCT_SLUGS } from '../data/aiDetails'
import { AISHIFOKOR_URL } from '../data/aiPlatform'
import { AISHIFOKOR_COPY } from '../data/aiShifokorCopy'
import { ClinicalAiHero } from './ui/clinical-ai-hero'
import '../styles/ai-spline.css'
import { accentInk } from '../lib/accent'

const AI_HERO_IMAGES: Record<string, string> = {
  'doctor-assistant': '/images/ai/doctor-assistant-hero-v3.webp',
  radiology: '/images/ai/radiology-hero-v1.webp',
  ultrasound: '/images/ai/ultrasound-hero-v1.webp',
  'clinical-research': '/images/ai/clinical-research-hero-v1.webp',
}

export default function AISection() {
  const { t, lang } = useLanguage()
  const { home } = useCms()
  const platform = t.homeCare.aiPlatform
  const copy = AISHIFOKOR_COPY[lang]
  const products = home?.aiProducts?.length
    ? home.aiProducts.map((prod) => ({
        id: prod.id || prod.slug,
        name: prod.name,
        tag: prod.tag,
        tagColor: prod.tag_color,
        desc: prod.desc,
        features: prod.features,
        metric: prod.metric,
        metricLabel: prod.metric_label,
        slug: prod.slug,
      }))
    : t.ai.products.map((prod, i) => ({
        ...prod,
        slug: AI_PRODUCT_SLUGS[i],
      }))
  const p = products[0]
  const heroImage = AI_HERO_IMAGES[p?.slug] ?? AI_HERO_IMAGES['doctor-assistant']

  return (
    <section id="ai" className="section section--muted">
      <div className="container-main">
        <Reveal variants={blurUp}>
          <a className="ai-platform-strip" href={AISHIFOKOR_URL}>
            <strong>{platform.brand}</strong>
            <span>{platform.title}</span>
            <em>{platform.cta} →</em>
          </a>
        </Reveal>

        <Reveal variants={blurUp}>
          <div className="ai-spline-wrap">
            <ClinicalAiHero
              productName={p.name}
              productTag={p.tag}
              productDescription={p.desc}
              metric={p.metric}
              metricLabel={p.metricLabel}
              demoLabel={t.ai.platformBtn}
              detailLabel={t.ai.casesBtn}
              demoHref={AISHIFOKOR_URL}
              detailHref={AISHIFOKOR_URL}
              imageSrc={heroImage}
              accent={accentInk(p.tagColor)}
            />
          </div>
        </Reveal>

        <Reveal variants={blurUp}>
          <div className="ai-stats" aria-label={copy.statsTitle}>
            {copy.stats.map((stat) => (
              <div key={stat.label} className="ai-stats__item">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal variants={blurUp}>
          <header className="ai-caps__head">
            <h2>{copy.capsTitle}</h2>
            <p>{copy.capsSubtitle}</p>
          </header>
          <div className="ai-caps">
            {copy.caps.map((cap) => (
              <article key={cap.title} className="ai-caps__card">
                <span className="ai-caps__dot" aria-hidden />
                <strong>{cap.title}</strong>
                <p>{cap.desc}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal variants={blurUp}>
          <header className="ai-flow__head">
            <h2>{copy.flowTitle}</h2>
            <p>{copy.flowSubtitle}</p>
          </header>
          <ol className="ai-flow">
            {copy.steps.map((step, i) => (
              <li key={step.title} className="ai-flow__step">
                <span className="ai-flow__num">{String(i + 1).padStart(2, '0')}</span>
                <div className="ai-flow__body">
                  <div className="ai-flow__row">
                    <strong>{step.title}</strong>
                    <span className="ai-flow__duration">{step.duration}</span>
                  </div>
                  <p>{step.desc}</p>
                  <ul>
                    {step.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal variants={blurUp}>
          <a className="ai-banner" href={AISHIFOKOR_URL}>
            <div className="ai-banner__copy">
              <strong>{copy.bannerTitle}</strong>
              <span>{copy.bannerSubtitle}</span>
            </div>
            <span className="ai-banner__cta">
              {copy.bannerCta} <em aria-hidden>→</em>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
