import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { ContentLang } from '../../i18n/types'
import {
  daCopy,
  physicianScenarios,
  protocolFromCustom,
  type PhysicianScenario,
} from '../../data/doctorAssistantDemo'

type Draft = Pick<PhysicianScenario, 'subjective' | 'objective' | 'plan' | 'icd'> & {
  title: string
}

export default function PhysicianDemo({ lang }: { lang: ContentLang }) {
  const c = daCopy[lang]
  const [scenarioId, setScenarioId] = useState(physicianScenarios[0].id)
  const [custom, setCustom] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [copied, setCopied] = useState(false)

  const activeScenario = useMemo(
    () => physicianScenarios.find((s) => s.id === scenarioId) ?? physicianScenarios[0],
    [scenarioId],
  )

  const runAnalyze = () => {
    if (analyzing) return
    setAnalyzing(true)
    setCopied(false)
    window.setTimeout(() => {
      if (custom.trim().length >= 8) {
        const built = protocolFromCustom(custom, lang)
        setDraft({
          title: custom.trim().slice(0, 72),
          ...built,
        })
      } else {
        setDraft({
          title: activeScenario.title[lang],
          subjective: activeScenario.subjective,
          objective: activeScenario.objective,
          plan: activeScenario.plan,
          icd: activeScenario.icd,
        })
      }
      setAnalyzing(false)
    }, 900)
  }

  const reset = () => {
    setDraft(null)
    setCopied(false)
    setCustom('')
    setScenarioId(physicianScenarios[0].id)
  }

  const copyAll = async () => {
    if (!draft) return
    const text = [
      draft.title,
      '',
      c.physicianSubjective,
      draft.subjective[lang],
      '',
      c.physicianObjective,
      draft.objective[lang],
      '',
      c.physicianPlan,
      draft.plan[lang],
      '',
      c.physicianIcd,
      ...draft.icd.map((row) => `${row.code} — ${row.label[lang]}`),
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="da-panel">
      <div className="da-block">
        <p className="da-block__hint">{c.physicianPick}</p>
        <div className="da-scenarios">
          {physicianScenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`da-scenario${scenarioId === s.id && !custom.trim() ? ' is-active' : ''}`}
              onClick={() => {
                setScenarioId(s.id)
                setCustom('')
                setDraft(null)
              }}
            >
              <strong>{s.title[lang]}</strong>
              <span>{s.complaint[lang]}</span>
            </button>
          ))}
        </div>

        <p className="da-or">{c.physicianOr}</p>
        <textarea
          rows={3}
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value)
            setDraft(null)
          }}
          placeholder={c.physicianCustomPh}
          aria-label={c.physicianCustomPh}
        />

        {!draft && (
          <button
            type="button"
            className="btn-accent da-btn"
            disabled={analyzing}
            onClick={runAnalyze}
          >
            {analyzing ? c.physicianAnalyzing : c.physicianAnalyze}
          </button>
        )}
      </div>

      <AnimatePresence>
        {draft && (
          <motion.div
            className="da-protocol"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <header className="da-protocol__head">
              <h3>{draft.title}</h3>
              <div className="da-protocol__actions">
                <button type="button" className="btn-outline btn-sm" onClick={copyAll}>
                  {copied ? c.physicianCopied : c.physicianCopy}
                </button>
                <button type="button" className="da-link" onClick={reset}>
                  {c.physicianReset}
                </button>
              </div>
            </header>

            <section className="da-protocol__section">
              <h4>{c.physicianSubjective}</h4>
              <p>{draft.subjective[lang]}</p>
            </section>
            <section className="da-protocol__section">
              <h4>{c.physicianObjective}</h4>
              <p>{draft.objective[lang]}</p>
            </section>
            <section className="da-protocol__section">
              <h4>{c.physicianPlan}</h4>
              <p>{draft.plan[lang]}</p>
            </section>
            <section className="da-protocol__section">
              <h4>{c.physicianIcd}</h4>
              <ul className="da-icd">
                {draft.icd.map((row) => (
                  <li key={row.code}>
                    <code>{row.code}</code>
                    <span>{row.label[lang]}</span>
                  </li>
                ))}
              </ul>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
