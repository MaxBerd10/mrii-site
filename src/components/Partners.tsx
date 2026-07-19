import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import Reveal from './ui/Reveal'
import { staggerContainer, rise3d, blurUp } from '../lib/animations'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function Partners() {
  const { t } = useLanguage()

  return (
    <section className="section section--muted partners-section">
      <div className="container-main">
        <Reveal variants={blurUp}>
          <p className="section-label partners-section__label">{t.partners.trusted}</p>
        </Reveal>

        <div className="partners-track-wrap">
          <div className="partners-track">
            {[...t.partners.partnerNames, ...t.partners.partnerNames].map((name, i) => (
              <span key={`${name}-${i}`} className="partners-track__name">{name}</span>
            ))}
          </div>
        </div>

        <Reveal variants={blurUp}>
          <h2 className="section-title partners-section__title">{t.partners.reviewsLabel}</h2>
        </Reveal>

        <motion.div
          className="testimonials-grid"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {t.partners.testimonials.map((item) => (
            <motion.blockquote
              key={item.author}
              className="testimonial-card"
              variants={rise3d}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              style={{ borderLeftColor: item.color }}
            >
              <svg className="testimonial-card__quote" width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden style={{ color: item.color }}>
                <path d="M14 9c-4 1.5-7 5-7 10v6h9v-9h-4c0-3 1-5 4-6l-2-1zM29 9c-4 1.5-7 5-7 10v6h9v-9h-4c0-3 1-5 4-6l-2-1z" fill="currentColor" opacity="0.22" />
              </svg>
              <p className="testimonial-card__text">"{item.quote}"</p>
              <div className="testimonial-card__meta">
                <span className="testimonial-card__avatar" style={{ background: `${item.color}18`, color: item.color }}>
                  {initials(item.author)}
                </span>
                <span className="testimonial-card__info">
                  <span className="testimonial-card__author">{item.author}</span>
                  <span className="testimonial-card__role">{item.role}</span>
                </span>
              </div>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
