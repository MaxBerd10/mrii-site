import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import { fetchAIProduct, isCmsEnabled, type CmsAIDetail } from '../api/client'
import { media } from '../data/media'
import { aiPageLabels, aiProducts, getAIProductBySlug } from '../data/aiDetails'
import { blurUp, rise3d, staggerContainer } from '../lib/animations'
import SectionBackLink from '../components/ui/SectionBackLink'
import NotFoundPage from './NotFoundPage'

const PRODUCT_IMAGES = [
  media.ai.doctor,
  media.ai.radiology,
  media.ai.ultrasound,
  media.ai.clinicalResearch,
]

type ViewModel = {
  slug: string
  name: string
  tag: string
  tagColor: string
  features: string[]
  metric: string
  metricLabel: string
  image: string
  overview: string
  audience: string
  outcomes: string[]
  workflow: string[]
  cases: { title: string; result: string }[]
  index: number
}

export default function AIProductPage({ slug }: { slug: string }) {
  const { lang, contentLang, t } = useLanguage()
  const { home } = useCms()
  const labels = aiPageLabels[contentLang]
  const staticMatch = getAIProductBySlug(slug)
  const [cmsDetail, setCmsDetail] = useState<CmsAIDetail | null>(null)
  const [triedCms, setTriedCms] = useState(!isCmsEnabled())
  const [form, setForm] = useState({ name: '', phone: '', email: '', clinic: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState<null | { requestId: string; phone: string }>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (!isCmsEnabled()) {
      setCmsDetail(null)
      setTriedCms(true)
      return
    }
    let cancelled = false
    setTriedCms(false)
    fetchAIProduct(slug, lang).then((data) => {
      if (!cancelled) {
        setCmsDetail(data)
        setTriedCms(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [slug, lang])

  useEffect(() => {
    if (!confirmation) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConfirmation(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [confirmation])

  const view: ViewModel | null = (() => {
    const staticCases = staticMatch?.detail.content[contentLang].cases ?? []
    if (cmsDetail) {
      const staticIndex = aiProducts.findIndex((item) => item.slug === slug)
      const index = staticIndex >= 0 ? staticIndex : 0
      const fallbackProduct = t.ai.products[index]
      return {
        slug: cmsDetail.slug,
        name: cmsDetail.name,
        tag: cmsDetail.tag,
        tagColor: cmsDetail.tag_color || fallbackProduct?.tagColor || '#5B4CDB',
        features: cmsDetail.features,
        metric: cmsDetail.metric,
        metricLabel: cmsDetail.metric_label,
        image: cmsDetail.image || PRODUCT_IMAGES[index] || PRODUCT_IMAGES[0],
        overview: cmsDetail.overview,
        audience: cmsDetail.audience,
        outcomes: cmsDetail.outcomes,
        workflow: cmsDetail.workflow,
        cases: staticCases,
        index,
      }
    }
    if (!triedCms && isCmsEnabled()) return null
    if (!staticMatch) return null
    const { detail, index } = staticMatch
    const product = t.ai.products[index]
    const content = detail.content[contentLang]
    return {
      slug: detail.slug,
      name: product.name,
      tag: product.tag,
      tagColor: product.tagColor,
      features: product.features,
      metric: product.metric,
      metricLabel: product.metricLabel,
      image: PRODUCT_IMAGES[index],
      overview: content.overview,
      audience: content.audience,
      outcomes: content.outcomes,
      workflow: content.workflow,
      cases: content.cases,
      index,
    }
  })()

  useEffect(() => {
    if (view) document.title = `${view.name} — ${t.nav.brand}`
  }, [view?.name])

  if (!triedCms && isCmsEnabled() && !view) {
    return (
      <section className="specialty-not-found">
        <p>{labels.back}…</p>
      </section>
    )
  }

  if (!view) {
    return <NotFoundPage />
  }

  const relatedFromCms = home?.aiProducts?.filter((item) => item.slug !== slug)
  const related = relatedFromCms?.length
    ? relatedFromCms.map((item, i) => ({
        slug: item.slug,
        name: item.name,
        tag: item.tag,
        tagColor: item.tag_color,
        image: item.image || PRODUCT_IMAGES[i] || PRODUCT_IMAGES[0],
      }))
    : aiProducts
        .map((item, itemIndex) => ({ ...item, index: itemIndex }))
        .filter((item) => item.slug !== slug)
        .map((item) => {
          const relatedProduct = t.ai.products[item.index]
          return {
            slug: item.slug,
            name: relatedProduct.name,
            tag: relatedProduct.tag,
            tagColor: relatedProduct.tagColor,
            image: PRODUCT_IMAGES[item.index],
          }
        })

  const submitDemo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    window.setTimeout(() => {
      setConfirmation({
        requestId: `AI-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        phone: form.phone,
      })
      setForm({ name: '', phone: '', email: '', clinic: '', message: '' })
      setSubmitting(false)
    }, 750)
  }

  return (
    <main className="ai-page">
      <section className="ai-product-hero">
        <div className="container-main ai-product-hero__grid">
          <motion.div
            className="ai-product-hero__visual"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={view.image} alt={view.name} />
            <div className="ai-product-hero__metric" style={{ color: view.tagColor }}>
              <strong>{view.metric}</strong>
              <span>{view.metricLabel}</span>
            </div>
          </motion.div>

          <motion.div
            className="ai-product-hero__copy"
            variants={staggerContainer(.08, .04)}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={blurUp}>
              <SectionBackLink href="/ai" className="ai-product__back">
                ← {labels.back}
              </SectionBackLink>
            </motion.div>
            <motion.div variants={blurUp} className="ai-product__tag-wrap">
              <span
                className="ai-product__tag"
                style={{ color: view.tagColor, background: `${view.tagColor}15` }}
              >
                {view.tag}
              </span>
            </motion.div>
            <motion.h1 variants={blurUp}>{view.name}</motion.h1>
            <motion.p className="ai-product-hero__lead" variants={blurUp}>{view.overview}</motion.p>
            <motion.p className="ai-product-hero__audience" variants={blurUp}>{view.audience}</motion.p>
            <motion.div className="ai-product-hero__actions" variants={blurUp}>
              <a href="#ai-demo" className="btn-accent" style={{ background: view.tagColor }}>
                {labels.demoTitle}
              </a>
              <a href="#ai-cases" className="btn-outline btn-sm">{labels.cases}</a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container-main">
          <motion.div
            className="ai-product-grid"
            variants={staggerContainer(.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: .15 }}
          >
            <motion.article className="ai-product-card" variants={rise3d}>
              <span>01</span>
              <h2>{labels.outcomes}</h2>
              <ul>
                {view.outcomes.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </motion.article>
            <motion.article className="ai-product-card" variants={rise3d}>
              <span>02</span>
              <h2>{labels.workflow}</h2>
              <ul>
                {view.workflow.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </motion.article>
            <motion.article className="ai-product-card" variants={rise3d}>
              <span>03</span>
              <h2>{labels.overview}</h2>
              <ul>
                {view.features.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </motion.article>
          </motion.div>

          {view.cases.length > 0 && (
            <div id="ai-cases" className="ai-product-cases">
              <div className="ai-product-cases__head">
                <span className="specialty-page__eyebrow">{labels.cases}</span>
                <h2>{labels.cases}</h2>
              </div>
              <div className="ai-product-cases__grid">
                {view.cases.map((item) => (
                  <article key={item.title} className="ai-product-case">
                    <h3>{item.title}</h3>
                    <p>{item.result}</p>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div id="ai-demo" className="ai-demo">
            <div className="ai-demo__copy">
              <h2>{labels.demoTitle}</h2>
              <p>{labels.demoDesc}</p>
            </div>
            <form className="ai-demo__form" onSubmit={submitDemo}>
              <div className="ai-demo__row">
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={labels.nameField}
                  aria-label={labels.nameField}
                />
                <input
                  required
                  type="tel"
                  minLength={7}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={labels.phoneField}
                  aria-label={labels.phoneField}
                />
              </div>
              <div className="ai-demo__row">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={labels.emailField}
                  aria-label={labels.emailField}
                />
                <input
                  required
                  type="text"
                  value={form.clinic}
                  onChange={(e) => setForm({ ...form, clinic: e.target.value })}
                  placeholder={labels.clinicField}
                  aria-label={labels.clinicField}
                />
              </div>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={labels.messageField}
                aria-label={labels.messageField}
              />
              <button
                type="submit"
                className="btn-accent"
                style={{ background: view.tagColor }}
                disabled={submitting}
              >
                {submitting ? labels.submitting : labels.demoTitle}
              </button>
            </form>
          </div>

          <div className="ai-product-related">
            <div className="ai-product-related__head">
              <span className="specialty-page__eyebrow">{labels.moreProducts}</span>
              <h2>{labels.related}</h2>
            </div>
            <div className="ai-product-related__grid">
              {related.map((item) => (
                <a key={item.slug} href={`/ai/${item.slug}`} className="ai-product-related__card">
                  <img src={item.image} alt="" />
                  <span style={{ color: item.tagColor }}>{item.tag}</span>
                  <strong>{item.name}</strong>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {confirmation && (
          <motion.div
            className="booking-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setConfirmation(null)
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="ai-demo-success-title"
              className="booking-success__dialog"
              initial={{ opacity: 0, y: 35, scale: .9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: .94 }}
              transition={{ type: 'spring', stiffness: 230, damping: 24 }}
            >
              <button
                autoFocus
                type="button"
                className="booking-success__close"
                aria-label={labels.close}
                onClick={() => setConfirmation(null)}
              >
                ×
              </button>
              <div className="booking-success__visual" aria-hidden>
                <span className="booking-success__ring" />
                <motion.span
                  className="booking-success__check"
                  initial={{ scale: .4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 16, delay: .08 }}
                >
                  ✓
                </motion.span>
              </div>
              <span className="booking-success__eyebrow">
                {labels.requestNumber}: {confirmation.requestId}
              </span>
              <h2 id="ai-demo-success-title">{labels.successTitle}</h2>
              <p>{labels.successDesc}</p>
              <dl className="booking-success__details">
                <div><dt>{labels.productLabel}</dt><dd>{view.name}</dd></div>
                <div><dt>{labels.phoneField}</dt><dd>{confirmation.phone}</dd></div>
              </dl>
              <div className="booking-success__actions">
                <button type="button" className="hp-btn hp-btn--primary" onClick={() => setConfirmation(null)}>
                  {labels.close}
                </button>
                <a href="/ai" className="hp-btn hp-btn--ghost">{labels.moreProducts}</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
