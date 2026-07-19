import { useEffect } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { media } from '../data/media'
import { getNewsBySlug, newsArticles, newsPageLabels } from '../data/newsDetails'
import { blurUp, rise3d, staggerContainer } from '../lib/animations'
import SectionBackLink from '../components/ui/SectionBackLink'

const NEWS_IMAGES = Object.values(media.news)

export default function NewsPage({ slug }: { slug: string }) {
  const { lang, t } = useLanguage()
  const match = getNewsBySlug(slug)
  const labels = newsPageLabels[lang]

  useEffect(() => {
    window.scrollTo(0, 0)
    if (match) document.title = `${t.news.items[match.index].title} — MRII`
  }, [match, t])

  if (!match) {
    return (
      <section className="specialty-not-found">
        <h1>404</h1>
        <SectionBackLink href="/#news">{labels.back}</SectionBackLink>
      </section>
    )
  }

  const { article, index } = match
  const item = t.news.items[index]
  const content = article.content[lang]
  const image = NEWS_IMAGES[index]
  const related = newsArticles
    .map((entry, entryIndex) => ({ ...entry, index: entryIndex }))
    .filter((entry) => entry.index !== index)

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
            <img src={image} alt={item.title} />
            <span
              className="news-card__badge"
              style={{ color: item.categoryColor, background: `${item.categoryColor}18` }}
            >
              {item.category}
            </span>
          </motion.div>

          <motion.div
            className="news-article__copy"
            variants={staggerContainer(.08, .04)}
            initial="hidden"
            animate="show"
          >
            <motion.time className="news-card__date" variants={blurUp}>{item.date}</motion.time>
            <motion.h1 variants={blurUp}>{item.title}</motion.h1>
            <motion.p className="news-article__lead" variants={blurUp}>{content.lead}</motion.p>
            {content.body.map((paragraph) => (
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
            {related.map((entry) => {
              const relatedItem = t.news.items[entry.index]
              return (
                <motion.a
                  key={entry.slug}
                  href={`/news/${entry.slug}`}
                  className="news-card news-card--link"
                  variants={rise3d}
                >
                  <div className="news-card__media">
                    <img src={NEWS_IMAGES[entry.index]} alt="" loading="lazy" className="news-card-img" />
                    <span
                      className="news-card__badge"
                      style={{ color: relatedItem.categoryColor, background: `${relatedItem.categoryColor}18` }}
                    >
                      {relatedItem.category}
                    </span>
                  </div>
                  <div className="news-card__body">
                    <time className="news-card__date">{relatedItem.date}</time>
                    <h3 className="news-card__title">{relatedItem.title}</h3>
                    <p className="news-card__excerpt">{relatedItem.excerpt}</p>
                  </div>
                </motion.a>
              )
            })}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
