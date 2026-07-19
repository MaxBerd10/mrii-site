const ICONS = [
  // Cardiology - heart
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z"/></svg>,
  // Neurology - brain
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></svg>,
  // Therapy
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M2 12h20"/></svg>,
  // Gastro
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6"/></svg>,
  // Endocrine
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3c-2 4-6 5-6 9a6 6 0 0012 0c0-4-4-5-6-9z"/></svg>,
  // Urology
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>,
  // Gynecology
  <svg key="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M12 12v8M8 20h8"/></svg>,
  // Pediatrics
  <svg key="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="7" r="3"/><path d="M6 21v-2a6 6 0 0112 0v2"/></svg>,
  // Surgery
  <svg key="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 4l6 6-8 8H6v-6l8-8z"/><path d="M8 16l-4 4"/></svg>,
  // Rehab
  <svg key="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12h16M12 4v16"/><circle cx="12" cy="12" r="9"/></svg>,
  // Diagnostics
  <svg key="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="M16 16l5 5"/></svg>,
  // Oncology
  <svg key="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>,
]

export default function SpecialtyIcon({ index, active }: { index: number; active?: boolean }) {
  return (
    <div className={`icon-box ${active ? 'icon-box--active' : ''}`}>
      {ICONS[index % ICONS.length]}
    </div>
  )
}

const PILLAR_ICONS = [
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v4M12 18v4M4 12H2M22 12h-2M6 6L4 4M20 20l-2-2M6 18l-2 2M20 4l-2 2"/><circle cx="12" cy="12" r="4"/></svg>,
  <svg key="r" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3h6v7l5 9H4l5-9V3z"/><path d="M9 3h6"/></svg>,
  <svg key="e" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10l-10 6L2 10l10-6 10 6z"/><path d="M6 12v5a2 2 0 002 2h8a2 2 0 002-2v-5"/></svg>,
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/><path d="M3 9h3M18 9h3M9 3v3M9 18v3"/></svg>,
]

export function PillarIcon({ index, color }: { index: number; color: string }) {
  return (
    <div className="pillar-icon" style={{ color, background: `${color}12`, borderColor: `${color}30` }}>
      {PILLAR_ICONS[index]}
    </div>
  )
}
