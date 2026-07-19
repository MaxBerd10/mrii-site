import { useState } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { blurUp, fadeUp, staggerContainer, fadeUpSmall } from '../lib/animations'

const PHASE_COLORS = ['#6366F1', '#0891B2', '#0B3D6B', '#059669']
const WHY_LIMIT = 6
const CAPABILITY_LIMIT = 8

export default function Research() {
  const { t } = useLanguage()
  const [tab, setTab] = useState(0)
  const whyItems = t.research.whyItems.slice(0, WHY_LIMIT)
  const capabilities = t.research.capabilities.slice(0, CAPABILITY_LIMIT)
  const stats = [
    [t.research.capabilities[1]?.value ?? '18+', t.research.capabilities[1]?.label ?? ''],
    [t.research.capabilities[2]?.value ?? '50 000+', t.research.capabilities[2]?.label ?? ''],
    [t.research.capabilities[3]?.value ?? '35', t.research.capabilities[3]?.label ?? ''],
  ] as const

  return (
    <section id="research" className="section section--white">
      <div className="container-main">
        <Reveal variants={blurUp}>
          <SectionHeader
            label={t.research.label}
            title={<>{t.research.title1} <em>{t.research.titleEm}</em></>}
            description={t.research.description}
            accent="#5B4CDB"
          />
        </Reveal>

        <motion.div
          className="stat-row research-stats"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05, margin: '120px 0px' }}
        >
          {stats.map(([value, label], i) => (
            <motion.div key={i} className="stat-row__item" variants={fadeUpSmall}>
              <div className="stat-row__value">{value}</div>
              <div className="stat-row__label">{label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="research-console"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2, margin: '80px 0px' }}
        >
          <div className="research-console__main">
            <div className="tab-bar" role="tablist">
              {t.research.tabs.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={tab === i}
                  aria-controls={`research-panel-${i}`}
                  id={`research-tab-${i}`}
                  className={`tab-bar__btn ${tab === i ? 'tab-bar__btn--active' : ''}`}
                  onClick={() => setTab(i)}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === 0 && (
              <div id="research-panel-0" role="tabpanel" aria-labelledby="research-tab-0">
                <h3 className="research-console__title">{t.research.whyTitle}</h3>
                <div className="research-why-grid">
                  {whyItems.map((item, i) => (
                    <div key={i} className="card research-console__item research-why-item">
                      <div className="research-why-item__dot" aria-hidden />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <a href="#contacts" className="btn-outline btn-sm">{t.research.sponsorBtn}</a>
              </div>
            )}

            {tab === 1 && (
              <div id="research-panel-1" role="tabpanel" aria-labelledby="research-tab-1" className="research-studies">
                {t.research.studies.slice(0, 3).map(s => (
                  <div key={s.id} className="card research-study">
                    <div className="flex-row--between" style={{ alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="flex-row" style={{ gap: 8, marginBottom: 4 }}>
                          <span className="research-study__id">{s.id}</span>
                          <span
                            className="badge"
                            style={{
                              fontSize: 10,
                              padding: '2px 8px',
                              color: s.status === 'open' ? '#059669' : 'var(--muted-foreground)',
                              background: s.status === 'open' ? 'rgba(51, 230, 208, 0.12)' : 'var(--muted)',
                            }}
                          >
                            {s.status === 'open' ? t.research.statusOpen : t.research.statusClosed}
                          </span>
                        </div>
                        <div className="research-study__title">{s.title}</div>
                        <div className="research-study__area">{s.area}</div>
                      </div>
                      <span className="research-study__phase">
                        {t.research.phase} {s.phase}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 2 && (
              <div id="research-panel-2" role="tabpanel" aria-labelledby="research-tab-2">
                <h3 className="research-console__title">{t.research.croTitle}</h3>
                <p className="section-desc research-cro-desc">{t.research.croDesc}</p>
                <div className="research-why-grid">
                  {t.research.croFeatures.map((f, i) => (
                    <div key={i} className="card research-cro-feature">→ {f}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="card research-console__metrics">
            <div className="section-label research-console__metrics-label">{t.research.capabilitiesTitle}</div>
            {capabilities.map((c, i) => (
              <div
                key={i}
                className={`research-metric-row${i < capabilities.length - 1 ? ' research-metric-row--border' : ''}`}
              >
                <span className="research-metric-row__label">{c.label}</span>
                <span className={`research-metric-row__value${c.highlight ? ' research-metric-row__value--accent' : ''}`}>
                  {c.value}
                </span>
              </div>
            ))}

            <div className="research-phases">
              <div className="research-phases__title">{t.research.phasesTitle}</div>
              <div className="research-phases__chips">
                {t.research.phases.map((sp, i) => (
                  <div
                    key={sp.phase}
                    className="research-phase-chip"
                    style={{ ['--phase-color' as string]: PHASE_COLORS[i] }}
                  >
                    <span className="research-phase-chip__name">{sp.phase}</span>
                    <span className="research-phase-chip__count">{sp.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </motion.div>
      </div>
    </section>
  )
}
