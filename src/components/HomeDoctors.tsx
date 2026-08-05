import { useLanguage } from '../i18n/LanguageContext'
import Reveal from './ui/Reveal'
import ImageGallery, { type ImageGalleryDoctor } from './ui/image-gallery'
import { doctorProfiles } from '../data/doctors'
import { getDoctorCardPortrait, getDoctorTurnMedia } from '../data/doctorTurnMedia'
import { blurUp } from '../lib/animations'
import '../styles/home-patient.css'

const HOME_COUNT = 7

export default function HomeDoctors() {
  const { contentLang, t } = useLanguage()

  const doctors: ImageGalleryDoctor[] = doctorProfiles
    .filter((p) => p.staffKind !== 'nurse')
    .slice(0, HOME_COUNT)
    .map((p) => {
      const c = p.content[contentLang]
      const turn = getDoctorTurnMedia(p.slug)
      const poster = turn?.poster ?? p.photo
      return {
        id: p.slug,
        name: c.name,
        role: c.role,
        specialty: c.specialty,
        experience: c.exp,
        image: getDoctorCardPortrait(p.slug, poster),
        href: `/doctors/${p.slug}`,
      }
    })

  return (
    <section id="home-doctors" className="section section--muted home-doctors">
      <div className="container-main">
        <Reveal variants={blurUp}>
          <ImageGallery
            doctors={doctors}
            title={
              <>
                {t.home.doctors.title1} <em>{t.home.doctors.titleEm}</em>
              </>
            }
            description={t.home.doctors.description}
            viewAllLabel={t.home.doctors.viewAll}
          />
        </Reveal>
      </div>
    </section>
  )
}
