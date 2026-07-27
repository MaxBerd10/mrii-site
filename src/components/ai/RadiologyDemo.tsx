import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { ContentLang } from '../../i18n/types'
import {
  radiologyDemoCopy,
  radiologyScans,
  type RadiologyDemoScan,
} from '../../data/radiologyDemo'

type Output = {
  scan: RadiologyDemoScan
  note: string
}

export default function RadiologyDemo({ lang }: { lang: ContentLang }) {
  const c = radiologyDemoCopy[lang]
  const [scanId, setScanId] = useState(radiologyScans[0].id)
  const [note, setNote] = useState('')
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<Output | null>(null)

  const active = useMemo(
    () => radiologyScans.find((s) => s.id === scanId) ?? radiologyScans[0],
    [scanId],
  )

  const run = () => {
    if (running) return
    setRunning(true)
    window.setTimeout(() => {
      setOutput({ scan: active, note: note.trim() })
      setRunning(false)
    }, 850)
  }

  return (
    <section className="ai-rad" aria-label={c.title}>
      <div className="ai-rad__head">
        <h2>{c.title}</h2>
        <p>{c.desc}</p>
      </div>

      <div className="ai-rad__grid">
        <div className="ai-rad__panel">
          <label className="ai-rad__label" htmlFor="ai-rad-scan">
            {c.selectLabel}
          </label>
          <select
            id="ai-rad-scan"
            value={scanId}
            onChange={(e) => {
              setScanId(e.target.value)
              setOutput(null)
            }}
          >
            {radiologyScans.map((scan) => (
              <option key={scan.id} value={scan.id}>
                {scan.label[lang]} ({scan.modality[lang]})
              </option>
            ))}
          </select>

          <label className="ai-rad__label" htmlFor="ai-rad-note">
            {c.inputLabel}
          </label>
          <textarea
            id="ai-rad-note"
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
                key={output.scan.id}
                className="ai-rad__report"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <div className="ai-rad__risk">
                  <span>{c.risk}</span>
                  <strong>{output.scan.risk[lang]}</strong>
                </div>

                <section>
                  <h3>{c.findings}</h3>
                  <ul>
                    {output.scan.findings[lang].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3>{c.recommendation}</h3>
                  <p>{output.scan.recommendation[lang]}</p>
                </section>

                <section>
                  <h3>{c.report}</h3>
                  <p>{output.scan.reportSnippet[lang]}</p>
                  {output.note ? <p className="ai-rad__note">{output.note}</p> : null}
                </section>

                <section>
                  <h3>{c.icd}</h3>
                  <ul className="ai-rad__icd">
                    {output.scan.icd.map((row) => (
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
