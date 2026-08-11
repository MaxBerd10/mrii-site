import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import { rise3d } from '../lib/animations'
import {
  CONTACT_ADDRESS_QUERY,
  CONTACT_COPY,
  CONTACT_EMAIL,
  CONTACT_TELEGRAM_URL,
  CONTACT_WEBSITE,
  SPONSOR_EMAIL_SUBJECT,
} from '../data/contactCopy'
import { CLINIC_PHONE_DISPLAY, CLINIC_PHONE_TEL, CLINIC_TELEGRAM_URL } from '../data/clinicContact'
import { getFooterNav } from '../data/footerNav'
import { cmsLocalizedText, useCmsContent } from '../lib/cmsLocalized'
import {
  IconClock,
  IconGlobe,
  IconHandshake,
  IconMail,
  IconPhone,
  IconPin,
  IconSend,
} from './contacts/ContactIcons'

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/',
    path: 'M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0022 12z',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/ferghana_medical_institute',
    path: 'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.9c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-3.2-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.9s0-3.6.1-4.9C2.3 4 3.9 2.4 7.1 2.3c1.3-.1 1.7-.1 4.9-.1zm0 3.4a6.4 6.4 0 100 12.8 6.4 6.4 0 000-12.8zm0 10.5a4.1 4.1 0 110-8.2 4.1 4.1 0 010 8.2zm6.6-10.8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
  },
  {
    label: 'Telegram',
    href: CLINIC_TELEGRAM_URL,
    path: 'M21.5 4.3 2.9 11.4c-1.1.4-1.1 1.1-.2 1.4l4.7 1.5 1.8 5.5c.2.6.4.8 1 .8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.5c.3-1.2-.5-1.8-1.4-1.4z',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/',
    path: 'M6.5 9.5H3.5v11h3v-11zM5 3.5a1.8 1.8 0 110 3.6 1.8 1.8 0 010-3.6zM20.5 20.5h-3v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.4h-3v-11h2.9v1.5h.1c.4-.8 1.4-1.7 2.9-1.7 3.1 0 3.7 2 3.7 4.7V20.5z',
  },
]

export default function FooterSection() {
  const { t, lang } = useLanguage()
  const { home } = useCms()
  const settings = useCmsContent(lang) ? home?.settings : null
  const copyright = cmsLocalizedText(lang, settings?.copyright, t.footer.copyright)
  const license = cmsLocalizedText(lang, settings?.license, t.footer.license)
  const copy = CONTACT_COPY[lang]
  const footerCols = getFooterNav(lang)
  const phoneDisplay = CLINIC_PHONE_DISPLAY
  const phoneHref = CLINIC_PHONE_TEL
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(CONTACT_ADDRESS_QUERY)}&output=embed`
  const mapExternal = `https://maps.google.com/?q=${encodeURIComponent(CONTACT_ADDRESS_QUERY)}`

  return (
    <footer id="contacts" className="contacts-page">
      <div className="container-main contacts-page__inner">
        <motion.div
          className="contacts-page__body"
          variants={rise3d}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
        >
          <div className="contacts-page__panels">
            <article id="bemor" className="contacts-panel contacts-panel--call">
              <div className="contacts-panel__head">
                <p className="contacts-panel__tag">{copy.eyebrow}</p>
                <div className="contacts-panel__glyph" aria-hidden>
                  <IconPhone />
                </div>
              </div>
              <h1 className="contacts-panel__title">{copy.title}</h1>
              <p className="contacts-panel__text">{copy.desc}</p>
              <a href={`tel:${phoneHref}`} className="contacts-tile">
                <span className="contacts-tile__icon contacts-tile__icon--phone">
                  <IconPhone />
                </span>
                <span className="contacts-tile__body">
                  <span className="contacts-tile__label">{copy.phoneLabel}</span>
                  <span className="contacts-tile__value">{phoneDisplay}</span>
                  <span className="contacts-tile__hint">{copy.phoneHint}</span>
                </span>
              </a>
            </article>

            <article id="homiy" className="contacts-panel contacts-panel--research">
              <div className="contacts-panel__head">
                <p className="contacts-panel__tag">{copy.sponsorEyebrow}</p>
                <div className="contacts-panel__glyph contacts-panel__glyph--research" aria-hidden>
                  <IconHandshake />
                </div>
              </div>
              <h2 className="contacts-panel__title">{copy.sponsorTitle}</h2>
              <p className="contacts-panel__text">{copy.sponsorDesc}</p>
              <div className="contacts-tile-row">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(SPONSOR_EMAIL_SUBJECT)}`}
                  className="contacts-tile"
                >
                  <span className="contacts-tile__icon contacts-tile__icon--mail">
                    <IconMail />
                  </span>
                  <span className="contacts-tile__body">
                    <span className="contacts-tile__label">{copy.sponsorEmailLabel}</span>
                    <span className="contacts-tile__value">{CONTACT_EMAIL}</span>
                    <span className="contacts-tile__hint">{copy.sponsorEmailHint}</span>
                  </span>
                </a>
                <a href={`tel:${phoneHref}`} className="contacts-tile">
                  <span className="contacts-tile__icon contacts-tile__icon--phone">
                    <IconPhone />
                  </span>
                  <span className="contacts-tile__body">
                    <span className="contacts-tile__label">{copy.sponsorPhoneLabel}</span>
                    <span className="contacts-tile__value">{phoneDisplay}</span>
                    <span className="contacts-tile__hint">{copy.phoneHint}</span>
                  </span>
                </a>
              </div>
            </article>
          </div>

          <div className="contacts-strip" aria-label={copy.eyebrow}>
            <div className="contacts-strip__item">
              <span className="contacts-strip__icon">
                <IconPin />
              </span>
              <div className="contacts-strip__body">
                <span className="contacts-strip__label">{copy.addressLabel}</span>
                <span className="contacts-strip__value">{copy.addressValue}</span>
                <a className="contacts-strip__link" href={mapExternal} target="_blank" rel="noreferrer">
                  {copy.mapCta} →
                </a>
              </div>
            </div>
            <div className="contacts-strip__item">
              <span className="contacts-strip__icon">
                <IconClock />
              </span>
              <div className="contacts-strip__body">
                <span className="contacts-strip__label">{copy.hoursLabel}</span>
                <span className="contacts-strip__value">{copy.hoursValue}</span>
              </div>
            </div>
            <a className="contacts-strip__item contacts-strip__item--link" href={CONTACT_TELEGRAM_URL} target="_blank" rel="noreferrer">
              <span className="contacts-strip__icon">
                <IconSend />
              </span>
              <div className="contacts-strip__body">
                <span className="contacts-strip__label">{copy.telegramChannelLabel}</span>
                <span className="contacts-strip__value">{copy.telegramLabel}</span>
              </div>
            </a>
            <a className="contacts-strip__item contacts-strip__item--link" href={`mailto:${CONTACT_EMAIL}`}>
              <span className="contacts-strip__icon">
                <IconMail />
              </span>
              <div className="contacts-strip__body">
                <span className="contacts-strip__label">{copy.emailLabel}</span>
                <span className="contacts-strip__value">{CONTACT_EMAIL}</span>
              </div>
            </a>
            <a className="contacts-strip__item contacts-strip__item--link" href={CONTACT_WEBSITE}>
              <span className="contacts-strip__icon">
                <IconGlobe />
              </span>
              <div className="contacts-strip__body">
                <span className="contacts-strip__label">{copy.websiteChannelLabel}</span>
                <span className="contacts-strip__value">{copy.websiteLabel}</span>
              </div>
            </a>
          </div>

          <figure className="contacts-page__map" aria-label={copy.mapLabel}>
            <iframe
              src={mapEmbed}
              title={copy.mapLabel}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </figure>
        </motion.div>

        <div className="contacts-page__nav">
          <div className="hp-footer__shell">
            <div className="hp-footer__brand">
              <a href="/" className="hp-nav__logo">
                <img src="/images/transition-medallion-v1.webp" alt="" className="hp-nav__logo-img" width={36} height={36} />
                <span className="hp-nav__brand">{t.nav.brand}</span>
              </a>
              <p className="hp-footer__tagline">{t.footer.tagline}</p>
              <div className="contacts-page__social" aria-label={t.homeDark?.footer?.followTitle ?? 'Social'}>
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="hp-footer__nav">
              {footerCols.map((col) => (
                <div key={col.title} className="hp-footer__col">
                  <div className="hp-footer__col-title">{col.title}</div>
                  {col.links.slice(0, 5).map((link) => (
                    <a key={link.href + link.label} href={link.href} className="hp-footer__link">
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
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
      </div>
    </footer>
  )
}
