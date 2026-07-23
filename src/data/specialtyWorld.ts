import type { ContentLang } from '../i18n/types'
import { media } from './media'
import { doctorProfiles, type DoctorProfile } from './doctors'

export type SpecialtyWorldTheme = {
  accent: string
  accentSoft: string
  glow: string
  /** Matches `doctorProfiles[].content.uz.specialty` */
  doctorSpecialtyUz: string
  organ: string
  /** Extra class for CSS mood (pulse heart, etc.) */
  mood: 'pulse' | 'soft' | 'cool' | 'warm'
  /** Linked AI product slug on /ai/:slug */
  aiProductSlug: string
  aiMetric: string
  aiInsight: Record<ContentLang, string>
}

/** Immersive theme per clinic specialty slug */
export const specialtyWorlds: Record<string, SpecialtyWorldTheme> = {
  cardiology: {
    accent: '#E11D48',
    accentSoft: 'rgba(225, 29, 72, 0.14)',
    glow: 'rgba(225, 29, 72, 0.35)',
    doctorSpecialtyUz: 'Kardiologiya',
    organ: media.clinic.cardiology,
    mood: 'pulse',
    aiProductSlug: 'doctor-assistant',
    aiMetric: '94%',
    aiInsight: {
      uz: 'AI ritm va xavf ballarini real vaqtda baholaydi — EKG/Holter signalida anomaliyalarni belgilaydi.',
      ru: 'ИИ оценивает ритм и риск в реальном времени — отмечает аномалии на ЭКГ/Холтере.',
      en: 'AI scores rhythm and risk in real time — flags anomalies on ECG/Holter signals.',
    },
  },
  neurology: {
    accent: '#7C3AED',
    accentSoft: 'rgba(124, 58, 237, 0.14)',
    glow: 'rgba(124, 58, 237, 0.32)',
    doctorSpecialtyUz: 'Nevrologiya',
    organ: media.clinic.neurology,
    mood: 'cool',
    aiProductSlug: 'radiology',
    aiMetric: '4s',
    aiInsight: {
      uz: 'AI MRT/KT kesimlarida erta o‘zgarishlarni ajratadi — nevrolog qaroriga tayyor xulosa beradi.',
      ru: 'ИИ выделяет ранние изменения на МРТ/КТ — готовое заключение для невролога.',
      en: 'AI highlights early MRI/CT changes — ready summary for the neurologist.',
    },
  },
  therapy: {
    accent: '#0EA5E9',
    accentSoft: 'rgba(14, 165, 233, 0.14)',
    glow: 'rgba(14, 165, 233, 0.3)',
    doctorSpecialtyUz: 'Terapiya',
    organ: media.clinic.therapy,
    mood: 'soft',
    aiProductSlug: 'doctor-assistant',
    aiMetric: '87%',
    aiInsight: {
      uz: 'AI anamnezdan protokol yasaydi va ICD kodlashni tezlashtiradi — shifokor bemorga e’tibor qaratadi.',
      ru: 'ИИ собирает протокол из анамнеза и ускоряет ICD — врач фокусируется на пациенте.',
      en: 'AI drafts protocols from history and speeds ICD coding — physician stays with the patient.',
    },
  },
  gastroenterology: {
    accent: '#D97706',
    accentSoft: 'rgba(217, 119, 6, 0.14)',
    glow: 'rgba(217, 119, 6, 0.3)',
    doctorSpecialtyUz: 'Gastroenterologiya',
    organ: media.clinic.gastroenterology,
    mood: 'warm',
    aiProductSlug: 'ultrasound',
    aiMetric: '3×',
    aiInsight: {
      uz: 'AI endoskopiya/UTT kadrlarda organ chegaralarini belgilaydi va o‘lchovlarni avtomatlashtiradi.',
      ru: 'ИИ размечает органы на эндоскопии/УЗИ и автоматизирует измерения.',
      en: 'AI outlines organs on endoscopy/ultrasound and automates measurements.',
    },
  },
  endocrinology: {
    accent: '#059669',
    accentSoft: 'rgba(5, 150, 105, 0.14)',
    glow: 'rgba(5, 150, 105, 0.3)',
    doctorSpecialtyUz: 'Endokrinologiya',
    organ: media.clinic.endocrinology,
    mood: 'soft',
    aiProductSlug: 'doctor-assistant',
    aiMetric: '2×',
    aiInsight: {
      uz: 'AI lab trendlarini kuzatadi — diabet va qalqonsimon bez dinamikasini ogohlantiradi.',
      ru: 'ИИ следит за лабораторными трендами — предупреждает по диабету и щитовидной железе.',
      en: 'AI tracks lab trends — alerts on diabetes and thyroid dynamics.',
    },
  },
  urology: {
    accent: '#0284C7',
    accentSoft: 'rgba(2, 132, 199, 0.14)',
    glow: 'rgba(2, 132, 199, 0.3)',
    doctorSpecialtyUz: 'Urologiya',
    organ: media.clinic.urology,
    mood: 'cool',
    aiProductSlug: 'radiology',
    aiMetric: '91%',
    aiInsight: {
      uz: 'AI buyrak/siydik yo‘llari tasvirida tosh va tugunlarni ajratib ko‘rsatadi.',
      ru: 'ИИ выделяет камни и узлы на снимках почек и мочевых путей.',
      en: 'AI highlights stones and nodules on kidney and urinary tract imaging.',
    },
  },
  gynecology: {
    accent: '#DB2777',
    accentSoft: 'rgba(219, 39, 119, 0.14)',
    glow: 'rgba(219, 39, 119, 0.3)',
    doctorSpecialtyUz: 'Ginekologiya',
    organ: media.clinic.gynecology,
    mood: 'warm',
    aiProductSlug: 'ultrasound',
    aiMetric: '3×',
    aiInsight: {
      uz: 'AI UTT da folikul/organ o‘lchovlarini real vaqtda yuritadi — protokol tayyor.',
      ru: 'ИИ ведёт измерения фолликулов/органов на УЗИ в реальном времени — протокол готов.',
      en: 'AI runs follicle/organ measurements on ultrasound in real time — protocol ready.',
    },
  },
  pediatrics: {
    accent: '#F59E0B',
    accentSoft: 'rgba(245, 158, 11, 0.16)',
    glow: 'rgba(245, 158, 11, 0.32)',
    doctorSpecialtyUz: 'Pediatriya',
    organ: media.clinic.pediatrics,
    mood: 'warm',
    aiProductSlug: 'doctor-assistant',
    aiMetric: '80%',
    aiInsight: {
      uz: 'AI bola yoshi va simptomlarga mos protokolni taklif qiladi — xavfsiz dozalarni eslatadi.',
      ru: 'ИИ предлагает протокол по возрасту и симптомам — напоминает безопасные дозы.',
      en: 'AI suggests age-appropriate protocols — reminds safe dosing ranges.',
    },
  },
  surgery: {
    accent: '#475569',
    accentSoft: 'rgba(71, 85, 105, 0.16)',
    glow: 'rgba(71, 85, 105, 0.28)',
    doctorSpecialtyUz: 'Jarrohlik',
    organ: media.clinic.surgery,
    mood: 'cool',
    aiProductSlug: 'radiology',
    aiMetric: '96%',
    aiInsight: {
      uz: 'AI preoperativ tasvirlarda anatomik orientirlarni belgilaydi — jarrohlik rejasini qo‘llab-quvvatlaydi.',
      ru: 'ИИ отмечает анатомические ориентиры на предоперационных снимках — помогает плану операции.',
      en: 'AI marks anatomical landmarks on pre-op imaging — supports surgical planning.',
    },
  },
  rehabilitation: {
    accent: '#14B8A6',
    accentSoft: 'rgba(20, 184, 166, 0.14)',
    glow: 'rgba(20, 184, 166, 0.3)',
    doctorSpecialtyUz: 'Reabilitatsiya',
    organ: media.clinic.rehabilitation,
    mood: 'soft',
    aiProductSlug: 'doctor-assistant',
    aiMetric: '1.5×',
    aiInsight: {
      uz: 'AI tiklanish dinamikasini kuzatadi — mashqlar rejasini individual moslashtiradi.',
      ru: 'ИИ отслеживает динамику восстановления — персонализирует план упражнений.',
      en: 'AI tracks recovery progress — personalizes the exercise plan.',
    },
  },
  diagnostics: {
    accent: '#6366F1',
    accentSoft: 'rgba(99, 102, 241, 0.14)',
    glow: 'rgba(99, 102, 241, 0.3)',
    doctorSpecialtyUz: 'Diagnostika',
    organ: media.clinic.diagnostics,
    mood: 'cool',
    aiProductSlug: 'radiology',
    aiMetric: '4s',
    aiInsight: {
      uz: 'AI DICOM oqimini tahlil qiladi — radiologga prioritetli topilmalarni chiqaradi.',
      ru: 'ИИ анализирует DICOM-поток — выводит приоритетные находки радиологу.',
      en: 'AI analyzes the DICOM stream — surfaces priority findings for radiology.',
    },
  },
  oncology: {
    accent: '#5B4CDB',
    accentSoft: 'rgba(91, 76, 219, 0.16)',
    glow: 'rgba(91, 76, 219, 0.32)',
    doctorSpecialtyUz: 'Onkologiya',
    organ: media.clinic.oncology,
    mood: 'soft',
    aiProductSlug: 'clinical-research',
    aiMetric: '12×',
    aiInsight: {
      uz: 'AI konsilium uchun topilmalarni jamlaydi — davolash yo‘lini va tadqiqot mosligini tekshiradi.',
      ru: 'ИИ собирает находки для консилиума — проверяет путь лечения и соответствие исследованиям.',
      en: 'AI assembles findings for tumor board — checks pathway fit and trial matching.',
    },
  },
}

export function getSpecialtyWorld(slug: string): SpecialtyWorldTheme {
  return (
    specialtyWorlds[slug] ?? {
      accent: '#5B4CDB',
      accentSoft: 'rgba(91, 76, 219, 0.14)',
      glow: 'rgba(91, 76, 219, 0.28)',
      doctorSpecialtyUz: '',
      organ: media.clinic.therapy,
      mood: 'soft' as const,
      aiProductSlug: 'doctor-assistant',
      aiMetric: 'AI',
      aiInsight: {
        uz: 'AI klinik yordamchi ushbu yo‘nalishda protokol va diagnostikaga yordam beradi.',
        ru: 'ИИ-помощник поддерживает протоколы и диагностику в этом направлении.',
        en: 'AI assistant supports protocols and diagnostics in this specialty.',
      },
    }
  )
}

export function getSpecialtyDoctors(slug: string): DoctorProfile[] {
  const world = getSpecialtyWorld(slug)
  if (!world.doctorSpecialtyUz) return []
  const aliases: Record<string, string[]> = {
    gynecology: ['Ginekologiya', 'Akusherlik'],
    surgery: ['Jarrohlik', 'Travmatologiya'],
  }
  const names = aliases[slug] ?? [world.doctorSpecialtyUz]
  return doctorProfiles.filter((d) => names.includes(d.content.uz.specialty))
}

export const specialtyWorldLabels: Record<
  ContentLang,
  {
    enter: string
    team: string
    teamEmpty: string
    seeDoctor: string
    book: string
    careTitle: string
    ambientHint: string
    aiLive: string
    aiTitle: string
    aiScan: string
    aiOpen: string
    aiSignal: string
    aiConfidence: string
  }
> = {
  uz: {
    enter: 'Bo‘limga kirish',
    team: 'Shu yo‘nalish shifokorlari',
    teamEmpty: 'Bu yo‘nalish uchun shifokorlar tez orada qo‘shiladi.',
    seeDoctor: 'Profil',
    book: 'Qabulga yozilish',
    careTitle: 'Bu muhitda nima kutadi',
    ambientHint: 'Siz {name} bo‘limidasiz',
    aiLive: 'AI Live',
    aiTitle: 'Klinik AI yordamchi',
    aiScan: 'Model skanerlamoqda…',
    aiOpen: 'AI mahsulotni ochish →',
    aiSignal: 'Signal',
    aiConfidence: 'Ishonch',
  },
  ru: {
    enter: 'Войти в отделение',
    team: 'Врачи этого направления',
    teamEmpty: 'Врачи этого направления появятся в ближайшее время.',
    seeDoctor: 'Профиль',
    book: 'Записаться',
    careTitle: 'Что вас ждёт в этом отделении',
    ambientHint: 'Вы в отделении: {name}',
    aiLive: 'AI Live',
    aiTitle: 'Клинический ИИ-помощник',
    aiScan: 'Модель сканирует…',
    aiOpen: 'Открыть AI-продукт →',
    aiSignal: 'Сигнал',
    aiConfidence: 'Уверенность',
  },
  en: {
    enter: 'Enter department',
    team: 'Doctors in this specialty',
    teamEmpty: 'Doctors for this specialty will be added soon.',
    seeDoctor: 'Profile',
    book: 'Book visit',
    careTitle: 'What awaits you here',
    ambientHint: 'You are in {name}',
    aiLive: 'AI Live',
    aiTitle: 'Clinical AI assist',
    aiScan: 'Model scanning…',
    aiOpen: 'Open AI product →',
    aiSignal: 'Signal',
    aiConfidence: 'Confidence',
  },
}
