import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { ReactNode } from 'react'

export type ImageGalleryDoctor = {
  id: string
  name: string
  role: string
  specialty: string
  experience: string
  image: string
  href: string
}

type ImageGalleryProps = {
  doctors: ImageGalleryDoctor[]
  title: ReactNode
  description: string
  viewAllLabel: string
  className?: string
}

/**
 * A compact doctor directory: hover (or tap) a portrait to expand its details.
 * The parent supplies the real clinic data, so this component stays reusable.
 */
export default function ImageGallery({
  doctors,
  title,
  description,
  viewAllLabel,
  className,
}: ImageGalleryProps) {
  const [activeId, setActiveId] = useState(doctors[0]?.id ?? '')

  return (
    <section className={cn('w-full', className)} aria-label={viewAllLabel}>
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] text-[var(--ink,#0b1f38)] sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted,#64748b)] sm:text-base">
          {description}
        </p>
      </div>

      <div className="mt-9 flex h-[420px] w-full gap-2 overflow-x-auto px-1 pb-1 sm:overflow-visible">
        {doctors.map((doctor) => {
          const isActive = activeId === doctor.id

          return (
            <a
              key={doctor.id}
              href={doctor.href}
              className={cn(
                'group relative min-w-[76px] flex-1 overflow-hidden rounded-2xl bg-slate-200 shadow-sm outline-none transition-[flex,transform,box-shadow] duration-500 ease-out focus-visible:ring-4 focus-visible:ring-sky-300 sm:min-w-0',
                isActive && 'flex-[4] shadow-xl',
                !isActive && 'sm:hover:flex-[4] sm:hover:-translate-y-1 sm:hover:shadow-xl',
              )}
              onMouseEnter={() => setActiveId(doctor.id)}
              onFocus={() => setActiveId(doctor.id)}
              onClick={(event) => {
                if (!isActive) {
                  event.preventDefault()
                  setActiveId(doctor.id)
                }
              }}
            >
              <img
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                src={doctor.image}
                alt={`${doctor.name} — ${doctor.role}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div
                className={cn(
                  'absolute inset-x-0 bottom-0 translate-y-10 p-5 text-left text-white transition-transform duration-500 sm:group-hover:translate-y-0',
                  isActive && 'translate-y-0',
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-200">{doctor.specialty}</p>
                <h3 className="mt-1 text-lg font-semibold leading-tight">{doctor.name}</h3>
                <p className="mt-1 text-sm text-slate-200">{doctor.role}</p>
                <p className="mt-3 text-xs text-slate-300">{doctor.experience}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-sky-200">Qabulga yozilish →</span>
              </div>
            </a>
          )
        })}
      </div>

      <div className="mt-7 text-center">
        <a
          href="/doctors"
          className="inline-flex rounded-full bg-[var(--brand-ink,#0ea5e9)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
        >
          {viewAllLabel}
        </a>
      </div>
    </section>
  )
}
