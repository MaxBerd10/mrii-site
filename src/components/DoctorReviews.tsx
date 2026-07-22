import { useEffect, useId, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  addDoctorReview,
  averageRating,
  getDoctorReviews,
  type DoctorReview,
} from '../lib/doctorReviews'

export type ReviewLabels = {
  rating: string
  reviews: string
  write: string
  empty: string
  name: string
  comment: string
  submit: string
  close: string
  thanks: string
  yourRating: string
}

type Props = {
  doctorId: string
  doctorName: string
  accent: string
  labels: ReviewLabels
  /** Full list + form on the page (doctor profile). */
  inline?: boolean
}

function Stars({
  value,
  onChange,
  size = 18,
  interactive = false,
  label,
}: {
  value: number
  onChange?: (n: number) => void
  size?: number
  interactive?: boolean
  label?: string
}) {
  return (
    <div className="doctor-stars" role={interactive ? 'radiogroup' : 'img'} aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value)
        if (!interactive) {
          return (
            <span key={n} className={`doctor-stars__star${filled ? ' is-on' : ''}`} aria-hidden>
              ★
            </span>
          )
        }
        return (
          <button
            key={n}
            type="button"
            className={`doctor-stars__star doctor-stars__btn${filled ? ' is-on' : ''}`}
            aria-label={`${n}`}
            aria-checked={n === value}
            role="radio"
            onClick={() => onChange?.(n)}
            style={{ fontSize: size }}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}

export default function DoctorReviews({
  doctorId,
  doctorName,
  accent,
  labels,
  inline = false,
}: Props) {
  const titleId = useId()
  const [open, setOpen] = useState(false)
  const [reviews, setReviews] = useState<DoctorReview[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    setReviews(getDoctorReviews(doctorId))
  }, [doctorId])

  useEffect(() => {
    if (!open || inline) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, inline])

  const avg = averageRating(reviews)
  const count = reviews.length

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim() || rating < 1) return
    const next = addDoctorReview(doctorId, { name, rating, text })
    setReviews(next)
    setName('')
    setText('')
    setRating(5)
    setSent(true)
    window.setTimeout(() => setSent(false), 2200)
  }

  const form = (
    <form className="doctor-review-form" onSubmit={onSubmit}>
      <label className="doctor-review-form__label">
        {labels.yourRating}
        <Stars value={rating} onChange={setRating} interactive size={22} />
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={labels.name}
        maxLength={60}
        autoComplete="name"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={labels.comment}
        rows={3}
        required
        maxLength={500}
      />
      <button type="submit" className="hp-btn hp-btn--primary" disabled={!text.trim()}>
        {sent ? labels.thanks : labels.submit}
      </button>
    </form>
  )

  const list = (
    <ul className={`doctor-review-modal__list${inline ? ' doctor-review-modal__list--inline' : ''}`}>
      {reviews.length === 0 ? (
        <li className="doctor-review-item doctor-review-item--empty">{labels.empty}</li>
      ) : (
        reviews.map((r) => (
          <li key={r.id} className="doctor-review-item">
            <div className="doctor-review-item__head">
              <strong>{r.name}</strong>
              <Stars value={r.rating} size={14} />
            </div>
            <p>{r.text}</p>
          </li>
        ))
      )}
    </ul>
  )

  if (inline) {
    return (
      <div className="doctor-reviews-inline">
        <div className="doctor-reviews-inline__summary">
          <Stars value={avg || 0} label={labels.rating} />
          <span>
            {count > 0 ? (
              <>
                <strong style={{ color: accent }}>{avg.toFixed(1)}</strong>
                {' · '}
                {count} {labels.reviews}
              </>
            ) : (
              labels.write
            )}
          </span>
        </div>
        {list}
        {form}
      </div>
    )
  }

  return (
    <>
      <div className="doctor-card__reviews">
        <Stars value={avg || 0} label={labels.rating} />
        <button type="button" className="doctor-card__review-btn" onClick={() => setOpen(true)}>
          {count > 0 ? (
            <>
              <strong style={{ color: accent }}>{avg.toFixed(1)}</strong>
              <span>
                · {count} {labels.reviews}
              </span>
            </>
          ) : (
            <span>{labels.write}</span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="doctor-review-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <motion.div
              className="doctor-review-modal__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            >
              <button
                type="button"
                className="doctor-review-modal__close"
                aria-label={labels.close}
                onClick={() => setOpen(false)}
              >
                ×
              </button>

              <h3 id={titleId} className="doctor-review-modal__title">
                {doctorName}
              </h3>
              <p className="doctor-review-modal__meta">
                {count > 0 ? (
                  <>
                    <Stars value={avg} />
                    <span>
                      {avg.toFixed(1)} · {count} {labels.reviews}
                    </span>
                  </>
                ) : (
                  labels.empty
                )}
              </p>

              {list}
              {form}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
