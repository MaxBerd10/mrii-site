import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import { isCmsEnabled, submitInquiry } from '../api/client'
import Reveal from './ui/Reveal'
import { staggerContainer, rise3d, blurUp } from '../lib/animations'
import { media } from '../data/media'
import '../styles/education-page.css'

const PREVIEW_COUNT = 6

type TrackFilter = 'all' | number
type Goal = 'residency' | 'course' | 'practice'
type Availability = 'full' | 'weekend' | 'evening'
type Format = 'onsite' | 'hybrid' | 'online'

type WizardCopy = {
  badge: string
  title: string
  desc: string
  qGoal: string
  qAvailability: string
  qFormat: string
  goalOptions: [string, string, string]
  availabilityOptions: [string, string, string]
  formatOptions: [string, string, string]
  recommendation: string
  formTitle: string
  fields: { name: string; phone: string; topic: string; note: string }
  submit: string
  sending: string
  success: string
  fallback: string
}

const WIZARD_COPY: Record<'uz' | 'ru' | 'en', WizardCopy> = {
  uz: {
    badge: 'Yo‘nalish tanlash',
    title: 'Sizga mos ordinatura / kursni topamiz',
    desc: '3 ta savolga javob bering, keyin arizani shu joyda yuborasiz.',
    qGoal: 'Asosiy maqsadingiz nima?',
    qAvailability: 'Qaysi jadval sizga qulay?',
    qFormat: 'Qaysi format afzal?',
    goalOptions: ['Ordinatura', 'Malaka oshirish kursi', 'Amaliyot bazasi'],
    availabilityOptions: ['To‘liq kun', 'Hafta oxiri', 'Kechki payt'],
    formatOptions: ['Offline', 'Gibrid', 'Online'],
    recommendation: 'Tavsiya etilgan yo‘nalish',
    formTitle: 'Ariza yuborish',
    fields: { name: 'Ism familiya', phone: 'Telefon', topic: 'Dastur nomi', note: 'Qisqa izoh' },
    submit: 'Arizani yuborish',
    sending: 'Yuborilmoqda…',
    success: 'Arizangiz qabul qilindi. Taʼlim bo‘limi siz bilan bog‘lanadi.',
    fallback: 'Hozircha test rejimi: ariza lokal saqlanadi.',
  },
  ru: {
    badge: 'Подбор направления',
    title: 'Подберем ординатуру или курс',
    desc: 'Ответьте на 3 вопроса и сразу отправьте заявку.',
    qGoal: 'Какая у вас цель?',
    qAvailability: 'Какой график удобен?',
    qFormat: 'Какой формат обучения нужен?',
    goalOptions: ['Ординатура', 'Курс повышения квалификации', 'Практическая база'],
    availabilityOptions: ['Полный день', 'Выходные', 'Вечером'],
    formatOptions: ['Очно', 'Гибридно', 'Онлайн'],
    recommendation: 'Рекомендованное направление',
    formTitle: 'Отправка заявки',
    fields: { name: 'Имя и фамилия', phone: 'Телефон', topic: 'Название программы', note: 'Короткий комментарий' },
    submit: 'Отправить заявку',
    sending: 'Отправляем…',
    success: 'Заявка принята. Учебный отдел свяжется с вами.',
    fallback: 'Сейчас тестовый режим: заявка сохраняется локально.',
  },
  en: {
    badge: 'Track matcher',
    title: 'Find the right residency or course',
    desc: 'Answer 3 quick questions, then submit an application here.',
    qGoal: 'What is your main goal?',
    qAvailability: 'Which schedule fits you best?',
    qFormat: 'Which format do you prefer?',
    goalOptions: ['Residency', 'Professional course', 'Clinical practice'],
    availabilityOptions: ['Full day', 'Weekends', 'Evenings'],
    formatOptions: ['On-site', 'Hybrid', 'Online'],
    recommendation: 'Recommended track',
    formTitle: 'Submit application',
    fields: { name: 'Full name', phone: 'Phone', topic: 'Program name', note: 'Short note' },
    submit: 'Send application',
    sending: 'Sending…',
    success: 'Application received. The education team will contact you.',
    fallback: 'Test mode enabled: application stored locally.',
  },
}

export default function Education() {
  const { t, lang, contentLang } = useLanguage()
  const { home } = useCms()
  const [filter, setFilter] = useState<TrackFilter>('all')
  const [expanded, setExpanded] = useState(false)
  const [goal, setGoal] = useState<Goal>('residency')
  const [availability, setAvailability] = useState<Availability>('full')
  const [format, setFormat] = useState<Format>('onsite')
  const [form, setForm] = useState({ name: '', phone: '', topic: '', note: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [confirmation, setConfirmation] = useState('')

  const tracks = useMemo(
    () =>
      home?.education?.length
        ? home.education.map((track, i) => ({
            audience: track.audience,
            color: track.color || t.education.tracks[i]?.color || '#059669',
            icon: track.icon || t.education.tracks[i]?.icon || '🎓',
            cta: t.education.tracks[i]?.cta ?? '→',
            programs: track.programs,
          }))
        : t.education.tracks,
    [home?.education, t.education.tracks],
  )

  const programs = useMemo(
    () =>
      tracks.flatMap((track, trackIndex) =>
        track.programs.map((prog, progIndex) => ({
          id: `${trackIndex}-${progIndex}`,
          trackIndex,
          audience: track.audience,
          color: track.color,
          icon: track.icon,
          cta: track.cta,
          name: prog.name,
          duration: prog.duration,
          spots: prog.spots,
        })),
      ),
    [tracks],
  )

  const filtered = filter === 'all' ? programs : programs.filter((p) => p.trackIndex === filter)
  const hasMore = filtered.length > PREVIEW_COUNT
  const visible = expanded || !hasMore ? filtered : filtered.slice(0, PREVIEW_COUNT)
  const hiddenCount = Math.max(0, filtered.length - PREVIEW_COUNT)
  const copy = WIZARD_COPY[contentLang]

  const recommendation = useMemo(() => {
    if (goal === 'residency') {
      return tracks[0]?.programs?.[0]?.name || tracks[0]?.audience || 'Ordinatura'
    }
    if (goal === 'practice') {
      return tracks[1]?.programs?.[0]?.name || tracks[1]?.audience || 'Amaliyot'
    }
    if (availability === 'weekend' || format === 'online') {
      return tracks[2]?.programs?.[0]?.name || tracks[2]?.audience || 'Qisqa kurs'
    }
    return tracks[1]?.programs?.[0]?.name || tracks[1]?.audience || 'Kurs'
  }, [availability, format, goal, tracks])

  useEffect(() => {
    setExpanded(false)
  }, [filter])

  useEffect(() => {
    setForm((prev) => ({ ...prev, topic: recommendation }))
  }, [recommendation])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError('')
    setConfirmation('')
    if (!form.name.trim() || !form.phone.trim()) {
      setSubmitError(`${copy.fields.name} / ${copy.fields.phone}`)
      return
    }

    if (!isCmsEnabled()) {
      setConfirmation(copy.fallback)
      return
    }

    setSubmitting(true)
    try {
      const response = await submitInquiry({
        intent: 'education',
        name: form.name.trim(),
        phone: form.phone.trim(),
        topic: form.topic.trim() || recommendation,
        message: form.note.trim(),
        source_path: '/education',
        lang,
      })
      if (!response?.ok) {
        throw new Error('submit-failed')
      }
      setConfirmation(copy.success)
      setForm((prev) => ({ ...prev, note: '' }))
    } catch {
      setSubmitError('So‘rov yuborilmadi. Iltimos, qayta urinib ko‘ring.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="education" className="education-section education-section--page">
      <div className="container-main education-page">
        <Reveal variants={blurUp}>
          <header className="education-hero">
            <div className="education-hero__copy">
              <span className="education-hero__label">
                <span className="education-hero__dot" aria-hidden />
                {t.education.pageLabel}
              </span>
              <h1 className="education-hero__title">
                {t.education.title1} <em>{t.education.titleEm}</em>
              </h1>
              <p className="education-hero__desc">{t.education.description}</p>
              <p className="education-hero__uni">
                {t.education.universityNote}{' '}
                <a
                  href={t.education.universityHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.education.universityLink}
                </a>
              </p>
            </div>
            <div className="education-hero__aside">
              <figure className="education-hero__photo">
                <img
                  src={media.facilities.education}
                  alt={t.education.pageLabel}
                  decoding="async"
                />
              </figure>
              <a href="/contacts?intent=education" className="education-hero__cta">
                {t.education.applyBtn}
              </a>
            </div>
          </header>
        </Reveal>

        <div className="education-caps" aria-label={t.education.programsLabel}>
          {t.education.stats.map(([value, label]) => (
            <div key={label} className="education-cap">
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="education-toolbar" role="tablist" aria-label={t.education.pageLabel}>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            className={`education-toolbar__btn${filter === 'all' ? ' is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <span className="education-toolbar__text">{t.education.filtersAll}</span>
            <span className="education-toolbar__count">{programs.length}</span>
          </button>
          {tracks.map((track, i) => (
            <button
              key={track.audience}
              type="button"
              role="tab"
              aria-selected={filter === i}
              className={`education-toolbar__btn${filter === i ? ' is-active' : ''}`}
              onClick={() => setFilter(i)}
            >
              <span
                className="education-toolbar__dot"
                style={{ background: track.color }}
                aria-hidden
              />
              <span className="education-toolbar__text">{track.audience}</span>
              <span className="education-toolbar__count">{track.programs.length}</span>
            </button>
          ))}
        </div>

        <section className="education-wizard" aria-label={copy.badge}>
          <div className="education-wizard__head">
            <span className="education-wizard__badge">{copy.badge}</span>
            <h2>{copy.title}</h2>
            <p>{copy.desc}</p>
          </div>
          <div className="education-wizard__grid">
            <div className="education-wizard__questions">
              <label>
                <span>{copy.qGoal}</span>
                <select value={goal} onChange={(e) => setGoal(e.target.value as Goal)}>
                  <option value="residency">{copy.goalOptions[0]}</option>
                  <option value="course">{copy.goalOptions[1]}</option>
                  <option value="practice">{copy.goalOptions[2]}</option>
                </select>
              </label>
              <label>
                <span>{copy.qAvailability}</span>
                <select value={availability} onChange={(e) => setAvailability(e.target.value as Availability)}>
                  <option value="full">{copy.availabilityOptions[0]}</option>
                  <option value="weekend">{copy.availabilityOptions[1]}</option>
                  <option value="evening">{copy.availabilityOptions[2]}</option>
                </select>
              </label>
              <label>
                <span>{copy.qFormat}</span>
                <select value={format} onChange={(e) => setFormat(e.target.value as Format)}>
                  <option value="onsite">{copy.formatOptions[0]}</option>
                  <option value="hybrid">{copy.formatOptions[1]}</option>
                  <option value="online">{copy.formatOptions[2]}</option>
                </select>
              </label>
              <div className="education-wizard__result">
                <small>{copy.recommendation}</small>
                <strong>{recommendation}</strong>
              </div>
            </div>
            <form className="education-wizard__form" onSubmit={onSubmit}>
              <h3>{copy.formTitle}</h3>
              <label>
                <span>{copy.fields.name}</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </label>
              <label>
                <span>{copy.fields.phone}</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </label>
              <label>
                <span>{copy.fields.topic}</span>
                <input
                  type="text"
                  value={form.topic}
                  onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
                />
              </label>
              <label>
                <span>{copy.fields.note}</span>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                />
              </label>
              {submitError ? <p className="education-wizard__error">{submitError}</p> : null}
              {confirmation ? <p className="education-wizard__ok">{confirmation}</p> : null}
              <button type="submit" disabled={submitting}>
                {submitting ? copy.sending : copy.submit}
              </button>
            </form>
          </div>
        </section>

        <motion.div
          key={`${filter}-${lang}-${expanded ? 'all' : 'preview'}`}
          className="education-catalog"
          variants={staggerContainer(0.04, 0.02)}
          initial="hidden"
          animate="show"
        >
          {visible.map((prog) => (
            <motion.a
              key={prog.id}
              href="/contacts?intent=education"
              className="education-card"
              variants={rise3d}
              style={{ '--edu-accent': prog.color } as CSSProperties}
            >
              <div className="education-card__top">
                <span className="education-card__eyebrow">{prog.audience}</span>
              </div>
              <strong className="education-card__title">{prog.name}</strong>
              <div className="education-card__meta">
                <span>{prog.duration}</span>
                <span>{prog.spots}</span>
              </div>
              <span className="education-card__link">
                {prog.cta} <span aria-hidden>→</span>
              </span>
            </motion.a>
          ))}
        </motion.div>

        {hasMore ? (
          <div className="education-more">
            <button
              type="button"
              className="education-more__btn"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded
                ? t.education.showLess
                : `${t.education.showMore}${hiddenCount ? ` · ${hiddenCount}` : ''}`}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
