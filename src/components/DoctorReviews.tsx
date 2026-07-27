import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  addDoctorReview,
  averageRating,
  getDoctorReviews,
  type DoctorReview,
} from '../lib/doctorReviews'
import { accentInk } from '../lib/accent'

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
  variant?: 'default' | 'profile'
  demoReviews?: DoctorReview[]
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
  variant = 'default',
  demoReviews = [],
}: Props) {
  const titleId = useId()
  const inlineFormId = useId()
  const [open, setOpen] = useState(false)
  const [inlineFormOpen, setInlineFormOpen] = useState(false)
  const [reviews, setReviews] = useState<DoctorReview[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [sent, setSent] = useState(false)
  const writeButtonRef = useRef<HTMLButtonElement>(null)
  const commentRef = useRef<HTMLTextAreaElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    setReviews(getDoctorReviews(doctorId))
    setInlineFormOpen(false)
    setSent(false)
  }, [doctorId])

  useEffect(() => {
    if (inlineFormOpen) commentRef.current?.focus()
  }, [inlineFormOpen])

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

  const visibleReviews = [...reviews, ...demoReviews]
  const avg = averageRating(visibleReviews)
  const count = visibleReviews.length

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
    if (inline) {
      setInlineFormOpen(false)
      writeButtonRef.current?.focus()
    }
  }

  const form = (
    <form className="doctor-review-form" onSubmit={onSubmit}>
      <label className="doctor-review-form__label">
        {labels.yourRating}
        <Stars value={rating} onChange={setRating} interactive size={22} />
      </label>
      <label className="doctor-review-form__field">
        <span>{labels.name}</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={labels.name}
          maxLength={60}
          autoComplete="name"
        />
      </label>
      <label className="doctor-review-form__field">
        <span>{labels.comment}</span>
        <textarea
          ref={commentRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={labels.comment}
          rows={4}
          required
          maxLength={500}
        />
        <small>{text.length}/500</small>
      </label>
      <div className="doctor-review-form__actions">
        <button type="submit" className="hp-btn hp-btn--primary" disabled={!text.trim()}>
          {sent ? labels.thanks : labels.submit}
        </button>
        {inline && (
          <button
            type="button"
            className="doctor-review-form__cancel"
            onClick={() => {
              setInlineFormOpen(false)
              writeButtonRef.current?.focus()
            }}
          >
            {labels.close}
          </button>
        )}
      </div>
    </form>
  )

  const list = (
    <ul className={`doctor-review-modal__list${inline ? ' doctor-review-modal__list--inline' : ''}`}>
      {reviews.length === 0 ? (
        <li className="doctor-review-item doctor-review-item--empty">{labels.empty}</li>
      ) : (
        visibleReviews.map((r) => (
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
    if (variant === 'profile') {
      const score = reviews.length > 0 ? avg : 4.9
      const total = 128 + reviews.length
      const distribution = [
        { stars: 5, count: 112, width: '88%' },
        { stars: 4, count: 12, width: '10%' },
        { stars: 3, count: 3, width: '3%' },
        { stars: 2, count: 1, width: '1%' },
        { stars: 1, count: 0, width: '0%' },
      ]

      return (
        <div className="dp-review-board">
          <aside className="dp-score">
            <div className="dp-score__big">
              <b className="dp-readout">{score.toFixed(1)}</b>
              <Stars value={score} label={labels.rating} />
            </div>
            <p className="dp-score__meta">
              {total} {labels.reviews}
            </p>
            <div className="dp-dist" aria-label={labels.rating}>
              {distribution.map((item) => (
                <div key={item.stars}>
                  <span>{item.stars}</span>
                  <i aria-hidden>
                    <b style={{ width: item.width }} />
                  </i>
                  <span>{item.count + reviews.filter((review) => review.rating === item.stars).length}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="dp-review-content">
            <div className="dp-review-content__actions">
              <span className="doctor-reviews-inline__status" role="status" aria-live="polite">
                {sent ? labels.thanks : ''}
              </span>
              <button
                ref={writeButtonRef}
                type="button"
                className="doctor-reviews-inline__write"
                aria-expanded={inlineFormOpen}
                aria-controls={inlineFormId}
                onClick={() => setInlineFormOpen((value) => !value)}
              >
                {inlineFormOpen ? labels.close : labels.write}
              </button>
            </div>

            <ul className="dp-review-quotes">
              {visibleReviews.slice(0, 3).map((review) => (
                <li key={review.id} className="dp-qcard">
                  <div className="dp-qcard__top">
                    <span className="dp-qcard__avatar" aria-hidden>
                      {(review.name.trim()[0] || 'M').toUpperCase()}
                    </span>
                    <span>
                      <strong>{review.name}</strong>
                      <small>{labels.reviews}</small>
                    </span>
                    <Stars value={review.rating} size={14} />
                  </div>
                  <p>{review.text}</p>
                </li>
              ))}
            </ul>

            <AnimatePresence initial={false}>
              {inlineFormOpen && (
                <motion.div
                  id={inlineFormId}
                  className="doctor-reviews-inline__form-shell"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-6px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0)' }}
                  exit={{ opacity: 0, transform: 'translateY(-4px)' }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                >
                  {form}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )
    }

    return (
      <div className="doctor-reviews-inline">
        <div className="doctor-reviews-inline__summary">
          <div className="doctor-reviews-inline__rating">
            <Stars value={avg || 0} label={labels.rating} />
            <span>
              {count > 0 ? (
                <>
                  <strong style={{ color: accentInk(accent) }}>{avg.toFixed(1)}</strong>
                  {' · '}
                  {count} {labels.reviews}
                </>
              ) : (
                labels.empty
              )}
            </span>
            <span className="doctor-reviews-inline__status" role="status" aria-live="polite">
              {sent ? labels.thanks : ''}
            </span>
          </div>
          <button
            ref={writeButtonRef}
            type="button"
            className="doctor-reviews-inline__write"
            aria-expanded={inlineFormOpen}
            aria-controls={inlineFormId}
            onClick={() => setInlineFormOpen((value) => !value)}
          >
            {inlineFormOpen ? labels.close : labels.write}
          </button>
        </div>
        {list}
        <AnimatePresence initial={false}>
          {inlineFormOpen && (
            <motion.div
              id={inlineFormId}
              className="doctor-reviews-inline__form-shell"
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, transform: 'translateY(-6px)' }
              }
              animate={{ opacity: 1, transform: 'translateY(0)' }}
              exit={{
                opacity: 0,
                transform: reduce ? 'translateY(0)' : 'translateY(-4px)',
                transition: { duration: 0.13, ease: [0.23, 1, 0.32, 1] },
              }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            >
              {form}
            </motion.div>
          )}
        </AnimatePresence>
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
              <strong style={{ color: accentInk(accent) }}>{avg.toFixed(1)}</strong>
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
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <motion.div
              className="doctor-review-modal__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, transform: 'translateY(20px) scale(.96)' }
              }
              animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
              exit={{
                opacity: 0,
                transform: reduce
                  ? 'translateY(0) scale(1)'
                  : 'translateY(12px) scale(.97)',
                transition: { duration: 0.16, ease: [0.23, 1, 0.32, 1] },
              }}
              transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
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
