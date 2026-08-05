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
  homepage: {
    eyebrow: string
    title_lead: string
    title_em: string
    lead: string
    team_image: string
    metrics: Array<{ value: string; label: string }>
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

export type CmsClinicTourVideo = {
  id: string
  src: string
  poster: string
  order: number
}

export function fetchClinicTourVideos(lang: Lang) {
  return getJson<CmsClinicTourVideo[]>('/api/clinic-tour/', lang)
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

export type InquiryIntent =
  | 'booking'
  | 'sponsor'
  | 'education'
  | 'ai'
  | 'international'
  | 'consult'

export type InquiryPayload = {
  intent: InquiryIntent
  name: string
  phone: string
  email?: string
  topic?: string
  clinic?: string
  product_slug?: string
  medical_history?: string
  allergies?: string
  message?: string
  lang?: string
  source_path?: string
}

export type InquiryResponse = {
  ok: boolean
  request_id: string
  intent: InquiryIntent
}

export type InquiryAdvice = {
  request_id: string
  status: string
  has_advice: boolean
  advice: string
  name: string
  created_at: string
}

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResponse | null> {
  if (!API_URL) return null
  const res = await fetch(`${API_URL}/api/inquiries/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    let detail = 'Submit failed'
    try {
      const data = (await res.json()) as { detail?: string }
      if (data.detail) detail = data.detail
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }
  return (await res.json()) as InquiryResponse
}

export async function fetchInquiryAdvice(requestId: string): Promise<InquiryAdvice | null> {
  if (!API_URL) return null
  const id = encodeURIComponent(requestId.trim())
  const res = await fetch(`${API_URL}/api/inquiries/${id}/`, {
    headers: { Accept: 'application/json' },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Lookup failed')
  return (await res.json()) as InquiryAdvice
}
