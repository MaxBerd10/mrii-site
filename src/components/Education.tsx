import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import Reveal from './ui/Reveal'
import { staggerContainer, rise3d, blurUp } from '../lib/animations'
import '../styles/education-page.css'

const PREVIEW_COUNT = 6

type TrackFilter = 'all' | number

export default function Education() {
  const { t, lang } = useLanguage()
  const { home } = useCms()
  const [filter, setFilter] = useState<TrackFilter>('all')
  const [expanded, setExpanded] = useState(false)

  const tracks = useMemo(
    () =>
      home?.education?.length
        ? home.education.map((track, i) => ({
            audience: track.audience,
            color: track.color || t.education.tracks[i]?.color || '#059669',
            icon: track.icon || t.education.tracks[i]?.icon || '🎓',
            cta: t.education.tracks[i]?.cta ?? '→',
            programs: track.programs,
          }))
        : t.education.tracks,
    [home?.education, t.education.tracks],
  )

  const programs = useMemo(
    () =>
      tracks.flatMap((track, trackIndex) =>
        track.programs.map((prog, progIndex) => ({
          id: `${trackIndex}-${progIndex}`,
          trackIndex,
          audience: track.audience,
          color: track.color,
          icon: track.icon,
          cta: track.cta,
          name: prog.name,
          duration: prog.duration,
          spots: prog.spots,
        })),
      ),
    [tracks],
  )

  const filtered = filter === 'all' ? programs : programs.filter((p) => p.trackIndex === filter)
  const hasMore = filtered.length > PREVIEW_COUNT
  const visible = expanded || !hasMore ? filtered : filtered.slice(0, PREVIEW_COUNT)
  const hiddenCount = Math.max(0, filtered.length - PREVIEW_COUNT)

  useEffect(() => {
    setExpanded(false)
  }, [filter])

  return (
    <section id="education" className="education-section education-section--page">
      <div className="container-main education-page">
        <Reveal variants={blurUp}>
          <header className="education-hero">
            <div className="education-hero__copy">
              <span className="education-hero__label">
                <span className="education-hero__dot" aria-hidden />
                {t.education.pageLabel}
              </span>
              <h1 className="education-hero__title">
                {t.education.title1} <em>{t.education.titleEm}</em>
              </h1>
              <p className="education-hero__desc">{t.education.description}</p>
            </div>
            <div className="education-hero__aside">
              <a href="/contacts" className="education-hero__cta">
                {t.education.applyBtn}
              </a>
            </div>
          </header>
        </Reveal>

        <div className="education-toolbar" role="tablist" aria-label={t.education.pageLabel}>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            className={`education-toolbar__btn${filter === 'all' ? ' is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <span className="education-toolbar__text">{t.education.filtersAll}</span>
            <span className="education-toolbar__count">{programs.length}</span>
          </button>
          {tracks.map((track, i) => (
            <button
              key={track.audience}
              type="button"
              role="tab"
              aria-selected={filter === i}
              className={`education-toolbar__btn${filter === i ? ' is-active' : ''}`}
              onClick={() => setFilter(i)}
            >
              <span
                className="education-toolbar__dot"
                style={{ background: track.color }}
                aria-hidden
              />
              <span className="education-toolbar__text">{track.audience}</span>
              <span className="education-toolbar__count">{track.programs.length}</span>
            </button>
          ))}
        </div>

        <div className="education-caps" aria-label={t.education.programsLabel}>
          {t.education.stats.map(([value, label]) => (
            <div key={label} className="education-cap">
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <motion.div
          key={`${filter}-${lang}-${expanded ? 'all' : 'preview'}`}
          className="education-catalog"
          variants={staggerContainer(0.04, 0.02)}
          initial="hidden"
          animate="show"
        >
          {visible.map((prog) => (
            <motion.a
              key={prog.id}
              href="/contacts"
              className="education-card"
              variants={rise3d}
              style={{ '--edu-accent': prog.color } as CSSProperties}
            >
              <div className="education-card__top">
                <span className="education-card__eyebrow">{prog.audience}</span>
                <span className="education-card__icon" aria-hidden>
                  {prog.icon}
                </span>
              </div>
              <strong className="education-card__title">{prog.name}</strong>
              <div className="education-card__meta">
                <span>{prog.duration}</span>
                <span>{prog.spots}</span>
              </div>
              <span className="education-card__link">
                {prog.cta} <span aria-hidden>→</span>
              </span>
            </motion.a>
          ))}
        </motion.div>

        {hasMore ? (
          <div className="education-more">
            <button
              type="button"
              className="education-more__btn"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded
                ? t.education.showLess
                : `${t.education.showMore}${hiddenCount ? ` · ${hiddenCount}` : ''}`}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
