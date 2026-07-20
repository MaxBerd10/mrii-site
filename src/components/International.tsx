import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { rise3d, staggerContainer, blurUp } from '../lib/animations'

export default function International() {
  const { t } = useLanguage()
  const { home } = useCms()
  const services = home?.international?.length ? home.international : t.international.services

  return (
    <section id="international" className="section section--white">
      <div className="container-main">
        <Reveal variants={blurUp}>
          <SectionHeader
            label={t.international.label}
            title={<>{t.international.title1} <em>{t.international.titleEm}</em></>}
            description={t.international.description}
          />
        </Reveal>

        <div className="international-languages" style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ color: 'var(--muted-foreground)', marginBottom: 14 }}>{t.international.languagesTitle}</div>
          <div className="flex-row" style={{ gap: 10 }}>
            {t.international.languages.map((l, i) => (
              <div key={i} className="badge" style={{ padding: '10px 18px', fontSize: 13, gap: 8 }}>
                <span style={{ fontSize: 16 }}>{l.flag}</span>
                {l.lang}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="international-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ marginBottom: 36 }}
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="card card--pad international-card"
              variants={rise3d}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 260, damping: 20 } }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: 12 }}>0{i + 1}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, lineHeight: 1.35 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="btn-group">
          <a href="#contacts" className="btn-accent">{t.international.contactBtn}</a>
          <a href="#" className="btn-outline">{t.international.telemedBtn}</a>
        </div>
      </div>
    </section>
  )
}
