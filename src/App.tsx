import { lazy, Suspense, type ReactNode } from 'react'
import Nav from './components/Nav'
import BackToTop from './components/BackToTop'
import SiteAssistant from './components/SiteAssistant'
import AiShifokorRedirect from './components/AiShifokorRedirect'
import HomeCarePage from './pages/HomeCarePage'
import PageShell from './pages/PageShell'
import { PageTransitionProvider, usePageNav } from './components/PageTransition'
import PageEnter from './components/PageEnter'
import { useScrollToTopOnRoute } from './lib/scrollRoute'

// Inner pages are loaded only after the visitor opens their route. The home
// route remains immediate because it is the primary first-load experience.
const Clinic = lazy(() => import('./components/Clinic'))
const Research = lazy(() => import('./components/Research'))
const AISection = lazy(() => import('./components/AISection'))
const Education = lazy(() => import('./components/Education'))
const Doctors = lazy(() => import('./components/Doctors'))
const NewsSection = lazy(() => import('./components/NewsSection'))
const FooterSection = lazy(() => import('./components/FooterSection'))
const SpecialtyPage = lazy(() => import('./pages/SpecialtyPage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const DoctorPage = lazy(() => import('./pages/DoctorPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const PricesPage = lazy(() => import('./pages/PricesPage'))
const ClinicGalleryPage = lazy(() => import('./pages/ClinicGalleryPage'))
const ClinicTourPage = lazy(() => import('./pages/ClinicTourPage'))
const VacanciesPage = lazy(() => import('./pages/VacanciesPage'))

function AppRoutes() {
  const { path, busy } = usePageNav()
  useScrollToTopOnRoute(path)

  const isClinicServices = path === '/clinic/services'
  const isClinicDiagnostics = path === '/clinic/diagnostics'
  const isClinicGallery = path === '/clinic/gallery'
  const isClinicTour = path === '/clinic/tour'
  const isClinicIndex = path === '/clinic'
  const specialtyMatch =
    isClinicServices || isClinicDiagnostics || isClinicGallery || isClinicTour ? null : path.match(/^\/clinic\/([^/]+)$/)
  const specialtySlug = specialtyMatch?.[1] ?? null
  const newsMatch = path.match(/^\/news\/([^/]+)$/)
  const newsSlug = newsMatch?.[1] ?? null
  const aiMatch = path.match(/^\/ai\/([^/]+)$/)
  const aiSlug = aiMatch?.[1] ?? null
  const doctorMatch = path.match(/^\/doctors\/([^/]+)$/)
  const doctorSlug = doctorMatch?.[1] ?? null
  const isDoctorPortal = path === '/doctor' || path === '/doctor/login'
  const isAiLegacyRoute = aiSlug !== null
  const isDoctorDetail = doctorSlug !== null

  const isHome = path === '/'
  const isContacts = path === '/contacts'

  let body: ReactNode

  if (specialtySlug) {
    body = <SpecialtyPage slug={specialtySlug} />
  } else if (newsSlug) {
    body = <NewsPage slug={newsSlug} />
  } else if (isDoctorPortal || isAiLegacyRoute) {
    body = <AiShifokorRedirect />
  } else if (doctorSlug) {
    body = <DoctorPage slug={doctorSlug} />
  } else if (isHome) {
    body = (
      <main className="site-main">
        <HomeCarePage />
      </main>
    )
  } else if (isClinicIndex) {
    body = (
      <PageShell className="page-shell--clinic">
        <Clinic />
      </PageShell>
    )
  } else if (isClinicServices) {
    body = (
      <PageShell className="page-shell--clinic">
        <Clinic view="services" />
      </PageShell>
    )
  } else if (isClinicDiagnostics) {
    body = (
      <PageShell className="page-shell--clinic">
        <Clinic view="diagnostics" />
      </PageShell>
    )
  } else if (isClinicGallery) {
    body = (
      <PageShell className="page-shell--clinic-gallery">
        <ClinicGalleryPage />
      </PageShell>
    )
  } else if (isClinicTour) {
    body = (
      <PageShell className="page-shell--clinic-tour">
        <ClinicTourPage />
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
  } else if (path === '/vakansiyalar') {
    body = (
      <PageShell className="page-shell--vacancies">
        <VacanciesPage />
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
      aria-hidden={busy || undefined}
    >
      {!isDoctorDetail && !isDoctorPortal && !isAiLegacyRoute && <Nav />}
      {/* The cinematic footer is the homepage's own closing moment and ships
          with it; no route adds a footer here. Inner pages end on their own
          last section. */}
      <PageEnter path={path}>
        <Suspense fallback={null}>{body}</Suspense>
      </PageEnter>
      {!isDoctorDetail && !isDoctorPortal && !isAiLegacyRoute && <BackToTop />}
      {!isDoctorDetail && !isDoctorPortal && !isAiLegacyRoute && <SiteAssistant />}
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
