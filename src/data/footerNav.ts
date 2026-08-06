import type { Lang } from '../i18n/types'
import { CLINIC_PHONE_DISPLAY, CLINIC_PHONE_TEL } from './clinicContact'

type Localized = Record<Lang, string>

export type FooterNavLink = {
  href: string
  label: Localized
}

export type FooterNavCol = {
  title: Localized
  links: FooterNavLink[]
}

/** Footer columns with real routes — not generic section roots. */
export const FOOTER_NAV: FooterNavCol[] = [
  {
    title: {
      uz: 'Klinika',
      ru: 'Клиника',
      en: 'Clinic',
      kaa: 'Klinika',
    },
    links: [
      {
        href: '/clinic/cardiology',
        label: {
          uz: 'Kardiologiya',
          ru: 'Кардиология',
          en: 'Cardiology',
          kaa: 'Kardiologiya',
        },
      },
      {
        href: '/clinic/neurology',
        label: {
          uz: 'Nevrologiya',
          ru: 'Неврология',
          en: 'Neurology',
          kaa: 'Nevrologiya',
        },
      },
      {
        href: '/clinic/gynecology',
        label: {
          uz: 'Ginekologiya',
          ru: 'Гинекология',
          en: 'Gynecology',
          kaa: 'Ginekologiya',
        },
      },
      {
        href: '/clinic/surgery',
        label: {
          uz: 'Jarrohlik',
          ru: 'Хирургия',
          en: 'Surgery',
          kaa: 'Jarrohlik',
        },
      },
      {
        href: '/clinic/ent',
        label: {
          uz: 'Otorinolaringologiya',
          ru: 'Оториноларингология',
          en: 'ENT',
          kaa: 'Otorinolaringologiya',
        },
      },
      {
        href: '/clinic',
        label: {
          uz: 'Barcha yo’nalishlar',
          ru: 'Все направления',
          en: 'All departments',
          kaa: 'Barlıq baǵdarlar',
        },
      },
      {
        href: `tel:${CLINIC_PHONE_TEL}`,
        label: {
          uz: `Qabul: ${CLINIC_PHONE_DISPLAY}`,
          ru: `Запись: ${CLINIC_PHONE_DISPLAY}`,
          en: `Booking: ${CLINIC_PHONE_DISPLAY}`,
          kaa: `Qabıl: ${CLINIC_PHONE_DISPLAY}`,
        },
      },
    ],
  },
  {
    title: {
      uz: 'Tadqiqotlar',
      ru: 'Исследования',
      en: 'Research',
      kaa: 'Izertlewler',
    },
    links: [
      {
        href: '/research#sponsors',
        label: {
          uz: 'Homiylar uchun',
          ru: 'Для спонсоров',
          en: 'For sponsors',
          kaa: 'Homiyler ushın',
        },
      },
      {
        href: '/research#patients',
        label: {
          uz: 'Bemorlar uchun',
          ru: 'Для пациентов',
          en: 'For patients',
          kaa: 'Bemorlar ushın',
        },
      },
      {
        href: '/research#cro',
        label: {
          uz: 'CRO uchun',
          ru: 'Для CRO',
          en: 'For CRO',
          kaa: 'CRO ushın',
        },
      },
      {
        href: '/research',
        label: {
          uz: 'Joriy klinik tadqiqotlar',
          ru: 'Текущие исследования',
          en: 'Current trials',
          kaa: 'Joriy klinikalıq izertlewler',
        },
      },
    ],
  },
  {
    title: {
      uz: 'Klinik baza',
      ru: 'Клиническая база',
      en: 'Clinical base',
      kaa: 'Klinikalıq baza',
    },
    links: [
      {
        href: '/education',
        label: {
          uz: 'Ordinatura rotatsiyasi',
          ru: 'Ротация ординаторов',
          en: 'Residency rotations',
          kaa: 'Ordinatura rotatsiyası',
        },
      },
      {
        href: '/education',
        label: {
          uz: 'Amaliyot bazasi',
          ru: 'База практики',
          en: 'Practice placements',
          kaa: 'Amaliyot bazası',
        },
      },
      {
        href: '/education',
        label: {
          uz: 'CME kurslari',
          ru: 'CME / НМО',
          en: 'CME courses',
          kaa: 'CME kursları',
        },
      },
      {
        href: '/education',
        label: {
          uz: 'GCP trening',
          ru: 'GCP-тренинг',
          en: 'GCP training',
          kaa: 'GCP trening',
        },
      },
      {
        href: '/news',
        label: {
          uz: 'Yangiliklar va e’lonlar',
          ru: 'Новости и объявления',
          en: 'News and updates',
          kaa: 'Jańalıqlar',
        },
      },
      {
        href: '/vakansiyalar',
        label: {
          uz: 'Vakansiyalar',
          ru: 'Вакансии',
          en: 'Vacancies',
          kaa: 'Vakansiyalar',
        },
      },
    ],
  },
  {
    title: {
      uz: 'AiShifokor',
      ru: 'AiShifokor',
      en: 'AiShifokor',
      kaa: 'AiShifokor',
    },
    links: [
      {
        href: 'https://aishifokor.uz/',
        label: {
          uz: 'Platformaga kirish',
          ru: 'Войти в платформу',
          en: 'Open platform',
          kaa: 'Platformaga kiriw',
        },
      },
      {
        href: '/ai',
        label: {
          uz: 'AI bo’limi',
          ru: 'AI-раздел',
          en: 'AI section',
          kaa: 'AI bólimi',
        },
      },
      {
        href: '/contacts',
        label: {
          uz: 'Demo buyurtma',
          ru: 'Заказать демо',
          en: 'Request demo',
          kaa: 'Demo buyırtpa',
        },
      },
    ],
  },
  {
    title: {
      uz: 'Institut',
      ru: 'Институт',
      en: 'Institute',
      kaa: 'Institut',
    },
    links: [
      {
        href: '/doctors',
        label: {
          uz: 'Shifokorlar',
          ru: 'Врачи',
          en: 'Doctors',
          kaa: 'Shıpakerler',
        },
      },
      {
        href: '/prices',
        label: {
          uz: 'Narxlar',
          ru: 'Цены',
          en: 'Prices',
          kaa: 'Bahalar',
        },
      },
      {
        href: '/clinic/gallery',
        label: {
          uz: 'Klinika galereyasi',
          ru: 'Галерея клиники',
          en: 'Clinic gallery',
          kaa: 'Klinika galereyası',
        },
      },
      {
        href: '/contacts',
        label: {
          uz: 'Aloqa',
          ru: 'Контакты',
          en: 'Contact',
          kaa: 'Baylanıs',
        },
      },
      {
        href: '/vakansiyalar',
        label: {
          uz: 'Vakansiyalar',
          ru: 'Вакансии',
          en: 'Vacancies',
          kaa: 'Vakansiyalar',
        },
      },
    ],
  },
]

export function getFooterNav(lang: Lang) {
  return FOOTER_NAV.map((col) => ({
    title: col.title[lang] ?? col.title.uz,
    links: col.links.map((link) => ({
      href: link.href,
      label: link.label[lang] ?? link.label.uz,
    })),
  }))
}
