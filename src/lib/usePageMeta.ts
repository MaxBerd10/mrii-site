import { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const SITE_ORIGIN = 'https://fermiclinic.uz'

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const el = document.head.querySelector<HTMLElement>(selector)
  if (el) el.setAttribute(attr, value)
}

/**
 * Per-route <title>, description and canonical for the SPA's static pages.
 * Detail pages (doctor, specialty, news) set their own title once their data is
 * loaded, so only the canonical URL is kept in sync for them.
 */
export function usePageMeta(path: string) {
  const { t } = useLanguage()

  useEffect(() => {
    const canonical = `${SITE_ORIGIN}${path === '/' ? '/' : path.replace(/\/$/, '')}`
    setMeta('link[rel="canonical"]', 'href', canonical)
    setMeta('meta[property="og:url"]', 'content', canonical)

    const names: Record<string, string> = {
      '/clinic': t.nav.clinic,
      '/clinic/services': t.nav.children.services,
      '/clinic/diagnostics': t.nav.children.diagnostics,
      '/clinic/gallery': t.nav.children.gallery,
      '/clinic/tour': t.nav.children.tour,
      '/prices': t.prices.title,
      '/research': t.nav.research,
      '/education': t.nav.education,
      '/vakansiyalar': t.vacancies.title,
      '/ai': t.nav.ai,
      '/doctors': t.nav.children.doctors,
      '/news': t.nav.news,
      '/contacts': t.nav.contacts,
    }
    const isHome = path === '/'
    const name = names[path]
    if (!isHome && !name) return

    const title = isHome ? t.nav.brand : `${name} — ${t.nav.brand}`
    document.title = title
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[name="description"]', 'content', `${t.nav.brand}. ${t.hero.instituteSlogan}`)
    setMeta('meta[property="og:description"]', 'content', `${t.nav.brand}. ${t.hero.instituteSlogan}`)
  }, [path, t])
}
