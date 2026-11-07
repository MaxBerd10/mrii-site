import { useEffect, useId, useState, type FormEvent } from "react"
import {
  fetchDoctorReviews,
  submitDoctorReview,
  type PublicDoctorReview,
} from "../api/client"

export type ReviewLabels = {
  rating: string
  reviews: string
  write: string
  empty: string
  name: string
  comment: string
  submit: string
  close: string
  pending: string
  error: string
  tooMany: string
  yourRating: string
}

function Stars({
  value,
  onChange,
  size = 18,
  label,
}: {
  value: number
  onChange?: (n: number) => void
  size?: number
  label?: string
}) {
  return (
    <div
      className="doctor-stars"
      role={onChange ? "radiogroup" : "img"}
      aria-label={label}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value)
        if (!onChange) {
          return (
            <span
              key={n}
              className={`doctor-stars__star${filled ? " is-on" : ""}`}
              aria-hidden
            >
              ★
            </span>
          )
        }
        return (
          <button
            key={n}
            type="button"
            className={`doctor-stars__star doctor-stars__btn${
              filled ? " is-on" : ""
            }`}
            aria-label={`${n}`}
            aria-checked={n === value}
            role="radio"
            onClick={() => onChange(n)}
            style={{ fontSize: size }}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}

/**
 * Patient reviews of one doctor. Only reviews the clinic approved are shown; new ones are saved as
 * "pending" on the server. Nothing here is invented: no sample reviews, no placeholder averages.
 */
export default function DoctorReviews({
  doctorSlug,
  labels,
  eyebrow,
  title,
  summary,
}: {
  /** Average and number of ALL approved reviews (the list below holds only the latest ones). */
  summary?: { avg: number; count: number }
  doctorSlug: string
  labels: ReviewLabels
  eyebrow: string
  title: string
}) {
  const formId = useId()
  const [reviews, setReviews] = useState<PublicDoctorReview[] | null>(null)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [rating, setRating] = useState(5)
  const [website, setWebsite] = useState("") // honeypot: people never see or fill this
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false
    setReviews(null)
    setOpen(false)
    setNote(null)
    fetchDoctorReviews(doctorSlug).then((list) => {
      if (!cancelled) setReviews(list)
    })
    return () => {
      cancelled = true
    }
  }, [doctorSlug])

  // Server unreachable or reviews not available for this doctor: show nothing rather than a fake block.
  if (reviews === null) return null

  const listed = reviews.length
  const count = Math.max(summary?.count ?? 0, listed)
  const avg =
    summary && summary.count > 0
      ? summary.avg
      : listed
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / listed
        : 0
  // The star bars are only honest when the list holds every review.
  const showBars = listed === count

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy || text.trim().length < 10) return
    setBusy(true)
    const result = await submitDoctorReview(doctorSlug, {
      name,
      rating,
      text,
      website,
    })
    setBusy(false)
    if (result.ok) {
      setName("")
      setText("")
      setRating(5)
      setOpen(false)
      setNote({ kind: "ok", text: labels.pending })
    } else {
      setNote({
        kind: "err",
        text: result.error === "rate" ? labels.tooMany : labels.error,
      })
    }
  }

  return (
    <section className="dp-shell dp-reviews">
      <header className="dp-section-head">
        <p className="dp-chan">{eyebrow}</p>
        <h2>{title}</h2>
      </header>
      <div className="dp-review-board">
        {count > 0 && (
          <aside className="dp-score">
            <div className="dp-score__big">
              <b className="dp-readout">{avg.toFixed(1)}</b>
              <Stars value={avg} label={labels.rating} />
            </div>
            <p className="dp-score__meta">
              {count} {labels.reviews}
            </p>
            {showBars && (
            <div className="dp-dist" aria-label={labels.rating}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const n = reviews.filter((r) => r.rating === stars).length
                return (
                  <div key={stars}>
                    <span>{stars}</span>
                    <i aria-hidden>
                      <b
                        style={{ width: `${Math.round((n / listed) * 100)}%` }}
                      />
                    </i>
                    <span>{n}</span>
                  </div>
                )
              })}
            </div>
            )}
          </aside>
        )}

        <div className="dp-review-content">
          <div className="dp-review-content__actions">
            <span
              className="doctor-reviews-inline__status"
              role="status"
              aria-live="polite"
            >
              {note?.kind === "ok" ? note.text : ""}
            </span>
            <button
              type="button"
              className="doctor-reviews-inline__write"
              aria-expanded={open}
              aria-controls={formId}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? labels.close : labels.write}
            </button>
          </div>

          {count === 0 ? (
            <p className="doctor-review-item doctor-review-item--empty">
              {labels.empty}
            </p>
          ) : (
            <ul className="dp-review-quotes">
              {reviews.slice(0, 6).map((review) => (
                <li key={review.id} className="dp-qcard">
                  <div className="dp-qcard__top">
                    <span className="dp-qcard__avatar" aria-hidden>
                      {(review.name.trim()[0] || "•").toUpperCase()}
                    </span>
                    <span>
                      <strong>{review.name || labels.reviews}</strong>
                    </span>
                    <Stars value={review.rating} size={14} />
                  </div>
                  <p>{review.text}</p>
                </li>
              ))}
            </ul>
          )}

          {open && (
            <div id={formId} className="doctor-reviews-inline__form-shell">
              <form className="doctor-review-form" onSubmit={onSubmit}>
                <label className="doctor-review-form__label">
                  {labels.yourRating}
                  <Stars value={rating} onChange={setRating} size={22} />
                </label>
                <label className="doctor-review-form__field">
                  <span>{labels.name}</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={labels.name}
                    maxLength={60}
                    autoComplete="given-name"
                  />
                </label>
                <label className="doctor-review-form__field">
                  <span>{labels.comment}</span>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={labels.comment}
                    rows={4}
                    required
                    minLength={10}
                    maxLength={800}
                  />
                  <small>{text.length}/800</small>
                </label>
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    width: 1,
                    height: 1,
                    opacity: 0,
                  }}
                />
                {note?.kind === "err" && <p role="alert">{note.text}</p>}
                <div className="doctor-review-form__actions">
                  <button
                    type="submit"
                    className="hp-btn hp-btn--primary"
                    disabled={busy || text.trim().length < 10}
                  >
                    {labels.submit}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
