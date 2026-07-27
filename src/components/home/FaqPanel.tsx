import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useCms } from '../../cms/CmsContext'
import HdHead from './HdHead'
import { EASE_OUT } from '../../lib/animations'

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : 'tel:+998712345678'
}

/** CH.10 — the questions patients actually ask, with the phone beside them. */
export default function FaqPanel() {
  const { t } = useLanguage()
  const { home } = useCms()
  const reduce = useReducedMotion()
  const baseId = useId()
  const [open, setOpen] = useState<number | null>(0)

  const copy = t.homeDark.faq
  const phone = home?.settings?.phone || t.topBar.phone

  return (
    <section className="hd-section hd-faq" aria-labelledby="hd-faq-title">
      <div className="container-main hd-faq__layout">
        <div>
          <HdHead
            channel={copy.channel}
            title={
              <span id="hd-faq-title">
                {copy.title1} <em>{copy.titleEm}</em>
              </span>
            }
            description={copy.description}
          />

          <div className="hd-panel hd-faq__aside" style={{ marginTop: '32px' }}>
            <p>{t.footer.readyDesc}</p>
            <a href={telHref(phone)} className="hd-faq__phone">
              {phone}
            </a>
            <span className="hd-faq__hours">{t.topBar.hours}</span>
          </div>
        </div>

        <div className="hd-faq__list">
          {copy.items.map((item, i) => {
            const isOpen = open === i
            const panelId = `${baseId}-panel-${i}`
            const buttonId = `${baseId}-button-${i}`

            return (
              <div key={item.q} className={`hd-faq__item${isOpen ? ' is-open' : ''}`}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    className="hd-faq__q"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span className="hd-faq__icon" aria-hidden />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="hd-faq__a"
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.36, ease: EASE_OUT }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
