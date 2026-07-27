import type { ContentLang } from '../i18n/types'

export type DaMode = 'patient' | 'physician'

export type PatientComplaint = {
  id: string
  label: Record<ContentLang, string>
  keywords: string[]
  followUps: { id: string; label: Record<ContentLang, string> }[]
  specialtySlug: string
  specialtyName: Record<ContentLang, string>
  advice: Record<ContentLang, string>
  urgency: Record<ContentLang, string>
}

export type PhysicianScenario = {
  id: string
  title: Record<ContentLang, string>
  complaint: Record<ContentLang, string>
  subjective: Record<ContentLang, string>
  objective: Record<ContentLang, string>
  plan: Record<ContentLang, string>
  icd: { code: string; label: Record<ContentLang, string> }[]
}

export const daCopy: Record<
  ContentLang,
  {
    eyebrow: string
    title: string
    lead: string
    freeBadge: string
    disclaimer: string
    modePatient: string
    modePhysician: string
    backAi: string
    intakeLead: string
    intakeAiIdle: string
    intakeAiListening: string
    intakeAiWorking: string
    intakeAiReady: string
    intakeAiLabel: string
    intakeAiSteps: string
    intakeAiIcd: string
    intakeAiSent: string
    intakeName: string
    intakeNamePh: string
    intakePhone: string
    intakePhonePh: string
    intakeEmail: string
    intakeEmailPh: string
    intakeHistory: string
    intakeHistoryPh: string
    intakeAllergies: string
    intakeAllergiesPh: string
    intakeComplaints: string
    intakeComplaintsPh: string
    intakeSubmit: string
    intakeSubmitting: string
    intakeError: string
    intakeSuccessEyebrow: string
    intakeSuccessTitle: string
    intakeSuccessDesc: string
    intakeRequestLabel: string
    intakeAnother: string
    lookupTitle: string
    lookupDesc: string
    lookupPh: string
    lookupSubmit: string
    lookupBusy: string
    lookupPending: string
    lookupAdviceLabel: string
    lookupNotFound: string
    lookupEmpty: string
    lookupError: string
    physicianPick: string
    physicianOr: string
    physicianCustomPh: string
    physicianAnalyze: string
    physicianAnalyzing: string
    physicianSubjective: string
    physicianObjective: string
    physicianPlan: string
    physicianIcd: string
    physicianCopy: string
    physicianCopied: string
    physicianReset: string
    leadTitle: string
    leadDesc: string
    leadBadge: string
    leadName: string
    leadPhone: string
    leadEmail: string
    leadClinic: string
    leadMessage: string
    leadSubmit: string
    leadSubmitting: string
    leadError: string
    leadSuccessTitle: string
    leadSuccessDesc: string
    leadClose: string
    related: string
  }
> = {
  uz: {
    eyebrow: 'AI Doctor Assistant',
    title: 'AI Doctor Assistant',
    lead: 'Shikoyatingizni yozing — AI darhol dastlabki tahlil beradi, so‘ng shifokor tasdiqlaydi.',
    freeBadge: 'AI tahlil · Shifokor nazorati',
    disclaimer: 'AI dastlabki maslahat beradi. Yakuniy tashxis faqat shifokor qabulida.',
    modePatient: 'Bemor',
    modePhysician: 'Shifokor',
    backAi: 'AI yechimlar',
    intakeLead: 'Anketani to‘ldiring — AI Doctor Assistant darhol dastlabki tahlil chiqaradi, so‘ng shifokor tasdiqlaydi.',
    intakeAiIdle: 'AI tayyor. Shikoyatni yozing va «AI tahlil» ni bosing.',
    intakeAiListening: 'Ma’lumot qabul qilinmoqda…',
    intakeAiWorking: 'AI tahlil qilmoqda: anamnez, risklar, yo‘nalish…',
    intakeAiReady: 'Dastlabki AI tahlil tayyor',
    intakeAiLabel: 'AI Doctor Assistant',
    intakeAiSteps: 'Keyingi qadamlar',
    intakeAiIcd: 'ICD takliflari',
    intakeAiSent: 'Shifokorga yuborildi — tasdiqlangan javobni raqam bilan tekshirasiz.',
    intakeName: 'Ism familiya',
    intakeNamePh: 'Masalan: Aliyev Anvar',
    intakePhone: 'Telefon',
    intakePhonePh: '+998 …',
    intakeEmail: 'Email (ixtiyoriy)',
    intakeEmailPh: 'email@example.com',
    intakeHistory: 'Kasallik tarixi',
    intakeHistoryPh: 'Surunkali kasalliklar, operatsiyalar, doimiy dorilar…',
    intakeAllergies: 'Allergiya',
    intakeAllergiesPh: 'Dori yoki ovqat allergiyasi yo‘q bo‘lsa — «Yo‘q»',
    intakeComplaints: 'Shikoyatlar',
    intakeComplaintsPh: 'Nima bezovta qilayotganini, qachondan, qanday kechayotganini yozing…',
    intakeSubmit: 'AI tahlil + shifokorga yuborish',
    intakeSubmitting: 'AI ishlamoqda…',
    intakeError: 'Yuborilmadi. Qayta urinib ko‘ring yoki qo‘ng‘iroq qiling.',
    intakeSuccessEyebrow: 'AI + shifokor',
    intakeSuccessTitle: 'AI tahlil chiqdi, so‘rov shifokorga ketdi',
    intakeSuccessDesc:
      'Pastda AI dastlabki maslahati. Shifokor tasdiqlagach, murojaat raqami bilan yakuniy javobni olasiz.',
    intakeRequestLabel: 'Murojaat raqami',
    intakeAnother: 'Yangi tahlil',
    lookupTitle: 'Javobni tekshirish',
    lookupDesc: 'Murojaat raqamingizni kiriting — shifokor yozgan maslahat shu yerda chiqadi.',
    lookupPh: 'MAS-2026-…',
    lookupSubmit: 'Tekshirish',
    lookupBusy: 'Qidirilmoqda…',
    lookupPending: 'Hali javob yozilmagan. Birozdan keyin qayta tekshiring yoki qo‘ng‘iroqni kuting.',
    lookupAdviceLabel: 'Shifokor maslahati',
    lookupNotFound: 'Bunday murojaat topilmadi. Raqamni tekshiring.',
    lookupEmpty: 'Hozircha CMS o‘chiq — javob tekshiruvi ishlamaydi.',
    lookupError: 'Tekshirishda xatolik. Keyinroq urinib ko‘ring.',
    physicianPick: 'Tayyor ssenariy',
    physicianOr: 'yoki shikoyatni yozing',
    physicianCustomPh: 'Bemor shikoyati, anamnez qisqacha…',
    physicianAnalyze: 'Protokol shakllantirish',
    physicianAnalyzing: 'Tahlil qilinmoqda…',
    physicianSubjective: 'Subyektiv',
    physicianObjective: 'Obyektiv / reja',
    physicianPlan: 'Tavsiya etilgan plan',
    physicianIcd: 'ICD-10 takliflari',
    physicianCopy: 'Nusxa olish',
    physicianCopied: 'Nusxa olindi',
    physicianReset: 'Yangi ssenariy',
    leadTitle: 'O‘z klinikangizga o‘rnatmoqchimisiz?',
    leadDesc: 'Yuqoridagi bemor anketasi shu klinika uchun. Boshqa klinika / MIS ulash uchun alohida so‘rov.',
    leadBadge: 'Klinikalar uchun (ixtiyoriy)',
    leadName: 'Ism',
    leadPhone: 'Telefon',
    leadEmail: 'Email',
    leadClinic: 'Klinika / tashkilot nomi',
    leadMessage: 'Nima kerak?',
    leadSubmit: 'Klinikaga so‘rov',
    leadSubmitting: 'Yuborilmoqda…',
    leadError: 'Yuborishda xatolik.',
    leadSuccessTitle: 'So‘rov qabul qilindi',
    leadSuccessDesc: 'Klinikangiz bo‘yicha bog‘lanamiz.',
    leadClose: 'Yopish',
    related: 'Boshqa AI mahsulotlar',
  },
  ru: {
    eyebrow: 'AI Doctor Assistant',
    title: 'AI Doctor Assistant',
    lead: 'Опишите жалобы — ИИ сразу даст предварительный разбор, затем врач подтвердит.',
    freeBadge: 'ИИ-анализ · Контроль врача',
    disclaimer: 'ИИ даёт предварительный совет. Окончательный диагноз только на приёме.',
    modePatient: 'Пациент',
    modePhysician: 'Врач',
    backAi: 'AI-решения',
    intakeLead: 'Заполните анкету — AI Doctor Assistant сразу даст предварительный разбор, затем врач подтвердит.',
    intakeAiIdle: 'ИИ готов. Опишите жалобы и нажмите «ИИ-анализ».',
    intakeAiListening: 'Приём данных…',
    intakeAiWorking: 'ИИ анализирует: анамнез, риски, направление…',
    intakeAiReady: 'Предварительный ИИ-разбор готов',
    intakeAiLabel: 'AI Doctor Assistant',
    intakeAiSteps: 'Следующие шаги',
    intakeAiIcd: 'Предложения ICD',
    intakeAiSent: 'Отправлено врачу — подтверждённый ответ смотрите по номеру.',
    intakeName: 'ФИО',
    intakeNamePh: 'Например: Алиев Анвар',
    intakePhone: 'Телефон',
    intakePhonePh: '+998 …',
    intakeEmail: 'Email (необязательно)',
    intakeEmailPh: 'email@example.com',
    intakeHistory: 'История болезни',
    intakeHistoryPh: 'Хронические болезни, операции, постоянные препараты…',
    intakeAllergies: 'Аллергии',
    intakeAllergiesPh: 'Если нет — напишите «Нет»',
    intakeComplaints: 'Жалобы',
    intakeComplaintsPh: 'Что беспокоит, с какого времени, как протекает…',
    intakeSubmit: 'ИИ-анализ + отправить врачу',
    intakeSubmitting: 'ИИ работает…',
    intakeError: 'Не удалось отправить. Попробуйте ещё раз или позвоните.',
    intakeSuccessEyebrow: 'ИИ + врач',
    intakeSuccessTitle: 'ИИ-разбор готов, заявка у врача',
    intakeSuccessDesc:
      'Ниже — предварительный совет ИИ. После подтверждения врача проверьте ответ по номеру обращения.',
    intakeRequestLabel: 'Номер обращения',
    intakeAnother: 'Новый анализ',
    lookupTitle: 'Проверить ответ',
    lookupDesc: 'Введите номер обращения — совет врача появится здесь.',
    lookupPh: 'MAS-2026-…',
    lookupSubmit: 'Проверить',
    lookupBusy: 'Поиск…',
    lookupPending: 'Ответа пока нет. Загляните позже или дождитесь звонка.',
    lookupAdviceLabel: 'Совет врача',
    lookupNotFound: 'Обращение не найдено. Проверьте номер.',
    lookupEmpty: 'CMS выключен — проверка ответа недоступна.',
    lookupError: 'Ошибка проверки. Попробуйте позже.',
    physicianPick: 'Готовый сценарий',
    physicianOr: 'или опишите жалобу',
    physicianCustomPh: 'Жалоба пациента, краткий анамнез…',
    physicianAnalyze: 'Сформировать протокол',
    physicianAnalyzing: 'Анализ…',
    physicianSubjective: 'Субъективно',
    physicianObjective: 'Объективно / план',
    physicianPlan: 'Рекомендуемый план',
    physicianIcd: 'Предложения ICD-10',
    physicianCopy: 'Копировать',
    physicianCopied: 'Скопировано',
    physicianReset: 'Новый сценарий',
    leadTitle: 'Хотите внедрить у себя?',
    leadDesc: 'Анкета выше — для этой клиники. Отдельная заявка — если нужна связка с вашей МИС.',
    leadBadge: 'Для клиник (опционально)',
    leadName: 'Имя',
    leadPhone: 'Телефон',
    leadEmail: 'Email',
    leadClinic: 'Клиника / организация',
    leadMessage: 'Что нужно?',
    leadSubmit: 'Заявка клиники',
    leadSubmitting: 'Отправка…',
    leadError: 'Ошибка отправки.',
    leadSuccessTitle: 'Заявка принята',
    leadSuccessDesc: 'Свяжемся по внедрению.',
    leadClose: 'Закрыть',
    related: 'Другие AI-продукты',
  },
  en: {
    eyebrow: 'AI Doctor Assistant',
    title: 'AI Doctor Assistant',
    lead: 'Describe your symptoms — AI drafts an initial analysis, then a doctor confirms.',
    freeBadge: 'AI analysis · Physician oversight',
    disclaimer: 'AI gives preliminary guidance. Final diagnosis only in a visit.',
    modePatient: 'Patient',
    modePhysician: 'Physician',
    backAi: 'AI solutions',
    intakeLead: 'Fill the intake — AI Doctor Assistant drafts an analysis immediately, then a doctor confirms.',
    intakeAiIdle: 'AI ready. Enter complaints and press “AI analysis”.',
    intakeAiListening: 'Receiving intake…',
    intakeAiWorking: 'AI analyzing history, risks, specialty…',
    intakeAiReady: 'Preliminary AI analysis ready',
    intakeAiLabel: 'AI Doctor Assistant',
    intakeAiSteps: 'Next steps',
    intakeAiIcd: 'ICD suggestions',
    intakeAiSent: 'Sent to a doctor — check the confirmed reply by request number.',
    intakeName: 'Full name',
    intakeNamePh: 'e.g. Anvar Aliyev',
    intakePhone: 'Phone',
    intakePhonePh: '+998 …',
    intakeEmail: 'Email (optional)',
    intakeEmailPh: 'email@example.com',
    intakeHistory: 'Medical history',
    intakeHistoryPh: 'Chronic conditions, surgeries, regular medicines…',
    intakeAllergies: 'Allergies',
    intakeAllergiesPh: 'If none — write “None”',
    intakeComplaints: 'Complaints',
    intakeComplaintsPh: 'What bothers you, since when, how it progresses…',
    intakeSubmit: 'AI analysis + send to doctor',
    intakeSubmitting: 'AI working…',
    intakeError: 'Could not send. Try again or call us.',
    intakeSuccessEyebrow: 'AI + doctor',
    intakeSuccessTitle: 'AI draft ready, request sent to a doctor',
    intakeSuccessDesc:
      'Below is the AI preliminary advice. After the doctor confirms, check the final reply by request number.',
    intakeRequestLabel: 'Request number',
    intakeAnother: 'New analysis',
    lookupTitle: 'Check the reply',
    lookupDesc: 'Enter your request number to see the doctor’s advice.',
    lookupPh: 'MAS-2026-…',
    lookupSubmit: 'Check',
    lookupBusy: 'Looking up…',
    lookupPending: 'No reply yet. Check again later or wait for a call.',
    lookupAdviceLabel: 'Doctor advice',
    lookupNotFound: 'Request not found. Check the number.',
    lookupEmpty: 'CMS is off — reply lookup unavailable.',
    lookupError: 'Lookup failed. Try again later.',
    physicianPick: 'Ready scenario',
    physicianOr: 'or type a complaint',
    physicianCustomPh: 'Patient complaint, brief history…',
    physicianAnalyze: 'Draft protocol',
    physicianAnalyzing: 'Analyzing…',
    physicianSubjective: 'Subjective',
    physicianObjective: 'Objective / notes',
    physicianPlan: 'Suggested plan',
    physicianIcd: 'ICD-10 suggestions',
    physicianCopy: 'Copy',
    physicianCopied: 'Copied',
    physicianReset: 'New scenario',
    leadTitle: 'Want this in your clinic?',
    leadDesc: 'The intake above is for this clinic. Separate request if you need EMR integration elsewhere.',
    leadBadge: 'For clinics (optional)',
    leadName: 'Name',
    leadPhone: 'Phone',
    leadEmail: 'Email',
    leadClinic: 'Clinic / organization',
    leadMessage: 'What do you need?',
    leadSubmit: 'Clinic request',
    leadSubmitting: 'Sending…',
    leadError: 'Could not send.',
    leadSuccessTitle: 'Request received',
    leadSuccessDesc: 'We will follow up on deployment.',
    leadClose: 'Close',
    related: 'Other AI products',
  },
}

export const patientComplaints: PatientComplaint[] = [
  {
    id: 'chest',
    label: { uz: 'Ko‘krak og‘rig‘i', ru: 'Боль в груди', en: 'Chest pain' },
    keywords: ['ko‘krak', 'kokrak', 'chest', 'груд', 'yurak', 'сердц', 'heart'],
    followUps: [
      {
        id: 'exertion',
        label: {
          uz: 'Harakatda kuchayadi',
          ru: 'Усиливается при нагрузке',
          en: 'Worse on exertion',
        },
      },
      {
        id: 'rest',
        label: { uz: 'Dam olganda ham bor', ru: 'Есть и в покое', en: 'Present at rest' },
      },
      {
        id: 'short',
        label: { uz: 'Nafas qisishi bilan', ru: 'С одышкой', en: 'With shortness of breath' },
      },
    ],
    specialtySlug: 'cardiology',
    specialtyName: { uz: 'Kardiologiya', ru: 'Кардиология', en: 'Cardiology' },
    advice: {
      uz: 'Kardiolog ko‘rigiga yoziling. Kuchli og‘riq, sovuq ter yoki hushsizlik bo‘lsa — zudlik bilan shoshilinch yordam.',
      ru: 'Запишитесь к кардиологу. При сильной боли, холодном поте или обмороке — срочная помощь.',
      en: 'Book cardiology. Severe pain, cold sweat, or fainting needs urgent care.',
    },
    urgency: {
      uz: 'Agar og‘riq kuchli yoki chap qo‘lga tarqalsa — kutmang.',
      ru: 'Если боль сильная или отдаёт в левую руку — не ждите.',
      en: 'If pain is severe or radiates to the left arm — do not wait.',
    },
  },
  {
    id: 'head',
    label: { uz: 'Bosh og‘rig‘i / aylanish', ru: 'Головная боль / головокружение', en: 'Headache / dizziness' },
    keywords: ['bosh', 'head', 'голово', 'aylan', 'migren', 'мигрен'],
    followUps: [
      {
        id: 'sudden',
        label: { uz: 'To‘satdan, kuchli', ru: 'Внезапно, сильно', en: 'Sudden and severe' },
      },
      {
        id: 'chronic',
        label: { uz: 'Bir necha kundan beri', ru: 'Несколько дней', en: 'For several days' },
      },
      {
        id: 'vision',
        label: { uz: 'Ko‘rish buzilishi bilan', ru: 'С нарушением зрения', en: 'With vision changes' },
      },
    ],
    specialtySlug: 'neurology',
    specialtyName: { uz: 'Nevrologiya', ru: 'Неврология', en: 'Neurology' },
    advice: {
      uz: 'Nevrolog konsultatsiyasi tavsiya etiladi. To‘satdan «eng kuchli» og‘riq bo‘lsa — shoshilinch yordam.',
      ru: 'Рекомендуется невролог. При внезапной «самой сильной» боли — срочная помощь.',
      en: 'See neurology. Sudden “worst ever” headache needs urgent care.',
    },
    urgency: {
      uz: 'Nutq buzilishi yoki kuchsizlik bo‘lsa — darhol yordam.',
      ru: 'При нарушении речи или слабости — немедленно.',
      en: 'Speech trouble or weakness — seek care immediately.',
    },
  },
  {
    id: 'belly',
    label: { uz: 'Qorin og‘rig‘i', ru: 'Боль в животе', en: 'Abdominal pain' },
    keywords: ['qorin', 'живот', 'belly', 'stomach', 'oshqozon', 'желуд'],
    followUps: [
      {
        id: 'upper',
        label: { uz: 'Yuqori qorin / oshqozon', ru: 'Верх живота', en: 'Upper abdomen' },
      },
      {
        id: 'right',
        label: { uz: 'O‘ng pastki qism', ru: 'Правый низ', en: 'Lower right' },
      },
      {
        id: 'diarrhea',
        label: { uz: 'Diareya / ko‘ngil aynishi', ru: 'Диарея / тошнота', en: 'Diarrhea / nausea' },
      },
    ],
    specialtySlug: 'gastroenterology',
    specialtyName: { uz: 'Gastroenterologiya', ru: 'Гастроэнтерология', en: 'Gastroenterology' },
    advice: {
      uz: 'Gastroenterolog yoki terapiya qabuli. O‘tkir kuchli og‘riqda — shoshilinch baholash.',
      ru: 'Гастроэнтеролог или терапевт. При острой сильной боли — срочная оценка.',
      en: 'Gastroenterology or therapy. Severe acute pain needs urgent assessment.',
    },
    urgency: {
      uz: 'Qon ketishi yoki yuqori isitma bo‘lsa — kutmang.',
      ru: 'При кровотечении или высокой температуре — не ждите.',
      en: 'Bleeding or high fever — do not wait.',
    },
  },
  {
    id: 'sugar',
    label: { uz: 'Qand / charchoq', ru: 'Сахар / усталость', en: 'Sugar / fatigue' },
    keywords: ['qand', 'сахар', 'diabet', 'диабет', 'charchoq', 'устало', 'fatigue', 'chanqoq'],
    followUps: [
      {
        id: 'thirst',
        label: { uz: 'Kuchli chanqoqlik', ru: 'Сильная жажда', en: 'Strong thirst' },
      },
      {
        id: 'weight',
        label: { uz: 'Vazn o‘zgarishi', ru: 'Изменение веса', en: 'Weight change' },
      },
      {
        id: 'known',
        label: { uz: 'Diabet tarixi bor', ru: 'Есть диабет в анамнезе', en: 'Known diabetes' },
      },
    ],
    specialtySlug: 'endocrinology',
    specialtyName: { uz: 'Endokrinologiya', ru: 'Эндокринология', en: 'Endocrinology' },
    advice: {
      uz: 'Endokrinolog ko‘rigi va qon tahlili (glyukoza / HbA1c) maqsadga muvofiq.',
      ru: 'Консультация эндокринолога и анализы глюкозы / HbA1c.',
      en: 'Endocrinology visit plus glucose / HbA1c labs is appropriate.',
    },
    urgency: {
      uz: 'Kuchli holsizlik yoki hushsizlik — shoshilinch yordam.',
      ru: 'Сильная слабость или обморок — срочная помощь.',
      en: 'Severe weakness or fainting — urgent care.',
    },
  },
  {
    id: 'general',
    label: { uz: 'Umumiy holsizlik', ru: 'Общее недомогание', en: 'General unwell' },
    keywords: ['holsiz', 'isitma', 'temperatura', 'простуд', 'flu', 'cold', 'umumiy', 'слабост'],
    followUps: [
      {
        id: 'fever',
        label: { uz: 'Isitma bor', ru: 'Есть температура', en: 'Fever present' },
      },
      {
        id: 'cough',
        label: { uz: 'Yo‘tal / tomoq', ru: 'Кашель / горло', en: 'Cough / sore throat' },
      },
      {
        id: 'long',
        label: { uz: '7 kundan ortiq', ru: 'Больше 7 дней', en: 'Longer than 7 days' },
      },
    ],
    specialtySlug: 'therapy',
    specialtyName: { uz: 'Terapiya', ru: 'Терапия', en: 'Internal medicine' },
    advice: {
      uz: 'Avval terapevt qabuli — keyin kerak bo‘lsa mutaxassisga yo‘naltiriladi.',
      ru: 'Сначала терапевт — при необходимости направит к узкому специалисту.',
      en: 'Start with internal medicine; they can refer if needed.',
    },
    urgency: {
      uz: 'Nafas qiyinlashishi yoki yuqori isitma — tezroq ko‘rsatiling.',
      ru: 'Затруднённое дыхание или высокая температура — обратитесь скорее.',
      en: 'Breathing trouble or high fever — seek care sooner.',
    },
  },
  {
    id: 'child',
    label: { uz: 'Bola alomatlari', ru: 'Симптомы у ребёнка', en: 'Child symptoms' },
    keywords: ['bola', 'ребён', 'child', 'pediatr', 'педиатр', 'chaqaloq'],
    followUps: [
      {
        id: 'fever-kid',
        label: { uz: 'Isitma', ru: 'Температура', en: 'Fever' },
      },
      {
        id: 'rash',
        label: { uz: 'Toshma', ru: 'Сыпь', en: 'Rash' },
      },
      {
        id: 'appetite',
        label: { uz: 'Ishtaha yo‘qolgan', ru: 'Нет аппетита', en: 'Poor appetite' },
      },
    ],
    specialtySlug: 'pediatrics',
    specialtyName: { uz: 'Pediatriya', ru: 'Педиатрия', en: 'Pediatrics' },
    advice: {
      uz: 'Pediatr ko‘rigiga yoziling. Chaqaloqlarda isitma — tezroq baholash.',
      ru: 'Запишитесь к педиатру. Температура у младенцев — ранняя оценка.',
      en: 'Book pediatrics. Fever in infants needs earlier assessment.',
    },
    urgency: {
      uz: 'Nafas qiyin, hushsizlik yoki kuchli dehidratatsiya — shoshilinch.',
      ru: 'Затруднённое дыхание, обморок или сильная дегидратация — срочно.',
      en: 'Hard breathing, unresponsiveness, or severe dehydration — urgent.',
    },
  },
]

export const physicianScenarios: PhysicianScenario[] = [
  {
    id: 'cardio',
    title: {
      uz: 'Kardiologiya qabuli',
      ru: 'Кардиологический приём',
      en: 'Cardiology visit',
    },
    complaint: {
      uz: '52 y.e., erkak. 2 haftadan beri jismoniy yuklama paytida ko‘krakda siquvchi og‘riq, chap qo‘lga tarqaladi. Nafas qisishi bor.',
      ru: '52 г., муж. 2 недели — давящая боль в груди при нагрузке, иррадиация в левую руку, одышка.',
      en: '52M. 2 weeks of exertional pressing chest pain radiating to left arm, with dyspnea.',
    },
    subjective: {
      uz: 'Shikoyat: yuklamada ko‘krak siquvi, chap qo‘lga irradiatsiya, NQ. Anamnez: AG 8 yil, chekuvchi (15 pak/yil). Allergiya yo‘q.',
      ru: 'Жалобы: давящая боль при нагрузке, иррадиация влево, одышка. Анамнез: АГ 8 лет, курение 15 пачко-лет. Аллергий нет.',
      en: 'CC: exertional pressing pain → L arm, dyspnea. Hx: HTN 8y, 15 pack-years. NKDA.',
    },
    objective: {
      uz: 'AH 148/92, Puls 88, SpO2 97%. Yurak tonlari ritmik, shovqin yo‘q. O‘pka: vezikulyar. ECG: ST depressiya yo‘q (demo).',
      ru: 'АД 148/92, пульс 88, SpO2 97%. Тоны ритмичные, шумов нет. Лёгкие: везикулярное. ЭКГ: без ST-депрессии (демо).',
      en: 'BP 148/92, HR 88, SpO2 97%. Heart regular, no murmur. Lungs clear. ECG: no ST depression (demo).',
    },
    plan: {
      uz: '1) Stress test / koronar risk baholash. 2) Lipidogramma, glyukoza. 3) ASA / statin muhokamasi. 4) Chekishni tashlash. 5) Qayta nazorat 7–10 kun.',
      ru: '1) Нагрузочный тест / оценка коронарного риска. 2) Липиды, глюкоза. 3) Обсудить АСК / статин. 4) Отказ от курения. 5) Контроль 7–10 дней.',
      en: '1) Stress test / CAD risk workup. 2) Lipids, glucose. 3) Discuss ASA/statin. 4) Smoking cessation. 5) Follow-up 7–10 days.',
    },
    icd: [
      { code: 'I20.8', label: { uz: 'Boshqa angina shakllari', ru: 'Другие формы стенокардии', en: 'Other forms of angina' } },
      { code: 'I10', label: { uz: 'Essensial gipertenziya', ru: 'Эссенциальная гипертензия', en: 'Essential hypertension' } },
      { code: 'Z72.0', label: { uz: 'Tamaki iste’moli', ru: 'Употребление табака', en: 'Tobacco use' } },
    ],
  },
  {
    id: 'therapy',
    title: {
      uz: 'Terapiya — O‘RQ',
      ru: 'Терапия — ОРВИ',
      en: 'Therapy — URI',
    },
    complaint: {
      uz: '34 y.e., ayol. 3 kundan beri tomoq og‘rig‘i, isitma 38.1, quruq yo‘tal. Hushyor, suyuqlik ichadi.',
      ru: '34 г., жен. 3 дня — боль в горле, t° 38.1, сухой кашель. В сознании, пьёт жидкость.',
      en: '34F. 3 days sore throat, fever 38.1, dry cough. Alert, taking fluids.',
    },
    subjective: {
      uz: 'Shikoyat: tomoq, isitma, quruq yo‘tal. Anamnez: surunkali kasallik yo‘q. Allergiya: penisillinga toshma (bolalikda).',
      ru: 'Жалобы: горло, лихорадка, сухой кашель. Хр. болезней нет. Аллергия: сыпь на пенициллин в детстве.',
      en: 'CC: sore throat, fever, dry cough. No chronic illness. Allergy: childhood penicillin rash.',
    },
    objective: {
      uz: 'T 38.0, AH 118/76, Puls 92, SpO2 98%. Tomoq giperemiyasi, yiring yo‘q. O‘pka: xirillash yo‘q. Quloq: normal.',
      ru: 'T 38.0, АД 118/76, пульс 92, SpO2 98%. Гиперемия зева, налёта нет. Лёгкие без хрипов. Уши: норма.',
      en: 'T 38.0, BP 118/76, HR 92, SpO2 98%. Pharynx erythematous, no exudate. Lungs clear. Ears normal.',
    },
    plan: {
      uz: '1) Simptomatik: suyuqlik, antipiretik. 2) Antibiotik hozircha yo‘q (virus ehtimoli). 3) Ogohlantirish belgilari. 4) 48–72 soatda qayta aloqa.',
      ru: '1) Симптоматически: жидкость, антипиретик. 2) Антибиотик пока не показан. 3) Красные флаги. 4) Связь через 48–72 ч.',
      en: '1) Supportive care + antipyretic. 2) No antibiotic yet. 3) Red-flag advice. 4) Recheck in 48–72h.',
    },
    icd: [
      { code: 'J06.9', label: { uz: 'O‘tkir yuqori nafas yo‘li infeksiyasi', ru: 'ОРВИ неуточнённая', en: 'Acute URI, unspecified' } },
      { code: 'R50.9', label: { uz: 'Isitma, aniqlanmagan', ru: 'Лихорадка неуточнённая', en: 'Fever, unspecified' } },
    ],
  },
  {
    id: 'endo',
    title: {
      uz: 'Endokrinologiya — qand nazorati',
      ru: 'Эндокринология — контроль глюкозы',
      en: 'Endocrinology — glucose control',
    },
    complaint: {
      uz: '47 y.e., erkak. 2-tip diabet. So‘nggi 1 oyda chanqoqlik, tungi siyish, charchoq. Uy glyukozasi 12–14 mmol/l.',
      ru: '47 г., муж. СД2. Месяц — жажда, никтурия, усталость. Домашняя глюкоза 12–14 ммоль/л.',
      en: '47M with T2DM. 1 month thirst, nocturia, fatigue. Home glucose 12–14 mmol/L.',
    },
    subjective: {
      uz: 'Shikoyat: polidipsiya, poliuriya, charchoq. Dori: metformin 1000 mg ×2. Dieta qisman. Allergiya yo‘q.',
      ru: 'Жалобы: полидипсия, полиурия, усталость. Терапия: метформин 1000×2. Диета частичная. Аллергий нет.',
      en: 'CC: polydipsia, polyuria, fatigue. Meds: metformin 1000 BID. Partial diet. NKDA.',
    },
    objective: {
      uz: 'AH 136/84, BMI 31. Oyoq sezgisi saqlangan. Demo lab: glu 13.2, HbA1c 9.1% (ssenariy).',
      ru: 'АД 136/84, ИМТ 31. Чувствительность стоп сохранена. Демо-лаб: глю 13.2, HbA1c 9.1%.',
      en: 'BP 136/84, BMI 31. Foot sensation intact. Demo labs: glu 13.2, HbA1c 9.1%.',
    },
    plan: {
      uz: '1) HbA1c / lipid / kreatinin. 2) Metformin dozasi / qo‘shimcha preparat muhokamasi. 3) Ovqatlanish va harakat. 4) Gipoglikemiya o‘qitish. 5) 2–4 haftada nazorat.',
      ru: '1) HbA1c / липиды / креатинин. 2) Обсудить дозу метформина / add-on. 3) Питание и активность. 4) Обучение гипогликемии. 5) Контроль 2–4 нед.',
      en: '1) HbA1c / lipids / creatinine. 2) Titrate metformin / discuss add-on. 3) Diet + activity. 4) Hypoglycemia education. 5) Follow-up 2–4 weeks.',
    },
    icd: [
      { code: 'E11.9', label: { uz: '2-tip diabet, asoratsiz', ru: 'СД2 без осложнений', en: 'Type 2 DM without complications' } },
      { code: 'E66.9', label: { uz: 'Semizlik', ru: 'Ожирение', en: 'Obesity' } },
    ],
  },
]

export function matchComplaint(text: string): PatientComplaint {
  const q = text.toLocaleLowerCase().trim()
  if (!q) return patientComplaints[patientComplaints.length - 2] // general
  let best = patientComplaints[4]
  let score = 0
  for (const item of patientComplaints) {
    const hits = item.keywords.filter((k) => q.includes(k.toLocaleLowerCase())).length
    if (hits > score) {
      score = hits
      best = item
    }
  }
  return best
}

export function protocolFromCustom(
  text: string,
  _lang: ContentLang,
): Pick<PhysicianScenario, 'subjective' | 'objective' | 'plan' | 'icd'> {
  const base = matchComplaint(text)
  const related =
    physicianScenarios.find((s) =>
      base.id === 'chest' ? s.id === 'cardio' : base.id === 'sugar' ? s.id === 'endo' : s.id === 'therapy',
    ) ?? physicianScenarios[1]

  const subjectiveLead = {
    uz: `Shikoyat (bemor matni): ${text.trim()}`,
    ru: `Жалоба (текст пациента): ${text.trim()}`,
    en: `Complaint (patient text): ${text.trim()}`,
  }

  return {
    subjective: {
      uz: `${subjectiveLead.uz}\n\n${related.subjective.uz}`,
      ru: `${subjectiveLead.ru}\n\n${related.subjective.ru}`,
      en: `${subjectiveLead.en}\n\n${related.subjective.en}`,
    },
    objective: related.objective,
    plan: {
      uz: `${related.plan.uz}\n\nYo‘nalish eslatmasi: ${base.specialtyName.uz}.`,
      ru: `${related.plan.ru}\n\nНаправление: ${base.specialtyName.ru}.`,
      en: `${related.plan.en}\n\nSpecialty cue: ${base.specialtyName.en}.`,
    },
    icd: related.icd,
  }
}

export type PatientAiAnalysis = {
  specialtySlug: string
  specialtyName: string
  summary: string
  nextSteps: string[]
  urgency: string
  icd: { code: string; label: string }[]
  fullText: string
}

export function buildPatientAiAnalysis(
  input: {
    complaints: string
    history: string
    allergies: string
  },
  lang: ContentLang,
): PatientAiAnalysis {
  const blob = `${input.complaints} ${input.history} ${input.allergies}`
  const matched = matchComplaint(blob || input.complaints)
  const draft = protocolFromCustom(input.complaints || blob, lang)
  const specialtyName = matched.specialtyName[lang]
  const summary = matched.advice[lang]
  const urgency = matched.urgency[lang]
  const nextSteps =
    lang === 'ru'
      ? [
          `Направление: ${specialtyName}`,
          'Сохраните номер обращения — врач подтвердит ответ',
          'При красных флагах не ждите — срочная помощь',
        ]
      : lang === 'en'
        ? [
            `Suggested specialty: ${specialtyName}`,
            'Keep your request ID — a doctor will confirm',
            'If red flags appear — seek urgent care',
          ]
        : [
            `Tavsiya etilgan yo‘nalish: ${specialtyName}`,
            'Murojaat raqamini saqlang — shifokor tasdiqlaydi',
            'Qizil bayroqlar bo‘lsa — kutmang, shoshilinch yordam',
          ]

  const icd = draft.icd.map((row) => ({ code: row.code, label: row.label[lang] }))
  const fullText = [
    lang === 'ru' ? 'AI Doctor Assistant — предварительный разбор' : lang === 'en' ? 'AI Doctor Assistant — preliminary analysis' : 'AI Doctor Assistant — dastlabki tahlil',
    '',
    summary,
    '',
    urgency,
    '',
    nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n'),
    '',
    'ICD:',
    ...icd.map((row) => `${row.code} — ${row.label}`),
  ].join('\n')

  return {
    specialtySlug: matched.specialtySlug,
    specialtyName,
    summary,
    nextSteps,
    urgency,
    icd,
    fullText,
  }
}
