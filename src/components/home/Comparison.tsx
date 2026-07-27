import { motion } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import HdHead from './HdHead'
import { settle, settleStagger, inView } from '../../lib/homeDarkMotion'

/** CH.04 — the usual route against this clinic, row by row. */
export default function Comparison() {
  const { t } = useLanguage()
  const copy = t.homeDark.compare

  return (
    <section className="hd-section hd-compare" aria-labelledby="hd-compare-title">
      <div className="container-main">
        <HdHead
          channel={copy.channel}
          title={
            <span id="hd-compare-title">
              {copy.title1} <em>{copy.titleEm}</em>
            </span>
          }
          description={copy.description}
        />

        <motion.div
          className="hd-compare__table"
          variants={settleStagger(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          {/* Visual header only — each cell repeats its column name on narrow screens. */}
          <div className="hd-compare__row hd-compare__row--head" aria-hidden>
            <span className="hd-compare__cell" />
            <span className="hd-compare__cell">{copy.colA}</span>
            <span className="hd-compare__cell hd-compare__cell--after">{copy.colB}</span>
          </div>

          {copy.rows.map((row) => (
            <motion.div key={row.label} className="hd-compare__row" variants={settle}>
              <span className="hd-compare__cell">{row.label}</span>
              <span className="hd-compare__cell hd-compare__cell--before" data-col={copy.colA}>
                <span className="hd-compare__mark" aria-hidden>
                  ·
                </span>
                {row.before}
              </span>
              <span className="hd-compare__cell hd-compare__cell--after" data-col={copy.colB}>
                <span className="hd-compare__mark" aria-hidden>
                  ✓
                </span>
                {row.after}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
