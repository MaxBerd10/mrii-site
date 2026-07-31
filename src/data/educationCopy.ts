import type { Lang } from '../i18n/types'

export type EducationCopy = {
  eyebrow: string
  title1: string
  titleEm: string
  description: string
  universityNote: string
  universityLink: string

  ordinaturaTitle: string
  ordinaturaIntro: string
  eligibilityLabel: string
  eligibility: string[]
  timelineLabel: string
  timelineValue: string
  processTitle: string
  processSteps: { title: string; desc: string }[]
  docsTitle: string
  docsSubtitle: string
  docs: { title: string; hint: string }[]
  phonesTitle: string
  phonesSubtitle: string

  kurslarTitle: string
  kurslarIntro: string
  categoriesTitle: string
  categories: { title: string; desc: string; meta: string }[]
  kurslarContactTitle: string
  kurslarContactDesc: string
  kurslarContactCta: string
}

export const ADMISSIONS_PHONES = [
  { display: '+998 95 044-23-45', tel: '+998950442345' },
  { display: '+998 95 046-23-45', tel: '+998950462345' },
  { display: '+998 95 048-23-45', tel: '+998950482345' },
  { display: '+998 94 138-00-25', tel: '+998941380025' },
] as const

export const EDUCATION_COPY: Record<Lang, EducationCopy> = {
  uz: {
    eyebrow: 'Taʼlim',
    title1: 'Ordinatura va',
    titleEm: 'malaka oshirish',
    description:
      'FJSTI klinik bazasi shifokorlar uchun uchta yoʻnalishni bir joyda taklif etadi: klinik ordinatura, malaka oshirish kurslari va tadqiqot amaliyoti.',
    universityNote: 'Asosiy oliy taʼlim — universitetimizda.',
    universityLink: 'fjsti.uz saytiga oʻtish →',

    ordinaturaTitle: 'Klinik ordinatura (rezidentura)',
    ordinaturaIntro:
      'Faqat oliy tibbiy maʼlumotga ega vrachlar tanlov asosida qabul qilinadi. Ikkinchi mutaxassislik toʻlov-kontrakt asosida boʻladi.',
    eligibilityLabel: 'Kim topshira oladi',
    eligibility: [
      'Oliy tibbiy maʼlumotli vrachlar',
      'Ilgari ordinatura yoki magistratura bitirganlar (ikkinchi mutaxassislikka)',
      'Xorijda oʻqiganlar — nostrifikatsiyadan soʻng',
    ],
    timelineLabel: 'Muddat',
    timelineValue: 'Ariza qabuli — kamida 30 kun · Test sinovi — avgust oyi oxiri',

    processTitle: 'Qabul jarayoni — 3 qadam',
    processSteps: [
      {
        title: 'Hujjatlarni topshiring',
        desc:
          'Rektor nomiga ariza, diplom, pasport, tibbiy maʼlumotnoma va fotosurat rasmiy platforma orqali yuboriladi.',
      },
      {
        title: 'Tanlov sinovi',
        desc:
          'Avgust oxirida test sinovi. Eng yuqori ballarning kamida 30 foizini toʻplash shart.',
      },
      {
        title: 'Yakuniy qabul',
        desc:
          'Natijalar 10-sentyabrgacha rasmiylashtiriladi. Maqsadli oʻrinlar 3 tomonlama shartnoma bilan.',
      },
    ],

    docsTitle: 'Kerakli hujjatlar',
    docsSubtitle:
      'Fayl nomida ism-familiya va hujjat turi koʻrsatiladi. Masalan: Olimov_Olim_diplom.pdf',
    docs: [
      { title: 'Rektor nomiga ariza', hint: 'Namuna boʻyicha, imzolangan skaner (PDF)' },
      { title: 'Oliy maʼlumot diplomi', hint: 'Diplom + ilova, rangli skaner (PDF)' },
      { title: 'Pasport', hint: 'Fotosuratli va roʻyxatdan oʻtgan betlar (PDF)' },
      { title: '086-U tibbiy maʼlumotnoma', hint: 'Ikki tomoni rangli skaner (PDF)' },
      { title: 'Fotosurat 3.5 × 4.5 sm', hint: 'Rangli, JPG, 300 DPI' },
      { title: 'Imtiyoz hujjati', hint: 'Boʻlsa — rangli skaner (PDF)' },
    ],

    phonesTitle: 'Qabul komissiyasi',
    phonesSubtitle:
      'Hujjat, muddat va imtihon manzillari boʻyicha savollarga qabul komissiyasi javob beradi.',

    kurslarTitle: 'Malaka oshirish va kurslar',
    kurslarIntro:
      'Amaliyotdagi shifokorlar uchun CME dasturlari, klinik seminarlar va tadqiqot amaliyoti — yoʻnalishga qarab modul yoki intensiv formatda.',
    categoriesTitle: 'Kurs yoʻnalishlari',
    categories: [
      {
        title: 'Malaka oshirish kurslari',
        desc: 'Klinik mutaxassisliklar boʻyicha 36–144 soatlik CME dasturlari.',
        meta: 'Sertifikat',
      },
      {
        title: 'Qayta tayyorlash',
        desc: 'Ikkinchi mutaxassislik yoki tor yoʻnalishga oʻtish uchun modulli kurslar.',
        meta: 'Toʻlov-kontrakt',
      },
      {
        title: 'Klinik seminar va vebinar',
        desc: 'Haftalik amaliy seminar, video-konsilium va ekspertlar bilan uchrashuv.',
        meta: '2 soat / hafta',
      },
      {
        title: 'GCP va tadqiqot amaliyoti',
        desc: 'ICH E6 R3, Clinical Research Coordinator va Study Nurse dasturlari.',
        meta: '16–80 soat',
      },
    ],
    kurslarContactTitle: 'Kurs boʻyicha maslahat',
    kurslarContactDesc:
      'Taʼlim boʻlimi mos dasturni tanlashda yordam beradi va yozilish tartibini tushuntiradi.',
    kurslarContactCta: 'Aloqaga oʻtish',
  },

  ru: {
    eyebrow: 'Обучение',
    title1: 'Ординатура и',
    titleEm: 'повышение квалификации',
    description:
      'Клиническая база ФЖСТИ объединяет три направления для врачей: клиническая ординатура, курсы повышения квалификации и исследовательская практика.',
    universityNote: 'Основное высшее образование — в нашем университете.',
    universityLink: 'Перейти на fjsti.uz →',

    ordinaturaTitle: 'Клиническая ординатура (резидентура)',
    ordinaturaIntro:
      'На конкурсной основе принимаются только врачи с высшим медицинским образованием. Вторая специальность — на платно-контрактной основе.',
    eligibilityLabel: 'Кто может подать',
    eligibility: [
      'Врачи с высшим медицинским образованием',
      'Окончившие ординатуру или магистратуру (для второй специальности)',
      'Учившиеся за рубежом — после нострификации',
    ],
    timelineLabel: 'Сроки',
    timelineValue: 'Приём документов — не менее 30 дней · Тест — конец августа',

    processTitle: 'Процесс поступления — 3 шага',
    processSteps: [
      {
        title: 'Подача документов',
        desc:
          'Заявление на имя ректора, диплом, паспорт, медицинская справка и фото загружаются через официальную платформу.',
      },
      {
        title: 'Конкурсный тест',
        desc:
          'Тест проводится в конце августа. Нужно набрать не менее 30% от максимального балла.',
      },
      {
        title: 'Окончательное зачисление',
        desc:
          'Результаты оформляются до 10 сентября. Целевые места — по трёхстороннему договору.',
      },
    ],

    docsTitle: 'Необходимые документы',
    docsSubtitle:
      'В имени файла указывается ФИО и тип документа. Например: Olimov_Olim_diplom.pdf',
    docs: [
      { title: 'Заявление на имя ректора', hint: 'По образцу, подписанный скан (PDF)' },
      { title: 'Диплом о высшем образовании', hint: 'Диплом + приложение, цветной скан (PDF)' },
      { title: 'Паспорт', hint: 'Страницы с фото и пропиской (PDF)' },
      { title: 'Медсправка 086-У', hint: 'Обе стороны цветным сканом (PDF)' },
      { title: 'Фото 3.5 × 4.5 см', hint: 'Цветное, JPG, 300 DPI' },
      { title: 'Документ на льготу', hint: 'При наличии — цветной скан (PDF)' },
    ],

    phonesTitle: 'Приёмная комиссия',
    phonesSubtitle:
      'По вопросам документов, сроков и мест проведения экзамена отвечает приёмная комиссия.',

    kurslarTitle: 'Повышение квалификации и курсы',
    kurslarIntro:
      'Для практикующих врачей — программы CME, клинические семинары и исследовательская практика в модульном или интенсивном формате.',
    categoriesTitle: 'Направления курсов',
    categories: [
      {
        title: 'Курсы повышения квалификации',
        desc: 'CME-программы 36–144 часа по клиническим специальностям.',
        meta: 'Сертификат',
      },
      {
        title: 'Профессиональная переподготовка',
        desc: 'Модульные курсы для второй специальности или узкого профиля.',
        meta: 'Платно-контрактно',
      },
      {
        title: 'Клинические семинары и вебинары',
        desc: 'Еженедельные практические семинары, видео-консилиумы и встречи с экспертами.',
        meta: '2 часа / неделя',
      },
      {
        title: 'GCP и исследовательская практика',
        desc: 'Программы ICH E6 R3, Clinical Research Coordinator и Study Nurse.',
        meta: '16–80 часов',
      },
    ],
    kurslarContactTitle: 'Консультация по курсам',
    kurslarContactDesc:
      'Учебный отдел поможет подобрать подходящую программу и объяснит порядок записи.',
    kurslarContactCta: 'Связаться',
  },

  en: {
    eyebrow: 'Education',
    title1: 'Residency and',
    titleEm: 'professional development',
    description:
      'The FJSTI clinical base offers three tracks for physicians: clinical residency, professional development courses, and research practice.',
    universityNote: 'The main degree programmes are at our university.',
    universityLink: 'Go to fjsti.uz →',

    ordinaturaTitle: 'Clinical residency',
    ordinaturaIntro:
      'Only physicians with a higher medical degree are admitted, on a competitive basis. A second specialty is on a paid contract basis.',
    eligibilityLabel: 'Who can apply',
    eligibility: [
      'Physicians with a higher medical degree',
      'Graduates of a previous residency or master’s (for a second specialty)',
      'Graduates from abroad — after credential nostrification',
    ],
    timelineLabel: 'Timeline',
    timelineValue: 'Applications open at least 30 days · Test in late August',

    processTitle: 'Admissions process — 3 steps',
    processSteps: [
      {
        title: 'Submit documents',
        desc:
          'Application to the rector, diploma, passport, medical certificate and photo are uploaded via the official platform.',
      },
      {
        title: 'Selection test',
        desc:
          'The test is held in late August. Candidates must score at least 30% of the top marks.',
      },
      {
        title: 'Final admission',
        desc:
          'Results are formalised by 10 September. Targeted seats come with a three-party contract.',
      },
    ],

    docsTitle: 'Required documents',
    docsSubtitle:
      'File names must include your name and document type. Example: Olimov_Olim_diplom.pdf',
    docs: [
      { title: 'Application to the rector', hint: 'Template-based, signed scan (PDF)' },
      { title: 'Higher-education diploma', hint: 'Diploma + attachment, colour scan (PDF)' },
      { title: 'Passport', hint: 'Photo and residence pages (PDF)' },
      { title: '086-U medical certificate', hint: 'Both sides, colour scan (PDF)' },
      { title: 'Photo 3.5 × 4.5 cm', hint: 'Colour, JPG, 300 DPI' },
      { title: 'Privilege document', hint: 'If applicable — colour scan (PDF)' },
    ],

    phonesTitle: 'Admissions commission',
    phonesSubtitle:
      'The admissions commission answers questions about documents, timelines and exam locations.',

    kurslarTitle: 'Courses and CME',
    kurslarIntro:
      'For practising physicians — CME programmes, clinical seminars and research practice in modular or intensive formats.',
    categoriesTitle: 'Course tracks',
    categories: [
      {
        title: 'CME courses',
        desc: '36–144-hour CME programmes across clinical specialties.',
        meta: 'Certificate',
      },
      {
        title: 'Retraining',
        desc: 'Modular courses for a second specialty or a niche focus.',
        meta: 'Paid contract',
      },
      {
        title: 'Clinical seminars & webinars',
        desc: 'Weekly practical seminars, video consilia and expert meetings.',
        meta: '2 hrs / week',
      },
      {
        title: 'GCP and research practice',
        desc: 'ICH E6 R3, Clinical Research Coordinator and Study Nurse programmes.',
        meta: '16–80 hrs',
      },
    ],
    kurslarContactTitle: 'Talk to us about courses',
    kurslarContactDesc:
      'The education office helps you pick the right programme and explains how to enrol.',
    kurslarContactCta: 'Contact us',
  },

  kaa: {
    eyebrow: 'Taʼlim',
    title1: 'Ordinatura hám',
    titleEm: 'malaka asıńlaw',
    description:
      'FJSTI klinik bazası shıpakerler ushın úsh baǵdardı bir jerde usınadı: klinik ordinatura, malaka asıńlaw kursları hám izertlew ámeliyatı.',
    universityNote: 'Tiykarǵı joqarı taʼlim — universitetimizde.',
    universityLink: 'fjsti.uz saytına ótiw →',

    ordinaturaTitle: 'Klinik ordinatura (rezidentura)',
    ordinaturaIntro:
      'Tek joqarı meditsinalıq maǵlumatlı shıpakerler tańlaw tiykarında qabıllanadı. Ekinshi qánigelik — tólemli shártnama tiykarında.',
    eligibilityLabel: 'Kim tapsıra aladı',
    eligibility: [
      'Joqarı meditsinalıq maǵlumatlı shıpakerler',
      'Aldın ordinatura yamasa magistratura bitirgenler (ekinshi qánigelik ushın)',
      'Shet elde oqıǵanlar — nostrifikatsiyadan keyin',
    ],
    timelineLabel: 'Múddet',
    timelineValue: 'Arza qabılı — kem degende 30 kún · Test — avgust ayı sońı',

    processTitle: 'Qabıllaw jarayanı — 3 qádem',
    processSteps: [
      {
        title: 'Hújjetlerdi tapsırıń',
        desc:
          'Rektor atına arza, diplom, pasport, meditsinalıq maʼlumatnama hám fotosúret rásmiy platforma arqalı jiberiledi.',
      },
      {
        title: 'Tańlaw sinaqı',
        desc:
          'Test avgust sońında ótkeriledi. Eń joqarı ballardıń kem degende 30 payızın jıynaw shárt.',
      },
      {
        title: 'Aqırǵı qabıllaw',
        desc:
          'Nátiyjeler 10-sentyabrǵa shekem rásmiylestiriledi. Maqsetli orınlar — úsh tárepli shártnama menen.',
      },
    ],

    docsTitle: 'Kerekli hújjetler',
    docsSubtitle:
      'Fayl atında familiya-atıńız hám hújjet túri kórsetiledi. Mısalı: Olimov_Olim_diplom.pdf',
    docs: [
      { title: 'Rektor atına arza', hint: 'Namunaga tiykarlanǵan, imzalanǵan skaner (PDF)' },
      { title: 'Joqarı taʼlim diplomı', hint: 'Diplom + qosımsha, reńli skaner (PDF)' },
      { title: 'Pasport', hint: 'Fotosúretli hám dizim betleri (PDF)' },
      { title: '086-U meditsinalıq maʼlumatnama', hint: 'Eki tárepin reńli skaner (PDF)' },
      { title: 'Fotosúret 3.5 × 4.5 sm', hint: 'Reńli, JPG, 300 DPI' },
      { title: 'Jeńillik hújjeti', hint: 'Bolsa — reńli skaner (PDF)' },
    ],

    phonesTitle: 'Qabıllaw komissiyası',
    phonesSubtitle:
      'Hújjetler, múddetler hám imtixan manziller boyınsha savallarǵa qabıllaw komissiyası juwap beredi.',

    kurslarTitle: 'Malaka asıńlaw hám kurslar',
    kurslarIntro:
      'Ámelde islewshi shıpakerler ushın CME baǵdarlamaları, klinik seminarlar hám izertlew ámeliyatı — baǵdarǵa qaray modul yamasa intensiv formatta.',
    categoriesTitle: 'Kurs baǵdarları',
    categories: [
      {
        title: 'Malaka asıńlaw kursları',
        desc: 'Klinik qánigelikler boyınsha 36–144 saatlıq CME baǵdarlamaları.',
        meta: 'Sertifikat',
      },
      {
        title: 'Qayta tayarlaw',
        desc: 'Ekinshi qánigelik yamasa tor baǵdarǵa ótiw ushın modul kursları.',
        meta: 'Tólemli shártnama',
      },
      {
        title: 'Klinik seminar hám vebinar',
        desc: 'Háptelik ámeliy seminar, video-konsilium hám ekspertler menen ushrasıw.',
        meta: '2 saat / hápte',
      },
      {
        title: 'GCP hám izertlew ámeliyatı',
        desc: 'ICH E6 R3, Clinical Research Coordinator hám Study Nurse baǵdarlamaları.',
        meta: '16–80 saat',
      },
    ],
    kurslarContactTitle: 'Kurs boyınsha másláhát',
    kurslarContactDesc:
      'Taʼlim bólimi sizge sáykes baǵdarlamanı tańlawǵa hám jazılıw tártibin túsindiriwge járdem beredi.',
    kurslarContactCta: 'Baylanıs',
  },
}
