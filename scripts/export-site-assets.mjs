// Lists every image/video the website uses (paths written in src/) -> backend/cms/site_assets.json.
// The admin page "Sayt rasmlari" lets the clinic replace any of them.   npm run assets:export
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const found = new Map() // path -> Set(files)
const re = /['"`](\/(?:images|videos)\/[^'"`\s)?#]+\.(?:png|jpe?g|webp|gif|mp4|webm))['"`]/g
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(tsx?|css)$/.test(f)) {
      const text = readFileSync(p, 'utf8')
      for (const m of text.matchAll(re)) {
        if (!found.has(m[1])) found.set(m[1], new Set())
        found.get(m[1]).add(relative(join(root, 'src'), p))
      }
    }
  }
}
walk(join(root, 'src'))

const entries = []
for (const [path, files] of [...found.entries()].sort()) {
  const full = join(root, 'public', path)
  if (!existsSync(full)) continue // referenced but not shipped: nothing to preview
  const parts = path.split('/').filter(Boolean) // ['images','clinic-gallery','x.webp']
  entries.push({
    path,
    kind: /\.(mp4|webm)$/.test(path) ? 'video' : 'image',
    group: parts.length > 2 ? parts[1] : parts[0],
    bytes: statSync(full).size,
    used_in: [...files].sort().slice(0, 4),
  })
}
writeFileSync(join(root, 'backend/cms/site_assets.json'), JSON.stringify(entries, null, 1) + '\n')
const groups = entries.reduce((a, e) => ((a[e.group] = (a[e.group] || 0) + 1), a), {})
console.log(`site_assets.json: ${entries.length} files`, JSON.stringify(groups))
