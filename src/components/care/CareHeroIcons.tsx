type IconProps = { className?: string }

export function IconCalendar({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {/* Booking calendar with a check — filled, window cells and tick cut as
          holes so the light chip reads through (evenodd). */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 2a1 1 0 0 1 1 1v.5h7V3a1 1 0 1 1 2 0v.5h.5A2.5 2.5 0 0 1 20.5 6v2.5h-17V6A2.5 2.5 0 0 1 6 3.5h.5V3a1 1 0 0 1 1-1ZM3.5 10.5h17V19a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 19v-8.5Zm12.2 2.9a1 1 0 0 1 .06 1.42l-4 4.2a1 1 0 0 1-1.46 0l-1.9-2a1 1 0 1 1 1.45-1.38l1.18 1.24 3.27-3.44a1 1 0 0 1 1.4-.06Z"
      />
    </svg>
  )
}

export function IconBuilding({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {/* Hospital complex: taller left tower + lower right wing, windows cut as
          holes so the light chip reads through them (evenodd). */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 21V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v15ZM14 21V10a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 20 10v11ZM7.6 7h1.5v1.5H7.6zM10.6 7h1.5v1.5h-1.5zM7.6 10h1.5v1.5H7.6zM10.6 10h1.5v1.5h-1.5zM7.6 13h1.5v1.5H7.6zM10.6 13h1.5v1.5h-1.5zM15.4 11h1.5v1.5h-1.5zM17.6 11h1.5v1.5h-1.5zM15.4 14h1.5v1.5h-1.5zM17.6 14h1.5v1.5h-1.5zM8.4 21v-3.4a1.6 1.6 0 0 1 3.2 0V21z"
      />
    </svg>
  )
}

export function IconTeam({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {/* Three people: one in front, two smaller behind — a real team cluster. */}
      <circle cx="4.9" cy="8.1" r="2.4" />
      <path d="M4.9 11.9c1 0 1.9.2 2.6.6a6.7 6.7 0 0 0-1.9 3.6H2.6a1 1 0 0 1-1-1c0-1.8 1.4-3.2 3.3-3.2Z" />
      <circle cx="19.1" cy="8.1" r="2.4" />
      <path d="M19.1 11.9c1.9 0 3.3 1.4 3.3 3.2a1 1 0 0 1-1 1h-3c-.2-1.4-.9-2.7-1.9-3.6.7-.4 1.6-.6 2.6-.6Z" />
      <circle cx="12" cy="7" r="3.2" />
      <path d="M12 11.5c3.5 0 6.2 2.3 6.2 5.3a1 1 0 0 1-1 1H6.8a1 1 0 0 1-1-1c0-3 2.7-5.3 6.2-5.3Z" />
    </svg>
  )
}

export function IconShield({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.63 2.28a1 1 0 0 1 .74 0l6.5 2.6a1 1 0 0 1 .63.93v5.3c0 4.6-3.1 8.35-7.2 9.66a1 1 0 0 1-.6 0C7.6 19.46 4.5 15.7 4.5 11.11v-5.3a1 1 0 0 1 .63-.93l6.5-2.6Zm4.08 6.9a1 1 0 0 0-1.42-1.4l-3.5 3.5-1.58-1.58a1 1 0 1 0-1.42 1.42l2.29 2.29a1 1 0 0 0 1.42 0l4.21-4.23Z"
      />
    </svg>
  )
}

export function IconBadge({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1.9a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 2.6a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2Z"
      />
      <path d="M7.9 15.05 6.3 21.3a.6.6 0 0 0 .88.67L12 19.4l4.82 2.57a.6.6 0 0 0 .88-.67l-1.6-6.25a8.1 8.1 0 0 1-8.2 0Z" />
    </svg>
  )
}

export function IconStethoscope({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* Bold stroke tube + earpieces, filled chestpiece — reads cleaner than a
          solid blob at this size. */}
      <path
        d="M6 3v4.5a4.5 4.5 0 0 0 9 0V3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path d="M4.4 3h3.2M13.4 3h3.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path
        d="M10.5 12v2.2a4.8 4.8 0 0 0 4.8 4.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="18" cy="17.6" r="2.6" fill="currentColor" />
    </svg>
  )
}

export function IconMonitor({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* Heartbeat / ECG trace inside a rounded monitor — diagnostics. */}
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M5.5 12h2.4l1.5-3.2 2.3 6.4 1.6-3.2h5.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const TRUST_ICONS = [IconBuilding, IconTeam, IconShield, IconBadge] as const
export const FEATURE_ICONS = [IconCalendar, IconStethoscope, IconMonitor] as const
