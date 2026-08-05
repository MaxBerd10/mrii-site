import type { ContentLang } from '../i18n/types'

export type UltrasoundDemoCase = {
  id: string
  label: Record<ContentLang, string>
  modality: Record<ContentLang, string>
  findings: Record<ContentLang, string[]>
  risk: Record<ContentLang, string>
  recommendation: Record<ContentLang, string>
  reportSnippet: Record<ContentLang, string>
  icd: { code: string; label: Record<ContentLang, string> }[]
}

export const ultrasoundCases: UltrasoundDemoCase[] = [
  {
    id: 'thyroid-nodule',
    label: {
      uz: 'Qalqonsimon bez — tugun',
      ru: 'Щитовидная железа — узел',
      en: 'Thyroid — nodule',
    },
    modality: { uz: 'UTT', ru: 'УЗИ', en: 'US' },
    findings: {
      uz: [
        'O’ng bo’lakda 11 mm gipoxogen tugun segmentatsiya qilindi.',
        'Chegaralari notekis, mikro-kalsifikatsiya ehtimoli.',
        'Bo’yin limfa tugunlari kattalashmagan.',
      ],
      ru: [
        'Сегментирован гипоэхогенный узел 11 мм в правой доле.',
        'Неровные контуры, вероятны микрокальцинаты.',
        'Шейные лимфоузлы без значимого увеличения.',
      ],
      en: [
        '11 mm hypoechoic right-lobe nodule segmented.',
        'Irregular margins with microcalcification cue.',
        'No significant cervical nodal enlargement.',
      ],
    },
    risk: {
      uz: 'TI-RADS xavf: TR4',
      ru: 'Риск TI-RADS: TR4',
      en: 'TI-RADS risk: TR4',
    },
    recommendation: {
      uz: 'Endokrinolog ko’rigi va nazorat UTT / FNAB masalasini ko’rib chiqish.',
      ru: 'Осмотр эндокринолога и обсуждение контрольного УЗИ / ТАБ.',
      en: 'Endocrine review; consider follow-up US / FNA decision.',
    },
    reportSnippet: {
      uz: 'AI avtomatik o’lchov va markerlarni protokolga joyladi.',
      ru: 'ИИ автоматически внёс размеры и маркеры в протокол.',
      en: 'AI auto-populated measurements and lesion markers.',
    },
    icd: [
      { code: 'E04.1', label: { uz: 'Qalqonsimon bez tuguni', ru: 'Узел щитовидной железы', en: 'Nontoxic single thyroid nodule' } },
      { code: 'R93.8', label: { uz: 'Diagnostik topilma', ru: 'Диагностическая находка', en: 'Abnormal finding on imaging' } },
    ],
  },
  {
    id: 'liver-steatosis',
    label: {
      uz: 'Jigar UTT — steatoz',
      ru: 'УЗИ печени — стеатоз',
      en: 'Liver US — steatosis',
    },
    modality: { uz: 'UTT', ru: 'УЗИ', en: 'US' },
    findings: {
      uz: [
        'Jigar echogenligi diffuz oshgan.',
        'Portal vena diametri normal chegarada.',
        'Fokal o’choq topilmadi.',
      ],
      ru: [
        'Диффузное повышение эхогенности печени.',
        'Диаметр воротной вены в норме.',
        'Фокальных образований не выявлено.',
      ],
      en: [
        'Diffuse increased hepatic echogenicity.',
        'Portal vein caliber within normal range.',
        'No focal lesion detected.',
      ],
    },
    risk: {
      uz: 'NAFLD ehtimoli: 0.76',
      ru: 'Вероятность NAFLD: 0.76',
      en: 'NAFLD likelihood: 0.76',
    },
    recommendation: {
      uz: 'Biokimyo paneli va gastroenterolog nazorati tavsiya etiladi.',
      ru: 'Рекомендованы биохимия и наблюдение гастроэнтеролога.',
      en: 'Recommend liver labs and gastroenterology follow-up.',
    },
    reportSnippet: {
      uz: 'AI steatoz belgilarini flag qilib, tayyor xulosani chiqardi.',
      ru: 'ИИ отметил признаки стеатоза и сформировал черновик заключения.',
      en: 'AI flagged steatosis markers and drafted the report.',
    },
    icd: [
      { code: 'K76.0', label: { uz: 'Yog’li jigar', ru: 'Жировая дистрофия печени', en: 'Fatty liver, not elsewhere classified' } },
      { code: 'E66.9', label: { uz: 'Semizlik (hamroh omil)', ru: 'Ожирение (сопутствующий фактор)', en: 'Obesity (comorbidity)' } },
    ],
  },
]

export const ultrasoundDemoCopy: Record<
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
    title: 'AI Ultrasound live-demo',
    desc: 'UTT case tanlang yoki klinik izoh kiriting — AI segmentatsiya, o’lchov va draft protokolni ko’rsatadi.',
    selectLabel: 'Tayyor UTT case',
    inputLabel: 'Klinik izoh',
    inputPlaceholder: 'Masalan: bo’yin UTT, tugun shubha, TSH oshgan...',
    run: 'AI UTT tahlilini ishga tushirish',
    running: 'Segmentatsiya va o’lchovlar hisoblanmoqda…',
    findings: 'Topilmalar',
    risk: 'Risk bahosi',
    recommendation: 'Keyingi qadam',
    report: 'Draft protokol',
    icd: 'ICD takliflari',
    queue: 'UTT protokol assistenti',
  },
  ru: {
    title: 'AI Ultrasound live-демо',
    desc: 'Выберите УЗИ-кейс или добавьте клинический контекст — AI покажет сегментацию, измерения и черновик протокола.',
    selectLabel: 'Готовый УЗИ-кейс',
    inputLabel: 'Клиническая заметка',
    inputPlaceholder: 'Например: узел щитовидной железы, повышен TSH...',
    run: 'Запустить AI-анализ УЗИ',
    running: 'Сегментация и автоизмерения…',
    findings: 'Находки',
    risk: 'Оценка риска',
    recommendation: 'Следующий шаг',
    report: 'Черновик протокола',
    icd: 'Предложения ICD',
    queue: 'Ассистент протокола УЗИ',
  },
  en: {
    title: 'AI Ultrasound live demo',
    desc: 'Pick an ultrasound case or add context — AI shows segmentation, measurements, and a draft protocol.',
    selectLabel: 'Preset ultrasound case',
    inputLabel: 'Clinical context',
    inputPlaceholder: 'e.g. thyroid nodule concern, elevated TSH...',
    run: 'Run AI ultrasound analysis',
    running: 'Computing segmentation and measurements…',
    findings: 'Findings',
    risk: 'Risk score',
    recommendation: 'Next step',
    report: 'Draft protocol',
    icd: 'ICD suggestions',
    queue: 'Ultrasound protocol assistant',
  },
}
