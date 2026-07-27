import { useState } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { daCopy, type DaMode } from '../data/doctorAssistantDemo'
import SectionBackLink from '../components/ui/SectionBackLink'
import PatientGuide from '../components/doctor-assistant/PatientGuide'
import PhysicianDemo from '../components/doctor-assistant/PhysicianDemo'
import '../styles/doctor-assistant.css'

const RELATED_SLUGS = ['radiology', 'ultrasound', 'clinical-research'] as const

export default function DoctorAssistantPage() {
  const { lang, contentLang, t } = useLanguage()
  const c = daCopy[contentLang]
  const [mode, setMode] = useState<DaMode>('patient')

  return (
    <main className="da-page">
      <section className="da-hero da-hero--console">
        <div className="container-main">
          <SectionBackLink href="/ai" className="ai-product__back da-hero__back">
            ← {c.backAi}
          </SectionBackLink>
          <div className="da-hero__brand-row">
            <div>
              <p className="da-hero__eyebrow">{c.eyebrow}</p>
              <h1 className="da-hero__title">{c.title}</h1>
              <p className="da-hero__lead">{c.lead}</p>
            </div>
            <div className="da-hero__signals" aria-hidden>
              <span className="da-hero__chip">{c.freeBadge}</span>
              <span className="da-hero__live">
                <i />
                AI LIVE
              </span>
            </div>
          </div>
          <p className="da-disclaimer" role="note">
            {c.disclaimer}
          </p>
        </div>
      </section>

      <section className="da-workspace">
        <div className="container-main">
          <div className="da-mode" role="tablist" aria-label={c.title}>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'patient'}
              className={`da-mode__btn${mode === 'patient' ? ' is-active' : ''}`}
              onClick={() => setMode('patient')}
            >
              {c.modePatient}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'physician'}
              className={`da-mode__btn${mode === 'physician' ? ' is-active' : ''}`}
              onClick={() => setMode('physician')}
            >
              {c.modePhysician}
            </button>
          </div>

          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {mode === 'patient' ? (
              <PatientGuide lang={contentLang} uiLang={lang} />
            ) : (
              <PhysicianDemo lang={contentLang} />
            )}
          </motion.div>

          <div className="da-related">
            <h2>{c.related}</h2>
            <div className="da-related__row">
              {RELATED_SLUGS.map((slug, i) => {
                const product = t.ai.products[i + 1]
                return (
                  <a key={slug} href={`/ai/${slug}`} className="da-related__link">
                    {product.name}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
