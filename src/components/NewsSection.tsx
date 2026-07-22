import { motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { staggerContainer, rise3d, blurUp } from '../lib/animations'
import { media } from '../data/media'
import { newsArticles } from '../data/newsDetails'

const NEWS_IMAGES = Object.values(media.news)

export default function NewsSection() {
  const { t } = useLanguage()
  const { home } = useCms()
  const items = home?.news?.length
    ? home.news.map((item) => ({
        slug: item.slug,
        date: item.date ?? '',
        category: item.category,
        categoryColor: item.category_color,
        title: item.title,
        excerpt: item.excerpt,
        cover: item.cover,
      }))
    : t.news.items.map((item, i) => ({
        slug: newsArticles[i]?.slug ?? `news-${i}`,
        date: item.date,
        category: item.category,
        categoryColor: item.categoryColor,
        title: item.title,
        excerpt: item.excerpt,
        cover: NEWS_IMAGES[i],
      }))

  return (
    <section id="news" className="section section--white news-section">
      <div className="container-main">
        <Reveal variants={blurUp}>
          <SectionHeader
            label={t.news.label}
            title={<>{t.news.title1} <em>{t.news.titleEm}</em></>}
            action={<a href="/news" className="btn-ghost news-section__all">{t.news.allBtn}</a>}
          />
        </Reveal>

        <motion.div
          className="news-grid"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {items.map((item) => (
            <motion.a
              key={item.slug}
              href={`/news/${item.slug}`}
              className="news-card news-card--link"
              variants={rise3d}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <div className="news-card__media">
                <img
                  src={item.cover}
                  alt=""
                  loading="lazy"
                  className="news-card-img"
                />
                <span
                  className="news-card__badge"
                  style={{ color: item.categoryColor, background: `${item.categoryColor}18` }}
                >
                  {item.category}
                </span>
              </div>
              <div className="news-card__body">
                <time className="news-card__date">{item.date}</time>
                <h3 className="news-card__title">{item.title}</h3>
                <p className="news-card__excerpt">{item.excerpt}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
