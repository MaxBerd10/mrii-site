---
version: 2
slug: "src-components-clinic-tsx"
primary_target: "src/components/Clinic.tsx"
related_targets: ["src/styles/clinic-catalog.css","src/i18n/translations.ts"]
---

Scope: `/clinic`, `/clinic/services`, and `/clinic/diagnostics` in Operate mode for patients seeking care.

Audience and job: A patient arrives ready to find the right department quickly and book. The primary action is appointment booking; specialty detail, doctors, and prices are supporting paths.

Direction: Finder-first daylight catalog. No brochure photo hero. First viewport = compact title row (label, h1, book CTA, one-line help) + dominant navy search block with three shortcuts. Specialty grid follows immediately.

Content and constraints: Use existing localized specialties, descriptions, doctor counts, and medical atlas imagery on cards only. Do not mix student content, invent claims, or hide navigation. Search, filters, empty recovery, keyboard focus, localization, and responsive layouts are required.

Composition: clinic-opening (intro + finder) → results head + filter toolbar → specialty grid.
