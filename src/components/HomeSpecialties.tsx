import { useMemo, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { staggerContainer, fadeUpSmall, blurUp } from '../lib/animations'
import { media } from '../data/media'
import { specialtyDetails } from '../data/specialtyDetails'
import '../styles/clinic-catalog.css'
import '../styles/home-patient.css'

type ClinicCategory = 'therapy' | 'surgery' | 'women' | 'diagnostics'

const SPECIALTY_IMAGES = Object.values(media.clinic)

const SPECIALTY_CATEGORIES: ClinicCategory[] = [
  'therapy',
  'therapy',
  'therapy',
  'therapy',
  'therapy',
  'surgery',
  'women',
  'women',
  'surgery',
  'diagnostics',
  'diagnostics',
  'surgery',
]

const CATEGORY_META: Record<ClinicCategory, { color: string }> = {
  therapy: { color: '#0EA5E9' },
  surgery: { color: '#6366F1' },
  women: { color: '#DB2777' },
  diagnostics: { color: '#059669' },
}

/** Patient-facing featured specialties on the homepage */
const FEATURED_SLUGS = [
  'cardiology',
  'neurology',
  'diagnostics',
  'pediatrics',
  'gynecology',
  'therapy',
] as const

export default function HomeSpecialties() {
  const { t, lang } = useLanguage()
  const { home } = useCms()

  const specialties = useMemo(() => {
    const base = home?.specialties?.length
      ? home.specialties.map((sp, i) => ({
          slug: sp.slug,
          name: sp.name,
          desc: sp.desc,
          count: sp.count,
          image: sp.image || SPECIALTY_IMAGES[i % SPECIALTY_IMAGES.length],
          category: SPECIALTY_CATEGORIES[i] ?? 'therapy',
        }))
      : t.clinic.specialties.map((sp, i) => ({
          slug: specialtyDetails[i]?.slug ?? `specialty-${i}`,
          name: sp.name,
          desc: sp.desc,
          count: sp.count,
          image: SPECIALTY_IMAGES[i] ?? SPECIALTY_IMAGES[0],
          category: SPECIALTY_CATEGORIES[i] ?? 'therapy',
        }))

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
