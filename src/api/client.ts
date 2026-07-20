import type { Lang } from '../i18n/types'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''

export function isCmsEnabled() {
  return Boolean(API_URL)
}

async function getJson<T>(path: string, lang: Lang): Promise<T | null> {
  if (!API_URL) return null
  try {
    const res = await fetch(`${API_URL}${path}${path.includes('?') ? '&' : '?'}lang=${lang}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export type CmsHome = {
  lang: string
  settings: {
    phone: string
    hours: string
    institute_name: string
    badge: string
    slogan: string
    copyright: string
    license: string
  }
  hero: {
    title1: string
    title2: string
    tagline: string
    description: string
    image: string
    certs: string
  } | null
  specialties: Array<{
    slug: string
    icon: string
    name: string
    desc: string
    count: number
    image: string
    order: number
  }>
  doctors: Array<{
    id: number
    name: string
    role: string
    specialty: string
    exp: string
    papers: string
    studies: string
    color: string
    photo: string
    order: number
  }>
  news: Array<{
    slug: string
    date: string | null
    category: string
    category_color: string
    title: string
    excerpt: string
    cover: string
    order: number
  }>
  aiProducts: Array<{
    id: string
    slug: string
    name: string
    tag: string
    tag_color: string
    desc: string
    features: string[]
    metric: string
    metric_label: string
    image: string
    order: number
  }>
  research: {
    label: string
    title1: string
    titleEm: string
    description: string
    whyTitle: string
    whyItems: string[]
    sponsorBtn: string
    studies: Array<{
      id: string
      title: string
      phase: string
      status: string
      area: string
    }>
    capabilities: Array<{ label: string; value: string; highlight: boolean }>
  } | null
  education: Array<{
    id: number
    audience: string
    color: string
    icon: string
    programs: Array<{ name: string; duration: string; spots: string }>
  }>
  testimonials: Array<{ quote: string; author: string; role: string }>
  partners: Array<{ name: string; logo: string }>
  international: Array<{ title: string; desc: string }>
}

export type CmsSpecialtyDetail = CmsHome['specialties'][number] & {
  overview: string
  conditions: string[]
  services: string[]
  diagnostics: string[]
}

export type CmsNewsDetail = CmsHome['news'][number] & {
  lead: string
  body: string[]
}

export type CmsAIDetail = CmsHome['aiProducts'][number] & {
  overview: string
  audience: string
  outcomes: string[]
  workflow: string[]
}

export function fetchHome(lang: Lang) {
  return getJson<CmsHome>('/api/home/', lang)
}

export function fetchSpecialty(slug: string, lang: Lang) {
  return getJson<CmsSpecialtyDetail>(`/api/specialties/${slug}/`, lang)
}

export function fetchNewsArticle(slug: string, lang: Lang) {
  return getJson<CmsNewsDetail>(`/api/news/${slug}/`, lang)
}

export function fetchAIProduct(slug: string, lang: Lang) {
  return getJson<CmsAIDetail>(`/api/ai-products/${slug}/`, lang)
}
