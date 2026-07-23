import type { ReactNode } from 'react'
import Nav from './components/Nav'
import Clinic from './components/Clinic'
import Research from './components/Research'
import AISection from './components/AISection'
import Education from './components/Education'
import Doctors from './components/Doctors'
import NewsSection from './components/NewsSection'
import Partners from './components/Partners'
import International from './components/International'
import FooterSection from './components/FooterSection'
import SiteFooter from './components/SiteFooter'
import BackToTop from './components/BackToTop'
import SiteAssistant from './components/SiteAssistant'
import SpecialtyPage from './pages/SpecialtyPage'
import NewsPage from './pages/NewsPage'
import AIProductPage from './pages/AIProductPage'
import DoctorPage from './pages/DoctorPage'
import NotFoundPage from './pages/NotFoundPage'
import HomePage from './pages/HomePage'
import PageShell from './pages/PageShell'
import PricesPage from './pages/PricesPage'
import { PageTransitionProvider, usePageNav } from './components/PageTransition'
import PageEnter from './components/PageEnter'

function AppRoutes() {
  const { path } = usePageNav()

  const specialtyMatch = path.match(/^\/clinic\/([^/]+)$/)
  const specialtySlug = specialtyMatch?.[1] ?? null
  const newsMatch = path.match(/^\/news\/([^/]+)$/)
  const newsSlug = newsMatch?.[1] ?? null
  const aiMatch = path.match(/^\/ai\/([^/]+)$/)
  const aiSlug = aiMatch?.[1] ?? null
  const doctorMatch = path.match(/^\/doctors\/([^/]+)$/)
  const doctorSlug = doctorMatch?.[1] ?? null

  const isHome = path === '/'
  const isContacts = path === '/contacts'
  const known =
    isHome ||
    path === '/clinic' ||
    path === '/prices' ||
    path === '/research' ||
    path === '/education' ||
    path === '/ai' ||
    path === '/doctors' ||
    path === '/news' ||
    path === '/partners' ||
    path === '/international' ||
    Boolean(specialtySlug || newsSlug || aiSlug || doctorSlug)

  let body: ReactNode

  if (specialtySlug) {
    body = <SpecialtyPage slug={specialtySlug} />
  } else if (newsSlug) {
    body = <NewsPage slug={newsSlug} />
  } else if (aiSlug) {
    body = <AIProductPage slug={aiSlug} />
  } else if (doctorSlug) {
    body = <DoctorPage slug={doctorSlug} />
  } else if (isHome) {
    body = (
      <main className="site-main">
        <HomePage />
      </main>
    )
  } else if (path === '/clinic') {
    body = (
      <PageShell className="page-shell--clinic">
        <Clinic />
      </PageShell>
    )
  } else if (path === '/prices') {
    body = (
      <PageShell className="page-shell--prices">
        <PricesPage />
      </PageShell>
    )
  } else if (path === '/research') {
    body = (
      <PageShell className="page-shell--research">
        <Research />
      </PageShell>
    )
  } else if (path === '/education') {
    body = (
      <PageShell className="page-shell--education">
        <Education />
      </PageShell>
    )
  } else if (path === '/ai') {
    body = (
      <PageShell className="page-shell--ai">
        <AISection />
      </PageShell>
    )
  } else if (path === '/doctors') {
    body = (
      <PageShell>
        <Doctors />
      </PageShell>
    )
  } else if (path === '/news') {
    body = (
      <PageShell>
        <NewsSection />
      </PageShell>
    )
  } else if (path === '/partners') {
    body = (
      <PageShell>
        <Partners />
      </PageShell>
    )
  } else if (path === '/international') {
    body = (
      <PageShell>
        <International />
      </PageShell>
    )
  } else if (isContacts) {
    body = (
      <PageShell className="page-shell--contacts">
        <FooterSection />
      </PageShell>
    )
  } else {
    body = <NotFoundPage />
  }

  return (
    <div
      className="site-shell min-h-screen"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <Nav />
      <PageEnter path={path}>
        {body}
        {isContacts || !known ? null : <SiteFooter />}
      </PageEnter>
      <BackToTop />
      <SiteAssistant />
    </div>
  )
}

export default function App() {
  return (
    <PageTransitionProvider>
      <AppRoutes />
    </PageTransitionProvider>
  )
}
