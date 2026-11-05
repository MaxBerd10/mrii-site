import { useContacts, useCopy } from '../i18n/useCopy'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import NotFoundPage from './NotFoundPage'
import {
  doctorPageLabels,
  getDoctorBySlug,
  getDoctorsBySpecialty,
} from '../data/doctors'
import { DOSSIER_LOCALES, getDoctorDossier } from '../data/doctorDossier'
import { getDoctorPortrait, getDoctorTurnMedia } from '../data/doctorTurnMedia'
import {
  getSpecialtyColleagues,
  getSpecialtySlugForDoctor,
} from '../data/specialtyWorld'
import { PROFILE_UI } from '../data/doctorProfileUi'
import { DoctorTeamSection } from '../components/DoctorTeamSection'
import { useScrollToTopOnRoute } from '../lib/scrollRoute'
import '../styles/doctor-profile.css'
import '../styles/doctor-portrait-fix.css'
import '../styles/doctor-mini.css'
import '../styles/doctor-booking-phone.css'

const barHeights = [42, 55, 47, 73, 86, 88, 82]

function splitName(name: string) {
  const parts = name.trim().split(/\s+/)
  return {
    lead: parts.slice(0, -1).join(' ') || name,
    tail: parts.length > 1 ? parts.at(-1) : '',
  }
}

export default function DoctorPage({ slug }: { slug: string }) {
  const { lang, t } = useLanguage()
  const contacts = useContacts()
  const labels = useCopy('doctorPageLabels', doctorPageLabels)
  const ui = useCopy('doctorProfileUi', PROFILE_UI)
  const match = getDoctorBySlug(slug)
  const [dockVisible, setDockVisible] = useState(false)
  const portraitVideoRef = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()

  useScrollToTopOnRoute(slug)

  useEffect(() => {
    const onScroll = () => setDockVisible(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!match) return
    document.title = `${match.profile.content[lang].name} - ${t.nav.brand}`
  }, [match, lang, t.nav.brand])

  useEffect(() => {
    const video = portraitVideoRef.current
    if (!video || reduce) return
    video.play().catch(() => undefined)
  }, [slug, reduce])

  useEffect(() => {
    const frame = portraitVideoRef.current?.closest('.dp-portrait')
    const video = portraitVideoRef.current
    if (!frame || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) video.pause()
      },
      { threshold: 0.2 },
    )
    observer.observe(frame)
    return () => observer.disconnect()
  }, [slug])

  if (!match) return <NotFoundPage />

  const { profile } = match
  const view = profile.content[lang]
  const dossierUi = useCopy('doctorDossier', DOSSIER_LOCALES)
  const dossier = getDoctorDossier(profile, lang, dossierUi)
  const portrait = getDoctorPortrait(profile.slug, profile.photo)
  const turnMedia = getDoctorTurnMedia(profile.slug)
  const title = splitName(view.name)
  const specialtySlug = getSpecialtySlugForDoctor(profile)
  const relatedDoctors = specialtySlug
    ? getSpecialtyColleagues(specialtySlug, slug)
    : getDoctorsBySpecialty(profile.content.uz.specialty, slug)
  const aboutText = view.about.startsWith(view.name)
    ? view.about.slice(view.name.length).replace(/^\s*[—–-]\s*/, '')
    : view.about

  const scrollToBooking = () => {
    document.getElementById('doctor-booking')?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'center',
    })
  }

  return (
    <main className="dp">
      <div className={`dp-dockbar${dockVisible ? ' is-on' : ''}`}>
        <div className="dp-shell dp-dockbar__in">
          <img className="dp-dockbar__thumb" src={portrait} alt="" />
          <div>
            <p className="dp-dockbar__name">{view.name}</p>
            <p className="dp-dockbar__role">
              {view.role} · {dossier.badges[0]}
            </p>
          </div>
          <span className="dp-dockbar__spacer" />
          <span className="dp-dockbar__slot">{ui.hoursShort}</span>
          <button type="button" className="dp-btn dp-btn--solid" onClick={scrollToBooking}>
            {ui.booking} <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <section className="dp-stage">
        <div className="dp-shell">
          <a className="dp-stage__back" href="/doctors">
            <span aria-hidden>←</span>
            <span>{labels.back}</span>
          </a>

          <div className="dp-stage__grid">
            <motion.div
              className="dp-stage__copy"
              initial={reduce ? false : { opacity: 0, transform: 'translateY(12px)' }}
              animate={{ opacity: 1, transform: 'translateY(0)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="dp-chan">
                {ui.profile} · {view.specialty}
              </p>
              <h1 className="dp-stage__title">
                <span>{title.lead}</span>
                {title.tail && <em>{title.tail}</em>}
              </h1>
              <p className="dp-stage__role">
                {view.role} · {dossier.academicTitle}
              </p>

              <div className="dp-stage__tags">
                {dossier.badges.map((badge) => (
                  <span key={badge} className="dp-stage__tag">
                    {badge}
                  </span>
                ))}
              </div>

              <p className="dp-stage__live">
                <i aria-hidden />
                {ui.available}
              </p>

              <div className="dp-stage__actions">
                <button type="button" className="dp-btn dp-btn--primary" onClick={scrollToBooking}>
                  {ui.book} <span className="dp-btn__arrow" aria-hidden>→</span>
                </button>
                <a className="dp-btn dp-btn--ghost" href={`tel:${contacts.phoneTel}`}>
                  {t.topBar.phone}
                </a>
              </div>
            </motion.div>

            <figure className="dp-portrait">
              <div className="dp-portrait__media" aria-hidden={turnMedia ? undefined : true}>
                {turnMedia ? (
                  <>
                    <img
                      className="dp-portrait__poster"
                      src={turnMedia.poster}
                      alt=""
                      width={650}
                      height={760}
                      decoding="async"
                    />
                    <video
                      ref={portraitVideoRef}
                      className="dp-portrait__video"
                      muted
                      playsInline
                      preload="metadata"
                      poster={turnMedia.poster}
                      aria-label={view.name}
                      onEnded={(event) => {
                        const video = event.currentTarget
                        video.currentTime = Math.max(0, video.duration - 0.06)
                      }}
                      onPointerEnter={() => {
                        if (reduce) return
                        const video = portraitVideoRef.current
                        if (!video) return
                        video.currentTime = 0
                        void video.play().catch(() => undefined)
                      }}
                    >
                      <source src={turnMedia.video} type="video/mp4" />
                    </video>
                  </>
                ) : (
                  <img
                    className="dp-portrait__photo"
                    src={portrait}
                    alt={view.name}
                    width={650}
                    height={760}
                    decoding="async"
                  />
                )}
              </div>
            </figure>
          </div>
        </div>

        <div className="dp-strip">
          <svg className="dp-strip__ecg" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden>
            <path d="M0 48H360L385 48L400 32L414 62L431 8L452 66L470 48H810L838 48L854 35L868 60L887 13L905 64L924 48H1200" />
          </svg>
          <div className="dp-shell dp-strip__grid">
            <div className="dp-strip__cell">
              <b className="dp-readout">{dossier.experienceYears}</b>
              <span>{labels.experience}</span>
            </div>
            <div className="dp-strip__cell">
              <b className="dp-readout">{profile.papers}</b>
              <span>{ui.papers}</span>
            </div>
            <div className="dp-strip__cell">
              <b className="dp-readout">{profile.studies}</b>
              <span>{ui.studies}</span>
            </div>
            <div className="dp-strip__cell">
              <b className="dp-readout">4.9</b>
              <span>{t.doctors.rating}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dp-shell dp-booking-wrap" id="doctor-booking">
        <div className="dp-booking dp-booking--phone">
          <div>
            <header className="dp-booking__head">
              <div>
                <p className="dp-chan">{ui.schedule}</p>
                <h2>{ui.phoneBookingTitle}</h2>
                <p className="dp-booking__lead">{ui.phoneBookingLead}</p>
              </div>
            </header>

            <ol className="dp-booking__steps">
              {ui.phoneSteps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <aside className="dp-booking__aside">
            <div className="dp-summary">
              <dl>
                <div><dt>{ui.doctor}</dt><dd>{view.name}</dd></div>
                <div><dt>{ui.direction}</dt><dd>{view.specialty}</dd></div>
                <div><dt>{ui.hours}</dt><dd>{ui.hoursShort}</dd></div>
                <div><dt>{ui.price}</dt><dd>{dossier.ui.visit.firstVisitValue}</dd></div>
              </dl>
            </div>
            <a className="dp-btn dp-btn--solid dp-booking__call" href={`tel:${contacts.phoneTel}`}>
              <span className="dp-booking__call-label">{ui.callToBook}</span>
              <span className="dp-booking__call-number">{contacts.phoneLocal}</span>
            </a>
            <a className="dp-btn dp-booking__contacts" href="/contacts?intent=booking">
              {ui.contactsCta} <span className="dp-btn__arrow" aria-hidden>→</span>
            </a>
            <p className="dp-booking__note">{ui.bookingNote}</p>
          </aside>
        </div>
      </section>

      <section className="dp-shell dp-body-split">
        <article className="dp-prose">
          <p className="dp-chan">{ui.about}</p>
          <h2>{ui.aboutTitle}</h2>
          <p>
            <strong>{view.name}</strong> {aboutText}
          </p>
          <p>
            {lang === 'uz'
              ? 'Har bir bemor uchun tekshiruv natijalari bitta kuzatuv kartasiga yig’iladi — shu karta keyingi qabul va davolash rejasining asosi bo’lib qoladi.'
              : lang === 'ru'
                ? 'Результаты обследований собираются в единую карту наблюдения — она становится основой следующих приёмов и плана лечения.'
                : lang === 'kaa'
                  ? 'Hár bir nawqas ushın tekseriw nátiyjeleri bir baqlaw kartasına jıynaladı — usı karta kelesi qabıllaw hám emlew jobasınıń tiykarı bolıp qaladı.'
                  : 'Every result is collected in one follow-up record, which becomes the basis for future visits and the care plan.'}
          </p>
          <p className="dp-chan dp-prose__focus">{ui.focus}</p>
          <div className="dp-chips">
            {view.focuses.concat(view.focuses.length < 5 ? view.education.slice(0, 2) : []).map((focus) => (
              <span key={focus} className="dp-chip">
                <i aria-hidden />
                {focus.replace(/[—–]/g, ' · ')}
              </span>
            ))}
          </div>
        </article>

        <aside className="dp-visitcard">
          <header className="dp-visitcard__head">
            <p className="dp-chan">{ui.visitCard}</p>
            <h3>{dossier.ui.visit.title}</h3>
          </header>
          <dl className="dp-visitcard__rows">
            {[
              [dossier.ui.visit.address, dossier.ui.visit.addressValue, dossier.ui.visit.addressNote],
              [dossier.ui.visit.hours, dossier.ui.visit.hoursValue, dossier.ui.visit.hoursNote],
              [ui.languages, view.languages.join(' · '), ''],
              [dossier.ui.visit.firstVisit, dossier.ui.visit.firstVisitValue, dossier.ui.visit.firstVisitNote],
              [dossier.ui.visit.followUp, dossier.ui.visit.followUpValue, dossier.ui.visit.followUpNote],
              [dossier.ui.visit.insurance, dossier.ui.visit.insuranceValue, dossier.ui.visit.insuranceNote],
            ].map(([label, value, note]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  {value}
                  {note && <small>{note}</small>}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <section className="dp-shell dp-career">
        <header className="dp-career__head">
          <div>
            <p className="dp-chan">{ui.career}</p>
            <h2>
              {lang === 'uz'
                ? `${dossier.experienceYears} yillik amaliyot, bitta chiziqda`
                : lang === 'ru'
                  ? `${dossier.experienceYears} лет практики на одной линии`
                  : lang === 'kaa'
                    ? `${dossier.experienceYears} jıllıq ámeliyat, bir sızıqta`
                    : `${dossier.experienceYears} years of practice on one line`}
            </h2>
          </div>
          <p>{ui.careerDescription}</p>
        </header>

        <div className="dp-trace">
          <svg className="dp-trace__line" viewBox="0 0 1000 70" preserveAspectRatio="none" aria-hidden>
            <path d="M0 38H760" />
            <path className="is-hot" d="M760 38H784L798 26L810 54L825 8L840 56L854 38H1000" />
          </svg>
          <ol className="dp-trace__row">
            {dossier.milestones.map((milestone) => (
              <li key={`${milestone.range}-${milestone.place}`} className={`dp-node${milestone.current ? ' dp-node--now' : ''}`}>
                <time>{milestone.range}</time>
                <span className="dp-node__dot" aria-hidden />
                <div className="dp-node__card">
                  <strong>{milestone.place}</strong>
                  <p>{milestone.role}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="dp-shell dp-evidence">
        <article className="dp-panel">
          <p className="dp-chan">{ui.education}</p>
          <h3>{ui.educationTitle}</h3>
          <ul className="dp-ruled">
            {view.education.concat([
              `${view.specialty} · ${new Date().getFullYear() - 4}`,
              dossier.academicTitle,
            ]).map((item, index) => (
              <li key={`${item}-${index}`}>
                {item.replace(/[—–]/g, ' · ')}
                <small>{index === 0 ? `${new Date().getFullYear() - dossier.experienceYears}` : view.specialty}</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="dp-panel">
          <p className="dp-chan">{ui.science}</p>
          <h3>{ui.scienceTitle}</h3>
          <div className="dp-bars" aria-hidden>
            {barHeights.map((height, index) => (
              <div key={height + index}>
                <i style={{ height: `${height}%` }} />
                <span>{String(new Date().getFullYear() - 6 + index).slice(-2)}</span>
              </div>
            ))}
          </div>
          <div className="dp-panel__stats">
            <div><b className="dp-readout">{profile.papers}</b><span>{ui.papers}</span></div>
            <div><b className="dp-readout">{profile.studies}</b><span>{ui.studies}</span></div>
          </div>
        </article>

        <article className="dp-panel">
          <p className="dp-chan">{ui.languages}</p>
          <h3>{ui.languagesTitle}</h3>
          <dl className="dp-langs">
            {dossier.languages.map((language, index) => (
              <div key={language.language}>
                <dt><span>{language.language}</span><em>{language.level}</em></dt>
                <dd><i style={{ width: `${Math.max(62, 100 - index * 12)}%` }} /></dd>
              </div>
            ))}
          </dl>
        </article>
      </section>


      <section className="dp-shell dp-related">
        <DoctorTeamSection
          embedded
          eyebrow={view.specialty}
          title={ui.related}
          description={ui.relatedDescription}
          hoursLabel={ui.hoursShort}
          doctors={relatedDoctors}
          contentLang={lang}
        />
      </section>

      <section className="dp-close">
        <div className="dp-shell dp-close__in">
          <div>
            <h2>{ui.coordinatorTitle}</h2>
            <p>{ui.coordinatorText}</p>
          </div>
          <div className="dp-close__actions">
            <a className="dp-btn dp-btn--primary" href={`tel:${contacts.phoneTel}`}>{t.topBar.phone}</a>
            <a className="dp-btn dp-btn--ghost" href="/contacts?intent=booking">
              {ui.callback}
            </a>
          </div>
        </div>
      </section>

      <footer className="dp-shell dp-foot">{ui.footnote}</footer>
    </main>
  )
}
