import {
  CLINIC_PHONE_DISPLAY,
  CLINIC_PHONE_LOCAL,
  CLINIC_PHONE_TEL,
  CLINIC_TELEGRAM_HANDLE,
  CLINIC_TELEGRAM_URL,
  CLINIC_WEBSITE,
} from '../data/clinicContact'
import { ADMISSIONS_PHONES } from '../data/educationCopy'
import { CONTACT_ADDRESS_QUERY, CONTACT_EMAIL } from '../data/contactCopy'

/** What the clinic typed in Admin → Sayt sozlamalari → Aloqa (blank fields are absent). */
export type ContactOverrides = {
  phone?: string
  telegramUrl?: string
  instagramUrl?: string
  website?: string
  email?: string
  mapQuery?: string
  admissionsPhones?: string[]
}

export type Contacts = {
  phoneDisplay: string
  phoneTel: string
  phoneLocal: string
  telegramUrl: string
  telegramHandle: string
  instagramUrl: string
  website: string
  websiteLabel: string
  email: string
  mapQuery: string
  admissionsPhones: Array<{ display: string; tel: string }>
}

const DEFAULT_INSTAGRAM = 'https://instagram.com/ferghana_medical_institute'

const digitsOf = (value: string) => value.replace(/[^\d+]/g, '')
const hostOf = (url: string) => url.replace(/^https?:\/\//i, '').replace(/\/+$/, '')

function localNumber(display: string): string {
  const d = display.replace(/\D/g, '')
  if (d.length < 7) return display
  const l = d.slice(-7)
  return `${l.slice(0, 3)}-${l.slice(3, 5)}-${l.slice(5)}`
}

function handleOf(url: string): string {
  const last = url.replace(/[?#].*$/, '').replace(/\/+$/, '').split('/').pop() ?? ''
  return last ? `@${last.replace(/^@/, '')}` : CLINIC_TELEGRAM_HANDLE
}

export const DEFAULT_CONTACTS: Contacts = {
  phoneDisplay: CLINIC_PHONE_DISPLAY,
  phoneTel: CLINIC_PHONE_TEL,
  phoneLocal: CLINIC_PHONE_LOCAL,
  telegramUrl: CLINIC_TELEGRAM_URL,
  telegramHandle: CLINIC_TELEGRAM_HANDLE,
  instagramUrl: DEFAULT_INSTAGRAM,
  website: CLINIC_WEBSITE,
  websiteLabel: hostOf(CLINIC_WEBSITE),
  email: CONTACT_EMAIL,
  mapQuery: CONTACT_ADDRESS_QUERY,
  admissionsPhones: ADMISSIONS_PHONES.map((p) => ({ display: p.display, tel: p.tel })),
}

export function resolveContacts(o: ContactOverrides | null | undefined): Contacts {
  if (!o) return DEFAULT_CONTACTS
  const phoneDisplay = o.phone?.trim() || DEFAULT_CONTACTS.phoneDisplay
  const telegramUrl = o.telegramUrl || DEFAULT_CONTACTS.telegramUrl
  const website = o.website || DEFAULT_CONTACTS.website
  return {
    phoneDisplay,
    phoneTel: o.phone ? digitsOf(phoneDisplay) : DEFAULT_CONTACTS.phoneTel,
    phoneLocal: o.phone ? localNumber(phoneDisplay) : DEFAULT_CONTACTS.phoneLocal,
    telegramUrl,
    telegramHandle: o.telegramUrl ? handleOf(telegramUrl) : DEFAULT_CONTACTS.telegramHandle,
    instagramUrl: o.instagramUrl || DEFAULT_CONTACTS.instagramUrl,
    website,
    websiteLabel: o.website ? hostOf(website) : DEFAULT_CONTACTS.websiteLabel,
    email: o.email || DEFAULT_CONTACTS.email,
    mapQuery: o.mapQuery || DEFAULT_CONTACTS.mapQuery,
    admissionsPhones: o.admissionsPhones?.length
      ? o.admissionsPhones.map((display) => ({ display, tel: digitsOf(display) }))
      : DEFAULT_CONTACTS.admissionsPhones,
  }
}

type Pair = [from: string, to: string]

/** Built-in contact strings that appear inside written copy, paired with their configured replacement. */
function replacementPairs(c: Contacts): Pair[] {
  const d = DEFAULT_CONTACTS
  const pairs: Pair[] = [
    [d.phoneDisplay, c.phoneDisplay],
    [d.phoneTel, c.phoneTel],
    [d.telegramUrl, c.telegramUrl],
    [d.telegramHandle, c.telegramHandle],
    [d.website, c.website],
    [d.websiteLabel, c.websiteLabel],
    [d.email, c.email],
  ]
  return pairs.filter(([from, to]) => from && from !== to)
}

function mapStrings<T>(node: T, fn: (s: string) => string): T {
  if (typeof node === 'string') return fn(node) as unknown as T
  if (Array.isArray(node)) {
    let changed = false
    const next = node.map((v) => {
      const m = mapStrings(v, fn)
      if (m !== v) changed = true
      return m
    })
    return (changed ? next : node) as unknown as T
  }
  if (node && typeof node === 'object') {
    let changed = false
    const next: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      const m = mapStrings(v, fn)
      if (m !== v) changed = true
      next[k] = m
    }
    return (changed ? next : node) as T
  }
  return node
}

/** Swap the built-in phone/Telegram/site/email inside every string of `tree` (no-op when nothing changed). */
export function applyContacts<T>(tree: T, contacts: Contacts): T {
  const pairs = replacementPairs(contacts)
  if (pairs.length === 0) return tree
  return mapStrings(tree, (s) => {
    let out = s
    for (const [from, to] of pairs) if (out.includes(from)) out = out.split(from).join(to)
    return out
  })
}
