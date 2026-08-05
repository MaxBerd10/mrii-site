import { useLanguage } from '../../i18n/LanguageContext'
import { doctorProfiles } from '../../data/doctors'
import { getDoctorCardPortrait, getDoctorTurnMedia } from '../../data/doctorTurnMedia'
import ImageGallery, { type ImageGalleryDoctor } from '../ui/image-gallery'

const FEATURED_COUNT = 7

/** Homepage doctor directory. Replaces the previous scroll-assembled portrait ring. */
export default function TeamGrid() {
  const { t, contentLang } = useLanguage()
  const copy = t.homeDark.team

  const doctors: ImageGalleryDoctor[] = doctorProfiles
    .filter((profile) => profile.staffKind !== 'nurse')
    .slice(0, FEATURED_COUNT)
    .map((profile) => {
      const content = profile.content[contentLang]
      const turn = getDoctorTurnMedia(profile.slug)
      const poster = turn?.poster ?? profile.photo

      return {
        id: profile.slug,
        name: content.name,
        role: content.role,
        specialty: content.specialty,
        experience: content.exp,
        image: getDoctorCardPortrait(profile.slug, poster),
        href: `/doctors/${profile.slug}`,
      }
    })

  return (
    <section className="hd-team hd-team--gallery" aria-label={copy.channel}>
      <div className="container-main">
        <ImageGallery
          className="hd-team__gallery"
          doctors={doctors}
          title={
            <>
              {copy.title1} <em>{copy.titleEm}</em>
            </>
          }
          description={copy.description}
          viewAllLabel={copy.viewAll}
        />
      </div>
    </section>
  )
}
