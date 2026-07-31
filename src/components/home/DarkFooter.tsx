import { useId, useState, type FormEvent } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useCms } from '../../cms/CmsContext'

import { CLINIC_PHONE_TEL, CLINIC_TELEGRAM_URL } from '../../data/clinicContact'
import { getFooterNav } from '../../data/footerNav'

const SOCIALS = [
  { label: 'Telegram', href: CLINIC_TELEGRAM_URL, path: 'M21.5 4.3 2.9 11.4c-1.1.4-1.1 1.1-.2 1.4l4.7 1.5 1.8 5.5c.2.6.4.8 1 .8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.5c.3-1.2-.5-1.8-1.4-1.4z' },
  { label: 'Instagram', href: 'https://instagram.com/', path: 'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.9c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-3.2-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.9s0-3.6.1-4.9C2.3 4 3.9 2.4 7.1 2.3c1.3-.1 1.7-.1 4.9-.1zm0 3.4a6.4 6.4 0 100 12.8 6.4 6.4 0 000-12.8zm0 10.5a4.1 4.1 0 110-8.2 4.1 4.1 0 010 8.2zm6.6-10.8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' },
  { label: 'YouTube', href: 'https://youtube.com/', path: 'M22.5 7.2a2.7 2.7 0 00-1.9-1.9C18.9 4.8 12 4.8 12 4.8s-6.9 0-8.6.5A2.7 2.7 0 001.5 7.2C1 8.9 1 12 1 12s0 3.1.5 4.8a2.7 2.7 0 001.9 1.9c1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5a2.7 2.7 0 001.9-1.9c.5-1.7.5-4.8.5-4.8s0-3.1-.5-4.8zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z' },
  { label: 'Facebook', href: 'https://facebook.com/', path: 'M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0022 12z' },
]

/** CH.12 — the close of the instrument. Gradient top edge, newsletter, real links. */
export default function DarkFooter() {
  const { t, lang } = useLanguage()
  const { home } = useCms()
  const fieldId = useId()

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'invalid' | 'done'>('idle')

  const copy = t.homeDark.footer
  const footerCols = getFooterNav(lang)
  const settings = home?.settings
  const phone = settings?.phone || t.topBar.phone
  const copyright = settings?.copyright || t.footer.copyright
  const license = settings?.license || t.footer.license

  const submit = (event: FormEvent) => {
    event.preventDefault()
    // Deliberately strict enough to catch typos, loose enough for real addresses.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setStatus('invalid')
      return
    }
    // TODO: POST to the Django backend once a subscription endpoint exists.
    setStatus('done')
  }

  return (
    <footer className="hd-footer">
      <div className="container-main">
        <div className="hd-footer__top">
          <div>
            <a href="/" className="hd-footer__brand">
              <img
                src="/images/fjsti-logo.png"
                alt=""
                className="hd-footer__logo"
                width={38}
                height={38}
              />
              {t.nav.brand}
            </a>
            <p className="hd-footer__tagline">{t.footer.tagline}</p>

            <div className="hd-social" aria-label={copy.followTitle}>
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <form className="hd-news" onSubmit={submit} noValidate>
            <h2 className="hd-news__title">{copy.newsletterTitle}</h2>
            <p className="hd-news__desc">{copy.newsletterDesc}</p>

            {status === 'done' ? (
              <p className="hd-news__ok" role="status">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {copy.subscribed}
              </p>
            ) : (
              <div className="hd-news__row">
                <label className="sr-only" htmlFor={fieldId}>
                  {copy.emailLabel}
                </label>
                <input
                  id={fieldId}
                  type="email"
                  className="hd-news__input"
                  placeholder={copy.emailPlaceholder}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (status === 'invalid') setStatus('idle')
                  }}
                  aria-invalid={status === 'invalid'}
                  aria-describedby={status === 'invalid' ? `${fieldId}-error` : undefined}
                  autoComplete="email"
                />
                <button type="submit" className="hd-btn hd-btn--primary">
                  {copy.subscribe}
                </button>
                {status === 'invalid' ? (
                  <p id={`${fieldId}-error`} className="hd-news__error" role="alert">
                    {copy.emailInvalid}
                  </p>
                ) : null}
              </div>
            )}
          </form>
        </div>

        <nav className="hd-footer__cols" aria-label={t.nav.home}>
          {footerCols.map((col) => (
            <div key={col.title} className="hd-footer__col">
              <h3>{col.title}</h3>
              <ul>
                {col.links.slice(0, 5).map((link) => (
                  <li key={link.href + link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="hd-footer__bottom">
          <span>
            {copyright} · {license}
          </span>
          <div className="hd-footer__legal">
            <a href={`tel:${CLINIC_PHONE_TEL}`}>{phone}</a>
            <span>{copy.address}</span>
            <a href="/contacts">{t.footer.privacy}</a>
            <a href="/contacts">{t.footer.terms}</a>
            <a href="/contacts">{t.footer.contactsLink}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
