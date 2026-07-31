import { useState } from 'react'
import type { ContentLang } from '../../i18n/types'

type IconName = 'spark' | 'save' | 'check' | 'edit' | 'alert' | 'shield' | 'file' | 'download' | 'chevron'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    spark: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    save: <><path d="M5 3h11l3 3v15H5z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></>,
    check: <path d="m5 12 4.2 4.2L19 6.5" />,
    edit: <><path d="m4 20 4.2-1 10.7-10.7a2.2 2.2 0 0 0-3.1-3.1L5.1 15.8 4 20Z" /><path d="m13.8 6.2 4 4" /></>,
    alert: <><path d="M12 3 2.8 20h18.4L12 3Z" /><path d="M12 9v4.5M12 17h.01" /></>,
    shield: <><path d="M12 3 20 6v5.6c0 5-3.4 8.2-8 9.4-4.6-1.2-8-4.4-8-9.4V6l8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></>,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h4M9 13h6M9 17h4" /></>,
    download: <><path d="M12 3v11M8 10l4 4 4-4" /><path d="M5 20h14" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{paths[name]}</svg>
}

const questions = [
  'Ko‘krak og‘rig‘i jismoniy harakat bilan kuchayadimi?',
  'Og‘riq chap qo‘l, yelka yoki jag‘ sohasiga tarqaladimi?',
  'Hansirash, sovuq terlash yoki ko‘ngil aynishi kuzatildimi?',
]

const specialtyQuestions: Record<string, string[]> = {
  therapy: questions,
  cardiology: ['Ko‘krak og‘rig‘i jismoniy harakat bilan kuchayadimi?', 'Og‘riq chap qo‘l, yelka yoki jag‘ sohasiga tarqaladimi?'],
  pediatrics: ['Bolaning yoshi va taxminiy vazni qancha?', 'Isitma necha kundan beri davom etyapti?'],
  gynecology: ['Oxirgi hayz sanasi qachon bo‘lgan?', 'Homiladorlik ehtimoli yoki tasdiqlangan holat bormi?'],
  neurology: ['Belgilar to‘satdan boshlandimi?', 'Nutq, ko‘rish yoki qo‘l-oyoq kuchsizligi o‘zgarganmi?'],
  endocrinology: ['Chanqash yoki tez-tez siyish kuzatiladimi?', 'Qon glyukozasi oxirgi marta qachon tekshirilgan?'],
  surgery: ['Og‘riq qayerda va qachondan boshlandi?', 'Qusish, isitma yoki ich ketishi bormi?'],
  dermatology: ['Toshma qachondan paydo bo‘lgan?', 'Qichishish, og‘riq yoki yangi dori qabul qilish bo‘lganmi?'],
  ent: ['Alomatlar qachondan boshlandi?', 'Eshitish, nafas olish yoki yutishda qiyinchilik bormi?'],
  urology: ['Siyishda achishish yoki qon aralashishi bormi?', 'Bel yoki pastki qorin og‘rig‘i kuzatiladimi?'],
}

export default function PhysicianDemo({ lang }: { lang: ContentLang }) {
  const [question, setQuestion] = useState(0)
  const [specialty, setSpecialty] = useState('therapy')
  const [answer, setAnswer] = useState('Ha, zinalardan chiqqanda kuchayadi')
  const [tests, setTests] = useState(['EKG', 'Troponin I'])
  const [saved, setSaved] = useState(false)
  const [conclusion, setConclusion] = useState(false)
  const isUz = lang === 'uz'
  const activeQuestions = specialtyQuestions[specialty] ?? questions

  const toggleTest = (test: string) => setTests((current) => current.includes(test) ? current.filter((item) => item !== test) : [...current, test])
  const nextQuestion = () => { setQuestion((current) => (current + 1) % activeQuestions.length); setAnswer('') }

  return (
    <div className={`clinical-workspace${conclusion ? ' is-reviewing' : ' is-intake'}`}>
      <header className="clinical-topbar">
        <div className="clinical-topbar__identity">
          <div className="clinical-logo"><Icon name="spark" size={19} /></div>
          <div><span>AiShifokor</span><small>{isUz ? 'Yangi qabul · Klinika ish stoli' : 'Новый приём · Рабочее место клиники'}</small></div>
        </div>
        <label className="clinical-specialty"><span>Mutaxassislik</span><select value={specialty} onChange={(event) => { setSpecialty(event.target.value); setQuestion(0); setAnswer('') }}><option value="therapy">Terapiya / oilaviy shifokor</option><option value="cardiology">Kardiologiya</option><option value="pediatrics">Pediatriya</option><option value="gynecology">Ginekologiya</option><option value="neurology">Nevrologiya</option><option value="endocrinology">Endokrinologiya</option><option value="surgery">Jarrohlik</option><option value="dermatology">Dermatologiya</option><option value="ent">LOR</option><option value="urology">Urologiya</option></select></label>
        <div className="clinical-patient"><span className="clinical-patient__avatar">AK</span><div><strong>Azizbek Karimov</strong><span>{isUz ? '42 yosh, erkak' : '42 года, мужчина'}</span></div><span className="clinical-draft">Draft</span></div>
        <div className="clinical-topbar__actions">
          <button className="clinical-plain-btn" onClick={() => setSaved(true)}><Icon name="save" size={16} />{saved ? (isUz ? 'Saqlandi' : 'Сохранено') : (isUz ? 'Saqlash' : 'Сохранить')}</button>
          <button className="clinical-primary-btn" onClick={() => setConclusion(true)}>{isUz ? 'Qabulni yakunlash' : 'Завершить приём'} <Icon name="chevron" size={17} /></button>
        </div>
      </header>

      <div className="clinical-grid">
        <aside className="clinical-card clinical-profile">
          <div className="clinical-card__heading"><div><span className="clinical-kicker">01 · {isUz ? 'Bemor kartasi' : 'Карта пациента'}</span><h2>{isUz ? 'Bemor ma’lumotlari' : 'Данные пациента'}</h2></div><button aria-label="Tahrirlash"><Icon name="edit" size={16} /></button></div>
          <section className="clinical-complaint"><span>{isUz ? 'Asosiy shikoyat' : 'Основная жалоба'}</span><p>Ko‘krak qafasida siquvchi og‘riq, hansirash</p><small>3 kundan beri · jismoniy zo‘riqishda</small></section>
          <div className="clinical-detail-list">
            <div><span>{isUz ? 'Allergiyalar' : 'Аллергии'}</span><strong className="clinical-neutral">Aniqlanmagan</strong></div>
            <div><span>{isUz ? 'Surunkali kasalliklar' : 'Хронические заболевания'}</span><strong>Arterial gipertoniya</strong></div>
            <div><span>{isUz ? 'Qabul qilayotgan dorilar' : 'Текущие препараты'}</span><strong>Amlodipin 5 mg</strong></div>
          </div>
          <div className="clinical-vitals-title"><span>{isUz ? 'Vital ko‘rsatkichlar' : 'Показатели'}</span><button>{isUz ? 'Tahrirlash' : 'Изменить'}</button></div>
          <div className="clinical-vitals">
            <div className="is-alert"><b>160/100</b><span>{isUz ? 'AB, mm.sim.ust.' : 'АД, мм рт. ст.'}</span></div><div><b>92</b><span>{isUz ? 'Puls / min' : 'Пульс / мин'}</span></div><div><b>36.8°</b><span>{isUz ? 'Harorat' : 'Температура'}</span></div><div><b>97%</b><span>SpO₂</span></div>
          </div>
        </aside>

        <main className="clinical-card clinical-visit">
          <div className="clinical-card__heading"><div><span className="clinical-kicker">02 · {isUz ? 'Anamnez' : 'Анамнез'}</span><h2>{isUz ? 'Klinik qabul' : 'Клинический приём'}</h2></div><span className="clinical-step">{question + 1} / {activeQuestions.length}</span></div>
          <div className="clinical-progress"><i style={{ width: `${((question + 1) / activeQuestions.length) * 100}%` }} /></div>
          <div className="clinical-dialogue">
            <div className="clinical-ai-message"><span className="clinical-ai-mark"><Icon name="spark" size={14} /></span><div><small>AISHIFOKOR</small><p>{activeQuestions[question]}</p><em>{isUz ? 'Tanlangan yo‘nalish uchun aniqlashtiruvchi savol' : 'Вопрос для уточнения диагноза'}</em></div></div>
            <div className="clinical-options"><button className={answer.startsWith('Ha') ? 'is-selected' : ''} onClick={() => setAnswer('Ha, zinalardan chiqqanda kuchayadi')}>Ha</button><button className={answer === 'Yo‘q' ? 'is-selected' : ''} onClick={() => setAnswer('Yo‘q')}>Yo‘q</button><button className={answer === 'Aniq emas' ? 'is-selected' : ''} onClick={() => setAnswer('Aniq emas')}>Aniq emas</button></div>
            <label className="clinical-answer"><span>{isUz ? 'Shifokor javobi' : 'Ответ врача'}</span><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={isUz ? 'Javobni yoki klinik kuzatuvni yozing…' : 'Введите ответ или клиническое наблюдение…'} rows={3} /></label>
          </div>
          <button className="clinical-next-btn" onClick={nextQuestion}>{isUz ? 'Keyingi savol' : 'Следующий вопрос'} <Icon name="chevron" size={17} /></button>
          <div className="clinical-note"><Icon name="shield" size={15} /><p>{isUz ? 'AI tavsiyalari klinik qarorni almashtirmaydi. Yakuniy qaror shifokorda.' : 'Рекомендации ИИ не заменяют клиническое решение. Окончательное решение за врачом.'}</p></div>
        </main>

        <aside className="clinical-card clinical-summary">
          <div className="clinical-card__heading"><div><span className="clinical-kicker clinical-kicker--blue">03 · AI INSIGHT</span><h2>{isUz ? 'Klinik xulosa' : 'Клиническое заключение'}</h2></div><span className="clinical-live-dot">{isUz ? 'Yangilanmoqda' : 'Обновляется'}</span></div>
          <section className="clinical-redflag"><div><span><Icon name="alert" size={17} /> RED FLAG</span><strong>{isUz ? 'Yuqori arterial bosim qayd etildi' : 'Зафиксировано высокое АД'}</strong><p>{isUz ? '160/100 mm.sim.ust. Qayta o‘lchash va shoshilinch simptomlarni baholash kerak.' : '160/100 мм рт. ст. Повторите измерение и оцените неотложные симптомы.'}</p></div><button>Ko‘rish</button></section>
          <section className="clinical-summary-section"><div className="clinical-section-label"><span>{isUz ? 'Ehtimoliy tashxislar' : 'Вероятные диагнозы'}</span><button>{isUz ? 'Nega?' : 'Почему?'}</button></div><div className="clinical-diagnoses"><div><i className="is-high" /><p><strong>Stabil stenokardiya</strong><span>{isUz ? 'Yuqori ehtimol' : 'Высокая вероятность'}</span></p></div><div><i className="is-mid" /><p><strong>Arterial gipertoniya</strong><span>{isUz ? 'O‘rta ehtimol' : 'Средняя вероятность'}</span></p></div><div><i className="is-low" /><p><strong>Gastroezofageal refluks</strong><span>{isUz ? 'Past ehtimol' : 'Низкая вероятность'}</span></p></div></div></section>
          <section className="clinical-summary-section"><div className="clinical-section-label"><span>{isUz ? 'Tavsiya etilgan tekshiruvlar' : 'Рекомендованные исследования'}</span><button>{isUz ? 'Tanlash' : 'Выбрать'}</button></div><div className="clinical-tests">{['EKG', 'Troponin I', 'Umumiy qon tahlili', 'Glyukoza'].map((test) => <label key={test}><input type="checkbox" checked={tests.includes(test)} onChange={() => toggleTest(test)} /><span><Icon name="check" size={13} /></span>{test}</label>)}</div></section>
          <section className="clinical-safety"><Icon name="shield" size={18} /><div><strong>{isUz ? 'Dori xavfsizligi' : 'Безопасность препаратов'}</strong><p>{isUz ? 'Hozircha o‘zaro ta’sir yoki allergiya xavfi topilmadi.' : 'Взаимодействий или риска аллергии пока не выявлено.'}</p></div></section>
          <button className="clinical-conclusion-btn" onClick={() => setConclusion(true)}><Icon name="spark" size={17} />{conclusion ? (isUz ? 'Klinik xulosa tayyor' : 'Заключение готово') : (isUz ? 'To‘liq klinik xulosa yaratish' : 'Создать полное заключение')}</button>
        </aside>
      </div>

      <section className="clinical-documents">
        <div><span className="clinical-kicker">04 · {isUz ? 'Natija' : 'Результат'}</span><h2>{isUz ? 'Hujjatlar' : 'Документы'}</h2><p>{isUz ? 'Tasdiqlashdan oldin har bir draftni ko‘rib chiqing.' : 'Проверьте каждый черновик перед подтверждением.'}</p></div>
        <div className="clinical-document-row">{[isUz ? 'Qabul xulosasi' : 'Заключение приёма', isUz ? 'Retsept drafti' : 'Черновик рецепта', isUz ? 'Bemor uchun tavsiya' : 'Рекомендации пациенту'].map((item, index) => <article key={item}><span className={`clinical-doc-icon doc-${index}`}><Icon name="file" size={18} /></span><div><strong>{item}</strong><small>{conclusion ? (isUz ? 'Yangilandi · hozir' : 'Обновлено · сейчас') : (isUz ? 'Tayyorlanmoqda' : 'Подготавливается')}</small></div><div className="clinical-doc-actions"><button>{isUz ? 'Ko‘rish' : 'Открыть'}</button><button aria-label="Yuklab olish"><Icon name="download" size={15} /></button></div></article>)}</div>
      </section>
    </div>
  )
}
