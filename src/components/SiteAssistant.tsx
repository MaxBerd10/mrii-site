import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import '../styles/site-assistant.css'

type Msg = {
  id: string
  role: 'bot' | 'user'
  text: string
  links?: { label: string; href: string }[]
}

function RobotHead({ className }: { className?: string }) {
  return (
    <span className={`site-assistant__robot${className ? ` ${className}` : ''}`} aria-hidden>
      <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none">
        <rect x="14" y="18" width="36" height="32" rx="12" fill="#E8F4FC" />
        <rect x="14" y="18" width="36" height="32" rx="12" stroke="#0EA5E9" strokeWidth="2.2" />
        <circle cx="26" cy="32" r="4.2" fill="#0F172A" className="site-assistant__eye" />
        <circle cx="38" cy="32" r="4.2" fill="#0F172A" className="site-assistant__eye" />
        <circle cx="27.2" cy="30.8" r="1.2" fill="#fff" />
        <circle cx="39.2" cy="30.8" r="1.2" fill="#fff" />
        <path
          d="M27 40c2.2 2.4 7.8 2.4 10 0"
          stroke="#0284C7"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="29" y="8" width="6" height="10" rx="3" fill="#38BDF8" />
        <circle cx="32" cy="7" r="3.2" fill="#0EA5E9" className="site-assistant__antenna" />
        <rect x="10" y="28" width="5" height="10" rx="2.5" fill="#7DD3FC" />
        <rect x="49" y="28" width="5" height="10" rx="2.5" fill="#7DD3FC" />
      </svg>
    </span>
  )
}

function matchIntent(raw: string, keys: Record<string, string[]>): string | null {
  const q = raw.toLocaleLowerCase().trim()
  for (const [intent, words] of Object.entries(keys)) {
    if (words.some((w) => q.includes(w.toLocaleLowerCase()))) return intent
  }
  return null
}

export default function SiteAssistant() {
  const { t } = useLanguage()
  const a = t.assistant
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const greeted = useRef(false)

  useEffect(() => {
    if (!open) return
    if (!greeted.current) {
      greeted.current = true
      setMessages([{ id: 'hello', role: 'bot', text: a.greeting }])
    }
  }, [open, a.greeting])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, open])

  const reply = (intent: string) => {
    const id = `${Date.now()}-${intent}`
    if (intent === 'address') {
      setMessages((prev) => [
        ...prev,
        {
          id,
          role: 'bot',
          text: a.addressReply,
          links: [
            { label: a.openMap, href: a.mapHref },
            { label: a.callNow, href: `tel:${a.phoneTel}` },
            { label: a.callNow2, href: `tel:${a.phoneTel2}` },
          ],
        },
      ])
      return
    }
    if (intent === 'phone') {
      setMessages((prev) => [
        ...prev,
        {
          id,
          role: 'bot',
          text: a.phoneReply,
          links: [
            { label: a.callNow, href: `tel:${a.phoneTel}` },
            { label: a.callNow2, href: `tel:${a.phoneTel2}` },
          ],
        },
      ])
      return
    }
    if (intent === 'hours') {
      setMessages((prev) => [
        ...prev,
        { id, role: 'bot', text: a.hoursReply.replace('{hours}', t.topBar.hours) },
      ])
      return
    }
    if (intent === 'prices') {
      setMessages((prev) => [
        ...prev,
        {
          id,
          role: 'bot',
          text: a.pricesReply,
          links: [{ label: a.goPrices, href: '/prices' }],
        },
      ])
      return
    }
    if (intent === 'doctors') {
      setMessages((prev) => [
        ...prev,
        {
          id,
          role: 'bot',
          text: a.doctorsReply,
          links: [{ label: a.goDoctors, href: '/doctors' }],
        },
      ])
      return
    }
    if (intent === 'book') {
      setMessages((prev) => [
        ...prev,
        {
          id,
          role: 'bot',
          text: a.bookReply,
          links: [{ label: a.goBook, href: '/doctors' }],
        },
      ])
      return
    }
    setMessages((prev) => [...prev, { id, role: 'bot', text: a.fallback }])
  }

  const ask = (label: string, intent: string) => {
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: label }])
    window.setTimeout(() => reply(intent), 220)
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text }])
    const intent =
      matchIntent(text, {
        address: a.keywords.address,
        phone: a.keywords.phone,
        hours: a.keywords.hours,
        prices: a.keywords.prices,
        doctors: a.keywords.doctors,
        book: a.keywords.book,
      }) ?? 'fallback'
    window.setTimeout(() => reply(intent === 'fallback' ? 'fallback' : intent), 260)
  }

  return (
    <div className={`site-assistant${open ? ' is-open' : ''}`}>
      <AnimatePresence>
        {open ? (
          <motion.section
            key="panel"
            id={panelId}
            className="site-assistant__panel"
            role="dialog"
            aria-label={a.name}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="site-assistant__head">
              <RobotHead className="site-assistant__robot--sm" />
              <div>
                <p className="site-assistant__name">{a.name}</p>
                <p className="site-assistant__status">{a.online}</p>
              </div>
              <button
                type="button"
                className="site-assistant__close"
                aria-label={a.close}
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </header>

            <div className="site-assistant__messages" ref={listRef}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`site-assistant__bubble site-assistant__bubble--${msg.role}`}
                >
                  <p>{msg.text}</p>
                  {msg.links?.length ? (
                    <div className="site-assistant__links">
                      {msg.links.map((link) => (
                        <a key={link.href + link.label} href={link.href}>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="site-assistant__chips" role="group" aria-label={a.quickLabel}>
              <button type="button" onClick={() => ask(a.chipAddress, 'address')}>
                {a.chipAddress}
              </button>
              <button type="button" onClick={() => ask(a.chipPhone, 'phone')}>
                {a.chipPhone}
              </button>
              <button type="button" onClick={() => ask(a.chipHours, 'hours')}>
                {a.chipHours}
              </button>
              <button type="button" onClick={() => ask(a.chipPrices, 'prices')}>
                {a.chipPrices}
              </button>
              <button type="button" onClick={() => ask(a.chipDoctors, 'doctors')}>
                {a.chipDoctors}
              </button>
              <button type="button" onClick={() => ask(a.chipBook, 'book')}>
                {a.chipBook}
              </button>
            </div>

            <form className="site-assistant__form" onSubmit={onSubmit}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={a.placeholder}
                aria-label={a.placeholder}
                autoComplete="off"
              />
              <button type="submit" aria-label={a.send}>
                →
              </button>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        className="site-assistant__fab"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? a.close : a.open}
        onClick={() => setOpen((v) => !v)}
      >
        <RobotHead />
        {!open ? <span className="site-assistant__fab-dot" aria-hidden /> : null}
      </button>
    </div>
  )
}
