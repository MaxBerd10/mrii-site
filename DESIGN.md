# DESIGN.md

Three visual worlds live in this repo, deliberately.

- **The care system** — `/`, scoped under `.home-care`. See below.
- **The instrument** — `/home-instrument`, scoped under `.home-dark`. Documented here.
- **The daylight system** — every inner route. Tokens in `src/styles/tokens.css`.

The homepage is the only surface that has to *convince*. Inner routes have to be
used, at a desk or on a phone in a waiting room. Both worlds ship a day and a
night rendition, switched by `data-theme` on `<html>`; the two worlds stay
distinct in both. The handoff between them is designed, not accidental — see
**Handoff** below.

---

## The care system (current homepage)

The light homepage lives at `/` and is styled entirely by
`src/styles/home-care.css`, with components in `src/components/care/`. The
instrument below is **not** deleted — it stays at `/home-instrument` so the two
directions can be compared.

### Thesis

Where the instrument is a monitor in a dark room, this is a cinematic clinic
gallery. It sells the same fact — machine precision meeting human care — to a
worried patient rather than to a peer. Deep-blue clinical stages alternate
with the current theme ground; generous space, product-scale surfaces and
large optical type create calm without making the page feel ordinary.

The emotional split is roughly 70% human, 30% machine, and that ratio is made
literal in the type: the ink half of every headline is the clinical claim, and
the signal colour lands **only** on the AI phrase. Colour names the machine.
That is the single emphasis rule on the page.

### Palette

| Token | Value | Means |
|---|---|---|
| `--hc-bg` | `#FAFBFC` | page ground |
| `--hc-card` | `#FFFFFF` | raised surface |
| `--hc-ink` | `#0B1F33` | primary text (16.2:1) |
| `--hc-muted` | `#55677A` | body copy (5.4:1) |
| `--hc-faint` | `#8494A5` | metadata, large text only (3.1:1) |
| `--hc-blue` | `#0F4C81` | **the institute** — authority, primary action (8.9:1) |
| `--hc-cyan` | `#3ABEF9` | **the machine** — AI, inference |
| `--hc-emerald` | `#20C997` | **the outcome** — results, confirmations |

Cyan and emerald are *graphic* colours: both fall under 3:1 on white, so small
text uses the `-ink` twins (`--hc-cyan-ink`, `--hc-emerald-ink`) instead. Using
the raw signal on body text is the failure mode to watch for.

### Material

- **Surface.** Small information groups use 12–16px radii. Product-scale
  passages use 26–38px continuous corners and shadow without a second outline.
  AI products form an asymmetric bento; specialties share one shelf instead of
  becoming twelve isolated cards; testimonials use one lead story and two
  supporting voices.
- **Buttons.** Every variant sets `--_bg` / `--_fg`, never `background`
  directly — declaring the property on a variant beats the base rule and
  silently breaks any context that re-tints the button. That is exactly how the
  ghost button once rendered white-on-white on the dark close.
- **The care team is the opening stage.** A five-person editorial portrait
  built from the institute's existing staff identities shares the first
  viewport with the claim. The team owns the right side; the left remains quiet
  enough for the clinical promise. The broader staff keeps its dedicated ring-to-arch
  section immediately below rather than being folded into the hero.

### Composition

care-team hero → doctor ring/arch → harmony → AI systems → comparison device →
patient journey → departments → voices → FAQ → close.

The order is an argument, not a menu. **Harmony** is the signature: two panels
inside a *single* card, because the claim is that these are one workflow rather
than two products, with the verdict — "the final diagnosis always rests with
the doctor" — spanning both columns underneath. It runs before anything is
sold, so the reassurance lands before the pitch.

Density is paced: the hero owns one team→claim composition, the staff owns a separate
ring-to-arch movement, Harmony is a single luminous instrument, AI becomes an asymmetric product bento,
Comparison reads as one device surface, and the patient journey keeps its
heading sticky beside the sequence. The departments shelf is dense; the
following lead testimonial is deliberately quiet and oversized.

### Motion

The hero is the deliberate exception: five existing staff identities are
composited into one restrained dark-field editorial portrait beside the visible
claim. Scroll adds only a shallow camera push-in and a few pixels of vertical
travel; human faces never rotate or bend. The following doctor section restores its original
ring-to-arch choreography, keeping portraits upright and readable as they move
around the centre instead of through it. Every frame remains interruptible by
scroll. `prefers-reduced-motion` keeps the DNA static behind the visible claim
and renders the doctor composition without its scroll morph.

After the hero, motion belongs to the content: the patient journey advances
through the viewport beside a sticky thesis, and one **care light** changes
from clinical blue through violet to outcome green as the story advances. Fine
pointers move the light across the four AI surfaces and tilt them by no more
than 3°; leaving, scrolling or losing focus returns them to rest immediately.
Patient-path lines inherit the same color sequence as progress feedback. Shared
supporting content still rises and
settles on `cubic-bezier(.22,1,.36,1)`, driven by the IntersectionObserver in
`careUi.tsx`. Touch drops the tilt; `prefers-reduced-motion` removes every
runway and leaves the color field static.

### Performance

The hero uses a 1672×941, 96 KB WebP dark-field team composite built from five
existing staff portraits, plus a dedicated 941×1672, 90 KB mobile reframe that
keeps those identities below the copy. Both have explicit dimensions to prevent layout shift.
Scroll updates CSS custom properties rather than re-rendering React on every
frame; transform and a bounded filter provide the camera push. Motion's values
drive the doctor ring independently below.

---

## The instrument (homepage)

### Thesis

The homepage is a live clinical instrument, not a brochure. It refuses the SaaS
feature ladder — identical icon-heading-text cards stacked to the footer. Every
section is a **readout**, a **trace**, or a **scan**, because that is what this
institute actually does all day.

The hero already commits to it: a scroll-driven frame sequence of a robot hand
meeting a human hand. Everything below continues that one gesture — machine
precision meeting human care — in instrument grammar.

### Two renditions of one instrument

The instrument ships a night and a day rendition. **The grammar does not change**
— channel strips, graticule, signal colours, tabular readouts, the scan plate,
the trace. What changes is what carries depth.

| | Night | Day |
|---|---|---|
| Ground | `#050816` void | `#f6f7fb` |
| Panel | 5% white fill | white, `--hd-shadow` cast |
| Depth | bloom and glow | ink, hairline, cast shadow (`--hd-bloom: 0`) |
| Signals | saturated (`#00e5ff`) | darkened for paper (`#0e7490`) |
| Photos | graded down to sit in the dark | left at full brightness |
| Metaphor | a monitor in a dark room | a printed chart under room light |

Glow is a night material. By day the same shadows read as a coloured haze, so
every pure-bloom effect is re-stated as ink or a cast shadow. The two canvases
(ECG, signal field) draw in JS and take `theme` as a prop for the same reason.

**The hero has a light twin.** `scripts/make-light-hero-frames.py` derives 51
light frames from the dark ones: the backdrop is a flat dark field, so keying on
*low luminance AND low local variance* — then keeping only what touches the
border — isolates it while leaving both hands and the robot's own dark panels
intact. Inverting does not work; the robot's darks measure below the backdrop.
Re-run the script if the source frames are ever replaced.

### Palette

Signal colors carry meaning. They are never chosen for variety. Values below are
the night rendition; see `home-dark.css` for the day pair of each.

| Token | Value | Means |
|---|---|---|
| `--hd-void` | `#050816` | page ground |
| `--hd-deep` | `#0A1023` | raised panel ground |
| `--hd-panel` | `rgba(255,255,255,.05)` | instrument bezel fill |
| `--hd-edge` | `rgba(255,255,255,.08)` | bezel hairline |
| `--hd-cyan` | `#00E5FF` | **machine** — AI, inference, automation |
| `--hd-blue` | `#3B82F6` | **clinical** — departments, doctors, care |
| `--hd-green` | `#00D084` | **vitals** — patients, outcomes, live state |
| `--hd-violet` | `#7C3AED` | **research** — trials, science, programs |
| `--hd-ink` | `#FFFFFF` | primary text (19.9:1) |
| `--hd-mute` | `#B8C1D9` | secondary text (11.1:1 measured) |
| `--hd-faint` | `#7C87A5` | channel labels, hairline metadata (5.6:1) |

A section commits to one signal color. Two signals in one panel means the panel
is describing a relationship (machine → clinical), never decoration.

**`--hd-signal-ink` is the token small colored text must use** — never
`--hd-signal` directly. `--hd-blue` (5.4:1) and especially `--hd-violet`
(3.5:1) are large-text-only on the void, so the blue and violet sections raise
the ink token to `--hd-blue-lt` / `--hd-violet-lt` (7.3:1). The deep signal
stays on rules, dots, glows, and display-size `<em>`, where ≥3:1 is the bar.
This was a measured failure in the first build, not a precaution.

### Photographic imagery: the scan plate

Two image families live here and are treated differently on purpose.

- **Transparent organ renders** (`/images/medical/*-transparent-3d.png`, used in
  the services grid) float free over their own radial bloom. No frame.
- **Photographs** (the four AI product renders, doctor portraits) are *mounted*,
  never floated: framed at a fixed aspect ratio, graded down
  (`saturate(.7) contrast(1.06) brightness(.72)`), washed with the channel
  color, vignetted, and given corner ticks. A bright clinical photo dropped
  raw onto `#050816` reads as a hole in the page; grading it into the world is
  what makes it read as an instrument capture.

### Material

- **Bezel.** 24px radius, `--hd-panel` fill, 1px `--hd-edge` border, plus a
  luminous top edge (`inset 0 1px 0 rgba(255,255,255,.10)`). This is the one
  container. It is not nested inside itself.
- **Calibration grid.** A 44px hairline grid at 3.5% white, masked. It appears
  on exactly two surfaces — the ECG readout strip and the signal-field canvas
  stage — because those are the only two that actually measure anything. It is
  graticule, the ruling behind a trace, not a page texture. The page ground
  itself is plain `--hd-void`; a grid tiled behind every section is decoration
  wearing the thesis's clothes, and it was cut for that reason.
- **Signal rule.** A 1px full-bleed horizontal line in the section's signal color
  at 30% opacity, with a soft bloom, separates major movements.
- **Bloom.** Glow is `0 0 Npx color/α` *paired with* a real offset shadow
  (`0 24px 60px rgba(2,6,20,.6)`). A haloed element with no cast shadow is
  decoration and does not ship.
- **Channel label.** Every panel and section carries a tracked uppercase
  identifier in `--hd-faint`: `CH.02 · CLINICAL`. This is the system's grammar,
  a monitor's channel strip — not an eyebrow habit. It always names a real thing.

**Emphasis is one rule everywhere:** `<em>` inside a heading takes the section's
solid signal color. No gradient text anywhere on the page — scale and weight
carry emphasis, and color only names the channel.

### Type

Inherited from the daylight system; no new faces.

- Display: **Sora** — `clamp(2.6rem, 6vw, 5.2rem)`, weight 700, tracking `-0.04em`.
- Body: **Source Sans 3** — 1.0625rem, measure capped at 68ch.
- **Readouts** (every number the page publishes): Sora, `font-variant-numeric:
  tabular-nums`, tracking `-0.05em`, sized `clamp(2.2rem, 4vw, 3.4rem)`.
  Tabular figures are why counting up doesn't jitter, and they read as a meter.
- No monospace. The measurement feeling comes from tabular figures and alignment,
  not from a costume face.

### Composition

Sections alternate deliberately so the page never reads as a card list:

full-bleed readout strip → asymmetric 7/5 split → full-bleed canvas →
two-column comparison → vertical trace timeline → dense grid → carousel →
marquee → single-column accordion → full-bleed close.

Rhythm: `--hd-section: clamp(88px, 11vw, 168px)` between movements. Heading gets
more space above than below. A dense passage always earns a quiet one after it.

### Motion

One authored moment, repeated as a system: **the trace**. Content arrives the way
a signal draws onto a monitor — a masked left-to-right or top-to-bottom reveal
(`clip-path` inset) with a 6px blur resolving to 0, on `cubic-bezier(.22,1,.36,1)`
over 620ms. Not a fade-up on every section.

Three things are genuinely live, and nothing else animates on a loop:
the ECG trace in the trust strip, the neural field canvas, and the partner marquee.

`prefers-reduced-motion` is not a degraded path — it is a static instrument
with every value already displayed. The canvas renders one still frame; counters
show their final value; the marquee becomes a static row.

**The reveals must fail open.** Browsers pause IntersectionObserver and rAF in a
hidden document, so a page opened in a background tab would sit at its hidden
state — blank sections — until focused. `HomePage` watches `visibilitychange`
and adds `.is-static`, which forces every reveal target visible with
`!important` (Motion writes inline styles, so nothing weaker wins). The
testimonial carousel is deliberately excluded: it animates through
`AnimatePresence`, not `whileInView`, so forcing it would expose the exiting
slide beneath the entering one. Any new reveal target must be added to that
selector list in `home-dark.css`.

### Accessibility

- Body text ≥ 4.5:1 on `--hd-void` (`--hd-mute` measures 4.9:1). Signal colors are
  never used for body copy — only for rules, dots, values, and large display text.
- Focus is visible and belongs to the world: 2px `--hd-cyan` ring at 2px offset.
- The accordion is buttons with `aria-expanded`; the carousel has real controls
  and pauses on hover and on focus.
- The canvas is `aria-hidden` and every claim it illustrates is also in text.

### Handoff to daylight

The page closes on the CTA and a dark footer. Any navigation into an inner route
crosses through `PageEnter`, which already covers the transition. The nav pill
inverts to dark only while `.home-dark` is mounted (a class on `<html>`, removed
on unmount) so no inner route inherits it.

---

## The daylight system (inner routes)

`src/styles/tokens.css` is authoritative: 14/20/28/38px radii, soft-shadow
raised surfaces. Do not port instrument tokens into it, and do not resurrect
legacy `src/index.css`.

### Day / night

Inner routes ship both themes, switched by `data-theme` on `<html>`.

- **Day** — `#f4f5f7` ground, `#5b4cdb` brand. The original system, unchanged.
- **Night** — `#111420` ground, `#171b29` surfaces. Deliberately *lighter and
  less saturated than the instrument's `#050816`*: these are surfaces people
  work on, not a showcase. No bloom, no signal colours, no glow.

The homepage follows the same switch, into its own two renditions above —
never into these tokens. `<html>` takes `is-home-dark` so its ground and
scrollbar follow the instrument rather than the daylight system.

Resolution order: the inline script in `index.html` applies the theme **before
first paint** (localStorage → OS → light). `ThemeProvider` reads that decision
back rather than recomputing it, follows the OS only until the visitor overrides
it, and persists the override. Never move that resolution into the bundle — dark
visitors would get a white flash on every load.

### The token rules that matter

Adding a colour means adding both halves. Three pairs do the real work:

| Token | Day | Night | Use for |
|---|---|---|---|
| `--brand` / `--brand-ink` | same | fill stays, ink lifts to `#a394ff` | `-ink` for **text**, plain for fills |
| `--accent-shade` | `#0f172a` | `#ffffff` | mixing partner that pushes an accent *away* from the ground |
| `--accent-wash` | `#ffffff` | `#171b29` | mixing partner that pulls an accent *toward* the ground |
| `--on-accent` | `#ffffff` | `#0b1020` | label on an accent-filled control |

- **Accents as text always go through the `-ink` variant or a mix.** `#0ea5e9`,
  `#059669`, `#6366f1` and friends miss 4.5:1 on white *and* on slate; several
  shipped that way before this pass. `src/lib/accent.ts` (`accentInk`,
  `accentWash`) exists for the data-driven colours that components apply inline,
  where CSS cannot reach them.
- **A colour-mix partner is never a literal.** `color-mix(…, #fff)` inverts
  wrongly at night; use `--accent-wash` / `--accent-shade`.
- **`background: var(--text)` pairs with `color: var(--bg)`**, never `#fff` —
  that is the inverted button, and it has to invert with the theme.
- Whites that sit on permanently dark or colour-filled art (hero copy, service
  cards, story cards, tiles) stay `#fff` and are excluded from tokenisation.
