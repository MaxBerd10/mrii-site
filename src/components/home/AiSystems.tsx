import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { media } from '../../data/media'
import { AISHIFOKOR_URL } from '../../data/aiPlatform'
import HdHead from './HdHead'
import { settle, inView } from '../../lib/homeDarkMotion'

/** Each product gets its own signal colour and its own specimen render. */
const PRODUCT_VISUALS: Record<string, { signal: string; img: string }> = {
  doctor: { signal: 'var(--hd-cyan)', img: media.ai.doctor },
  radiology: { signal: 'var(--hd-blue)', img: media.ai.radiology },
  ultrasound: { signal: 'var(--hd-green)', img: media.ai.ultrasound },
  'clinical-research': { signal: 'var(--hd-violet-lt)', img: media.ai.clinicalResearch },
}

/** CH.02 — the four AI systems actually running in the clinic. Alternating rows. */
export default function AiSystems() {
  const { t } = useLanguage()
  const copy = t.homeDark.ai

  return (
    <section className="hd-section hd-ai" aria-labelledby="hd-ai-title">
      <div className="container-main">
        <HdHead
          channel={copy.channel}
          title={
            <span id="hd-ai-title">
              {copy.title1} <em>{copy.titleEm}</em>
            </span>
          }
          description={copy.description}
          action={
            <a href="/ai" className="hd-more">
              {copy.viewAll} <span aria-hidden>→</span>
            </a>
          }
        />

        <div className="hd-ai__list">
          {t.ai.products.map((product) => {
            const visual = PRODUCT_VISUALS[product.id] ?? PRODUCT_VISUALS.doctor
            return (
              <motion.article
                key={product.id}
                className="hd-panel hd-ai__row"
                style={{ '--hd-signal': visual.signal } as CSSProperties}
                variants={settle}
                initial="hidden"
                whileInView="show"
                viewport={inView}
              >
                <div className="hd-ai__body">
                  <span className="hd-ai__tag">{product.tag}</span>
                  <h3 className="hd-ai__name">{product.name}</h3>
                  <p className="hd-ai__desc">{product.desc}</p>

                  <ul className="hd-ai__features" aria-label={copy.featuresLabel}>
                    {product.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>

                  <div className="hd-ai__foot">
                    <div className="hd-ai__metric">
                      <strong className="hd-value">{product.metric}</strong>
                      <span>{product.metricLabel}</span>
                    </div>
                    <a href={AISHIFOKOR_URL} className="hd-more">
                      {copy.cta} <span aria-hidden>→</span>
                    </a>
                  </div>
                </div>

                <div className="hd-ai__visual" aria-hidden>
                  <img src={visual.img} alt="" loading="lazy" className="hd-ai__img" />
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
