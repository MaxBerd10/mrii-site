/**
 * Pictures come from the admin, so some will be missing, deleted or mistyped. A broken-image icon with
 * alt text spilling over a card looks like a bug. This swaps any image that has no usable source (or
 * fails to load) for a quiet neutral tile of the same size, wherever it appears on the site.
 */
const TILE = (inner: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9eef3"/><stop offset="1" stop-color="#d5dde6"/></linearGradient></defs>` +
      `<rect width="400" height="500" fill="url(#g)"/>${inner}</svg>`,
  )

const PERSON = TILE(
  `<circle cx="200" cy="205" r="62" fill="#b3bfcc"/><path d="M80 470c0-82 54-132 120-132s120 50 120 132z" fill="#b3bfcc"/>`,
)
const GENERIC = TILE(
  `<rect x="150" y="200" width="100" height="100" rx="18" fill="none" stroke="#b3bfcc" stroke-width="10"/>` +
    `<path d="M200 225v50M175 250h50" stroke="#b3bfcc" stroke-width="10" stroke-linecap="round"/>`,
)

function tileFor(img: HTMLImageElement): string {
  const hint = `${img.className} ${img.parentElement?.className ?? ''}`
  return /doctor|dp-|portrait|team|person|avatar/i.test(hint) ? PERSON : GENERIC
}

function applyTile(img: HTMLImageElement) {
  if (img.dataset.fallback) return
  img.dataset.fallback = '1'
  img.removeAttribute('srcset')
  img.src = tileFor(img)
}

function checkEmpty(img: HTMLImageElement) {
  const src = img.getAttribute('src')
  if (!src || !src.trim()) applyTile(img)
}

export function installImageFallback() {
  if (typeof document === 'undefined') return
  // Load failures do not bubble, but they can be caught in the capture phase.
  document.addEventListener(
    'error',
    (event) => {
      const el = event.target
      if (el instanceof HTMLImageElement) applyTile(el)
    },
    true,
  )

  const scan = (root: ParentNode) => root.querySelectorAll('img').forEach((img) => checkEmpty(img as HTMLImageElement))
  scan(document)
  new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'attributes' && r.target instanceof HTMLImageElement) {
        const img = r.target
        // The page gave this image a new real source: forget the old failure so it can fall back again later.
        if (img.dataset.fallback && !(img.getAttribute('src') ?? '').startsWith('data:image/svg+xml')) delete img.dataset.fallback
        if (!img.dataset.fallback) checkEmpty(img)
        continue
      }
      r.addedNodes.forEach((n) => {
        if (n instanceof HTMLImageElement) checkEmpty(n)
        else if (n instanceof Element) scan(n)
      })
    }
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] })
}
