import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { ContentLang } from '../../i18n/types'
import { fetchInquiryAdvice, isCmsEnabled, submitInquiry } from '../../api/client'
import {
  buildPatientAiAnalysis,
  daCopy,
  type PatientAiAnalysis,
} from '../../data/doctorAssistantDemo'

type Props = {
  lang: ContentLang
  uiLang: string
}

const empty = {
  name: '',
  phone: '',
  email: '',
  medical_history: '',
  allergies: '',
  message: '',
}

type Phase = 'idle' | 'working' | 'ready'

export default function PatientGuide({ lang, uiLang }: Props) {
  const c = daCopy[lang]
  const [form, setForm] = useState(empty)
  const [phase, setPhase] = useState<Phase>('idle')
  const [logLine, setLogLine] = useState(c.intakeAiIdle)
  const [analysis, setAnalysis] = useState<PatientAiAnalysis | null>(null)
  const [requestId, setRequestId] = useState('')
  const [error, setError] = useState('')
  const [lookupId, setLookupId] = useState('')
  const [lookupBusy, setLookupBusy] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [doctorReply, setDoctorReply] = useState<{ text: string; pending: boolean; name: string } | null>(null)

  useEffect(() => {
    if (phase !== 'idle') return
    setLogLine(c.intakeAiIdle)
  }, [c.intakeAiIdle, phase])

  const reset = () => {
    setPhase('idle')
    setAnalysis(null)
    setRequestId('')
    setError('')
    setDoctorReply(null)
    setLogLine(c.intakeAiIdle)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (phase === 'working') return
    setError('')
    setDoctorReply(null)
    setPhase('working')
    setLogLine(c.intakeAiListening)

    const built = buildPatientAiAnalysis(
      {
        complaints: form.message.trim(),
        history: form.medical_history.trim(),
        allergies: form.allergies.trim(),
      },
      lang,
    )

    await new Promise((r) => window.setTimeout(r, 700))
    setLogLine(c.intakeAiWorking)
    await new Promise((r) => window.setTimeout(r, 1100))

    try {
      let id = `MAS-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
      const messageForAdmin = [
        form.message.trim(),
        '',
        '--- AiShifokor ---',
        built.fullText,
      ].join('\n')

      if (isCmsEnabled()) {
        const result = await submitInquiry({
          intent: 'consult',
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          medical_history: form.medical_history.trim(),
          allergies: form.allergies.trim(),
          message: messageForAdmin,
          product_slug: 'doctor-assistant',
          topic: `AI → ${built.specialtyName}`,
          lang: uiLang,
          source_path: '/ai/doctor-assistant',
        })
        if (!result) throw new Error('fail')
        id = result.request_id
      }

      setAnalysis(built)
      setRequestId(id)
      setLookupId(id)
      setPhase('ready')
      setForm(empty)
    } catch {
      setError(c.intakeError)
      setPhase('idle')
      setLogLine(c.intakeAiIdle)
    }
  }

  const onLookup = async (event: FormEvent) => {
    event.preventDefault()
    if (lookupBusy || !lookupId.trim()) return
    setLookupBusy(true)
    setLookupError('')
    setDoctorReply(null)
    try {
      if (!isCmsEnabled()) {
        setLookupError(c.lookupEmpty)
        return
      }
      const data = await fetchInquiryAdvice(lookupId.trim())
      if (!data) {
        setLookupError(c.lookupNotFound)
        return
      }
      setDoctorReply(
        data.has_advice
          ? { text: data.advice, pending: false, name: data.name }
          : { text: '', pending: true, name: data.name },
      )
    } catch {
      setLookupError(c.lookupError)
    } finally {
      setLookupBusy(false)
    }
  }

  return (
    <div className="da-console">
      <div className="da-console__form-col">
        <p className="da-console__intro">{c.intakeLead}</p>
        <form className="da-intake" onSubmit={onSubmit}>
          <div className="da-lead__row">
            <label className="da-field">
              <span>{c.intakeName}</span>
              <input
                required
                type="text"
                value={form.name}
                disabled={phase === 'working'}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={c.intakeNamePh}
              />
            </label>
            <label className="da-field">
              <span>{c.intakePhone}</span>
              <input
                required
                type="tel"
                minLength={7}
                value={form.phone}
                disabled={phase === 'working'}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder={c.intakePhonePh}
              />
            </label>
          </div>
          <label className="da-field">
            <span>{c.intakeEmail}</span>
            <input
              type="email"
              value={form.email}
              disabled={phase === 'working'}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={c.intakeEmailPh}
            />
          </label>
          <label className="da-field">
            <span>{c.intakeHistory}</span>
            <textarea
              rows={2}
              value={form.medical_history}
              disabled={phase === 'working'}
              onChange={(e) => setForm({ ...form, medical_history: e.target.value })}
              placeholder={c.intakeHistoryPh}
            />
          </label>
          <label className="da-field">
            <span>{c.intakeAllergies}</span>
            <textarea
              rows={2}
              value={form.allergies}
              disabled={phase === 'working'}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              placeholder={c.intakeAllergiesPh}
            />
          </label>
          <label className="da-field">
            <span>{c.intakeComplaints}</span>
            <textarea
              required
              rows={4}
              value={form.message}
              disabled={phase === 'working'}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={c.intakeComplaintsPh}
            />
          </label>
          <button type="submit" className="btn-accent da-btn" disabled={phase === 'working'}>
            {phase === 'working' ? c.intakeSubmitting : c.intakeSubmit}
          </button>
          {error ? (
            <p className="ai-demo__error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>

      <aside className="da-ai" aria-live="polite">
        <header className="da-ai__bar">
          <span className="da-ai__brand">
            <i className={`da-ai__pulse${phase === 'working' ? ' is-busy' : ''}`} />
            {c.intakeAiLabel}
          </span>
          <span className="da-ai__status">
            {phase === 'working' ? 'LIVE' : phase === 'ready' ? 'OK' : 'READY'}
          </span>
        </header>

        <AnimatePresence mode="wait">
          {phase !== 'ready' || !analysis ? (
            <motion.div
              key="stream"
              className="da-ai__stream"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="da-ai__log">{logLine}</p>
              {phase === 'working' ? (
                <div className="da-ai__meter" aria-hidden>
                  <span />
                  <span />
                  <span />
                </div>
              ) : (
                <ul className="da-ai__caps">
                  <li>{c.intakeAiSteps}</li>
                  <li>{c.intakeAiIcd}</li>
                  <li>{c.intakeAiSent}</li>
                </ul>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              className="da-ai__result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="da-ai__ready">{c.intakeAiReady}</p>
              <h3>{analysis.specialtyName}</h3>
              <p>{analysis.summary}</p>
              <div className="da-ai__warn">{analysis.urgency}</div>
              <h4>{c.intakeAiSteps}</h4>
              <ul>
                {analysis.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              <h4>{c.intakeAiIcd}</h4>
              <ul className="da-icd">
                {analysis.icd.map((row) => (
                  <li key={row.code}>
                    <code>{row.code}</code>
                    <span>{row.label}</span>
                  </li>
                ))}
              </ul>
              <div className="da-ai__ticket">
                <span>{c.intakeRequestLabel}</span>
                <strong>{requestId}</strong>
                <p>{c.intakeAiSent}</p>
              </div>
              <button type="button" className="da-link" onClick={reset}>
                {c.intakeAnother}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      <div className="da-lookup da-console__lookup">
        <h3 className="da-lookup__title">{c.lookupTitle}</h3>
        <p className="da-block__hint">{c.lookupDesc}</p>
        <form className="da-lookup__form" onSubmit={onLookup}>
          <input
            type="text"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder={c.lookupPh}
            aria-label={c.lookupPh}
          />
          <button type="submit" className="btn-outline btn-sm" disabled={lookupBusy}>
            {lookupBusy ? c.lookupBusy : c.lookupSubmit}
          </button>
        </form>
        {lookupError ? (
          <p className="ai-demo__error" role="alert">
            {lookupError}
          </p>
        ) : null}
        {doctorReply?.pending ? (
          <div className="da-result__card">
            <h4>{doctorReply.name}</h4>
            <p>{c.lookupPending}</p>
          </div>
        ) : null}
        {doctorReply && !doctorReply.pending ? (
          <div className="da-result__card da-advice">
            <h4>{c.lookupAdviceLabel}</h4>
            <p>{doctorReply.text}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
