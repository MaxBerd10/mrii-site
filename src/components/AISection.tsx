import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { blurUp, rise3d } from '../lib/animations'
import { media } from '../data/media'
import { AI_PRODUCT_SLUGS } from '../data/aiDetails'

const PRODUCT_IMAGES = Object.values(media.ai)

export default function AISection() {
  const { t } = useLanguage()
  const [active, setActive] = useState(0)
  const p = t.ai.products[active]
  const productHref = `/ai/${AI_PRODUCT_SLUGS[active]}`

  return (
    <section id="ai" className="section section--muted">
      <div className="container-main">
        <Reveal variants={blurUp}>
          <SectionHeader
            label={t.ai.label}
            title={<>{t.ai.title1} <em>{t.ai.titleEm}</em></>}
            description={t.ai.description}
            accent="#5B4CDB"
          />
        </Reveal>

        <div className="product-tabs" role="tablist">
          {t.ai.products.map((prod, i) => (
            <motion.button
              key={prod.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-controls={`ai-panel-${i}`}
              id={`ai-tab-${i}`}
              className={`product-tab ${active === i ? 'product-tab--active' : ''}`}
              style={active === i ? { borderColor: prod.tagColor } : undefined}
              onClick={() => setActive(i)}
              whileTap={{ scale: 0.97 }}
            >
              {active === i && (
                <motion.span
                  layoutId="product-tab-active"
                  className="product-tab__glow"
                  style={{ background: `${prod.tagColor}14` }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                />
              )}
              <span className="product-tab__thumb">
                <img src={PRODUCT_IMAGES[i]} alt="" loading="lazy" />
              </span>
              <span className="product-tab__copy">
                <span
                  className="product-tab__tag"
                  style={{ color: active === i ? prod.tagColor : '#6B7280' }}
                >
                  {prod.tag}
                </span>
                <span className="product-tab__name">{prod.name}</span>
              </span>
            </motion.button>
          ))}
        </div>

        <motion.div
          id={`ai-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`ai-tab-${active}`}
          className="ai-console"
          variants={rise3d}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05, margin: '120px 0px' }}
        >
          <div className="ai-console__visual" style={{ position: 'relative', minHeight: 280, overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={`img-${active}`}
                src={PRODUCT_IMAGES[active]}
                alt={p.name}
                className="ai-console__photo"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            </AnimatePresence>
            <div className="ai-console__shade" aria-hidden />
            <motion.div
              key={`metric-${active}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="ai-console__metric"
            >
              <div className="ai-console__metric-value" style={{ color: p.tagColor }}>{p.metric}</div>
              <div className="ai-console__metric-label">{p.metricLabel}</div>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`body-${active}`}
              className="ai-console__body card--pad"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.35 }}
            >
              <span
                className="badge badge--accent"
                style={{ color: p.tagColor, background: `${p.tagColor}15` }}
              >
                {p.tag}
              </span>
              <h3 className="ai-console__title">{p.name}</h3>
              <p className="ai-console__desc">{p.desc}</p>
              <ul className="ai-console__features">
                {p.features.map((f) => (
                  <li key={f}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <circle cx="8" cy="8" r="8" fill={`${p.tagColor}20`} />
                      <path d="M5 8l2 2 4-4" stroke={p.tagColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="btn-group">
                <a href={`${productHref}#ai-demo`} className="btn-accent" style={{ background: p.tagColor }}>{t.ai.demoBtn}</a>
                <a href={productHref} className="btn-outline btn-sm">{t.ai.casesBtn}</a>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
