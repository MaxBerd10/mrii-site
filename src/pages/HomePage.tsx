import Hero from '../components/Hero'
import Pillars from '../components/Pillars'
import ProcessSteps from '../components/ProcessSteps'

/** Landing: hero + entry cards only — sections live on their own routes. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Pillars />
      <ProcessSteps />
    </>
  )
}
