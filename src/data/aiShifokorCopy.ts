import type { Lang } from '../i18n/types'

export type AiShifokorHomeCardKey = 'consilium' | 'knowledge' | 'ekg' | 'risk'

export type AiShifokorHomeCard = {
  key: AiShifokorHomeCardKey
  title: string
  desc: string
  metric: string
  metricLabel: string
}

export type AiShifokorCopy = {
  statsTitle: string
  stats: { value: string; label: string }[]
  capsTitle: string
  capsSubtitle: string
  caps: { title: string; desc: string }[]
  flowTitle: string
  flowSubtitle: string
  steps: { title: string; desc: string; bullets: string[]; duration: string }[]
  bannerTitle: string
  bannerSubtitle: string
  bannerCta: string
  homeCards: AiShifokorHomeCard[]
}

export const AISHIFOKOR_COPY: Record<Lang, AiShifokorCopy> = {
  uz: {
    statsTitle: 'Platforma samaradorligi',
    stats: [
      { value: '15 000+', label: 'Klinik protokollar' },
      { value: '50+', label: 'Hamkor klinikalar' },
      { value: '100K+', label: 'Muvaffaqiyatli tahlillar' },
      { value: '12+', label: 'AI mutaxassislar' },
    ],
    capsTitle: 'Imkoniyatlar chegarasiz',
    capsSubtitle:
      'AiShifokor shifokorlarga kundalik faoliyatida duch keladigan eng murakkab vazifalarni hal qilishda yordam beradi.',
    caps: [
      {
        title: 'AI Konsilium',
        desc: 'Kardiolog, Nevrolog, Onkolog va 10+ virtual mutaxassislar bilan real vaqtda maslahatlashing.',
      },
      {
        title: 'Xavfsiz va aniq',
        desc: 'Xalqaro FDA va SSV standartlariga asoslangan, dalillarga tayangan tibbiyot (EBM) tamoyillari.',
      },
      {
        title: 'Global bilimlar bazasi',
        desc: 'Dunyo bo’ylab eng so’nggi tibbiy tadqiqotlar va maqolalarni bir zumda tahlil qiling.',
      },
      {
        title: 'EKG tahlili',
        desc: 'EKG tasvirlarini yuklang va sun’iy intellekt yordamida aniq xulosa va tahlil oling.',
      },
      {
        title: 'Dorilar o’zaro ta’siri',
        desc: 'Bir vaqtning o’zida bir nechta dori vositalarini qabul qilishda xavfsizlikni tekshiring.',
      },
      {
        title: 'Xavf skoring',
        desc: 'ASCVD, CHADS-VASc kabi xalqaro shkalalar yordamida bemor xavf darajasini baholang.',
      },
    ],
    flowTitle: 'Ishlash tizimi oddiy va samarali',
    flowSubtitle:
      '3 qadam · taxminan 15–25 daqiqa · 12+ virtual mutaxassis · O’zbekiston SSV protokollari.',
    steps: [
      {
        title: 'Ma’lumotlarni kiriting',
        desc:
          'Bemorning shikoyatlari, anamnezi, obyektiv ko’rik va laboratoriya natijalarini kiriting. EKG, rentgen yoki boshqa tasvirlarni yuklashingiz mumkin.',
        bullets: [
          'Shikoyatlar, anamnez, allergiya va dori-darmonlar',
          'Vital ko’rsatkichlar (AB, puls, harorat, SpO₂)',
          'Laboratoriya va instrumental tahlillar',
          'Ixtiyoriy: EKG, rentgen, KT/MRT rasmlari',
        ],
        duration: '2–5 daqiqa',
      },
      {
        title: 'AI tahlili',
        desc:
          'Tizim ma’lumotlarni o’rganadi, differensial tashxis ro’yxatini shakllantiradi va holatga mos 5–6 mutaxassisni taklif qiladi.',
        bullets: [
          'Differensial tashxis va ehtimollik baholash',
          'Konsilium uchun mutaxassislar jamoasi',
          'Aniqlashtiruvchi savollar',
          'SSV va xalqaro protokollar',
        ],
        duration: '5–15 daqiqa',
      },
      {
        title: 'Ekspert xulosasi',
        desc:
          'Virtual konsilium yakuniy konsensusga keladi. Davolash rejasi, dori tavsiyalari va prognozni PDF/Wordda yuklab oling.',
        bullets: [
          'Konsensus tashxisi va asoslari',
          'Davolash rejasi va dori-darmonlar (O’zbekistonda mavjud)',
          'Qo’shimcha tekshiruvlar va kuzatuv rejasi',
          'PDF/Word hisobot',
        ],
        duration: 'Yakuniy',
      },
    ],
    bannerTitle: 'Tibbiy amaliyotingizni bugun o’zgartiring',
    bannerSubtitle:
      'AiShifokor platformasi bilan ishlashni boshlang va har bir bemorga yuqori aniqlikdagi tashxis qo’ying.',
    bannerCta: 'Tizimga kirish',
    homeCards: [
      {
        key: 'consilium',
        title: 'AI Konsilium',
        desc: 'Kardiolog, nevrolog, onkolog va 10+ virtual mutaxassis bilan real vaqtda maslahat.',
        metric: '12+',
        metricLabel: 'virtual mutaxassis',
      },
      {
        key: 'knowledge',
        title: 'Global bilimlar bazasi',
        desc: 'SSV va xalqaro tavsiyalar asosidagi yagona baza. Bir zumda kerakli protokol.',
        metric: '15 000+',
        metricLabel: 'klinik protokol',
      },
      {
        key: 'ekg',
        title: 'EKG va tasvirlar',
        desc: 'EKG, rentgen, KT, MRT rasmlarini AI avtomatik tahlil qiladi.',
        metric: '100K+',
        metricLabel: 'muvaffaqiyatli tahlil',
      },
      {
        key: 'risk',
        title: 'Xavf skoring',
        desc: 'ASCVD, CHADS-VASc va boshqa xalqaro shkalalar bilan bemor xavfini baholash.',
        metric: 'FDA · SSV',
        metricLabel: 'standartlariga mos',
      },
    ],
  },

  ru: {
    statsTitle: 'Эффективность платформы',
    stats: [
      { value: '15 000+', label: 'Клинических протоколов' },
      { value: '50+', label: 'Клиник-партнёров' },
      { value: '100K+', label: 'Успешных анализов' },
      { value: '12+', label: 'AI-специалистов' },
    ],
    capsTitle: 'Возможности без границ',
    capsSubtitle:
      'AiShifokor помогает врачам решать самые сложные задачи повседневной практики.',
    caps: [
      {
        title: 'AI-консилиум',
        desc: 'Консультируйтесь в реальном времени с кардиологом, неврологом, онкологом и 10+ виртуальными специалистами.',
      },
      {
        title: 'Безопасно и точно',
        desc: 'Основано на международных стандартах FDA и Минздрава, принципах доказательной медицины (EBM).',
      },
      {
        title: 'Глобальная база знаний',
        desc: 'Мгновенно анализируйте свежие мировые медицинские исследования и статьи.',
      },
      {
        title: 'Анализ ЭКГ',
        desc: 'Загрузите изображение ЭКГ и получите точное заключение с помощью искусственного интеллекта.',
      },
      {
        title: 'Взаимодействие лекарств',
        desc: 'Проверяйте безопасность одновременного приёма нескольких препаратов.',
      },
      {
        title: 'Оценка рисков',
        desc: 'Оценивайте риск пациента по международным шкалам ASCVD, CHADS-VASc и др.',
      },
    ],
    flowTitle: 'Простая и эффективная схема работы',
    flowSubtitle:
      '3 шага · около 15–25 минут · 12+ виртуальных специалистов · протоколы Минздрава РУз.',
    steps: [
      {
        title: 'Введите данные',
        desc:
          'Введите жалобы, анамнез, объективный осмотр и результаты лабораторных исследований. Можно загрузить ЭКГ, рентген и другие снимки.',
        bullets: [
          'Жалобы, анамнез, аллергия и принимаемые препараты',
          'Витальные показатели (АД, пульс, температура, SpO₂)',
          'Лабораторные и инструментальные анализы',
          'По желанию: ЭКГ, рентген, КТ/МРТ',
        ],
        duration: '2–5 мин',
      },
      {
        title: 'AI-анализ',
        desc:
          'Система изучает данные, формирует список дифференциальных диагнозов и предлагает 5–6 профильных специалистов.',
        bullets: [
          'Дифференциальный диагноз и вероятности',
          'Команда экспертов для консилиума',
          'Уточняющие вопросы',
          'Протоколы Минздрава и международные',
        ],
        duration: '5–15 мин',
      },
      {
        title: 'Заключение экспертов',
        desc:
          'Виртуальный консилиум приходит к консенсусу. Скачайте план лечения, рекомендации по препаратам и прогноз в PDF/Word.',
        bullets: [
          'Консенсус-диагноз с обоснованием',
          'План лечения и препараты (доступные в РУз)',
          'Дополнительные обследования и наблюдение',
          'Отчёт в PDF/Word',
        ],
        duration: 'Финал',
      },
    ],
    bannerTitle: 'Измените свою практику уже сегодня',
    bannerSubtitle:
      'Начните работу с платформой AiShifokor и ставьте точные диагнозы каждому пациенту.',
    bannerCta: 'Войти в систему',
    homeCards: [
      {
        key: 'consilium',
        title: 'AI-консилиум',
        desc: 'Консультация в реальном времени с кардиологом, неврологом, онкологом и 10+ виртуальными специалистами.',
        metric: '12+',
        metricLabel: 'виртуальных специалистов',
      },
      {
        key: 'knowledge',
        title: 'Глобальная база знаний',
        desc: 'Протоколы Минздрава и международные рекомендации в одной системе.',
        metric: '15 000+',
        metricLabel: 'клинических протоколов',
      },
      {
        key: 'ekg',
        title: 'ЭКГ и снимки',
        desc: 'AI автоматически анализирует ЭКГ, рентген, КТ и МРТ.',
        metric: '100K+',
        metricLabel: 'успешных анализов',
      },
      {
        key: 'risk',
        title: 'Оценка рисков',
        desc: 'ASCVD, CHADS-VASc и другие международные шкалы для оценки риска пациента.',
        metric: 'FDA · МЗ',
        metricLabel: 'соответствует стандартам',
      },
    ],
  },

  en: {
    statsTitle: 'Platform performance',
    stats: [
      { value: '15,000+', label: 'Clinical protocols' },
      { value: '50+', label: 'Partner clinics' },
      { value: '100K+', label: 'Successful analyses' },
      { value: '12+', label: 'AI specialists' },
    ],
    capsTitle: 'Capabilities without limits',
    capsSubtitle:
      'AiShifokor helps physicians solve the most complex tasks they face in daily practice.',
    caps: [
      {
        title: 'AI Consilium',
        desc: 'Consult in real time with a cardiologist, neurologist, oncologist and 10+ virtual specialists.',
      },
      {
        title: 'Safe and accurate',
        desc: 'Built on international FDA and Ministry of Health standards and evidence-based medicine (EBM).',
      },
      {
        title: 'Global knowledge base',
        desc: 'Instantly analyse the latest medical research and papers from around the world.',
      },
      {
        title: 'ECG analysis',
        desc: 'Upload ECG images and get a precise AI-driven interpretation.',
      },
      {
        title: 'Drug interactions',
        desc: 'Verify safety when a patient takes several medicines at once.',
      },
      {
        title: 'Risk scoring',
        desc: 'Assess patient risk with international scales like ASCVD and CHADS-VASc.',
      },
    ],
    flowTitle: 'A simple, effective workflow',
    flowSubtitle:
      '3 steps · around 15–25 minutes · 12+ virtual specialists · Uzbek MoH protocols.',
    steps: [
      {
        title: 'Enter the data',
        desc:
          'Enter the patient’s complaints, history, examination and lab results. You can also upload ECG, X-ray and other imaging.',
        bullets: [
          'Complaints, history, allergies and medications',
          'Vitals (BP, pulse, temperature, SpO₂)',
          'Lab and instrumental results',
          'Optional: ECG, X-ray, CT/MRI images',
        ],
        duration: '2–5 min',
      },
      {
        title: 'AI analysis',
        desc:
          'The system studies the data, builds a differential-diagnosis list and suggests 5–6 relevant specialists.',
        bullets: [
          'Differential diagnosis with probabilities',
          'Expert team for the consilium',
          'Clarifying questions',
          'MoH and international protocols',
        ],
        duration: '5–15 min',
      },
      {
        title: 'Expert conclusion',
        desc:
          'The virtual consilium reaches consensus. Download the treatment plan, drug recommendations and prognosis as PDF/Word.',
        bullets: [
          'Consensus diagnosis with rationale',
          'Treatment plan and drugs available in Uzbekistan',
          'Follow-up tests and monitoring plan',
          'PDF/Word report',
        ],
        duration: 'Final',
      },
    ],
    bannerTitle: 'Transform your practice today',
    bannerSubtitle:
      'Start working with the AiShifokor platform and give every patient a high-accuracy diagnosis.',
    bannerCta: 'Sign in',
    homeCards: [
      {
        key: 'consilium',
        title: 'AI Consilium',
        desc: 'Real-time consultation with a cardiologist, neurologist, oncologist and 10+ virtual specialists.',
        metric: '12+',
        metricLabel: 'virtual specialists',
      },
      {
        key: 'knowledge',
        title: 'Global knowledge base',
        desc: 'MoH and international guidelines in a single system.',
        metric: '15,000+',
        metricLabel: 'clinical protocols',
      },
      {
        key: 'ekg',
        title: 'ECG and imaging',
        desc: 'AI automatically analyses ECG, X-ray, CT and MRI.',
        metric: '100K+',
        metricLabel: 'successful analyses',
      },
      {
        key: 'risk',
        title: 'Risk scoring',
        desc: 'ASCVD, CHADS-VASc and other international scales to assess patient risk.',
        metric: 'FDA · MoH',
        metricLabel: 'standards compliant',
      },
    ],
  },

  kaa: {
    statsTitle: 'Platforma nátiyjeliligi',
    stats: [
      { value: '15 000+', label: 'Klinik protokollar' },
      { value: '50+', label: 'Sherik klinikalar' },
      { value: '100K+', label: 'Ámelge asqan tallawlar' },
      { value: '12+', label: 'AI qánigeler' },
    ],
    capsTitle: 'Múmkinshilikler shegarasız',
    capsSubtitle:
      'AiShifokor shıpakerlerge kúndelik jumısında ushıraytuğın eń qıyın máselelerdi sheshiwde járdem beredi.',
    caps: [
      {
        title: 'AI Konsilium',
        desc: 'Kardiolog, Nevrolog, Onkolog hám 10+ virtual qánigeler menen real waqıtta másláhátlashıń.',
      },
      {
        title: 'Qawipsiz hám anıq',
        desc: 'Xalıqaralıq FDA hám SSV standartlarına tiykarlanǵan, dálillerge tayanǵan meditsina (EBM) tiykarları.',
      },
      {
        title: 'Global bilimler bazası',
        desc: 'Dúnyadaǵı eń jańa meditsinalıq izertlewlerdi hám maqalalardı bir zamatta tallań.',
      },
      {
        title: 'EKG tallawı',
        desc: 'EKG súwretlerin júkleń hám sún’iy intellekt járdeminde anıq juwmaq alıń.',
      },
      {
        title: 'Dári-dármaqlar tásiri',
        desc: 'Bir waqıtta bir neshe dárini qabıllawda qawipsizlikti tekseriń.',
      },
      {
        title: 'Qáwip skoringi',
        desc: 'ASCVD, CHADS-VASc sıyaqlı xalıqaralıq shkalalar járdeminde bekimsheklikke bahá beriń.',
      },
    ],
    flowTitle: 'Islew sistemasi ápiwayı hám nátiyjeli',
    flowSubtitle:
      '3 qádem · shama menen 15–25 minut · 12+ virtual qánige · O’zbekstan SSV protokolları.',
    steps: [
      {
        title: 'Mag’lıwmatlardı kirgiziń',
        desc:
          'Bemardıń shag’ımları, anamnezi, obyektiv qarawı hám laboratoriya juwmakların kirgiziń. EKG, rentgen yamasa basqa súwretler júklewińiz múmkin.',
        bullets: [
          'Shag’ımlar, anamnez, allergiya hám dárilar',
          'Witaldıq korsetkishler (AB, puls, ısıqlıq, SpO₂)',
          'Laboratoriya hám instrumental tallawlar',
          'Erikli: EKG, rentgen, KT/MRT súwretleri',
        ],
        duration: '2–5 minut',
      },
      {
        title: 'AI tallawı',
        desc:
          'Sistema mag’lıwmatlardı úyrenedi, differensial tashxis dizimin dúzedi hám jaǵdayǵa sáykes 5–6 qánige usınadı.',
        bullets: [
          'Differensial tashxis hám itimallıq',
          'Konsilium ushın qánigeler toparı',
          'Anıqlashtırıwshı sorawlar',
          'SSV hám xalıqaralıq protokollar',
        ],
        duration: '5–15 minut',
      },
      {
        title: 'Ekspert juwmakı',
        desc:
          'Virtual konsilium juwmaqlawshı konsensusqa keledi. Emlew rejesi, dári usınısları hám prognozdı PDF/Word’da júklep alıń.',
        bullets: [
          'Konsensus tashxis hám tiykarları',
          'Emlew rejesi hám O’zbekstanda bar dárilar',
          'Qosımsha tekseriwler hám baqlaw rejesi',
          'PDF/Word esabatı',
        ],
        duration: 'Sońǵı',
      },
    ],
    bannerTitle: 'Meditsinalıq ámeliyatıńızdı bugin ózgeriztiriń',
    bannerSubtitle:
      'AiShifokor platformasi menen islewdi baslań hám hár bir bemarǵa joqarı anıqlıqta tashxis qoyıń.',
    bannerCta: 'Sistemag’a kirisiw',
    homeCards: [
      {
        key: 'consilium',
        title: 'AI Konsilium',
        desc: 'Kardiolog, nevrolog, onkolog hám 10+ virtual qánige menen real waqıtta másláhát.',
        metric: '12+',
        metricLabel: 'virtual qánige',
      },
      {
        key: 'knowledge',
        title: 'Global bilimler bazası',
        desc: 'SSV hám xalıqaralıq usınıslar tiykarındaǵı jalǵız baza.',
        metric: '15 000+',
        metricLabel: 'klinik protokol',
      },
      {
        key: 'ekg',
        title: 'EKG hám súwretler',
        desc: 'EKG, rentgen, KT, MRT súwretlerin AI avtomatik talqılaydı.',
        metric: '100K+',
        metricLabel: 'ámelge asqan tallaw',
      },
      {
        key: 'risk',
        title: 'Qáwip skoringi',
        desc: 'ASCVD, CHADS-VASc hám basqa xalıqaralıq shkalalar járdeminde qáwipti bahalaw.',
        metric: 'FDA · SSV',
        metricLabel: 'standartlarıǵa muwapıq',
      },
    ],
  },
}
