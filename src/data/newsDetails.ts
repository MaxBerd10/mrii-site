import type { ContentLang } from '../i18n/types'

export type NewsArticleContent = {
  lead: string
  body: string[]
}

export type NewsArticle = {
  slug: string
  content: Record<ContentLang, NewsArticleContent>
}

export const newsArticles: NewsArticle[] = [
  {
    slug: 'car-t-therapy-study',
    content: {
      uz: {
        lead: 'Fargʻona Jamoat Salomatligi Tibbiyot Instituti I-bosqich bo‘limi CAR-T terapiyasi bo‘yicha xalqaro ko‘p markazli tadqiqotda birinchi bemorlarni qabul qilishni boshladi.',
        body: [
          'Yangi dastur onkohematologik kasalliklarni davolashda shaxsiylashtirilgan immunoterapiyani kengaytirishga qaratilgan. Tadqiqot protokoli xalqaro GCP standartlari asosida ishlab chiqilgan va multidisiplinar konsilium tomonidan tasdiqlangan.',
          'Birinchi bemorlar to‘liq diagnostika, laboratoriya monitoringi va 24/7 klinik kuzatuv ostida qabul qilinmoqda. Fargʻona Jamoat Salomatligi Tibbiyot Instituti jamoasi sponsorlar, CRO hamkorlari va klinik laboratoriyalar bilan yagona raqamli tizim orqali ishlaydi.',
          'Kelgusi oyda markaz qo‘shimcha bemorlarni jalb etishni rejalashtirmoqda. Tadqiqot natijalari kelajakda mintaqada CAR-T yo‘nalishini rivojlantirish uchun asos bo‘ladi.',
        ],
      },
      ru: {
        lead: 'Отделение I фазы Ферганский медицинский институт общественного здоровья начало набор первых пациентов в международное исследование CAR-T терапии.',
        body: [
          'Новая программа направлена на расширение персонализированной иммунотерапии при онкогематологических заболеваниях. Протокол разработан по международным стандартам GCP и утверждён мультидисциплинарным консилиумом.',
          'Первые пациенты принимаются при полном диагностическом сопровождении, лабораторном мониторинге и круглосуточном клиническом наблюдении. Команда Ферганский медицинский институт общественного здоровья работает со спонсорами и CRO в единой цифровой системе.',
          'В ближайший месяц центр планирует расширить набор. Результаты исследования станут основой для развития CAR-T направления в регионе.',
        ],
      },
      en: {
        lead: 'Ferghana Medical Institute of Public Health’s Phase I unit has started enrolling the first patients in an international multi-center CAR-T therapy study.',
        body: [
          'The new program expands personalized immunotherapy for oncohematologic diseases. The protocol follows international GCP standards and was approved by a multidisciplinary board.',
          'First patients are admitted with full diagnostics, laboratory monitoring, and 24/7 clinical observation. Fargʻona Jamoat Salomatligi Tibbiyot Instituti collaborates with sponsors and CRO partners through one digital system.',
          'The center plans to expand enrollment next month. Study outcomes will support future CAR-T development in the region.',
        ],
      },
    },
  },
  {
    slug: 'ai-radiology-certified',
    content: {
      uz: {
        lead: 'AI Radiology tizimi klinik qo‘llash uchun sertifikatlandi: ko‘krak qafasi KT avtomatik tahlili 94% aniqlik bilan tasdiqlandi.',
        body: [
          'Yechim radiologlarga shubhali topilmalarni tezroq ajratish, prioritetlash va ikkinchi fikr olishda yordam beradi. Model minglab klinik tasvirlar asosida o‘qitilgan va ichki validatsiyadan o‘tgan.',
          'Fargʻona Jamoat Salomatligi Tibbiyot Instituti diagnostika markazida tizim mavjud ish jarayoniga integratsiya qilinadi: skanerlash, tahlil, xulosa va davolovchi shifokorga uzatish yagona zanjirda qoladi.',
          'Keyingi bosqichda jamoa boshqa anatomik sohalar uchun modelni kengaytirishni rejalashtirmoqda. Maqsad — diagnostika tezligi va sifatini bir vaqtda oshirish.',
        ],
      },
      ru: {
        lead: 'Система AI Radiology сертифицирована для клинического применения: точность автоматического анализа КТ грудной клетки подтверждена на уровне 94%.',
        body: [
          'Решение помогает радиологам быстрее выявлять подозрительные находки, расставлять приоритеты и получать второе мнение. Модель обучена на тысячах клинических изображений и прошла внутреннюю валидацию.',
          'В диагностическом центре Ферганский медицинский институт общественного здоровья система встраивается в текущий процесс: сканирование, анализ, заключение и передача лечащему врачу остаются в одной цепочке.',
          'На следующем этапе команда планирует расширить модель на другие анатомические области, чтобы одновременно повысить скорость и качество диагностики.',
        ],
      },
      en: {
        lead: 'AI Radiology has been certified for clinical use, with chest CT auto-analysis validated at 94% accuracy.',
        body: [
          'The solution helps radiologists identify suspicious findings faster, prioritize cases, and support second opinions. The model was trained on thousands of clinical images and passed internal validation.',
          'At the Ferghana Medical Institute of Public Health diagnostics center, the system integrates into the existing workflow so scanning, analysis, reporting, and physician handoff stay in one chain.',
          'Next, the team plans to expand the model to additional anatomical areas to improve both diagnostic speed and quality.',
        ],
      },
    },
  },
  {
    slug: 'residency-2025-2027',
    content: {
      uz: {
        lead: 'Fargʻona Jamoat Salomatligi Tibbiyot Instituti akademiyasi 2025–2027 o‘quv davriga ordinaturaga ariza qabul qilmoqda: 8 ixtisoslikda jami 48 o‘rin ochiq.',
        body: [
          'Dastur klinik amaliyotni ilmiy yo‘nalish bilan birlashtiradi. Ordinatorlar real bemorlar bilan ishlash, konsiliumlarda qatnashish va tadqiqot loyihalariga qo‘shilish imkoniyatiga ega.',
          'O‘qitish moduli GCP treninglar, simulyatsion mashg‘ulotlar va mentorlik sessiyalarini o‘z ichiga oladi. Har bir yo‘nalish bo‘yicha individual o‘quv yo‘li tuziladi.',
          'Ariza topshirish muddati ochiq. Nomzodlar akademiya portalidan hujjatlar paketini yuborishi va suhbat bosqichiga o‘tishi mumkin.',
        ],
      },
      ru: {
        lead: 'Академия Ферганский медицинский институт общественного здоровья открыла набор в ординатуру на 2025–2027 учебный период: 48 мест по 8 специальностям.',
        body: [
          'Программа объединяет клиническую практику и научный трек. Ординаторы работают с реальными пациентами, участвуют в консилиумах и подключаются к исследовательским проектам.',
          'Обучение включает GCP-тренинги, симуляционные занятия и менторские сессии. Для каждого направления формируется индивидуальный учебный маршрут.',
          'Приём заявок открыт. Кандидаты могут подать пакет документов через портал академии и пройти этап собеседования.',
        ],
      },
      en: {
        lead: 'Fargʻona Jamoat Salomatligi Tibbiyot Instituti Academy is accepting residency applications for 2025–2027: 48 seats across 8 specialties.',
        body: [
          'The program combines clinical practice with a research track. Residents work with real patients, join consiliums, and contribute to research projects.',
          'Training includes GCP modules, simulation sessions, and mentorship. Each specialty follows an individualized learning pathway.',
          'Applications are open. Candidates can submit documents through the academy portal and proceed to interviews.',
        ],
      },
    },
  },
]

export const newsPageLabels: Record<ContentLang, {
  back: string
  related: string
  readMore: string
}> = {
  uz: {
    back: 'Barcha yangiliklar',
    related: 'Boshqa yangiliklar',
    readMore: 'O‘qish',
  },
  ru: {
    back: 'Все новости',
    related: 'Другие новости',
    readMore: 'Читать',
  },
  en: {
    back: 'All news',
    related: 'More news',
    readMore: 'Read',
  },
}

export function getNewsBySlug(slug: string) {
  const index = newsArticles.findIndex((item) => item.slug === slug)
  return index === -1 ? null : { article: newsArticles[index], index }
}
