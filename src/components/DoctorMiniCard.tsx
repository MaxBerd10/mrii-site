import { getDoctorPortrait } from '../data/doctorTurnMedia'

export function DoctorMiniCard({
  slug,
  name,
  role,
  exp,
  photo,
  hoursLabel,
  priority = false,
}: {
  slug: string
  name: string
  role: string
  exp: string
  photo: string
  hoursLabel: string
  priority?: boolean
}) {
  return (
    <a href={`/doctors/${slug}`} className="dp-mini">
      <img
        src={getDoctorPortrait(slug, photo)}
        alt={name}
        width={400}
        height={420}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
      <span className="dp-mini__body">
        <strong>{name}</strong>
        <span>
          {role} · {exp}
        </span>
        <em>{hoursLabel}</em>
      </span>
    </a>
  )
}

export function DoctorMiniShelf({ children }: { children: React.ReactNode }) {
  return <div className="dp-shelf">{children}</div>
}
