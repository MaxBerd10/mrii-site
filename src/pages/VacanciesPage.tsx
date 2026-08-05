import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { usePageNav } from '../components/PageTransition'
import {
  fetchVacancies,
  isCmsEnabled,
  submitInquiry,
  type CmsVacancy,
  type VacancyCategory,
} from '../api/client'
import { FALLBACK_VACANCIES } from '../data/vacanciesFallback'
import { getDoctorCardPortrait } from '../data/doctorTurnMedia'
import '../styles/vacancies-page.css'

const HR_CONTACT_SLUG = 'nigmatova-s-a'
const HR_CONTACT_PHOTO = getDoctorCardPortrait(
  HR_CONTACT_SLUG,
  '/images/doctors/cards/nigmatova-s-a.webp',
)

type FilterId = 'all' | VacancyCategory

function formatDeadline(value: string | null, lang: string) {
  if (!value) return ''
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return value
  if (lang === 'en') {
    return `${d} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]} ${y}`
  }
  if (lang === 'ru') {
    return `${d} ${['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][m - 1]} ${y}`
  }
  return `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${y}`
}

export default function VacanciesPage() {
  const { t, lang } = useLanguage()
  const { routeEnter } = usePageNav()
  const reduceMotion = useReducedMotion()
  const shouldAnimate = routeEnter && !reduceMotion

  const [vacancies, setVacancies] = useState<CmsVacancy[]>(FALLBACK_VACANCIES)
  const [filter, setFilter] = useState<FilterId>('all')
  const [selectedId, setSelectedId] = useState<string>('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successId, setSuccessId] = useState('')
  const applicationHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    let cancelled = false
    void fetchVacancies(lang).then((rows) => {
      if (cancelled || !rows?.length) return
      setVacancies(rows)
    })
    return () => {
      cancelled = true
    }
  }, [lang])

  const allFilters: { id: FilterId; label: string }[] = [
    { id: 'all', label: t.vacancies.filters.all },
    { id: 'doctor', label: t.vacancies.filters.doctor },
    { id: 'nurse', label: t.vacancies.filters.nurse },
    { id: 'admin', label: t.vacancies.filters.admin },
    { id: 'residency', label: t.vacancies.filters.residency },
    { id: 'other', label: t.vacancies.filters.other },
  ]

  const filters = useMemo(
    () => allFilters.filter((item) => item.id === 'all' || vacancies.some((row) => row.category === item.id)),
    [vacancies],
  )

  const filtered = useMemo(() => {
    const rows = filter === 'all' ? vacancies : vacancies.filter((row) => row.category === filter)
    return [...rows].sort((a, b) => a.order - b.order)
  }, [filter, vacancies])

  const selectedVacancy = vacancies.find((row) => row.id === selectedId) ?? null

  const applyToVacancy = (id: string) => {
    setSelectedId(id)
    setSuccessId('')
    setError('')
    document.getElementById('vacancy-application')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => applicationHeadingRef.current?.focus(), 350)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccessId('')

    const topic = selectedVacancy?.title || t.vacancies.generalApplication

    try {
      if (!isCmsEnabled()) {
        setError(t.vacancies.offlineError)
        return
      }
      const result = await submitInquiry({
        intent: 'career',
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        topic,
        message: message.trim() || t.vacancies.defaultMessage,
        lang,
        source_path: '/vakansiyalar',
      })
      if (!result?.request_id) {
        setError(t.vacancies.submitError)
        return
      }
      setSuccessId(result.request_id)
      setName('')
      setPhone('')
      setEmail('')
      setMessage('')
    } catch {
      setError(t.vacancies.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="vacancies-page">
      <motion.header
        className="vacancies-page__head"
        initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="vacancies-page__eyebrow">{t.vacancies.eyebrow}</p>
        <h1 className="vacancies-page__title">{t.vacancies.title}</h1>
        <p className="vacancies-page__lead">{t.vacancies.lead}</p>
      </motion.header>

      <div className="vacancies-page__filters" role="tablist" aria-label={t.vacancies.filtersLabel}>
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            className={`vacancies-page__filter${filter === item.id ? ' is-active' : ''}`}
            onClick={() => setFilter(item.id)}
          >
            {item.label} · {item.id === 'all' ? vacancies.length : vacancies.filter((row) => row.category === item.id).length}
          </button>
        ))}
      </div>

      <section className="vacancies-page__grid" aria-label={t.vacancies.title}>
        {filtered.length === 0 ? (
          <p className="vacancies-page__empty">{t.vacancies.empty}</p>
        ) : (
          filtered.map((vacancy) => (
            <article key={vacancy.id} className="vacancy-card">
              <div className="vacancy-card__meta">
                <span className="vacancy-card__tag">{t.vacancies.categories[vacancy.category]}</span>
                <span className="vacancy-card__tag vacancy-card__tag--muted">
                  {t.vacancies.employment[vacancy.employment]}
                </span>
              </div>
              <h2 className="vacancy-card__title">{vacancy.title}</h2>
              {vacancy.department ? <p className="vacancy-card__dept">{vacancy.department}</p> : null}
              {vacancy.description ? <p className="vacancy-card__desc">{vacancy.description}</p> : null}
              <ul className="vacancy-card__facts">
                {vacancy.experience ? (
                  <li>
                    <strong>{t.vacancies.experienceLabel}:</strong> {vacancy.experience}
                  </li>
                ) : null}
                {vacancy.location ? (
                  <li>
                    <strong>{t.vacancies.locationLabel}:</strong> {vacancy.location}
                  </li>
                ) : null}
                {vacancy.deadline ? (
                  <li>
                    <strong>{t.vacancies.deadlineLabel}:</strong> {formatDeadline(vacancy.deadline, lang)}
                  </li>
                ) : null}
              </ul>
              {vacancy.requirements.length > 0 ? (
                <ul className="vacancy-card__requirements">
                  {vacancy.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              <div className="vacancy-card__actions">
                <button type="button" className="vacancy-card__apply" onClick={() => applyToVacancy(vacancy.id)}>
                  {t.vacancies.apply}
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      <section id="vacancy-application" className="vacancies-page__form-wrap">
        <div className="vacancies-page__form-head">
          <h2 ref={applicationHeadingRef} tabIndex={-1}>{t.vacancies.formTitle}</h2>
          <p>{t.vacancies.formLead}</p>
        </div>

        <p className="vacancies-form__selection" aria-live="polite">
          <span>{t.vacancies.positionLabel}</span>
          <strong>{selectedVacancy?.title ?? t.vacancies.generalApplication}</strong>
        </p>

        {successId ? (
          <p className="vacancies-form__success">
            {t.vacancies.success.replace('{id}', successId)}
          </p>
        ) : null}
        {error ? <p className="vacancies-form__error">{error}</p> : null}

        <div className="vacancies-page__application-grid">
          <aside className="vacancies-hr-card">
            <img src={HR_CONTACT_PHOTO} alt={t.vacancies.hrPersonName} />
            <div>
              <p>{t.vacancies.hrLabel}</p>
              <h3>{t.vacancies.hrPersonName}</h3>
              <span>{t.vacancies.hrPersonRole}</span>
            </div>
            <small>{t.vacancies.hrNote}</small>
          </aside>

          <form className="vacancies-form" onSubmit={handleSubmit}>
            <div className="vacancies-form__row">
              <label>
                {t.vacancies.nameLabel}
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  autoComplete="name"
                />
              </label>
              <label>
                {t.vacancies.phoneLabel}
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  autoComplete="tel"
                />
              </label>
            </div>
            <label>
              {t.vacancies.emailLabel}
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </label>
            <label>
              {t.vacancies.messageLabel}
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t.vacancies.messagePlaceholder}
              />
            </label>
            <button type="submit" className="vacancies-form__submit" disabled={submitting}>
              {submitting ? t.vacancies.submitting : t.vacancies.submit}
            </button>
            <p className="vacancies-form__note">{t.vacancies.formNote}</p>
          </form>
        </div>
      </section>
    </main>
  )
}
