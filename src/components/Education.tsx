import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { staggerContainer, rise3d, fadeUpSmall, blurUp } from '../lib/animations'

export default function Education() {
  const { t } = useLanguage()

  return (
    <section id="education" className="section section--white">
      <div className="container-main">
        <Reveal variants={blurUp}>
          <SectionHeader
            label={t.education.label}
            title={<>{t.education.title1} <em>{t.education.titleEm}</em></>}
            description={t.education.description}
            accent="#059669"
          />
        </Reveal>

        <motion.div
          className="stat-row education-stats"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05, margin: '120px 0px' }}
        >
          {t.education.stats.map(([v, l], i) => (
            <motion.div key={i} className="stat-row__item" variants={fadeUpSmall}>
              <div className="stat-row__value">{v}</div>
              <div className="stat-row__label">{l}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="education-tracks grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05, margin: '120px 0px' }}
        >
          {t.education.tracks.map((track, i) => (
            <motion.div
              key={i}
              variants={rise3d}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="card track-card"
              style={{ '--track-color': track.color, borderTopColor: track.color } as CSSProperties}
            >
              <div className="track-card__icon" style={{ background: `${track.color}15`, color: track.color }}>
                {track.icon}
              </div>
              <div className="section-label" style={{ color: track.color, marginBottom: 6, fontSize: 10 }}>
                {t.education.programsLabel}
              </div>
              <h3 className="track-card__title">{track.audience}</h3>
              <div style={{ flex: 1 }}>
                {track.programs.map((prog, j) => (
                  <div key={j} className="track-card__program">
                    <div className="track-card__program-name">{prog.name}</div>
                    <div className="track-card__program-meta">
                      <span>{prog.duration}</span>
                      <span style={{ color: track.color, fontWeight: 700 }}>{prog.spots}</span>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#contacts" className="btn-ghost" style={{ marginTop: 10, color: track.color, fontWeight: 600 }}>
                {track.cta} →
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
