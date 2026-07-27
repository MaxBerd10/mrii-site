import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import HdHead from './HdHead'
import { settle, settleStagger, inView } from '../../lib/homeDarkMotion'

/**
 * CH.05 — the five stages of a patient's path.
 *
 * The spine draws itself as you scroll: the trace, applied to the page's own
 * reading order. Five steps genuinely carry sequence, so they are numbered.
 */
export default function PatientPath() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const trackRef = useRef<HTMLOListElement>(null)
  const copy = t.homeDark.path

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 78%', 'end 62%'],
  })
  const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })
  const scaleY = useTransform(drawn, [0, 1], [0, 1])

  return (
    <section className="hd-section hd-path" aria-labelledby="hd-path-title">
      <div className="container-main">
        <HdHead
          channel={copy.channel}
          title={
            <span id="hd-path-title">
              {copy.title1} <em>{copy.titleEm}</em>
            </span>
          }
          description={copy.description}
        />

        <motion.ol
          ref={trackRef}
          className="hd-path__track"
          variants={settleStagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          <span className="hd-path__spine" aria-hidden>
            <motion.i style={reduce ? undefined : { scaleY }} />
          </span>

          {copy.steps.map((step) => (
            <motion.li key={step.num} className="hd-path__step" variants={settle}>
              <span className="hd-path__node" aria-hidden />
              <div>
                <span className="hd-path__num">{step.num}</span>
                <h3 className="hd-path__title">{step.title}</h3>
                <span className="hd-path__meta">{step.meta}</span>
              </div>
              <p className="hd-path__desc">{step.desc}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
