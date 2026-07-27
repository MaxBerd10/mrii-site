import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { ContentLang } from '../../i18n/types'
import {
  clinicalResearchDemoCopy,
  researchStudies,
  type ClinicalResearchDemoStudy,
} from '../../data/clinicalResearchDemo'

type Output = {
  study: ClinicalResearchDemoStudy
  note: string
}

export default function ClinicalResearchDemo({ lang }: { lang: ContentLang }) {
  const c = clinicalResearchDemoCopy[lang]
  const [studyId, setStudyId] = useState(researchStudies[0].id)
  const [note, setNote] = useState('')
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<Output | null>(null)

  const active = useMemo(
    () => researchStudies.find((s) => s.id === studyId) ?? researchStudies[0],
    [studyId],
  )

  const run = () => {
    if (running) return
    setRunning(true)
    window.setTimeout(() => {
      setOutput({ study: active, note: note.trim() })
      setRunning(false)
    }, 900)
  }

  return (
    <section className="ai-rad ai-rad--research" aria-label={c.title}>
      <div className="ai-rad__head">
        <h2>{c.title}</h2>
        <p>{c.desc}</p>
      </div>

      <div className="ai-rad__grid">
        <div className="ai-rad__panel">
          <label className="ai-rad__label" htmlFor="ai-cr-study">
            {c.selectLabel}
          </label>
          <select
            id="ai-cr-study"
            value={studyId}
            onChange={(e) => {
              setStudyId(e.target.value)
              setOutput(null)
            }}
          >
            {researchStudies.map((study) => (
              <option key={study.id} value={study.id}>
                {study.label[lang]} ({study.phase[lang]})
              </option>
            ))}
          </select>

          <label className="ai-rad__label" htmlFor="ai-cr-note">
            {c.inputLabel}
          </label>
          <textarea
            id="ai-cr-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={c.inputPlaceholder}
          />

          <button type="button" className="btn-accent" onClick={run} disabled={running}>
            {running ? c.running : c.run}
          </button>
        </div>

        <div className="ai-rad__result">
          <AnimatePresence mode="wait">
            {!output ? (
              <motion.div
                key="idle"
                className="ai-rad__idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p>{running ? c.running : c.queue}</p>
              </motion.div>
            ) : (
              <motion.div
                key={output.study.id}
                className="ai-rad__report"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <div className="ai-rad__risk">
                  <span>{c.risk}</span>
                  <strong>{output.study.risk[lang]}</strong>
                </div>

                <section>
                  <h3>{c.findings}</h3>
                  <ul>
                    {output.study.findings[lang].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3>{c.recommendation}</h3>
                  <p>{output.study.recommendation[lang]}</p>
                </section>

                <section>
                  <h3>{c.report}</h3>
                  <p>{output.study.reportSnippet[lang]}</p>
                  {output.note ? <p className="ai-rad__note">{output.note}</p> : null}
                </section>

                <section>
                  <h3>{c.icd}</h3>
                  <ul className="ai-rad__icd">
                    {output.study.icd.map((row) => (
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
      </div>
    </section>
  )
}
