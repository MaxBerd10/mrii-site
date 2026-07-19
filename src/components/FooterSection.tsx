import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { rise3d } from '../lib/animations'

export default function FooterSection() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState<null | {
    requestId: string
    service: string
    phone: string
  }>(null)

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

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)

    window.setTimeout(() => {
      setConfirmation({
        requestId: `MRII-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        service: form.service,
        phone: form.phone,
      })
      setForm({ name: '', phone: '', email: '', service: '', message: '' })
      setSubmitting(false)
    }, 750)
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
            <h2 className="hp-book__title">{t.footer.ready}</h2>
            <p className="hp-book__desc">{t.footer.readyDesc}</p>
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
              <select
                required
                aria-label={t.footer.serviceField}
                value={form.service}
                onChange={(event) => setForm({ ...form, service: event.target.value })}
              >
                <option value="" disabled>{t.footer.serviceField}</option>
                {t.clinic.specialties.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <textarea
              rows={3}
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              placeholder={t.footer.messageField}
              aria-label={t.footer.messageField}
            />
            <button type="submit" className="hp-btn hp-btn--primary" disabled={submitting}>
              {submitting ? t.footer.submitting : t.footer.bookBtn}
            </button>
          </form>
        </motion.div>

        <div className="hp-footer__shell">
          <div className="hp-footer__brand">
            <a href="/" className="hp-nav__logo">
              <span className="hp-nav__mark" aria-hidden>M</span>
              <span className="hp-nav__brand">MRII</span>
            </a>
            <p className="hp-footer__tagline">{t.footer.tagline}</p>
          </div>

          <div className="hp-footer__nav">
            {t.footer.cols.map((col) => (
              <div key={col.title} className="hp-footer__col">
                <div className="hp-footer__col-title">{col.title}</div>
                {col.links.slice(0, 5).map((link) => (
                  <a key={link} href="#" className="hp-footer__link">{link}</a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="hp-footer__bottom">
          <span>{t.footer.copyright} · {t.footer.license}</span>
          <div className="hp-footer__legal">
            {[t.footer.privacy, t.footer.terms, t.footer.contactsLink].map((l) => (
              <a key={l} href="#">{l}</a>
            ))}
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
              initial={{ opacity: 0, y: 35, scale: .9, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 20, scale: .94 }}
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
                  initial={{ scale: .4, rotate: -18, opacity: 0 }}
                  animate={{ scale: 1, rotate: -5, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 16, delay: .08 }}
                >
                  ✓
                </motion.span>
              </div>
              <span className="booking-success__eyebrow">{t.footer.requestNumber}: {confirmation.requestId}</span>
              <h2 id="booking-success-title">{t.footer.successTitle}</h2>
              <p>{t.footer.successDesc}</p>
              <dl className="booking-success__details">
                <div><dt>{t.footer.selectedService}</dt><dd>{confirmation.service}</dd></div>
                <div><dt>{t.footer.contactPhone}</dt><dd>{confirmation.phone}</dd></div>
                <div><dt>{t.footer.callbackTime}</dt><dd>{t.footer.callbackValue}</dd></div>
              </dl>
              <div className="booking-success__actions">
                <button type="button" className="hp-btn hp-btn--primary" onClick={() => setConfirmation(null)}>
                  {t.footer.close}
                </button>
                <a href="/" className="hp-btn hp-btn--ghost">{t.footer.home}</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}
