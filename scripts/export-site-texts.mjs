// Exports every editable UI text (src/i18n/translations.ts, 4 languages) to
// backend/cms/site_texts.json — the catalogue the admin "Sayt matnlari" page edits.
// Re-run after adding/removing keys in translations.ts:  npm run texts:export
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = mkdtempSync(join(tmpdir(), 'site-texts-'))
const bundle = join(tmp, 'translations.mjs')
execFileSync(join(root, 'node_modules/.bin/rolldown'), [join(root, 'src/i18n/translations.ts'), '--format', 'esm', '--file', bundle], { stdio: 'ignore' })
const { translations } = await import(pathToFileURL(bundle).href)

const LANGS = ['uz', 'ru', 'en', 'kaa']

// Static copy that lives outside translations.ts. Each is {uz,ru,en,kaa}-shaped (or localized strings in a tree).
const extraEntry = join(tmp, 'extra-entry.ts')
writeFileSync(extraEntry, `
export { CONTACT_COPY } from '${join(root, 'src/data/contactCopy.ts')}'
export { EDUCATION_COPY } from '${join(root, 'src/data/educationCopy.ts')}'
export { AISHIFOKOR_COPY } from '${join(root, 'src/data/aiShifokorCopy.ts')}'
export { getFooterNav } from '${join(root, 'src/data/footerNav.ts')}'
`)
const extraBundle = join(tmp, 'extra.mjs')
execFileSync(join(root, 'node_modules/.bin/rolldown'), [extraEntry, '--format', 'esm', '--file', extraBundle], { stdio: 'ignore' })
const extra = await import(pathToFileURL(extraBundle).href)
const extraTrees = {
  contactCopy: Object.fromEntries(LANGS.map((l) => [l, extra.CONTACT_COPY[l] ?? extra.CONTACT_COPY.uz])),
  educationCopy: Object.fromEntries(LANGS.map((l) => [l, extra.EDUCATION_COPY[l] ?? extra.EDUCATION_COPY.uz])),
  aiShifokorCopy: Object.fromEntries(LANGS.map((l) => [l, extra.AISHIFOKOR_COPY[l] ?? extra.AISHIFOKOR_COPY.uz])),
  footerNav: Object.fromEntries(LANGS.map((l) => [l, { cols: extra.getFooterNav(l) }])),
}

function flatten(value, path = '', out = {}) {
  if (typeof value === 'string') { out[path] = value; return out }
  if (Array.isArray(value)) { value.forEach((v, i) => flatten(v, `${path}[${i}]`, out)); return out }
  if (value && typeof value === 'object') { for (const k of Object.keys(value)) flatten(value[k], path ? `${path}.${k}` : k, out) }
  return out
}

// Not text an editor should touch: ids, links, colours, enum-like flags, chatbot matching keywords.
const SKIP_KEY = /(^|\.)(id|slug|href|url|color|accent|icon|flag|status|key)$|Href$|Url$|Color$|^assistant\.keywords/i
const looksTechnical = (v) => /^(https?:|\/|#|mailto:|tel:)/.test(v)

const flat = Object.fromEntries(
  LANGS.map((l) => {
    const out = flatten(translations[l])
    for (const [ns, perLang] of Object.entries(extraTrees)) flatten(perLang[l], ns, out)
    return [l, out]
  }),
)
const entries = []
const skipped = []
for (const key of Object.keys(flat.uz)) {
  const uz = flat.uz[key]
  if (SKIP_KEY.test(key) || looksTechnical(uz) || uz.trim() === '') { skipped.push(key); continue }
  entries.push({ key, uz, ru: flat.ru[key] ?? '', en: flat.en[key] ?? '', kaa: flat.kaa[key] ?? '' })
}
// Drop texts the website never reads (a path word that appears nowhere in src/), so editors only see live copy.
let srcText = ''
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(tsx?|css)$/.test(f) && !/src[\\/]i18n[\\/]translations/.test(p)) srcText += readFileSync(p, 'utf8') + '\n'
  }
}
walk(join(root, 'src'))
const wordUsed = (w) => new RegExp(`(?<![A-Za-z0-9_])${w}(?![A-Za-z0-9_])`).test(srcText)
const keepUnused = process.argv.includes('--keep-unused')
const live = keepUnused ? entries : entries.filter((e) => e.key.replace(/\[\d+\]/g, '').split('.').every(wordUsed))
const pruned = entries.length - live.length
writeFileSync(join(root, 'backend/cms/site_texts.json'), JSON.stringify(live, null, 1) + '\n')
console.log(`site_texts.json: ${live.length} editable texts (${skipped.length} technical keys skipped, ${pruned} unused pruned)`)
if (process.argv.includes('--show-skipped')) console.log(skipped.join('\n'))
rmSync(tmp, { recursive: true, force: true })
