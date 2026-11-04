import { useEffect, useState } from 'react'
import { apiBase } from '../api/client'
import {
  CHECKUP_DIRECTIONS,
  PRICE_CATALOG,
  PRICE_CATEGORIES,
  PRICE_LIST_UPDATED,
  type CatalogItem,
  type CheckupDirection,
} from '../data/clinicPrices'
import { PRICE_TRANSLATIONS } from '../data/clinicPricesTranslations'

export type PriceData = {
  catalog: CatalogItem[]
  categories: string[]
  checkups: CheckupDirection[]
  updated: string
  translations: Record<string, { ru?: string; en?: string; kaa?: string }>
  /** 'loading' only while waiting for the admin-edited list; falls back to the built-in list on any failure. */
  status: 'loading' | 'ready'
}

type ApiPrices = {
  catalog: CatalogItem[] | null
  categories: string[] | null
  checkups: CheckupDirection[] | null
  translations: PriceData['translations']
  updated: string | null
}

const CACHE_KEY = 'fjsti-prices-v1'

const BUILT_IN: Omit<PriceData, 'status'> = {
  catalog: PRICE_CATALOG,
  categories: PRICE_CATEGORIES,
  checkups: CHECKUP_DIRECTIONS,
  updated: PRICE_LIST_UPDATED,
  translations: PRICE_TRANSLATIONS,
}

function merge(api: ApiPrices | null): Omit<PriceData, 'status'> {
  if (!api) return BUILT_IN
  return {
    catalog: api.catalog ?? BUILT_IN.catalog,
    categories: api.categories ?? BUILT_IN.categories,
    checkups: api.checkups ?? BUILT_IN.checkups,
    updated: api.updated ?? BUILT_IN.updated,
    translations: { ...PRICE_TRANSLATIONS, ...api.translations },
  }
}

function readCache(): ApiPrices | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as ApiPrices) : null
  } catch {
    return null
  }
}

/**
 * Prices as the clinic last saved them in the admin. Wrong prices are worse than a short wait,
 * so the built-in list is only used when the server cannot be reached (or has no list yet).
 */
export function usePriceData(): PriceData {
  const base = apiBase()
  const cached = base ? readCache() : null
  const [state, setState] = useState<{ api: ApiPrices | null; status: PriceData['status'] }>(() => ({
    api: cached,
    status: !base || cached ? 'ready' : 'loading',
  }))

  useEffect(() => {
    if (!base) return
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 4000)
    fetch(`${base}/api/prices/`, { headers: { Accept: 'application/json' }, signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<ApiPrices>) : null))
      .then((api) => {
        if (api) {
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(api))
          } catch {
            /* ignore */
          }
        }
        setState({ api, status: 'ready' })
      })
      .catch(() => setState((s) => ({ api: s.api, status: 'ready' })))
      .finally(() => window.clearTimeout(timer))
    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [base])

  return { ...merge(state.api), status: state.status }
}
