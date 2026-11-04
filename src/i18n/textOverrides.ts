import type { Lang } from './types'

/** {key: {lang: text}} — texts edited by the clinic in the admin ("Sayt matnlari"). */
export type TextOverrides = Record<string, Partial<Record<Lang, string>>>

/** "homeCare.cards[0].value" -> ['homeCare', 'cards', 0, 'value'] */
export function parsePath(path: string): Array<string | number> {
  const tokens: Array<string | number> = []
  for (const part of path.split('.')) {
    const match = /^([^[\]]*)((?:\[\d+\])*)$/.exec(part)
    if (!match) return []
    if (match[1]) tokens.push(match[1])
    for (const idx of match[2].matchAll(/\[(\d+)\]/g)) tokens.push(Number(idx[1]))
  }
  return tokens
}

function setIn(node: unknown, tokens: Array<string | number>, value: string): unknown {
  if (tokens.length === 0) return typeof node === 'string' ? value : node // only ever replace text
  if (node === null || typeof node !== 'object') return node
  const [head, ...rest] = tokens
  const container = node as Record<string | number, unknown>
  if (!(head in container)) return node // unknown path: ignore instead of inventing structure
  const next = setIn(container[head], rest, value)
  if (next === container[head]) return node
  const copy = Array.isArray(node) ? [...node] : { ...container }
  ;(copy as Record<string | number, unknown>)[head] = next
  return copy
}

/** Copy-on-write: returns `base` itself when nothing applies, otherwise a new tree. */
export function applyTextOverrides<T>(base: T, overrides: TextOverrides | null, lang: Lang, prefix = ''): T {
  if (!overrides) return base
  let result: unknown = base
  for (const [key, values] of Object.entries(overrides)) {
    const text = values[lang]
    if (!text) continue
    if (prefix) {
      if (!key.startsWith(prefix + '.')) continue
    }
    const tokens = parsePath(prefix ? key.slice(prefix.length + 1) : key)
    if (tokens.length === 0) continue
    result = setIn(result, tokens, text)
  }
  return result as T
}
