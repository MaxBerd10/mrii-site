import { useLayoutEffect } from 'react'
import CareHero from '../components/care/CareHero'
import CareOrbit from '../components/care/CareOrbit'
import CareHarmony from '../components/care/CareHarmony'
import {
  CareAi,
  CareCompare,
  CareFaq,
  CarePath,
  CareServices,
  CareVoices,
} from '../components/care/CareSections'
import CinematicFooter from '../components/ui/motion-footer'
import '../styles/home-care.css'

/**
 * THE CARE SYSTEM — the light homepage.
 *
 * The counterpart to `HomePage` (the dark instrument, still reachable at
 * `/home-instrument`). This one opens on daylight: warm white ground, the
 * clinic's own corridor, one deep blue carrying the institute's authority.
 *
 * The order is an argument, not a menu. The hero makes the claim; the doctor
 * orbit immediately turns that promise into real people and a memorable
 * scroll-led moment. Harmony then defines the line between machine and doctor;
 * the AI systems and comparison table are the evidence; the journey and
 * departments answer "what happens to me"; voices and FAQ absorb the remaining
 * doubt.
 *
 * Density is paced: a dense passage (departments, doctors) always earns a
 * quieter one after it, and the tinted sections alternate so the page never
 * reads as one long white scroll. The page carries no closing CTA of its own —
 * the footer is the close, and a second pitch above it only competed with it.
 */
export default function HomeCarePage() {
  useLayoutEffect(() => {
    document.documentElement.classList.add('is-home-care')
    return () => document.documentElement.classList.remove('is-home-care')
  }, [])

  return (
    <div className="home-care">
      <CareHero />
      <CareOrbit />
      <CareHarmony />
      <CareAi />
      <CareCompare />
      <CarePath />
      <CareServices />
      <CareVoices />
      <CareFaq />
      <CinematicFooter />
    </div>
  )
}
