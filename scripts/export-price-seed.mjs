// One-off: turns the built-in price list (src/data/clinicPrices*.ts) into backend/cms/price_seed.json,
// which migration 0026 loads into the admin (Narxlar) on first deploy.   node scripts/export-price-seed.mjs
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = mkdtempSync(join(tmpdir(), 'price-seed-'))
const entry = join(tmp, 'entry.ts')
writeFileSync(entry, `export * from '${join(root, 'src/data/clinicPrices.ts')}'\nexport * from '${join(root, 'src/data/clinicPricesTranslations.ts')}'\n`)
const out = join(tmp, 'out.mjs')
execFileSync(join(root, 'node_modules/.bin/rolldown'), [entry, '--format', 'esm', '--file', out], { stdio: 'ignore' })
const m = await import(pathToFileURL(out).href)

const tr = (uz) => ({ uz, ru: m.PRICE_TRANSLATIONS[uz]?.ru ?? '', en: m.PRICE_TRANSLATIONS[uz]?.en ?? '', kaa: m.PRICE_TRANSLATIONS[uz]?.kaa ?? '' })
const lines = (arr) => ({ uz: arr, ru: arr.map((s) => tr(s).ru), en: arr.map((s) => tr(s).en), kaa: arr.map((s) => tr(s).kaa) })

const seed = {
  updated: m.PRICE_LIST_UPDATED,
  categories: m.PRICE_CATEGORIES.map(tr),
  items: m.PRICE_CATALOG.map((i) => ({
    name: tr(i.name), category: i.category, location: i.location ? tr(i.location) : null,
    citizen: i.citizen, foreign: i.foreign,
  })),
  checkups: m.CHECKUP_DIRECTIONS.map((d) => ({
    id: d.id, title: tr(d.title), accent: d.accent,
    tiers: d.tiers.map((t) => ({ tier: t.tier, price: t.price, includes: lines(t.includes), notes: lines(t.notes) })),
  })),
}
writeFileSync(join(root, 'backend/cms/price_seed.json'), JSON.stringify(seed, null, 1) + '\n')
console.log(`price_seed.json: ${seed.items.length} services, ${seed.categories.length} categories, ${seed.checkups.length} checkup directions`)
