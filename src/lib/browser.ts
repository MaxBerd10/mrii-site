/** Desktop or mobile Safari (not Chrome, Edge, Firefox iOS, etc.). */
export function isSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Safari/.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|Edg|OPR|OPiOS/.test(ua)
}

export function markSafariDocument() {
  if (typeof document === 'undefined' || !isSafari()) return
  document.documentElement.classList.add('is-safari')
}
