/**
 * Data-driven accent colours (doctor colours, AI product tags, news categories)
 * are authored for a white page. Used raw as *text* they fail contrast twice
 * over: most already miss 4.5:1 on white, and on the dark theme they are far too
 * dark against slate.
 *
 * These helpers mix the accent against a theme-aware partner, so the same value
 * darkens by day and lightens by night. `--accent-shade` is `#0f172a` in the
 * light theme and `#ffffff` in the dark one; `--accent-wash` is the reverse.
 *
 * Use `accentInk` wherever an accent is applied to `color`, and `accentWash`
 * wherever it is applied as a soft tinted `background`. Accents used as a solid
 * fill, a border, or a dot need no adjustment — only text has a contrast floor.
 */

/** An accent safe to use as text in both themes. */
export function accentInk(color: string, strength = 60): string {
  return `color-mix(in srgb, ${color} ${strength}%, var(--accent-shade))`
}

/** A soft accent-tinted surface that stays a *surface* in both themes. */
export function accentWash(color: string, strength = 14): string {
  return `color-mix(in srgb, ${color} ${strength}%, var(--accent-wash))`
}
