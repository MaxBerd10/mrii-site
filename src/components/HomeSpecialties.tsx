import { useMemo, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { staggerContainer, fadeUpSmall, blurUp } from '../lib/animations'
import { buildClinicSpecialties } from '../data/clinicSpecialties'
import '../styles/clinic-catalog.css'
import '../styles/home-patient.css'

type ClinicCategory = 'therapy' | 'surgery' | 'women' | 'diagnostics' | 'emergency'

const FEATURED_SLUGS = [
  'cardiology',
  'neurology',
  'gynecology',
  'surgery',
  'gastroenterology',
  'therapy',
] as const

const CATEGORY_META: Record<ClinicCategory, { color: string }> = {
  therapy: { color: '#0EA5E9' },
  surgery: { color: '#6366F1' },
  women: { color: '#DB2777' },
  diagnostics: { color: '#059669' },
  emergency: { color: '#E85D04' },
}

export default function HomeSpecialties() {
  const { t, lang } = useLanguage()
  const { home } = useCms()

  const specialties = useMemo(() => {
    const base = buildClinicSpecialties(t.clinic.specialties, home?.specialties)

    const featured = FEATURED_SLUGS.map((slug) => base.find((s) => s.slug === slug)).filter(
      Boolean,
    ) as typeof base
    return featured.length ? featured : base.slice(0, 6)
  }, [home, t.clinic.specialties])

  const categoryLabel = (cat: ClinicCategory) => t.clinic.filters[cat]

  return (
    <section id="home-specialties" className="section section--white home-specialties">
      <div className="container-main">
        <Reveal variants={blurUp}>
          <SectionHeader
            label={t.home.specialties.label}
            title={
              <>
                {t.home.specialties.title1} <em>{t.home.specialties.titleEm}</em>
              </>
            }
            description={t.home.specialties.description}
            accent="#0EA5E9"
            action={
              <a href="/clinic" className="home-section__more">
                {t.home.specialties.viewAll} →
              </a>
            }
          />
        </Reveal>

        <motion.div
          key={lang}
          className="clinic-catalog home-specialties__grid"
          variants={staggerContainer(0.04, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
        >
          {specialties.map((sp) => {
            const color = CATEGORY_META[sp.category].color
            return (
              <motion.a
                key={sp.slug}
                href={`/clinic/${sp.slug}`}
                className="clinic-card"
                variants={fadeUpSmall}
                style={{ '--clinic-cat': color } as CSSProperties}
              >
                <div className="clinic-card__media">
                  <img src={sp.image} alt="" loading="lazy" />
                </div>
                <div className="clinic-card__body">
                  <span className="clinic-card__cat">
                    <span className="clinic-card__cat-dot" aria-hidden />
                    {categoryLabel(sp.category)}
                  </span>
                  <strong className="clinic-card__name">{sp.name}</strong>
                  <p className="clinic-card__desc">{sp.desc}</p>
                  <span className="clinic-card__meta">
                    {sp.count} {t.clinic.doctorsCount}
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </motion.a>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
