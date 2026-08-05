import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { daCopy } from '../data/doctorAssistantDemo'
import SectionBackLink from '../components/ui/SectionBackLink'
import '../styles/doctor-assistant.css'

export default function DoctorAssistantPage() {
  const { contentLang } = useLanguage()
  const c = daCopy[contentLang]
  return (
    <main className="da-page">
      <section className="da-workspace">
        <div className="container-main">
          <SectionBackLink href="/ai" className="ai-product__back da-hero__back">← {c.backAi}</SectionBackLink>
          <PhysicianProductOverview />
        </div>
      </section>

    </main>
  )
}

function PhysicianProductOverview() {
  return (
    <div className="doctor-showcase">
      <section className="doctor-showcase__hero">
        <div className="doctor-showcase__copy">
          <p>AISHIFOKOR</p>
          <h1>Ai<em>Shifokor</em></h1>
          <p className="doctor-showcase__lead">Shifokor qabulidagi ishonchli yordamchi. Anamnezni tartiblaydi, klinik xavfni ko’rsatadi va hujjatlarni tayyorlashga yordam beradi.</p>
          <div><a className="doctor-showcase__cta" href="https://aishifokor.uz/">AiShifokorga kirish →</a><span>Radiology va Ultrasound ham shu platformada · Orqaga tugmasi bilan qayting</span></div>
        </div>
        <ProductWalkthrough />
      </section>

      <section className="doctor-showcase__explain">
        <header><p>QANDAY ISHLAYDI</p><h2>AiShifokor qabuldagi uch muhim ishni yengillashtiradi.</h2><span>Quyidagi videolar mahsulotdan foydalanish jarayonini ko’rsatadi.</span></header>
        <div className="doctor-showcase__videos">
          <VideoSlot number="01" title="Anamnezni tartiblaydi" text="Shikoyatga qarab muhim klinik savollarni taklif qiladi." duration="01:10" />
          <VideoSlot number="02" title="Xavfni ko’rsatadi" text="Red flag, dori xavfsizligi va yetishmayotgan ma’lumotlarni ajratadi." duration="00:55" />
          <VideoSlot number="03" title="Hujjatlarni tayyorlaydi" text="Qabul xulosasi va bemorga tavsiyani shifokor ko’rib chiqishi uchun draft qiladi." duration="01:05" />
        </div>
      </section>
    </div>
  )
}

function VideoSlot({ number, title, text, duration }: { number: string; title: string; text: string; duration: string }) {
  return <article className={`doctor-video-slot doctor-video-slot--${number}`}><div><span>{number}</span><button type="button" aria-label={`${title} videosini ko’rish`}>▶</button><small>{duration}</small></div><h3>{title}</h3><p>{text}</p></article>
}

const walkthroughFrames = [
  { step: '01', tag: 'ANAMNEZ', title: 'Shikoyat kiritiladi', detail: 'Ko’krak og’rig’i va hansirash', caption: 'AI kerakli klinik savollarni ketma-ket taklif qiladi.' },
  { step: '02', tag: 'XAVF NAZORATI', title: 'Muhim signal ajratiladi', detail: '160/100 · Shoshilinch baholash zarur', caption: 'Red flag va uning sababi qabul paytida ko’rinadi.' },
  { step: '03', tag: 'SHIFOKOR NAZORATI', title: 'Qaror sizda qoladi', detail: 'Xulosa ko’rib chiqish uchun tayyor', caption: 'AI draft yaratadi. Shifokor tekshiradi va tasdiqlaydi.' },
]

function ProductWalkthrough() {
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setFrame((current) => (current + 1) % walkthroughFrames.length), 2600)
    return () => window.clearInterval(timer)
  }, [playing])

  const current = walkthroughFrames[frame]

  return (
    <section className="da-intro__video" aria-label="AiShifokor qanday ishlashini ko’rsatuvchi video preview">
      <div className="da-intro__video-grid" />
      <div className="da-intro__video-ui">
        <div className="da-intro__video-bar"><span>AISHIFOKOR · QANDAY ISHLAYDI</span><b>01:30</b></div>
        <div className="da-walkthrough" data-frame={frame}>
          <div className="da-walkthrough__top"><span>{current.step}</span><i>{current.tag}</i></div>
          <div className="da-walkthrough__patient"><b>AK</b><div><strong>Azizbek Karimov</strong><small>42 yosh · yangi qabul</small></div></div>
          <div className={`da-walkthrough__event${frame === 1 ? ' is-urgent' : ''}`}><span>{frame === 0 ? 'Shikoyat' : frame === 1 ? 'AI ogohlantirishi' : 'Qabul xulosasi'}</span><strong>{current.detail}</strong></div>
          <div className="da-walkthrough__action"><span className="da-walkthrough__spark">✦</span><div><small>AISHIFOKOR</small><p>{current.title}</p></div></div>
          <p className="da-walkthrough__caption">{current.caption}</p>
        </div>
        <div className="da-intro__video-bottom">
          <button type="button" className="da-walkthrough__play" onClick={() => setPlaying((current) => !current)} aria-pressed={playing}>{playing ? 'Ⅱ' : '▶'} <span>{playing ? 'Pauza' : 'Ko’rish'}</span></button>
          <div className="da-walkthrough__dots" aria-label={`${frame + 1}-qadam`}><i className={frame === 0 ? 'is-active' : ''} /><i className={frame === 1 ? 'is-active' : ''} /><i className={frame === 2 ? 'is-active' : ''} /></div>
        </div>
      </div>
      <p className="da-intro__video-note">Interaktiv product preview · haqiqiy video keyingi bosqichda shu ssenariy asosida qo’shiladi</p>
    </section>
  )
}
