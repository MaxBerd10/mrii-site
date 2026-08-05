import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import Reveal from './ui/Reveal'
import { staggerContainer, rise3d, blurUp } from '../lib/animations'
import { media } from '../data/media'
import { useCmsContent } from '../lib/cmsLocalized'
import '../styles/research-page.css'

const PREVIEW_COUNT = 4
const TAB_COLORS = ['#6366F1', '#0EA5E9', '#059669'] as const
const PHASE_COLORS = ['#6366F1', '#0891B2', '#0B3D6B', '#059669']
const TAB_HASHES = ['sponsors', 'patients', 'cro'] as const

function hashToTab(hash: string): number {
  const clean = hash.replace(/^#/, '')
  const i = TAB_HASHES.indexOf(clean as (typeof TAB_HASHES)[number])
  return i >= 0 ? i : 0
}

export default function Research() {
  const { t, lang } = useLanguage()
  const { home } = useCms()
  const [tab, setTab] = useState(() =>
    typeof window === 'undefined' ? 0 : hashToTab(window.location.hash),
  )
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const sync = () => setTab(hashToTab(window.location.hash))
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  const selectTab = (i: number) => {
    setTab(i)
    const nextHash = `#${TAB_HASHES[i]}`
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${nextHash}`)
    }
  }
  const cmsRaw = home?.research
  const cms = useCmsContent(lang) ? cmsRaw : null

  const whyItems = cms?.whyItems?.length ? cms.whyItems : t.research.whyItems
  const studies = cms?.studies?.length ? cms.studies : t.research.studies
  const croFeatures = t.research.croFeatures
  const capabilities =
    cms?.capabilities?.length ? cms.capabilities : t.research.capabilities
  const proofCapabilities = capabilities
    .filter((capability) => !/^(Ha|Да|Yes)$/i.test(capability.value))
    .slice(0, 4)
  const panelTitle =
    tab === 0
      ? cms?.whyTitle || t.research.whyTitle
      : tab === 1
        ? t.research.currentTitle
        : t.research.croTitle

  const cards = useMemo(() => {
    if (tab === 0) {
      return whyItems.map((item, i) => ({
        id: `why-${i}`,
        eyebrow: String(i + 1).padStart(2, '0'),
        title: item,
        meta: null as string | null,
        status: null as 'open' | 'closed' | null,
      }))
    }
    if (tab === 1) {
      return studies.map((s) => ({
        id: s.id,
        eyebrow: s.area,
        title: s.title,
        meta: `${t.research.phase} ${s.phase} · ${s.id}`,
        status: s.status as 'open' | 'closed',
      }))
    }
    return croFeatures.map((f, i) => ({
      id: `cro-${i}`,
      eyebrow: String(i + 1).padStart(2, '0'),
      title: f,
      meta: null as string | null,
      status: null as 'open' | 'closed' | null,
    }))
  }, [tab, whyItems, studies, croFeatures, t.research])

  const hasMore = cards.length > PREVIEW_COUNT
  const visible = expanded || !hasMore ? cards : cards.slice(0, PREVIEW_COUNT)
  const hiddenCount = Math.max(0, cards.length - PREVIEW_COUNT)

  useEffect(() => {
    setExpanded(false)
  }, [tab])

  const ctaLabel = (cms?.sponsorBtn || t.research.sponsorBtn).replace(/→\s*$/, '').trim()

  return (
    <section id="research" className="research-section research-section--page">
      <div className="container-main research-page">
        <Reveal variants={blurUp}>
          <header className="research-hero">
            <div className="research-hero__copy">
              <span className="research-hero__label">
                <span className="research-hero__dot" aria-hidden />
                {t.research.pageLabel}
              </span>
              <h1 className="research-hero__title">
                {cms?.title1 || t.research.title1}{' '}
                <em>{cms?.titleEm || t.research.titleEm}</em>
              </h1>
              <p className="research-hero__desc">{cms?.description || t.research.description}</p>
              <div className="research-proof" aria-label={t.research.capabilitiesTitle}>
                {proofCapabilities.map((capability) => (
                  <div className="research-proof__item" key={capability.label}>
                    <strong>{capability.value}</strong>
                    <span>{capability.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="research-hero__aside">
              <figure className="research-hero__photo">
                <img
                  src={media.facilities.research}
                  alt={t.research.pageLabel}
                  decoding="async"
                />
              </figure>
              <a href="/contacts#homiy" className="research-hero__cta">
                {ctaLabel}
              </a>
            </div>
          </header>
        </Reveal>

        <div className="research-toolbar" role="tablist" aria-label={t.research.pageLabel}>
          {t.research.tabs.map((tabLabel, i) => (
            <button
              key={tabLabel}
              id={TAB_HASHES[i]}
              type="button"
              role="tab"
              aria-selected={tab === i}
              className={`research-toolbar__btn${tab === i ? ' is-active' : ''}`}
              onClick={() => selectTab(i)}
            >
              <span
                className="research-toolbar__dot"
                style={{ background: TAB_COLORS[i] }}
                aria-hidden
              />
              <span className="research-toolbar__text">{tabLabel}</span>
              <span className="research-toolbar__count">
                {i === 0 ? whyItems.length : i === 1 ? studies.length : croFeatures.length}
              </span>
            </button>
          ))}
        </div>

        <div className="research-layout">
          <div className="research-main">
            <div className="research-panel-head">
              <h2 className="research-panel-head__title">{panelTitle}</h2>
              <span className="research-panel-head__count">{cards.length}</span>
            </div>

            <motion.div
              key={`${tab}-${lang}-${expanded ? 'all' : 'preview'}`}
              className="research-catalog"
              variants={staggerContainer(0.04, 0.02)}
              initial="hidden"
              animate="show"
            >
              {visible.map((card) => (
                <motion.article
                  key={card.id}
                  className="research-card"
                  variants={rise3d}
                  style={{ ['--research-accent' as string]: TAB_COLORS[tab] }}
                >
                  <div className="research-card__top">
                    <span className="research-card__eyebrow">{card.eyebrow}</span>
                    {card.status ? (
                      <span className={`research-card__status is-${card.status}`}>
                        {card.status === 'open' ? t.research.statusOpen : t.research.statusClosed}
                      </span>
                    ) : (
                      <span className="research-card__mark" aria-hidden />
                    )}
                  </div>
                  <strong className="research-card__title">{card.title}</strong>
                  {card.meta ? <span className="research-card__meta">{card.meta}</span> : null}
                  <a href="/contacts#homiy" className="research-card__link">
                    {ctaLabel} <span aria-hidden>→</span>
                  </a>
                </motion.article>
              ))}
            </motion.div>

            {hasMore ? (
              <div className="research-more">
                <button
                  type="button"
                  className="research-more__btn"
                  aria-expanded={expanded}
                  onClick={() => setExpanded((v) => !v)}
                >
                  {expanded
                    ? t.research.showLess
                    : `${t.research.showMore}${hiddenCount ? ` · ${hiddenCount}` : ''}`}
                </button>
              </div>
            ) : null}
          </div>

          <aside className="research-side">
            <div className="research-side__block">
              <h3 className="research-side__title">{t.research.capabilitiesTitle}</h3>
              <ul className="research-side__list">
                {capabilities
                  .filter((c) => /^(Ha|Да|Yes)$/i.test(c.value))
                  .slice(0, 4)
                  .map((c) => (
                    <li key={c.label}>{c.label}</li>
                  ))}
              </ul>
            </div>

            <div className="research-side__block">
              <h3 className="research-side__title">{t.research.phasesTitle}</h3>
              <div className="research-phases">
                {t.research.phases.map((sp, i) => (
                  <div
                    key={sp.phase}
                    className="research-phase"
                    style={{ ['--phase-color' as string]: PHASE_COLORS[i] }}
                  >
                    <span className="research-phase__name">{sp.phase}</span>
                    <strong className="research-phase__count">{sp.count}</strong>
                  </div>
                ))}
              </div>
            </div>

            {tab === 2 ? (
              <p className="research-side__note">{t.research.croDesc}</p>
            ) : null}
          </aside>
        </div>

      </div>
    </section>
  )
}
