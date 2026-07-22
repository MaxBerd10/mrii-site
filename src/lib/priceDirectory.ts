export type PriceEntry = {
  name: string
  slug: string
}

export type LetterGroup = {
  letter: string
  items: PriceEntry[]
}

export function letterKey(name: string): string {
  const ch = name.trim().charAt(0)
  if (!ch) return '#'
  return ch.toLocaleUpperCase()
}

export function filterEntries(entries: PriceEntry[], query: string): PriceEntry[] {
  const q = query.trim().toLocaleLowerCase()
  if (!q) return entries
  return entries.filter((e) => e.name.toLocaleLowerCase().includes(q))
}

export function groupByLetter(entries: PriceEntry[]): LetterGroup[] {
  const map = new Map<string, PriceEntry[]>()
  for (const entry of entries) {
    const letter = letterKey(entry.name)
    const bucket = map.get(letter)
    if (bucket) bucket.push(entry)
    else map.set(letter, [entry])
  }

  for (const items of map.values()) {
    items.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map(([letter, items]) => ({ letter, items }))
}
