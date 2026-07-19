import { useScrollReveal } from '../hooks/useScrollReveal'
import { useCountUp } from '../hooks/useCountUp'
import { useLanguage } from '../i18n/LanguageContext'

function StatCell({ value, label, sub, active }: { value: string; label: string; sub: string; active: boolean }) {
  const display = useCountUp(value, active)
  return (
    <div className="stat-cell">
      <div className="stat-cell__value">{display}</div>
      <div className="stat-cell__label">{label}</div>
      <div className="stat-cell__sub">{sub}</div>
    </div>
  )
}

export default function StatsBar() {
  const { t } = useLanguage()
  const { ref, visible } = useScrollReveal(0.2)

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="stats-float" aria-label="Statistics">
      <div className="container-main">
        <div className="stats-panel">
          {t.stats.items.map((s, i) => (
            <StatCell key={i} value={s.value} label={s.label} sub={s.sub} active={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}
