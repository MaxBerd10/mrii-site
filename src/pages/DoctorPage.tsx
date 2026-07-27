import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import type { ContentLang } from '../i18n/types'
import DoctorReviews from '../components/DoctorReviews'
import DoctorBookingModal from '../components/DoctorBookingModal'
import NotFoundPage from './NotFoundPage'
import {
  doctorPageLabels,
  doctorProfiles,
  getDoctorBySlug,
  getDoctorsBySpecialty,
} from '../data/doctors'
import { getDoctorDossier } from '../data/doctorDossier'
import { getDoctorPortrait, getDoctorTurnMedia } from '../data/doctorTurnMedia'
import '../styles/doctor-profile.css'

type ProfileUi = {
  profile: string
  available: string
  book: string
  booking: string
  schedule: string
  chooseTime: string
  realtime: string
  today: string
  doctor: string
  direction: string
  date: string
  time: string
  notSelected: string
  price: string
  confirm: string
  bookingNote: string
  about: string
  aboutTitle: string
  focus: string
  visitCard: string
  career: string
  careerDescription: string
  education: string
  educationTitle: string
  science: string
  scienceTitle: string
  languages: string
  languagesTitle: string
  papers: string
  studies: string
  reviews: string
  reviewsTitle: string
  related: string
  relatedDescription: string
  coordinatorTitle: string
  coordinatorText: string
  callback: string
  footnote: string
}

const profileUi: Record<ContentLang, ProfileUi> = {
  uz: {
    profile: 'Shifokor profili',
    available: 'Qabul ochiq — eng yaqin vaqt bugun 14:30',
    book: 'Qabulga yozilish',
    booking: 'Yozilish',
    schedule: 'Qabul jadvali',
    chooseTime: 'Vaqtni tanlang',
    realtime: 'Jadval real vaqtda yangilanadi',
    today: 'Bugun',
    doctor: 'Shifokor',
    direction: 'Yo‘nalish',
    date: 'Sana',
    time: 'Vaqt',
    notSelected: 'tanlanmagan',
    price: 'Narx',
    confirm: 'Bandlikni tasdiqlash',
    bookingNote: 'Ariza bepul. Bekor qilish — qabuldan 2 soat oldin, jarimasiz.',
    about: 'Mutaxassis haqida',
    aboutTitle: 'Sog‘liqni erta asrash — kech davolashdan samaraliroq.',
    focus: 'Yordam yo‘nalishlari',
    visitCard: 'Qabul kartasi',
    career: 'Kasbiy yo‘l',
    careerDescription: 'Tayyorgarlikdan yetakchi mutaxassislikkacha — ish joylari va mas’uliyat doirasi.',
    education: 'Ta’lim va malaka',
    educationTitle: 'Hujjatlar bilan tasdiqlangan',
    science: 'Ilmiy faoliyat',
    scienceTitle: 'Nashrlar dinamikasi',
    languages: 'Qabul tillari',
    languagesTitle: 'Tarjimonsiz muloqot',
    papers: 'Maqola',
    studies: 'Tadqiqot',
    reviews: 'Bemorlar fikri',
    reviewsTitle: '128 ta tasdiqlangan sharh',
    related: 'Shu yo‘nalishdagi boshqa shifokorlar',
    relatedDescription: 'Vaqt to‘g‘ri kelmasa — hamkasblari ham shu klinik kuzatuv kartasini ko‘radi.',
    coordinatorTitle: 'Qaysi shifokorga yozilishni bilmayapsizmi?',
    coordinatorText: 'Klinika koordinatori shikoyatingizni tinglab, to‘g‘ri mutaxassisga yo‘naltiradi.',
    callback: 'Qayta qo‘ng‘iroq so‘rash',
    footnote: 'Shifokor profilidagi kasbiy ma’lumotlar CMS orqali yangilanadi.',
  },
  ru: {
    profile: 'Профиль врача',
    available: 'Запись открыта — ближайшее время сегодня в 14:30',
    book: 'Записаться на приём',
    booking: 'Записаться',
    schedule: 'Расписание приёма',
    chooseTime: 'Выберите время',
    realtime: 'Расписание обновляется в реальном времени',
    today: 'Сегодня',
    doctor: 'Врач',
    direction: 'Направление',
    date: 'Дата',
    time: 'Время',
    notSelected: 'не выбрано',
    price: 'Стоимость',
    confirm: 'Подтвердить время',
    bookingNote: 'Заявка бесплатна. Отмена без штрафа — за 2 часа до приёма.',
    about: 'О специалисте',
    aboutTitle: 'Раннее внимание к здоровью эффективнее позднего лечения.',
    focus: 'Направления помощи',
    visitCard: 'Карточка приёма',
    career: 'Профессиональный путь',
    careerDescription: 'От подготовки до ведущей практики — места работы и зона ответственности.',
    education: 'Образование и квалификация',
    educationTitle: 'Подтверждено документами',
    science: 'Научная деятельность',
    scienceTitle: 'Динамика публикаций',
    languages: 'Языки приёма',
    languagesTitle: 'Общение без переводчика',
    papers: 'Публикаций',
    studies: 'Исследований',
    reviews: 'Отзывы пациентов',
    reviewsTitle: '128 подтверждённых отзывов',
    related: 'Другие врачи этого направления',
    relatedDescription: 'Если время не подходит, коллеги увидят ту же клиническую карту наблюдения.',
    coordinatorTitle: 'Не знаете, к какому врачу записаться?',
    coordinatorText: 'Координатор клиники выслушает жалобы и направит к подходящему специалисту.',
    callback: 'Заказать звонок',
    footnote: 'Профессиональные данные профиля обновляются через CMS.',
  },
  en: {
    profile: 'Doctor profile',
    available: 'Appointments open — next slot today at 14:30',
    book: 'Book appointment',
    booking: 'Book',
    schedule: 'Appointment schedule',
    chooseTime: 'Choose a time',
    realtime: 'Schedule updates in real time',
    today: 'Today',
    doctor: 'Doctor',
    direction: 'Specialty',
    date: 'Date',
    time: 'Time',
    notSelected: 'not selected',
    price: 'Price',
    confirm: 'Confirm availability',
    bookingNote: 'The request is free. Cancel without a fee up to two hours before the visit.',
    about: 'About the specialist',
    aboutTitle: 'Early attention to health is more effective than late treatment.',
    focus: 'Areas of care',
    visitCard: 'Visit card',
    career: 'Professional journey',
    careerDescription: 'From clinical training to leading practice — workplaces and responsibilities.',
    education: 'Education and credentials',
    educationTitle: 'Documented qualifications',
    science: 'Research activity',
    scienceTitle: 'Publication momentum',
    languages: 'Consultation languages',
    languagesTitle: 'Talk without an interpreter',
    papers: 'Papers',
    studies: 'Studies',
    reviews: 'Patient reviews',
    reviewsTitle: '128 verified reviews',
    related: 'Other doctors in this specialty',
    relatedDescription: 'If the time does not work, colleagues can see the same clinical follow-up record.',
    coordinatorTitle: 'Not sure which doctor to choose?',
    coordinatorText: 'A clinic coordinator will listen to your symptoms and guide you to the right specialist.',
    callback: 'Request a callback',
    footnote: 'Professional profile details are kept current through the CMS.',
  },
}

const slotRows = [
  { label: '09:00', disabled: true },
  { label: '09:40', disabled: false },
  { label: '10:20', disabled: false },
  { label: '11:00', disabled: true },
  { label: '14:30', disabled: false },
  { label: '15:10', disabled: false },
  { label: '15:50', disabled: true },
  { label: '16:30', disabled: false },
]

const modalTimeBySlot: Record<string, string> = {
  '09:00': '09:00 – 09:30',
  '09:40': '09:30 – 10:00',
  '10:20': '10:00 – 10:30',
  '11:00': '11:00 – 11:30',
  '14:30': '14:30 – 15:00',
  '15:10': '15:00 – 15:30',
  '15:50': '15:30 – 16:00',
  '16:30': '16:00 – 16:30',
}

const barHeights = [42, 55, 47, 73, 86, 88, 82]

function splitName(name: string) {
  const parts = name.trim().split(/\s+/)
  return {
    lead: parts.slice(0, -1).join(' ') || name,
    tail: parts.length > 1 ? parts.at(-1) : '',
  }
}

function buildDays(lang: ContentLang) {
  const weekdays: Record<ContentLang, string[]> = {
    uz: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'],
    ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  }
  const months: Record<ContentLang, string[]> = {
    uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
    ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  }
  const now = new Date()
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now)
    date.setDate(now.getDate() + index)
    return {
      iso: date.toISOString().slice(0, 10),
      day: date.getDate(),
      weekday: weekdays[lang][date.getDay()],
      full:
        lang === 'en'
          ? `${months.en[date.getMonth()]} ${date.getDate()}`
          : `${date.getDate()}-${months[lang][date.getMonth()]}`,
      count: [5, 7, 3, 6, 4, 8][index],
    }
  })
}

export default function DoctorPage({ slug }: { slug: string }) {
  const { contentLang, t } = useLanguage()
  const labels = doctorPageLabels[contentLang]
  const ui = profileUi[contentLang]
  const match = getDoctorBySlug(slug)
  const [bookOpen, setBookOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedTime, setSelectedTime] = useState('')
  const [dockVisible, setDockVisible] = useState(false)
  const portraitVideoRef = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
    setSelectedDay(0)
    setSelectedTime('')
  }, [slug])

  useEffect(() => {
    const onScroll = () => setDockVisible(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!match) return
    document.title = `${match.profile.content[contentLang].name} - ${t.nav.brand}`
  }, [match, contentLang, t.nav.brand])

  const days = useMemo(() => buildDays(contentLang), [contentLang])

  if (!match) return <NotFoundPage />

  const { profile } = match
  const view = profile.content[contentLang]
  const dossier = getDoctorDossier(profile, contentLang)
  const portrait = getDoctorPortrait(profile.slug, profile.photo)
  const turnMedia = getDoctorTurnMedia(profile.slug)
  const title = splitName(view.name)
  const sameSpecialty = getDoctorsBySpecialty(profile.content.uz.specialty, slug)
  const relatedSafe = [
    ...sameSpecialty,
    ...doctorProfiles.filter(
      (doctor) =>
        doctor.slug !== slug &&
        !sameSpecialty.some((sameDoctor) => sameDoctor.slug === doctor.slug),
    ),
  ].slice(0, 5)
  const aboutText = view.about.startsWith(view.name)
    ? view.about.slice(view.name.length).replace(/^\s*[—–-]\s*/, '')
    : view.about
  const selectedDate = days[selectedDay]
  const localeReviewText: Record<ContentLang, [string, string, string]> = {
    uz: [
      'Natijalarni birinchi marta tushunarli qilib izohlab berdilar. Davolash rejasini yozib berdilar, uyda ham adashmadim.',
      'Har bir savolimga shoshilmasdan javob berdilar. Kuzatuv rejasi aniq va juda qulay bo‘ldi.',
      'Qabul biroz kechikdi, lekin shifokor yetarli vaqt ajratdi va barcha savollarimga javob berdi.',
    ],
    ru: [
      'Впервые результаты объяснили понятным языком. План лечения записали так, что дома ничего не перепуталось.',
      'На каждый вопрос ответили без спешки. План наблюдения получился ясным и удобным.',
      'Приём немного задержался, но врач уделил достаточно времени и ответил на все вопросы.',
    ],
    en: [
      'For the first time, the results were explained clearly. The written care plan was easy to follow at home.',
      'Every question was answered without rushing. The follow-up plan was clear and practical.',
      'The visit started a little late, but the doctor gave me enough time and answered every question.',
    ],
  }
  const demoReviews = [
    {
      id: `${slug}-demo-1`,
      name: 'Dilnoza R.',
      rating: 5,
      text: localeReviewText[contentLang][0],
      createdAt: '2026-07-12T10:00:00.000Z',
    },
    {
      id: `${slug}-demo-2`,
      name: 'Sanjar T.',
      rating: 5,
      text: localeReviewText[contentLang][1],
      createdAt: '2026-07-04T10:00:00.000Z',
    },
    {
      id: `${slug}-demo-3`,
      name: 'Malika A.',
      rating: 4,
      text: localeReviewText[contentLang][2],
      createdAt: '2026-06-28T10:00:00.000Z',
    },
  ]
  const reviewLabels = {
    rating: t.doctors.rating,
    reviews: t.doctors.reviews,
    write: t.doctors.writeReview,
    empty: t.doctors.emptyReviews,
    name: t.doctors.reviewName,
    comment: t.doctors.reviewComment,
    submit: t.doctors.reviewSubmit,
    close: t.doctors.reviewClose,
    thanks: t.doctors.reviewThanks,
    yourRating: t.doctors.yourRating,
  }

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
          <span className="dp-dockbar__slot">{ui.available.replace('Qabul ochiq — ', '')}</span>
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
                <a className="dp-btn dp-btn--ghost" href="tel:+998902732301">
                  {t.topBar.phone}
                </a>
              </div>
            </motion.div>

            <motion.figure
              className="dp-portrait"
              initial={reduce ? false : { opacity: 0, transform: 'translateY(18px)' }}
              animate={{ opacity: 1, transform: 'translateY(0)' }}
              transition={{ duration: 0.62, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {turnMedia ? (
                <video
                  ref={portraitVideoRef}
                  autoPlay={!reduce}
                  muted
                  playsInline
                  preload="auto"
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
              ) : (
                <img src={portrait} alt={view.name} width="650" height="760" />
              )}
              <figcaption className="dp-portrait__chip">
                <span className="dp-portrait__check" aria-hidden>✓</span>
                <span>
                  <strong>
                    {dossier.patientCount} {dossier.ui.patientCount}
                  </strong>
                  <small>{dossier.ui.patientPeriod}</small>
                </span>
              </figcaption>
            </motion.figure>
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
        <div className="dp-booking">
          <div>
            <header className="dp-booking__head">
              <div>
                <p className="dp-chan">{ui.schedule}</p>
                <h2>{ui.chooseTime}</h2>
              </div>
              <p>{ui.realtime}</p>
            </header>

            <div className="dp-days" role="group" aria-label={ui.date}>
              {days.map((day, index) => (
                <button
                  key={day.iso}
                  type="button"
                  className="dp-day"
                  aria-pressed={selectedDay === index}
                  onClick={() => {
                    setSelectedDay(index)
                    setSelectedTime('')
                  }}
                >
                  <span>{index === 0 ? ui.today : day.weekday}</span>
                  <b>{day.day}</b>
                  <em>{day.count} {ui.time.toLocaleLowerCase()}</em>
                </button>
              ))}
            </div>

            <div className="dp-slots" role="group" aria-label={ui.time}>
              {slotRows.map((slot) => (
                <button
                  key={slot.label}
                  type="button"
                  className="dp-slot"
                  disabled={slot.disabled}
                  aria-pressed={selectedTime === slot.label}
                  onClick={() => setSelectedTime(slot.label)}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          <aside className="dp-booking__aside">
            <div className="dp-summary">
              <dl>
                <div><dt>{ui.doctor}</dt><dd>{view.name}</dd></div>
                <div><dt>{ui.direction}</dt><dd>{view.specialty}</dd></div>
                <div><dt>{ui.date}</dt><dd>{selectedDate?.full}</dd></div>
                <div>
                  <dt>{ui.time}</dt>
                  <dd className={selectedTime ? '' : 'is-empty'}>{selectedTime || ui.notSelected}</dd>
                </div>
                <div><dt>{ui.price}</dt><dd>{dossier.ui.visit.firstVisitValue}</dd></div>
              </dl>
            </div>
            <button
              type="button"
              className="dp-btn dp-btn--solid"
              disabled={!selectedTime}
              onClick={() => setBookOpen(true)}
            >
              {ui.confirm} <span className="dp-btn__arrow" aria-hidden>→</span>
            </button>
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
            {contentLang === 'uz'
              ? 'Har bir bemor uchun tekshiruv natijalari bitta kuzatuv kartasiga yig‘iladi — shu karta keyingi qabul va davolash rejasining asosi bo‘lib qoladi.'
              : contentLang === 'ru'
                ? 'Результаты обследований собираются в единую карту наблюдения — она становится основой следующих приёмов и плана лечения.'
                : 'Every result is collected in one follow-up record, which becomes the basis for future visits and the care plan.'}
          </p>
          <blockquote className="dp-quote">“{dossier.ui.quote}”</blockquote>
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
              {contentLang === 'uz'
                ? `${dossier.experienceYears} yillik amaliyot, bitta chiziqda`
                : contentLang === 'ru'
                  ? `${dossier.experienceYears} лет практики на одной линии`
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

      <section className="dp-shell dp-reviews">
        <header className="dp-section-head">
          <p className="dp-chan">{ui.reviews}</p>
          <h2>{ui.reviewsTitle}</h2>
        </header>
        <DoctorReviews
          doctorId={profile.slug}
          doctorName={view.name}
          accent={profile.color}
          labels={reviewLabels}
          inline
          variant="profile"
          demoReviews={demoReviews}
        />
      </section>

      <section className="dp-shell dp-related">
        <header className="dp-section-head">
          <p className="dp-chan">{view.specialty}</p>
          <h2>{ui.related}</h2>
          <span>{ui.relatedDescription}</span>
        </header>
        <div className="dp-shelf">
          {relatedSafe.map((doctor) => {
            const content = doctor.content[contentLang]
            return (
              <a key={doctor.slug} href={`/doctors/${doctor.slug}`} className="dp-mini">
                <img src={getDoctorPortrait(doctor.slug, doctor.photo)} alt={content.name} loading="lazy" />
                <span className="dp-mini__body">
                  <strong>{content.name}</strong>
                  <span>{content.role} · {content.exp}</span>
                  <em>{ui.available.replace('Qabul ochiq — eng yaqin vaqt ', '')}</em>
                </span>
              </a>
            )
          })}
        </div>
      </section>

      <section className="dp-close">
        <div className="dp-shell dp-close__in">
          <div>
            <h2>{ui.coordinatorTitle}</h2>
            <p>{ui.coordinatorText}</p>
          </div>
          <div className="dp-close__actions">
            <a className="dp-btn dp-btn--primary" href="tel:+998902732301">{t.topBar.phone}</a>
            <button type="button" className="dp-btn dp-btn--ghost" onClick={() => setBookOpen(true)}>
              {ui.callback}
            </button>
          </div>
        </div>
      </section>

      <footer className="dp-shell dp-foot">{ui.footnote}</footer>

      <DoctorBookingModal
        open={bookOpen}
        doctorName={view.name}
        doctorSpecialty={view.specialty}
        accent={profile.color}
        initialDate={selectedDate?.iso}
        initialTime={modalTimeBySlot[selectedTime]}
        labels={labels.booking}
        onClose={() => setBookOpen(false)}
      />
    </main>
  )
}
