/**
 * Pictures/videos the clinic replaced in the admin ("Sayt rasmlari").
 *
 * The site refers to its built-in files by path (/images/…, /videos/…) in dozens of places, so instead of
 * threading a lookup through every component this module rewrites those paths where the browser reads
 * them: the src / srcset / poster of <img>, <source>, <video>, and inline `url(…)` backgrounds.
 * Replacements are applied before the browser starts loading when possible (property/attribute setters),
 * and to already-rendered elements when the list arrives later.
 */
let overrides: Record<string, string> = {}
let active = false // true only while at least one replacement exists: the common case costs nothing
let installed = false

function swap(value: string): string {
  if (!value) return value
  try {
    const url = new URL(value, location.href)
    if (url.origin !== location.origin) return value
    return overrides[decodeURIComponent(url.pathname)] ?? value
  } catch {
    return value
  }
}

function swapSrcset(value: string): string {
  return value
    .split(',')
    .map((part) => {
      const [u, ...rest] = part.trim().split(/\s+/)
      return [swap(u), ...rest].join(' ')
    })
    .join(', ')
}

function swapStyle(value: string): string {
  return value.replace(/url\((['"]?)([^'")]+)\1\)/g, (m, q: string, u: string) => {
    const next = swap(u)
    return next === u ? m : `url(${q}${next}${q})`
  })
}

const TAGS = new Set(['IMG', 'SOURCE', 'VIDEO'])

function fixElement(el: Element) {
  if (TAGS.has(el.tagName)) {
    for (const attr of ['src', 'poster'] as const) {
      const v = el.getAttribute(attr)
      if (v) {
        const next = swap(v)
        if (next !== v) el.setAttribute(attr, next)
      }
    }
    const set = el.getAttribute('srcset')
    if (set) {
      const next = swapSrcset(set)
      if (next !== set) el.setAttribute('srcset', next)
    }
  }
  const style = el.getAttribute('style')
  if (style && style.includes('url(')) {
    const next = swapStyle(style)
    if (next !== style) el.setAttribute('style', next)
  }
}

function fixTree(root: ParentNode) {
  root.querySelectorAll('img, source, video, [style*="url("]').forEach(fixElement)
}

function install() {
  if (installed || typeof window === 'undefined') return
  installed = true

  // 1) attribute writes (React uses setAttribute)
  const nativeSet = Element.prototype.setAttribute
  Element.prototype.setAttribute = function (name: string, value: string) {
    if (active) {
      const n = name.toLowerCase()
      if (TAGS.has(this.tagName) && (n === 'src' || n === 'poster')) value = swap(String(value))
      else if (TAGS.has(this.tagName) && n === 'srcset') value = swapSrcset(String(value))
      else if (n === 'style' && String(value).includes('url(')) value = swapStyle(String(value))
    }
    return nativeSet.call(this, name, value)
  }

  // 2) property writes: img.src = '…', video.poster = '…'
  const patch = (proto: object, prop: string) => {
    const desc = Object.getOwnPropertyDescriptor(proto, prop)
    if (!desc?.set) return
    Object.defineProperty(proto, prop, {
      ...desc,
      set(this: unknown, v: string) {
        desc.set!.call(this, active ? swap(String(v)) : v)
      },
    })
  }
  patch(HTMLImageElement.prototype, 'src')
  patch(HTMLSourceElement.prototype, 'src')
  patch(HTMLVideoElement.prototype, 'src')
  patch(HTMLVideoElement.prototype, 'poster')

  // 3) safety net: nodes added with already-built markup, style changes
  new MutationObserver((records) => {
    if (!active) return
    for (const r of records) {
      if (r.type === 'attributes' && r.target instanceof Element) fixElement(r.target)
      r.addedNodes.forEach((n) => {
        if (n instanceof Element) {
          fixElement(n)
          fixTree(n)
        }
      })
    }
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['src', 'poster', 'srcset', 'style'],
  })
}

/** Install (once) and apply the latest replacement list. Safe to call again whenever the list changes. */
export function setAssetOverrides(next: Record<string, string> | null | undefined) {
  const clean: Record<string, string> = {}
  for (const [path, url] of Object.entries(next ?? {})) {
    if (path.startsWith('/') && /^https?:\/\//.test(url)) clean[path] = url
  }
  overrides = clean
  active = Object.keys(clean).length > 0
  if (!active && !installed) return // nothing replaced: leave the browser untouched
  try {
    install()
    if (active) fixTree(document)
  } catch {
    /* the site must never break because of an image tweak */
  }
}
