import type { Lang } from '../i18n/types'

export type ProfileUi = {
  profile: string
  available: string
  hoursShort: string
  book: string
  booking: string
  schedule: string
  phoneBookingTitle: string
  phoneBookingLead: string
  phoneSteps: string[]
  doctor: string
  direction: string
  hours: string
  price: string
  callToBook: string
  contactsCta: string
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

export const PROFILE_UI: Record<Lang, ProfileUi> = {
  uz: {
    profile: 'Shifokor profili',
    available: 'Qabul olayapti · Dushanba–Shanba, 09:00–18:00',
    hoursShort: '09:00–18:00 · Du–Sha',
    book: 'Qabulga yozilish',
    booking: 'Yozilish',
    schedule: 'Telefon orqali yozilish',
    phoneBookingTitle: 'Bitta qo’ng’iroq — vaqt tasdiqlanadi',
    phoneBookingLead:
      'Onlayn jadval yo’q. Registratura telefon orqali ishlaydi: shifokor, kun va vaqtni birga kelishamiz.',
    phoneSteps: [
      'Belgilangan raqamga qo’ng’iroq qiling yoki qayta qo’ng’iroq so’rang.',
      'Mutaxassislik va shikoyatingizni ayting — mos shifokor tanlanadi.',
      'Qulay kun va vaqt tasdiqlanadi, qabulga kelishingiz mumkin.',
    ],
    doctor: 'Shifokor',
    direction: 'Yo’nalish',
    hours: 'Ish vaqti',
    price: 'Birinchi qabul narxi',
    callToBook: 'Qo’ng’iroq qilish',
    contactsCta: 'Aloqa va manzil',
    bookingNote: 'Ish vaqti: Dushanba–Shanba, 09:00–18:00.',
    about: 'Mutaxassis haqida',
    aboutTitle: 'Sog’liqni erta asrash — kech davolashdan samaraliroq.',
    focus: 'Yordam yo’nalishlari',
    visitCard: 'Qabul kartasi',
    career: 'Kasbiy yo’l',
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
    related: 'Shu yo’nalishdagi boshqa shifokorlar',
    relatedDescription: 'Vaqt to’g’ri kelmasa — hamkasblari ham shu klinik kuzatuv kartasini ko’radi.',
    coordinatorTitle: 'Qaysi shifokorga yozilishni bilmayapsizmi?',
    coordinatorText: 'Klinika koordinatori shikoyatingizni tinglab, to’g’ri mutaxassisga yo’naltiradi.',
    callback: 'Qayta qo’ng’iroq so’rash',
    footnote: 'Shifokor profilidagi kasbiy ma’lumotlar CMS orqali yangilanadi.',
  },
  ru: {
    profile: 'Профиль врача',
    available: 'Приём открыт · Пн–Сб, 09:00–18:00',
    hoursShort: '09:00–18:00 · Пн–Сб',
    book: 'Записаться на приём',
    booking: 'Записаться',
    schedule: 'Запись по телефону',
    phoneBookingTitle: 'Один звонок — время подтверждается',
    phoneBookingLead:
      'Онлайн-расписания нет. Регистратура работает по телефону: врач, день и время согласуются с вами.',
    phoneSteps: [
      'Позвоните на указанный номер или закажите обратный звонок.',
      'Опишите жалобы — вас направят к нужному специалисту.',
      'Подберут удобные день и время приёма.',
    ],
    doctor: 'Врач',
    direction: 'Направление',
    hours: 'Часы приёма',
    price: 'Стоимость первого приёма',
    callToBook: 'Позвонить',
    contactsCta: 'Контакты и адрес',
    bookingNote: 'Приём: Пн–Сб, 09:00–18:00.',
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
    available: 'Accepting patients · Mon–Sat, 09:00–18:00',
    hoursShort: '09:00–18:00 · Mon–Sat',
    book: 'Book appointment',
    booking: 'Book',
    schedule: 'Phone booking',
    phoneBookingTitle: 'One call — we confirm the time',
    phoneBookingLead:
      'There is no online schedule. Registration works by phone: we agree on the doctor, day, and time with you.',
    phoneSteps: [
      'Call the clinic number or request a callback.',
      'Describe your symptoms — we match you with the right specialist.',
      'We confirm a convenient day and time for your visit.',
    ],
    doctor: 'Doctor',
    direction: 'Specialty',
    hours: 'Clinic hours',
    price: 'First visit fee',
    callToBook: 'Call to book',
    contactsCta: 'Contact and address',
    bookingNote: 'Hours: Mon–Sat, 09:00–18:00.',
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
  kaa: {
    profile: 'Shıpaker profili',
    available: 'Qabıllaw ashıq · Dúysenbi–Shánbi, 09:00–18:00',
    hoursShort: '09:00–18:00 · Dú–Shá',
    book: 'Qabılǵa jazılıw',
    booking: 'Jazılıw',
    schedule: 'Telefon arqalı jazılıw',
    phoneBookingTitle: 'Bir qońıraq — waqıt tastıyıqlanadı',
    phoneBookingLead:
      'Onlayn keste joq. Registratura telefon arqalı isleydi: shıpaker, kún hám waqıttı birge kelisemiz.',
    phoneSteps: [
      'Belgilengen nomerge qońıraq etiń yamasa qayta qońıraq sorań.',
      'Mamanlıq hám shikayatıńızdı aytıń — mos shıpaker tańlanadı.',
      'Qolay kún hám waqıt tastıyıqlanadı, qabılǵa kele alasız.',
    ],
    doctor: 'Shıpaker',
    direction: 'Baǵdar',
    hours: 'Jumıs waqtı',
    price: 'Birinshi qabıllaw bahası',
    callToBook: 'Qońıraq etiw',
    contactsCta: 'Baylanıs hám mánzil',
    bookingNote: 'Jumıs waqtı: Dúysenbi–Shánbi, 09:00–18:00.',
    about: 'Mutaxassis haqqında',
    aboutTitle: 'Salamatlıqqa erte itibar — keshiki emlewden nátiyjeli.',
    focus: 'Járdem baǵdarları',
    visitCard: 'Qabıllaw kartası',
    career: 'Kásiplik jol',
    careerDescription: 'Tayarlıqtan jetekshi mamanlıqqa shekem — jumıs orınları hám juwapkershilik dárejesi.',
    education: 'Bilim hám maliyke',
    educationTitle: 'Hújjetler menen tastıyıqlanǵan',
    science: 'Ilimiy iskerlik',
    scienceTitle: 'Basılımlar dinamikası',
    languages: 'Qabıllaw tilleri',
    languagesTitle: 'Awdarıwshısız sóylesiw',
    papers: 'Maqala',
    studies: 'Izertlew',
    reviews: 'Nawqaslar pikiri',
    reviewsTitle: '128 tastıyıqlanǵan pikir',
    related: 'Usı baǵdardaǵı basqa shıpakerler',
    relatedDescription: 'Waqıt sáykes kelmese — kásiplesleri de usı klinikalıq baqlaw kartasın kóredi.',
    coordinatorTitle: 'Qaysı shıpakerge jazılıwdı bilmeysiz be?',
    coordinatorText: 'Klinika koordinatorı shikayatıńızdı tıńlap, durıs mutaxassiske jónltedi.',
    callback: 'Qayta qońıraq soraw',
    footnote: 'Shıpaker profilindegi kásiplik maǵlıwmatlar CMS arqalı jańalanadı.',
  },
}
