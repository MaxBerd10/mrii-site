import type { ContentLang } from '../i18n/types'

export type RadiologyDemoScan = {
  id: string
  label: Record<ContentLang, string>
  modality: Record<ContentLang, string>
  findings: Record<ContentLang, string[]>
  risk: Record<ContentLang, string>
  recommendation: Record<ContentLang, string>
  reportSnippet: Record<ContentLang, string>
  icd: { code: string; label: Record<ContentLang, string> }[]
}

export const radiologyScans: RadiologyDemoScan[] = [
  {
    id: 'chest-ct-nodule',
    label: {
      uz: 'Ko’krak KT — tugun',
      ru: 'КТ грудной клетки — узел',
      en: 'Chest CT — pulmonary nodule',
    },
    modality: { uz: 'KT', ru: 'КТ', en: 'CT' },
    findings: {
      uz: [
        'O’ng yuqori bo’lakda 8 mm tugun (spikulatsiya belgisi).',
        'Plevral suyuqlik aniqlanmadi.',
        'Mediastinal limfa tugunlari yiriklashmagan.',
      ],
      ru: [
        'Узел 8 мм в верхней доле справа (спикуляция).',
        'Плеврального выпота нет.',
        'Медиастинальные лимфоузлы не увеличены.',
      ],
      en: [
        '8 mm right upper lobe nodule with spiculation cue.',
        'No pleural effusion.',
        'No enlarged mediastinal nodes.',
      ],
    },
    risk: {
      uz: 'Yuqori xavf: 0.82',
      ru: 'Высокий риск: 0.82',
      en: 'High-risk score: 0.82',
    },
    recommendation: {
      uz: 'Kontrast KT va torakal jarroh/radiolog konsiliumi tavsiya etiladi.',
      ru: 'Рекомендованы контрастная КТ и консилиум торакального хирурга/радиолога.',
      en: 'Recommend contrast CT and thoracic radiology/surgery review.',
    },
    reportSnippet: {
      uz: 'AI tugunni prioritetladi. Radiolog tasdiqlashi kutilmoqda.',
      ru: 'ИИ приоритизировал находку. Ожидается подтверждение радиолога.',
      en: 'AI prioritized the lesion. Radiologist confirmation pending.',
    },
    icd: [
      { code: 'R91.1', label: { uz: 'Yolg’iz o’pka tuguni', ru: 'Солитарный узел лёгкого', en: 'Solitary pulmonary nodule' } },
      { code: 'Z12.2', label: { uz: 'O’pka skriningi', ru: 'Скрининг лёгких', en: 'Lung screening' } },
    ],
  },
  {
    id: 'brain-mri-stroke',
    label: {
      uz: 'Miya MRT — insult riski',
      ru: 'МРТ мозга — риск инсульта',
      en: 'Brain MRI — stroke risk',
    },
    modality: { uz: 'MRT', ru: 'МРТ', en: 'MRI' },
    findings: {
      uz: [
        'Chap MCA hududida yangi ishemik o’choq ehtimoli.',
        'Diffuziyada signal kuchaygan.',
        'Mass-effekt sezilarli emas.',
      ],
      ru: [
        'Вероятный свежий ишемический очаг в бассейне левой СМА.',
        'Ограничение диффузии.',
        'Выраженного масс-эффекта нет.',
      ],
      en: [
        'Likely acute ischemic focus in left MCA territory.',
        'Diffusion restriction present.',
        'No significant mass effect.',
      ],
    },
    risk: {
      uz: 'Shoshilinch prioritet: 0.91',
      ru: 'Срочный приоритет: 0.91',
      en: 'Urgent priority score: 0.91',
    },
    recommendation: {
      uz: 'Stroke protokoli bo’yicha zudlik bilan nevrologik baholash.',
      ru: 'Немедленная неврологическая оценка по stroke-протоколу.',
      en: 'Immediate neuro assessment under stroke protocol.',
    },
    reportSnippet: {
      uz: 'AI case navbatda birinchi o’ringa ko’tardi.',
      ru: 'ИИ поднял кейс в верх очереди.',
      en: 'AI escalated this case to top of queue.',
    },
    icd: [
      { code: 'I63.9', label: { uz: 'Miya infarkti, aniqlanmagan', ru: 'Инфаркт мозга неуточнённый', en: 'Cerebral infarction, unspecified' } },
      { code: 'R29.8', label: { uz: 'Boshqa nevrologik belgilar', ru: 'Другие неврологические симптомы', en: 'Other neurological symptoms' } },
    ],
  },
]

export const radiologyDemoCopy: Record<
  ContentLang,
  {
    title: string
    desc: string
    selectLabel: string
    inputLabel: string
    inputPlaceholder: string
    run: string
    running: string
    findings: string
    risk: string
    recommendation: string
    report: string
    icd: string
    queue: string
  }
> = {
  uz: {
    title: 'AI Radiology live-demo',
    desc: 'Tasvir turini tanlang yoki klinik izoh kiriting — AI prioritet, topilmalar va radiologga draft xulosa chiqaradi.',
    selectLabel: 'Tayyor skan',
    inputLabel: 'Klinik izoh',
    inputPlaceholder: 'Masalan: yo’tal + vazn yo’qotish, KTda tugun shubha...',
    run: 'AI tahlilni ishga tushirish',
    running: 'Tahlil qilinmoqda…',
    findings: 'Topilmalar',
    risk: 'Xavf bahosi',
    recommendation: 'Keyingi qadam',
    report: 'Radiolog draft xulosasi',
    icd: 'ICD takliflari',
    queue: 'Worklist prioriteti',
  },
  ru: {
    title: 'AI Radiology live-демо',
    desc: 'Выберите тип исследования или добавьте клинический контекст — AI отдаст приоритет, находки и черновик для радиолога.',
    selectLabel: 'Готовый кейс',
    inputLabel: 'Клиническая заметка',
    inputPlaceholder: 'Например: кашель + потеря веса, подозрение на узел на КТ...',
    run: 'Запустить AI-анализ',
    running: 'Анализ…',
    findings: 'Находки',
    risk: 'Оценка риска',
    recommendation: 'Следующий шаг',
    report: 'Черновик заключения радиолога',
    icd: 'Предложения ICD',
    queue: 'Приоритет worklist',
  },
  en: {
    title: 'AI Radiology live demo',
    desc: 'Pick a study type or add context — AI returns queue priority, findings, and a radiologist-ready draft.',
    selectLabel: 'Preset scan',
    inputLabel: 'Clinical context',
    inputPlaceholder: 'e.g. persistent cough + weight loss, CT nodule concern...',
    run: 'Run AI analysis',
    running: 'Analyzing…',
    findings: 'Findings',
    risk: 'Risk score',
    recommendation: 'Next step',
    report: 'Radiologist draft report',
    icd: 'ICD suggestions',
    queue: 'Worklist priority',
  },
}
