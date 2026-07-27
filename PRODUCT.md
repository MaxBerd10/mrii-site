# PRODUCT.md

Durable product truth for the FJSTI site. Visual decisions live in DESIGN.md.

## What this is

**FJSTI Multidisciplinary Clinic** — the clinical arm of the Ferghana Public Health
Medical Institute (Fargʻona Jamoat Salomatligi Tibbiyot Instituti), Uzbekistan.
Operating since 2008. ISO 9001:2015 · GCP · ICH E6.

It is four things under one roof, and the site exists because most visitors only
know about the first:

1. **Clinic** — 12 clinical departments, ~50 000 patients a year.
2. **Clinical research** — Phase I–IV trials, own Phase I unit, GCP-certified team.
3. **Clinical base** — residency rotations, student placements, CME. *Not* a degree
   granting body; degrees come from FJSTI University (fjsti.uz).
4. **AI** — four products in real use: AI Doctor Assistant, AI Radiology,
   AI Ultrasound, AI Clinical Research.

## Who it is for

Ranked by traffic and by what the homepage must serve:

- **Patients and their families** in the Fergana Valley choosing where to be seen.
  They arrive on a phone, often on a slow connection, wanting one thing: the right
  specialist and a booking. Everything else on the page is secondary to them.
- **Referring physicians** checking whether the institute is credible enough to
  send a patient to.
- **Trial sponsors and CROs** evaluating the site as a research partner.
- **Residents and physicians** looking for rotations or CME.

Uzbek, Russian, English, and Karakalpak all matter. Russian is the heaviest
locale; Karakalpak inherits Uzbek for long-form content.

## What must be true

- **Claims are load-bearing.** This is a licensed medical institute. Patient
  counts, trial counts, accuracy figures, and testimonials are regulated public
  claims — they come from `src/i18n/translations.ts` and the data files in
  `src/data/`, never from invention. Product metrics that already exist
  (87% documentation-time reduction, 94% early-detection sensitivity, 3× faster
  ultrasound, 40% screening-time reduction) belong to the named AI product and
  must stay attached to it.
- **Booking is the primary action** on every patient-facing surface. The phone
  number is the second; a meaningful share of visitors will call rather than book.
- **Doctors are people with pages.** Every doctor card resolves to a real profile
  at `/doctors/<slug>` with real photography.
- **The clinic does not grant degrees.** Any education copy must keep the
  university distinction intact.

## Real numbers (the only ones that may be published)

| Value    | Meaning                       |
|----------|-------------------------------|
| 50 000+  | patients per year             |
| 100+     | doctors and scientists        |
| 150+     | clinical trials completed     |
| 20+      | active research programs      |
| 10+      | AI solutions in development    |
| 500+     | specialists trained per year  |
| 12       | clinical departments          |
| 18+      | therapeutic areas             |
| 40+      | countries patients come from  |

## Constraints

- React 19 + Vite + Tailwind v4 + `motion/react`. No new runtime dependencies
  without cause; `three`/`@react-three/fiber` and Spline are already present and
  already expensive — do not add more to the homepage.
- Django CMS at `backend/` can override homepage content through `useCms()`;
  every section must render correctly from the static i18n fallback alone.
- Four locales. No copy may be hardcoded in a component.
- Phones on slow connections are the median homepage visitor.

## Surfaces

| Route            | Mode      | Job                                              |
|------------------|-----------|--------------------------------------------------|
| `/`              | Persuade  | Believe the institute; book or call.             |
| `/clinic`, `/clinic/:slug` | Operate | Find the right department and its doctors. |
| `/doctors`, `/doctors/:slug` | Operate | Choose a specialist; book.            |
| `/prices`        | Read      | Find a price without asking anyone.              |
| `/research`      | Persuade  | Convince a sponsor or CRO.                       |
| `/education`     | Read      | Find a rotation, placement, or CME course.       |
| `/ai`, `/ai/:slug` | Persuade | Sell the AI products; request a demo.           |
