import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import { isCmsEnabled, submitInquiry } from '../api/client'
import { usePageNav } from './PageTransition'
import { rise3d } from '../lib/animations'

type ContactIntent = 'booking' | 'sponsor' | 'education' | 'ai' | 'international'

const INTENT_IDS: ContactIntent[] = ['booking', 'sponsor', 'education', 'ai', 'international']

function readIntentFromUrl(): ContactIntent {
  try {
    const value = new URLSearchParams(window.location.search).get('intent')
    if (value && INTENT_IDS.includes(value as ContactIntent)) return value as ContactIntent
  } catch {
    /* ignore */
  }
  return 'booking'
}

export default function FooterSection() {
  const { t, lang } = useLanguage()
  const { home } = useCms()
  const { path, navigate } = usePageNav()
  const copyright = home?.settings?.copyright || t.footer.copyright
  const license = home?.settings?.license || t.footer.license
  const [intent, setIntent] = useState<ContactIntent>(() => readIntentFromUrl())
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [confirmation, setConfirmation] = useState<null | {
    requestId: string
    service: string
    phone: string
    successDesc: string
  }>(null)

  const intentCopy = t.footer.intents[intent]

  useEffect(() => {
    if (path !== '/contacts') return
    const next = readIntentFromUrl()
    setIntent(next)
    setForm((prev) => ({ ...prev, service: '' }))
  }, [path])

  useEffect(() => {
    if (!confirmation) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConfirmation(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [confirmation])

  const selectIntent = (next: ContactIntent) => {
    setIntent(next)
    setForm((prev) => ({ ...prev, service: '' }))
    const url = next === 'booking' ? '/contacts' : `/contacts?intent=${next}`
    if (path === '/contacts') {
      window.history.replaceState(null, '', url)
      return
    }
    navigate(url)
  }

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setSubmitError('')

    const localId = `FJSTI-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
    try {
      let requestId = localId
      if (isCmsEnabled()) {
        const result = await submitInquiry({
          intent,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          topic: form.service.trim(),
          message: form.message.trim(),
          lang,
          source_path: typeof window !== 'undefined' ? window.location.pathname + window.location.search : path,
        })
        if (!result) throw new Error('Submit failed')
        requestId = result.request_id
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 750))
      }

      setConfirmation({
        requestId,
        service: form.service,
        phone: form.phone,
        successDesc: intentCopy.successDesc,
      })
      setForm({ name: '', phone: '', email: '', service: '', message: '' })
    } catch {
      setSubmitError(t.footer.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <footer id="contacts" className="hp-footer">
      <div className="container-main">
        <motion.div
          className="hp-book"
          variants={rise3d}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
        >
          <div className="hp-book__copy">
            <p className="hp-book__intent-label">{t.footer.intentLabel}</p>
            <div className="hp-book__intents" role="tablist" aria-label={t.footer.intentLabel}>
              {INTENT_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={intent === id}
                  className={`hp-book__intent${intent === id ? ' is-active' : ''}`}
                  onClick={() => selectIntent(id)}
                >
                  {t.footer.intents[id].label}
                </button>
              ))}
            </div>
            <h2 className="hp-book__title">{intentCopy.title}</h2>
            <p className="hp-book__desc">{intentCopy.desc}</p>
            <a href={`tel:${t.topBar.phone.replace(/[^\d+]/g, '')}`} className="hp-book__phone">
              {t.topBar.phone}
            </a>
          </div>
          <form className="hp-book__form" onSubmit={submitBooking}>
            <div className="hp-book__row">
              <input
                required
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder={t.footer.nameField}
                aria-label={t.footer.nameField}
              />
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder={t.footer.phoneField}
                aria-label={t.footer.phoneField}
                minLength={7}
              />
            </div>
            <div className="hp-book__row">
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder={t.footer.emailField}
                aria-label={t.footer.emailField}
              />
              {intent === 'booking' ? (
                <select
                  required
                  aria-label={intentCopy.topicField}
                  value={form.service}
                  onChange={(event) => setForm({ ...form, service: event.target.value })}
                >
                  <option value="" disabled>
                    {intentCopy.topicField}
                  </option>
                  {t.clinic.specialties.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  type="text"
                  value={form.service}
                  onChange={(event) => setForm({ ...form, service: event.target.value })}
                  placeholder={intentCopy.topicField}
                  aria-label={intentCopy.topicField}
                />
              )}
            </div>
            <textarea
              rows={3}
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              placeholder={t.footer.messageField}
              aria-label={t.footer.messageField}
            />
            <button type="submit" className="hp-btn hp-btn--primary" disabled={submitting}>
              {submitting ? t.footer.submitting : intentCopy.submit}
            </button>
            {submitError ? <p className="hp-book__error" role="alert">{submitError}</p> : null}
          </form>
        </motion.div>

        <div className="hp-footer__shell">
          <div className="hp-footer__brand">
            <a href="/" className="hp-nav__logo">
              <img src="/images/fjsti-logo.png" alt="" className="hp-nav__logo-img" width={36} height={36} />
              <span className="hp-nav__brand">{t.nav.brand}</span>
            </a>
            <p className="hp-footer__tagline">{t.footer.tagline}</p>
          </div>

          <div className="hp-footer__nav">
            {t.footer.cols.map((col, colIndex) => {
              const colHref = ['/clinic', '/research', '/education', '/ai', '/partners'][colIndex] ?? '/'
              return (
                <div key={col.title} className="hp-footer__col">
                  <div className="hp-footer__col-title">{col.title}</div>
                  {col.links.slice(0, 5).map((link) => (
                    <a key={link} href={colHref} className="hp-footer__link">
                      {link}
                    </a>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        <div className="hp-footer__bottom">
          <span>
            {copyright} · {license}
          </span>
          <div className="hp-footer__legal">
            <a href="/contacts">{t.footer.privacy}</a>
            <a href="/contacts">{t.footer.terms}</a>
            <a href="/contacts">{t.footer.contactsLink}</a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {confirmation && (
          <motion.div
            className="booking-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setConfirmation(null)
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-success-title"
              className="booking-success__dialog"
              initial={{ opacity: 0, y: 35, scale: 0.9, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 20, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 230, damping: 24 }}
            >
              <button
                autoFocus
                type="button"
                className="booking-success__close"
                aria-label={t.footer.close}
                onClick={() => setConfirmation(null)}
              >
                ×
              </button>
              <div className="booking-success__visual" aria-hidden>
                <span className="booking-success__ring" />
                <motion.span
                  className="booking-success__check"
                  initial={{ scale: 0.4, rotate: -18, opacity: 0 }}
                  animate={{ scale: 1, rotate: -5, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 16, delay: 0.08 }}
                >
                  ✓
                </motion.span>
              </div>
              <span className="booking-success__eyebrow">
                {t.footer.requestNumber}: {confirmation.requestId}
              </span>
              <h2 id="booking-success-title">{t.footer.successTitle}</h2>
              <p>{confirmation.successDesc}</p>
              <dl className="booking-success__details">
                <div>
                  <dt>{t.footer.selectedService}</dt>
                  <dd>{confirmation.service}</dd>
                </div>
                <div>
                  <dt>{t.footer.contactPhone}</dt>
                  <dd>{confirmation.phone}</dd>
                </div>
                <div>
                  <dt>{t.footer.callbackTime}</dt>
                  <dd>{t.footer.callbackValue}</dd>
                </div>
              </dl>
              <div className="booking-success__actions">
                <button type="button" className="hp-btn hp-btn--primary" onClick={() => setConfirmation(null)}>
                  {t.footer.close}
                </button>
                <a href="/" className="hp-btn hp-btn--ghost">
                  {t.footer.home}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}
