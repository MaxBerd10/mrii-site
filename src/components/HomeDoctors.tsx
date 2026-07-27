import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { DoctorCard, type DoctorCardDoc } from './Doctors'
import { doctorProfiles, getSpecialtyGroup } from '../data/doctors'
import { getDoctorTurnMedia } from '../data/doctorTurnMedia'
import { staggerContainer, blurUp } from '../lib/animations'
import '../styles/doctor-turn.css'
import '../styles/home-patient.css'

const HOME_COUNT = 6

export default function HomeDoctors() {
  const { contentLang, t } = useLanguage()

  const doctors: DoctorCardDoc[] = doctorProfiles
    .filter((p) => p.staffKind !== 'nurse')
    .slice(0, HOME_COUNT)
    .map((p) => {
      const c = p.content[contentLang]
      const turn = getDoctorTurnMedia(p.slug)
      return {
        id: p.slug,
        slug: p.slug,
        name: c.name,
        role: c.role,
        specialty: c.specialty,
        specialtyGroup: getSpecialtyGroup(p),
        exp: c.exp,
        papers: p.papers,
        studies: p.studies,
        color: p.color,
        photo: turn?.poster ?? p.photo,
        video: turn?.video,
        staffKind: p.staffKind,
      }
    })

  return (
    <section id="home-doctors" className="section section--muted home-doctors">
      <div className="container-main">
        <Reveal variants={blurUp}>
          <SectionHeader
            label={t.home.doctors.label}
            title={
              <>
                {t.home.doctors.title1} <em>{t.home.doctors.titleEm}</em>
              </>
            }
            description={t.home.doctors.description}
            accent="#0EA5E9"
            action={
              <a href="/doctors" className="home-section__more">
                {t.home.doctors.viewAll} →
              </a>
            }
          />
        </Reveal>

        <motion.div
          className="doctor-grid doctor-grid--home"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
        >
          {doctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doc={doc}
              bookLabel={t.doctors.bookBtn}
              papersLabel={t.doctors.papers}
              studiesLabel={t.doctors.studies}
              reviewsLabel={t.doctors.reviews}
              noReviewsLabel={t.doctors.writeReview}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
