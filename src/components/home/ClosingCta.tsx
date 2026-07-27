import { motion } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useCms } from '../../cms/CmsContext'
import Magnetic from '../ui/Magnetic'
import { ASSISTANT_OPEN_EVENT } from '../SiteAssistant'
import { trace, settle, inView } from '../../lib/homeDarkMotion'

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : 'tel:+998712345678'
}

/** CH.11 — the close. The page's one gradient headline marks the end of the trace. */
export default function ClosingCta() {
  const { t } = useLanguage()
  const { home } = useCms()
  const copy = t.homeDark.cta
  const phone = home?.settings?.phone || t.topBar.phone

  return (
    <section className="hd-cta" aria-labelledby="hd-cta-title">
      <span className="hd-cta__aura" aria-hidden />
      <div className="container-main">
        <motion.p
          className="hd-channel"
          variants={trace}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          <span className="hd-channel__dot" aria-hidden />
          {copy.channel}
        </motion.p>

        <motion.h2
          id="hd-cta-title"
          className="hd-cta__title"
          variants={settle}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          {copy.title1} <em>{copy.titleEm}</em>
        </motion.h2>

        <motion.p
          className="hd-cta__desc"
          variants={settle}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          transition={{ delay: 0.08 }}
        >
          {copy.description}
        </motion.p>

        <motion.div
          className="hd-cta__row"
          variants={settle}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          transition={{ delay: 0.14 }}
        >
          <Magnetic href="/contacts" className="hd-btn hd-btn--primary" strength={0.3}>
            {copy.book}
          </Magnetic>
          <button
            type="button"
            className="hd-btn hd-btn--ghost"
            onClick={() => window.dispatchEvent(new Event(ASSISTANT_OPEN_EVENT))}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M21 11.5a8.4 8.4 0 01-9 8.4 9 9 0 01-3.6-.7L3 21l1.9-5.1A8.4 8.4 0 013 11.5 8.5 8.5 0 0112 3a8.5 8.5 0 019 8.5z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {copy.talk}
          </button>
        </motion.div>

        <p className="hd-cta__phone">
          {copy.phoneLabel}
          <a href={telHref(phone)}>{phone}</a>
        </p>
      </div>
    </section>
  )
}
