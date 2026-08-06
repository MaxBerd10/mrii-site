import type { ReactNode } from 'react'
import type { Lang } from '../i18n/types'
import type { DoctorProfile } from '../data/doctors'
import { DoctorMiniCard, DoctorMiniShelf } from './DoctorMiniCard'

export function DoctorTeamSection({
  eyebrow,
  title,
  description,
  hoursLabel,
  doctors,
  contentLang,
  action,
  empty,
  className = '',
  embedded = false,
}: {
  eyebrow: string
  title: string
  description?: string
  hoursLabel: string
  doctors: DoctorProfile[]
  contentLang: Lang
  action?: ReactNode
  empty?: ReactNode
  className?: string
  embedded?: boolean
}) {
  const Tag = embedded ? 'div' : 'section'

  return (
    <Tag className={`doctor-team-section${className ? ` ${className}` : ''}`}>
      <header className="doctor-team-section__head">
        <p className="doctor-team-section__eyebrow">{eyebrow}</p>
        <h2 className="doctor-team-section__title">{title}</h2>
        {description ? <span className="doctor-team-section__desc">{description}</span> : null}
        {action ? <div className="doctor-team-section__action">{action}</div> : null}
      </header>

      {doctors.length === 0 ? (
        empty
      ) : (
        <DoctorMiniShelf>
          {doctors.map((profile, index) => {
            const content = profile.content[contentLang]
            return (
              <DoctorMiniCard
                key={profile.slug}
                slug={profile.slug}
                name={content.name}
                role={content.role}
                exp={content.exp}
                photo={profile.photo}
                hoursLabel={hoursLabel}
                priority={index < 3}
              />
            )
          })}
        </DoctorMiniShelf>
      )}
    </Tag>
  )
}
