export type DoctorReview = {
  id: string
  name: string
  rating: number
  text: string
  createdAt: string
}

const STORAGE_KEY = 'fjsti-doctor-reviews'

function readAll(): Record<string, DoctorReview[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, DoctorReview[]>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeAll(data: Record<string, DoctorReview[]>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore quota */
  }
}

export function getDoctorReviews(doctorId: string): DoctorReview[] {
  return readAll()[doctorId] ?? []
}

export function addDoctorReview(
  doctorId: string,
  input: { name: string; rating: number; text: string },
): DoctorReview[] {
  const all = readAll()
  const next: DoctorReview = {
    id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: input.name.trim() || 'Mehmon',
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
    text: input.text.trim(),
    createdAt: new Date().toISOString(),
  }
  const list = [next, ...(all[doctorId] ?? [])]
  all[doctorId] = list
  writeAll(all)
  try {
    window.dispatchEvent(new Event('fjsti-doctor-reviews'))
  } catch {
    /* ignore */
  }
  return list
}

export function averageRating(reviews: DoctorReview[]): number {
  if (!reviews.length) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}
