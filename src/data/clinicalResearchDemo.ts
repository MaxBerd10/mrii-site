import type { ContentLang } from '../i18n/types'

export type ClinicalResearchDemoStudy = {
  id: string
  label: Record<ContentLang, string>
  phase: Record<ContentLang, string>
  findings: Record<ContentLang, string[]>
  risk: Record<ContentLang, string>
  recommendation: Record<ContentLang, string>
  reportSnippet: Record<ContentLang, string>
  icd: { code: string; label: Record<ContentLang, string> }[]
}

export const researchStudies: ClinicalResearchDemoStudy[] = [
  {
    id: 'diabetes-phase2',
    label: {
      uz: 'Diabet dori — II faza',
      ru: 'Препарат диабета — фаза II',
      en: 'Diabetes therapy — phase II',
    },
    phase: { uz: 'II faza', ru: 'Фаза II', en: 'Phase II' },
    findings: {
      uz: [
        'AI 320 nomzoddan 41 bemorni mezonga mos deb topdi.',
        'eCRF maydonlarida 7 ta majburiy bo‘sh qiymat aniqlandi.',
        'Nojo‘ya hodisa signali: 2 bemorda ALT oshishi.',
      ],
      ru: [
        'ИИ нашёл 41 подходящего пациента из 320 кандидатов.',
        'В eCRF выявлено 7 обязательных пустых полей.',
        'Сигнал НЯ: повышение ALT у 2 пациентов.',
      ],
      en: [
        'AI matched 41 eligible patients from 320 candidates.',
        'Detected 7 missing required eCRF fields.',
        'AE signal: ALT elevation in 2 participants.',
      ],
    },
    risk: {
      uz: 'Monitoring alert: o‘rta',
      ru: 'Monitoring alert: средний',
      en: 'Monitoring alert: medium',
    },
    recommendation: {
      uz: 'Lab retest + safety board review, eCRF lockdan oldin data-cleanup.',
      ru: 'Повторные анализы + review safety board, очистка данных до lock eCRF.',
      en: 'Retest labs + safety board review, complete data cleanup before eCRF lock.',
    },
    reportSnippet: {
      uz: 'AI bemor matching va safety signallarni CTMS paneliga yubordi.',
      ru: 'ИИ отправил matching пациентов и safety-сигналы в CTMS панель.',
      en: 'AI pushed patient matching and safety signals to CTMS dashboard.',
    },
    icd: [
      { code: 'E11.9', label: { uz: '2-tip diabet', ru: 'Сахарный диабет 2 типа', en: 'Type 2 diabetes mellitus' } },
      { code: 'R74.0', label: { uz: 'Transaminazalar oshishi', ru: 'Повышение трансаминаз', en: 'Elevation of transaminases' } },
    ],
  },
  {
    id: 'oncology-multicenter',
    label: {
      uz: 'Onkologiya — ko‘p markazli',
      ru: 'Онкология — мультицентровое',
      en: 'Oncology — multi-center',
    },
    phase: { uz: 'III faza', ru: 'Фаза III', en: 'Phase III' },
    findings: {
      uz: [
        'Site performance score: 9 markazdan 2 tasi past.',
        'Randomization logda 3 kechikkan entry.',
        'Follow-up visit compliance 94%.',
      ],
      ru: [
        'Site performance score: 2 центра из 9 ниже порога.',
        'В randomization log 3 задержанных записи.',
        'Compliance follow-up визитов 94%.',
      ],
      en: [
        'Site performance score: 2 of 9 centers below threshold.',
        'Three delayed entries in randomization log.',
        'Follow-up visit compliance at 94%.',
      ],
    },
    risk: {
      uz: 'Operatsion risk: past-o‘rta',
      ru: 'Операционный риск: низко-средний',
      en: 'Operational risk: low-medium',
    },
    recommendation: {
      uz: 'Past performans markazlar uchun retraining va query closure sprint.',
      ru: 'Retraining для low-performing центров и sprint по закрытию query.',
      en: 'Retraining for low-performing sites and query-closure sprint.',
    },
    reportSnippet: {
      uz: 'AI monitoring panel markazlar kesimida KPI driftni ko‘rsatdi.',
      ru: 'AI monitoring panel отобразила KPI drift по центрам.',
      en: 'AI monitoring panel highlighted KPI drift by site.',
    },
    icd: [
      { code: 'C80.1', label: { uz: 'Onkologik tashxis (umumiy)', ru: 'Онкологический диагноз (общий)', en: 'Malignant neoplasm, unspecified' } },
      { code: 'Z00.6', label: { uz: 'Klinik tadqiqot ishtiroki', ru: 'Участие в клиническом исследовании', en: 'Examination as trial participant' } },
    ],
  },
]

export const clinicalResearchDemoCopy: Record<
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
    title: 'AI Clinical Research live-demo',
    desc: 'Trial case tanlang yoki protocol context qo‘shing — AI screening, safety va data-quality signalini chiqaradi.',
    selectLabel: 'Tadqiqot case',
    inputLabel: 'Protocol context',
    inputPlaceholder: 'Masalan: inclusion age 18-65, ALT monitoring har 2 hafta...',
    run: 'AI trial tahlilini ishga tushirish',
    running: 'Screening va safety signal analiz qilinmoqda…',
    findings: 'Topilmalar',
    risk: 'Risk bahosi',
    recommendation: 'Keyingi qadam',
    report: 'CTMS/eCRF draft xulosa',
    icd: 'Relevant ICD',
    queue: 'Trial ops dashboard',
  },
  ru: {
    title: 'AI Clinical Research live-демо',
    desc: 'Выберите исследовательский кейс или добавьте контекст протокола — AI покажет screening, safety и data-quality сигналы.',
    selectLabel: 'Исследовательский кейс',
    inputLabel: 'Контекст протокола',
    inputPlaceholder: 'Например: inclusion 18-65, ALT monitoring каждые 2 недели...',
    run: 'Запустить AI trial-анализ',
    running: 'Идёт анализ screening и safety сигналов…',
    findings: 'Находки',
    risk: 'Оценка риска',
    recommendation: 'Следующий шаг',
    report: 'Черновик CTMS/eCRF',
    icd: 'Relevant ICD',
    queue: 'Trial ops dashboard',
  },
  en: {
    title: 'AI Clinical Research live demo',
    desc: 'Select a trial case or add protocol context — AI surfaces screening, safety, and data-quality signals.',
    selectLabel: 'Trial case',
    inputLabel: 'Protocol context',
    inputPlaceholder: 'e.g. inclusion age 18-65, ALT monitoring every 2 weeks...',
    run: 'Run AI trial analysis',
    running: 'Analyzing screening and safety signals…',
    findings: 'Findings',
    risk: 'Risk score',
    recommendation: 'Next step',
    report: 'CTMS/eCRF draft summary',
    icd: 'Relevant ICD',
    queue: 'Trial ops dashboard',
  },
}
