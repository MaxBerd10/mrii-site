import type { Lang } from '../i18n/types'
import {
  CLINIC_PHONE_DISPLAY,
  CLINIC_TELEGRAM_HANDLE,
  CLINIC_TELEGRAM_URL,
  CLINIC_WEBSITE,
} from './clinicContact'

export type ContactCopy = {
  eyebrow: string
  title: string
  desc: string
  phoneLabel: string
  phoneHint: string
  telegramChannelLabel: string
  telegramLabel: string
  websiteChannelLabel: string
  websiteLabel: string
  addressLabel: string
  addressValue: string
  emailLabel: string
  hoursLabel: string
  hoursValue: string
  mapLabel: string
  mapCta: string
  sponsorEyebrow: string
  sponsorTitle: string
  sponsorDesc: string
  sponsorEmailLabel: string
  sponsorEmailHint: string
  sponsorPhoneLabel: string
}

export const SPONSOR_EMAIL_SUBJECT = 'Homiy va CRO hamkorlik'

export const CONTACT_PHONE_DISPLAY = CLINIC_PHONE_DISPLAY
export const CONTACT_TELEGRAM_URL = CLINIC_TELEGRAM_URL
export const CONTACT_WEBSITE = CLINIC_WEBSITE

export const CONTACT_EMAIL = 'info@fjsti.uz'
/** Fargʻona shahri, Yangi Turon koʻchasi, 2-a uy. */
export const CONTACT_ADDRESS_QUERY = 'Farg\'ona Yangi Turon 2a'

export const CONTACT_COPY: Record<Lang, ContactCopy> = {
  uz: {
    eyebrow: 'Aloqa',
    title: 'Qabulga yozilish uchun qo‘ng‘iroq qiling',
    desc:
      'Bemor xizmatimiz siz bilan bog‘lanadi, mos shifokorni tanlaydi va qabul vaqtini tayinlaydi.',
    phoneLabel: 'Qabulga yozilish',
    phoneHint: 'Dushanba–Shanba, 09:00–18:00',
    telegramChannelLabel: 'Telegram',
    telegramLabel: CLINIC_TELEGRAM_HANDLE,
    websiteChannelLabel: 'Sayt',
    websiteLabel: 'fjsti.uz',
    addressLabel: 'Manzil',
    addressValue: 'Farg‘ona sh., Yangi Turon ko‘chasi, 2-a uy',
    emailLabel: 'Elektron pochta',
    hoursLabel: 'Ish vaqti',
    hoursValue: 'Dushanba–Shanba · 09:00–18:00',
    mapLabel: 'Bizni xaritada toping',
    mapCta: 'Xaritada ochish',
    sponsorEyebrow: 'Homiylar va CRO',
    sponsorTitle: 'Tadqiqotlarda hamkorlik',
    sponsorDesc:
      'Homiy, CRO va akademik institutlar bilan hamkorlik uchun email yuboring yoki qo‘ng‘iroq qiling. Protokol va hujjatlarni biriktirishingiz mumkin.',
    sponsorEmailLabel: 'Tadqiqot bo‘limi',
    sponsorEmailHint: 'Protokol va hujjatlarni biriktiring',
    sponsorPhoneLabel: 'Yoki qo‘ng‘iroq qiling',
  },
  ru: {
    eyebrow: 'Контакты',
    title: 'Позвоните, чтобы записаться на приём',
    desc:
      'Наш пациентский сервис свяжется с вами, подберёт врача и назначит удобное время визита.',
    phoneLabel: 'Запись на приём',
    phoneHint: 'Пн–Сб, 09:00–18:00',
    telegramChannelLabel: 'Telegram',
    telegramLabel: CLINIC_TELEGRAM_HANDLE,
    websiteChannelLabel: 'Сайт',
    websiteLabel: 'fjsti.uz',
    addressLabel: 'Адрес',
    addressValue: 'г. Фергана, ул. Янги Турон, 2-а',
    emailLabel: 'Электронная почта',
    hoursLabel: 'Часы работы',
    hoursValue: 'Пн–Сб · 09:00–18:00',
    mapLabel: 'Найдите нас на карте',
    mapCta: 'Открыть в картах',
    sponsorEyebrow: 'Спонсоры и CRO',
    sponsorTitle: 'Партнёрство в исследованиях',
    sponsorDesc:
      'Для партнёрства со спонсорами, CRO и институтами — напишите на почту или позвоните.',
    sponsorEmailLabel: 'Отдел исследований',
    sponsorEmailHint: 'Прикрепите протокол и документы',
    sponsorPhoneLabel: 'Или позвоните',
  },
  en: {
    eyebrow: 'Contact',
    title: 'Call us to book an appointment',
    desc:
      'Our patient service will call you back, match a doctor for your case and set a convenient visit time.',
    phoneLabel: 'Book an appointment',
    phoneHint: 'Mon–Sat, 09:00–18:00',
    telegramChannelLabel: 'Telegram',
    telegramLabel: CLINIC_TELEGRAM_HANDLE,
    websiteChannelLabel: 'Website',
    websiteLabel: 'fjsti.uz',
    addressLabel: 'Address',
    addressValue: 'Fergana, Yangi Turon street, 2A',
    emailLabel: 'Email',
    hoursLabel: 'Hours',
    hoursValue: 'Mon–Sat · 09:00–18:00',
    mapLabel: 'Find us on the map',
    mapCta: 'Open in maps',
    sponsorEyebrow: 'Sponsors & CROs',
    sponsorTitle: 'Research partnership',
    sponsorDesc:
      'For sponsor, CRO and institute partnerships — email us or give us a call.',
    sponsorEmailLabel: 'Research office',
    sponsorEmailHint: 'Attach your protocol and documents',
    sponsorPhoneLabel: 'Or give us a call',
  },
  kaa: {
    eyebrow: 'Baylanıs',
    title: 'Qabılg‘a jazılıw ushın qońıraw etiń',
    desc:
      'Bemar xızmetimiz siz benen baylanısıp, sáykes shıpaker tabıp, qabıllaw waqtın belgileydi.',
    phoneLabel: 'Qabılg‘a jazılıw',
    phoneHint: 'Dúyshembi–Shembi, 09:00–18:00',
    telegramChannelLabel: 'Telegram',
    telegramLabel: CLINIC_TELEGRAM_HANDLE,
    websiteChannelLabel: 'Sayt',
    websiteLabel: 'fjsti.uz',
    addressLabel: 'Manzil',
    addressValue: 'Farg‘ana q., Yangi Turon kóshesi, 2-a úy',
    emailLabel: 'Elektron pochta',
    hoursLabel: 'Islew waqtı',
    hoursValue: 'Dúyshembi–Shembi · 09:00–18:00',
    mapLabel: 'Bizdi xaritada tabıń',
    mapCta: 'Xaritada ashıw',
    sponsorEyebrow: 'Homıylar hám CRO',
    sponsorTitle: 'Izertlewlerde sheriklik',
    sponsorDesc:
      'Homıy, CRO hám institutlar menen sheriklik ushın email jiberiń yamasa qońıraw etiń.',
    sponsorEmailLabel: 'Izertlew bólimi',
    sponsorEmailHint: 'Protokol hám hújjetlerdi qosıń',
    sponsorPhoneLabel: 'Yamasa qońıraw etiń',
  },
}
