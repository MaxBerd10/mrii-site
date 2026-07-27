import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import AiShowcase from '../components/home/AiShowcase'
import TrustReadout from '../components/home/TrustReadout'
import AiSystems from '../components/home/AiSystems'
import AiOrbit from '../components/home/AiOrbit'
import Comparison from '../components/home/Comparison'
import PatientPath from '../components/home/PatientPath'
import ServiceGrid from '../components/home/ServiceGrid'
import TeamGrid from '../components/home/TeamGrid'
import Voices from '../components/home/Voices'
import PartnerMarquee from '../components/home/PartnerMarquee'
import FaqPanel from '../components/home/FaqPanel'
import ClosingCta from '../components/home/ClosingCta'
import DarkFooter from '../components/home/DarkFooter'
import '../styles/home-dark.css'

/**
 * THE INSTRUMENT — see DESIGN.md for the full direction contract.
 *
 * The hero's one gesture (a robot hand meeting a human hand) continues down the
 * page as instrument grammar: every section is a readout, a trace, or a scan.
 * Density is paced deliberately — strip, asymmetric split, canvas, table,
 * timeline, dense grid, carousel, marquee, single column, close.
 *
 * This is the only dark surface on the site. Inner routes stay in the daylight
 * system, so the `is-home-dark` class is scoped to this page's lifetime.
 */
export default function HomePage() {
  // Browsers pause IntersectionObserver while a document is hidden, so a page
  // opened in a background tab would render its reveal targets blank. Track
  // visibility and fall back to a fully static page until the tab is seen.
  const [hidden, setHidden] = useState(() =>
    typeof document === 'undefined' ? false : document.visibilityState === 'hidden',
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('is-home-dark')

    const sync = () => setHidden(document.visibilityState === 'hidden')
    document.addEventListener('visibilitychange', sync)
    sync()

    return () => {
      root.classList.remove('is-home-dark')
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return (
    <div className={`home-dark${hidden ? ' is-static' : ''}`}>
      <Hero />
      <AiShowcase />
      <TeamGrid />
      <TrustReadout />
      <AiSystems />
      <AiOrbit />
      <Comparison />
      <PatientPath />
      <ServiceGrid />
      <Voices />
      <PartnerMarquee />
      <FaqPanel />
      <ClosingCta />
      <DarkFooter />
    </div>
  )
}
