# Edge Case Hunter review prompt

Invoke the `bmad-review-edge-case-hunter` skill on the implementation described by:

- Spec: `_bmad-output/implementation-artifacts/spec-match-doctor-preview.md`
- Baseline commit: `72d2b02d1614497b6555caa91dba56a6a67b5ce0`
- Primary changed files:
  - `src/App.tsx`
  - `src/pages/DoctorPage.tsx`
  - `src/styles/doctor-profile.css`
  - `src/data/doctorDossier.ts`
  - `src/components/DoctorReviews.tsx`
  - `src/components/DoctorBookingModal.tsx`

Inspect the complete working-tree diff against the baseline, including untracked files. Focus on branching paths and boundary conditions introduced by this doctor-detail implementation: unknown slugs, every staff kind and language, date rollover, unavailable and selected slots, modal prefill, empty/local reviews, mobile width, keyboard focus, reduced motion, related-doctor fallback, and route-specific chrome.

Return only unhandled edge cases with file and line evidence. If no meaningful finding exists, say so explicitly.
