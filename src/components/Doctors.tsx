import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { staggerContainer, rise3d, blurUp } from '../lib/animations'
import { media } from '../data/media'

const DOCTOR_IMAGES = Object.values(media.doctors)

export default function Doctors() {
  const { t } = useLanguage()

  return (
    <section id="doctors" className="section section--muted doctors-section">
      <div className="container-main">
        <Reveal variants={blurUp}>
          <SectionHeader
            label={t.doctors.label}
            title={<>{t.doctors.title1}<br />{t.doctors.title2}</>}
            action={<a href="#contacts" className="btn-ghost doctors-section__all">{t.doctors.allBtn}</a>}
          />
        </Reveal>

        <motion.div
          className="doctor-grid"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05, margin: '120px 0px' }}
        >
          {t.doctors.list.map((doc, i) => (
            <motion.article
              key={doc.name}
              className="doctor-card"
              variants={rise3d}
              whileHover={{ y: -7, transition: { type: 'spring', stiffness: 260, damping: 20 } }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="doctor-card__media">
                <img src={DOCTOR_IMAGES[i]} alt={doc.name} loading="lazy" />
                <span className="doctor-card__badge">{doc.specialty}</span>
              </div>

              <div className="doctor-card__body">
                <h3 className="doctor-card__name">{doc.name}</h3>
                <p className="doctor-card__role">{doc.role}</p>
                <p className="doctor-card__exp">{doc.exp}</p>

                <div className="doctor-card__stats">
                  <div className="doctor-card__stat">
                    <strong style={{ color: doc.color }}>{doc.papers}</strong>
                    <span>{t.doctors.papers}</span>
                  </div>
                  <div className="doctor-card__stat">
                    <strong style={{ color: doc.color }}>{doc.studies}</strong>
                    <span>{t.doctors.studies}</span>
                  </div>
                </div>

                <a href="#contacts" className="doctor-card__cta">
                  {t.doctors.bookBtn}
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
