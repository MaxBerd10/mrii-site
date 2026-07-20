import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import Reveal from './ui/Reveal'
import SoftSurface from './ui/SoftSurface'
import { staggerContainer, blurUp } from '../lib/animations'
import { media } from '../data/media'
import { specialtyDetails } from '../data/specialtyDetails'

const SPECIALTY_IMAGES = Object.values(media.clinic)

function specialtyTone(index: number) {
  return `${[1, 2, 3, 4, 5, 7, 8, 9, 10, 11].includes(index) ? ' clinic-tile--organ' : ''}${[3, 4, 5, 7].includes(index) ? ' clinic-tile--warm' : ''}${[2, 9, 10].includes(index) ? ' clinic-tile--cyan' : ''}${index === 1 ? ' clinic-tile--brain' : ''}${index === 8 ? ' clinic-tile--slate' : ''}${index === 11 ? ' clinic-tile--violet' : ''}`
}

export default function Clinic() {
  const { t } = useLanguage()
  const { home } = useCms()
  const specialties = home?.specialties?.length
    ? home.specialties.map((sp) => ({
        slug: sp.slug,
        name: sp.name,
        desc: sp.desc,
        count: sp.count,
        image: sp.image || SPECIALTY_IMAGES[0],
      }))
    : t.clinic.specialties.map((sp, i) => ({
        slug: specialtyDetails[i]?.slug ?? `specialty-${i}`,
        name: sp.name,
        desc: sp.desc,
        count: sp.count,
        image: SPECIALTY_IMAGES[i] ?? SPECIALTY_IMAGES[0],
      }))

  return (
    <section id="clinic" className="clinic-section" style={{ perspective: 1200 }}>
      <div className="container-main">
        <Reveal variants={blurUp}>
          <div className="clinic-section__head">
            <div className="clinic-section__copy">
              <span className="clinic-section__label">
                <span className="clinic-section__dot" />
                {t.clinic.label}
              </span>
              <h2 className="clinic-section__title">
                {t.clinic.title1}
                <br />
                <em>{t.clinic.title2}</em>
              </h2>
              <p className="clinic-section__desc">{t.clinic.description}</p>
            </div>
            <a href="#contacts" className="clinic-section__cta">
              {t.clinic.bookBtn}
            </a>
          </div>
        </Reveal>

        <motion.div
          className="clinic-bento"
          variants={staggerContainer(0.08, 0.04)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: .1 }}
        >
          {specialties.map((sp, i) => (
            <SoftSurface
              key={sp.slug}
              as="article"
              className={`clinic-tile${i === 0 ? ' clinic-tile--featured' : ''}${i === 1 ? ' clinic-tile--tall' : ''}${specialtyTone(i)}`}
              maxTilt={5}
            >
              <a
                href={`/clinic/${sp.slug}`}
                className="clinic-tile__trigger"
                aria-label={`${sp.name}: ${sp.desc}`}
              >
                <img
                  src={sp.image}
                  alt=""
                  loading="lazy"
                  className={`clinic-tile__img${sp.image.startsWith('/') ? ' clinic-tile__img--3d' : ''}${i === 0 ? ' clinic-tile__img--heart' : ''}${[1, 2, 3, 4, 5, 7, 8, 9, 10, 11].includes(i) ? ' clinic-tile__img--organ' : ''}${i === 1 ? ' clinic-tile__img--brain' : ''}`}
                />
                <span className="clinic-tile__shade" aria-hidden />
                <span className="clinic-tile__content">
                  <span className="clinic-tile__count">{sp.count} {t.clinic.doctorsCount}</span>
                  <span className="clinic-tile__name">{sp.name}</span>
                  <span className="clinic-tile__desc">{sp.desc}</span>
                  <span className="clinic-tile__actions">
                    <span>{t.clinic.specialists} →</span>
                    <span>{t.clinic.prices}</span>
                  </span>
                </span>
              </a>
            </SoftSurface>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
