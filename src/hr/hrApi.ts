import { apiBase } from '../api/client'

export type Choice = { value: string; label: string }

export type HrMe = {
  name: string
  new_applications: number
  choices: { category: Choice[]; employment: Choice[] }
}

export type HrVacancy = {
  id: number
  slug: string
  category: string
  employment: string
  deadline: string | null
  is_active: boolean
  title: string
  department: string
  location: string
  experience: string
  description: string
  requirements: string[]
  applications: number
  created_at: string
}

export type VacancyInput = Partial<{
  category: string
  employment: string
  deadline: string | null
  is_active: boolean
  title: string
  department: string
  location: string
  experience: string
  description: string
  requirements: string[]
}>

export type HrApplication = {
  id: number
  request_id: string
  name: string
  phone: string
  email: string
  vacancy: string
  message: string
  status: 'new' | 'contacted' | 'closed'
  has_resume: boolean
  created_at: string
}

export class HrApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** First human-readable message out of a DRF error body. */
function readError(body: unknown): string {
  if (!body || typeof body !== 'object') return ''
  const data = body as Record<string, unknown>
  if (typeof data.detail === 'string') return data.detail
  for (const value of Object.values(data)) {
    if (typeof value === 'string') return value
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  }
  return ''
}

export function createHrClient(initData: string) {
  async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${apiBase()}/api/hr${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `tma ${initData}`,
      },
    })
    if (res.status === 204) return undefined as T
    let body: unknown = null
    try {
      body = await res.json()
    } catch {
      /* not JSON */
    }
    if (!res.ok) throw new HrApiError(res.status, readError(body) || `Xatolik (${res.status})`)
    return body as T
  }

  return {
    me: () => call<HrMe>('/me/'),
    vacancies: () => call<HrVacancy[]>('/vacancies/'),
    createVacancy: (data: VacancyInput) => call<HrVacancy>('/vacancies/', { method: 'POST', body: JSON.stringify(data) }),
    updateVacancy: (id: number, data: VacancyInput) =>
      call<HrVacancy>(`/vacancies/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteVacancy: (id: number) => call<void>(`/vacancies/${id}/`, { method: 'DELETE' }),
    applications: (status?: string) => call<HrApplication[]>(`/applications/${status ? `?status=${status}` : ''}`),
    setApplicationStatus: (id: number, status: HrApplication['status']) =>
      call<HrApplication>(`/applications/${id}/`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    sendResume: (id: number) => call<{ ok: boolean }>(`/applications/${id}/resume/`, { method: 'POST' }),
  }
}

export type HrClient = ReturnType<typeof createHrClient>
