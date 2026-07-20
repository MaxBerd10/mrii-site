import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import { fetchNewsArticle, isCmsEnabled, type CmsNewsDetail } from '../api/client'
import { media } from '../data/media'
import { getNewsBySlug, newsArticles, newsPageLabels } from '../data/newsDetails'
import { blurUp, rise3d, staggerContainer } from '../lib/animations'
import SectionBackLink from '../components/ui/SectionBackLink'

const NEWS_IMAGES = Object.values(media.news)

type ViewModel = {
  slug: string
  title: string
  date: string
  category: string
  categoryColor: string
  excerpt: string
  cover: string
  lead: string
  body: string[]
  index: number
}

function formatDate(value: string | null | undefined) {
  if (!value) return ''
  return value
}

export default function NewsPage({ slug }: { slug: string }) {
  const { lang, t } = useLanguage()
  const { home } = useCms()
  const labels = newsPageLabels[lang]
  const staticMatch = getNewsBySlug(slug)
  const [cmsDetail, setCmsDetail] = useState<CmsNewsDetail | null>(null)
  const [triedCms, setTriedCms] = useState(!isCmsEnabled())

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
    fetchNewsArticle(slug, lang).then((data) => {
      if (!cancelled) {
        setCmsDetail(data)
        setTriedCms(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [slug, lang])

  const view: ViewModel | null = (() => {
    if (cmsDetail) {
      const staticIndex = newsArticles.findIndex((item) => item.slug === slug)
      const index = staticIndex >= 0 ? staticIndex : 0
      return {
        slug: cmsDetail.slug,
        title: cmsDetail.title,
        date: formatDate(cmsDetail.date) || t.news.items[index]?.date || '',
        category: cmsDetail.category,
        categoryColor: cmsDetail.category_color,
        excerpt: cmsDetail.excerpt,
        cover: cmsDetail.cover || NEWS_IMAGES[index] || NEWS_IMAGES[0],
        lead: cmsDetail.lead,
        body: cmsDetail.body,
        index,
      }
    }
    if (!triedCms && isCmsEnabled()) return null
    if (!staticMatch) return null
    const { article, index } = staticMatch
    const item = t.news.items[index]
    const content = article.content[lang]
    return {
      slug: article.slug,
      title: item.title,
      date: item.date,
      category: item.category,
      categoryColor: item.categoryColor,
      excerpt: item.excerpt,
      cover: NEWS_IMAGES[index],
      lead: content.lead,
      body: content.body,
      index,
    }
  })()

  useEffect(() => {
    if (view) document.title = `${view.title} — MRII`
  }, [view?.title])

  if (!triedCms && isCmsEnabled() && !view) {
    return (
      <section className="specialty-not-found">
        <p>{labels.back}…</p>
      </section>
    )
  }

  if (!view) {
    return (
      <section className="specialty-not-found">
        <h1>404</h1>
        <SectionBackLink href="/#news">{labels.back}</SectionBackLink>
      </section>
    )
  }

  const relatedFromCms = home?.news?.filter((item) => item.slug !== slug)
  const related = relatedFromCms?.length
    ? relatedFromCms.map((item, i) => ({
        slug: item.slug,
        title: item.title,
        date: formatDate(item.date),
        category: item.category,
        categoryColor: item.category_color,
        excerpt: item.excerpt,
        cover: item.cover || NEWS_IMAGES[i] || NEWS_IMAGES[0],
      }))
    : newsArticles
        .map((entry, entryIndex) => ({ ...entry, index: entryIndex }))
        .filter((entry) => entry.slug !== slug)
        .map((entry) => {
          const relatedItem = t.news.items[entry.index]
          return {
            slug: entry.slug,
            title: relatedItem.title,
            date: relatedItem.date,
            category: relatedItem.category,
            categoryColor: relatedItem.categoryColor,
            excerpt: relatedItem.excerpt,
            cover: NEWS_IMAGES[entry.index],
          }
        })

  return (
    <main className="news-page">
      <section className="news-article">
        <div className="container-main news-article__inner">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SectionBackLink href="/#news" className="news-article__back">
              ← {labels.back}
            </SectionBackLink>
          </motion.div>

          <motion.div
            className="news-article__media"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={view.cover} alt={view.title} />
            <span
              className="news-card__badge"
              style={{ color: view.categoryColor, background: `${view.categoryColor}18` }}
            >
              {view.category}
            </span>
          </motion.div>

          <motion.div
            className="news-article__copy"
            variants={staggerContainer(.08, .04)}
            initial="hidden"
            animate="show"
          >
            <motion.time className="news-card__date" variants={blurUp}>{view.date}</motion.time>
            <motion.h1 variants={blurUp}>{view.title}</motion.h1>
            <motion.p className="news-article__lead" variants={blurUp}>{view.lead}</motion.p>
            {view.body.map((paragraph) => (
              <motion.p key={paragraph} className="news-article__text" variants={blurUp}>
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="news-article__related section section--white">
        <div className="container-main">
          <div className="news-article__related-head">
            <span className="specialty-page__eyebrow">{t.news.label}</span>
            <h2>{labels.related}</h2>
          </div>
          <motion.div
            className="news-grid"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {related.map((entry) => (
              <motion.a
                key={entry.slug}
                href={`/news/${entry.slug}`}
                className="news-card news-card--link"
                variants={rise3d}
              >
                <div className="news-card__media">
                  <img src={entry.cover} alt="" loading="lazy" className="news-card-img" />
                  <span
                    className="news-card__badge"
                    style={{ color: entry.categoryColor, background: `${entry.categoryColor}18` }}
                  >
                    {entry.category}
                  </span>
                </div>
                <div className="news-card__body">
                  <time className="news-card__date">{entry.date}</time>
                  <h3 className="news-card__title">{entry.title}</h3>
                  <p className="news-card__excerpt">{entry.excerpt}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
