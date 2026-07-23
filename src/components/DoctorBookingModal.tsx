import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import type { ContentLang, Lang } from '../i18n/types'
import { toContentLang } from '../i18n/types'

export type BookingLabels = {
  title: string
  appointment: string
  patient: string
  clinic: string
  date: string
  time: string
  lastName: string
  firstName: string
  middleName: string
  noMiddleName: string
  birthDate: string
  phone: string
  comment: string
  privacy: string
  privacyLink: string
  submit: string
  submitting: string
  close: string
  successTitle: string
  successDesc: string
  successClose: string
  requestNumber: string
}

type Props = {
  open: boolean
  doctorName: string
  doctorSpecialty?: string
  accent?: string
  labels: BookingLabels
  onClose: () => void
}

const CLINICS: Record<ContentLang, string[]> = {
  uz: [
    'FJSTI asosiy klinika',
    'Konsultativ poliklinika',
    'Diagnostika markazi',
  ],
  ru: [
    'Основная клиника FJSTI',
    'Консультативная поликлиника',
    'Диагностический центр',
  ],
  en: [
    'FJSTI main clinic',
    'Outpatient clinic',
    'Diagnostics center',
  ],
}

const TIMES = [
  '09:00 – 09:30',
  '09:30 – 10:00',
  '10:00 – 10:30',
  '10:30 – 11:00',
  '11:00 – 11:30',
  '11:30 – 12:00',
  '12:00 – 12:30',
  '14:00 – 14:30',
  '14:30 – 15:00',
  '15:00 – 15:30',
  '15:30 – 16:00',
  '16:00 – 16:30',
]

function buildDates(lang: Lang, count = 14) {
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ'
  const out: { value: string; label: string }[] = []
  const now = new Date()
  for (let i = 1; i <= count; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    if (d.getDay() === 0) continue // skip Sunday
    const value = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    })
    out.push({ value, label })
  }
  return out
}

const emptyForm = {
  clinic: '',
  date: '',
  time: '',
  lastName: '',
  firstName: '',
  middleName: '',
  noMiddleName: false,
  birthDate: '',
  phone: '',
  comment: '',
  privacy: false,
}

export default function DoctorBookingModal({
  open,
  doctorName,
  doctorSpecialty,
  accent = '#5B4CDB',
  labels,
  onClose,
}: Props) {
  const { lang } = useLanguage()
  const titleId = useId()
  const contentLang = toContentLang(lang)
  const dates = useMemo(() => buildDates(lang), [lang])
  const clinics = CLINICS[contentLang]
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<{ id: string } | null>(null)

  useEffect(() => {
    if (!open) return
    setForm({
      ...emptyForm,
      clinic: clinics[0] ?? '',
      date: dates[0]?.value ?? '',
      time: TIMES[0],
    })
    setDone(null)
    setSubmitting(false)
  }, [open, clinics, dates])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (submitting || !form.privacy) return
    setSubmitting(true)
    window.setTimeout(() => {
      setDone({
        id: `FJSTI-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
      })
      setSubmitting(false)
    }, 700)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="doctor-book"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            className="doctor-book__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          >
            <button
              type="button"
              className="doctor-book__close"
              aria-label={labels.close}
              onClick={onClose}
            >
              ×
            </button>

            {done ? (
              <div className="doctor-book__success">
                <p className="doctor-book__success-id">
                  {labels.requestNumber}: {done.id}
                </p>
                <h2 id={titleId}>{labels.successTitle}</h2>
                <p>{labels.successDesc}</p>
                <p className="doctor-book__success-meta">
                  {doctorName}
                  {doctorSpecialty ? ` · ${doctorSpecialty}` : ''}
                  <br />
                  {form.date} · {form.time}
                </p>
                <button type="button" className="hp-btn hp-btn--primary" onClick={onClose}>
                  {labels.successClose}
                </button>
              </div>
            ) : (
              <form className="doctor-book__form" onSubmit={onSubmit}>
                <h2 id={titleId} className="doctor-book__title" style={{ color: accent }}>
                  {labels.title}: {doctorName}
                </h2>

                <fieldset className="doctor-book__section">
                  <legend>{labels.appointment}</legend>
                  <div className="doctor-book__row doctor-book__row--2">
                    <label>
                      <span>{labels.clinic}</span>
                      <select
                        required
                        value={form.clinic}
                        onChange={(e) => setForm({ ...form, clinic: e.target.value })}
                      >
                        {clinics.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>{labels.date}</span>
                      <select
                        required
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                      >
                        {dates.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    <span>{labels.time}</span>
                    <select
                      required
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                    >
                      {TIMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                </fieldset>

                <fieldset className="doctor-book__section">
                  <legend>{labels.patient}</legend>
                  <label>
                    <span>{labels.lastName}</span>
                    <input
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      autoComplete="family-name"
                    />
                  </label>
                  <div className="doctor-book__row doctor-book__row--2">
                    <label>
                      <span>{labels.firstName}</span>
                      <input
                        required
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        autoComplete="given-name"
                      />
                    </label>
                    <label>
                      <span>{labels.middleName}</span>
                      <input
                        required={!form.noMiddleName}
                        disabled={form.noMiddleName}
                        value={form.middleName}
                        onChange={(e) => setForm({ ...form, middleName: e.target.value })}
                        autoComplete="additional-name"
                      />
                    </label>
                  </div>
                  <label className="doctor-book__check">
                    <input
                      type="checkbox"
                      checked={form.noMiddleName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          noMiddleName: e.target.checked,
                          middleName: e.target.checked ? '' : form.middleName,
                        })
                      }
                    />
                    <span>{labels.noMiddleName}</span>
                  </label>
                  <div className="doctor-book__row doctor-book__row--2">
                    <label>
                      <span>{labels.birthDate}</span>
                      <input
                        required
                        type="date"
                        value={form.birthDate}
                        onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                      />
                    </label>
                    <label>
                      <span>{labels.phone}</span>
                      <input
                        required
                        type="tel"
                        minLength={7}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+998 __ ___ __ __"
                        autoComplete="tel"
                      />
                    </label>
                  </div>
                </fieldset>

                <label className="doctor-book__section doctor-book__comment">
                  <span>{labels.comment}</span>
                  <textarea
                    rows={3}
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    maxLength={500}
                  />
                </label>

                <div className="doctor-book__footer">
                  <label className="doctor-book__check doctor-book__privacy">
                    <input
                      type="checkbox"
                      required
                      checked={form.privacy}
                      onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                    />
                    <span>
                      {labels.privacy}{' '}
                      <a href="/contacts" onClick={(e) => e.stopPropagation()}>
                        {labels.privacyLink}
                      </a>
                    </span>
                  </label>
                  <button
                    type="submit"
                    className="hp-btn hp-btn--primary doctor-book__submit"
                    style={{ background: accent }}
                    disabled={submitting || !form.privacy}
                  >
                    {submitting ? labels.submitting : labels.submit}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
