import { AISHIFOKOR_URL } from '../data/aiPlatform'
import '../styles/doctor-portal.css'

/** Legacy /doctor/login route — live clinical AI now lives on AiShifokor. */
export default function DoctorPortalPage() {
  return (
    <main className="doctor-portal">
      <section className="doctor-portal__panel" aria-labelledby="doctor-portal-title">
        <a className="doctor-portal__brand" href="/ai/doctor-assistant"><span>✦</span> AiShifokor</a>
        <div className="doctor-portal__content">
          <p className="doctor-portal__eyebrow">AiShifokor PLATFORMASI</p>
          <h1 id="doctor-portal-title">Klinik AI ish joyi aishifokor.uz da.</h1>
          <p className="doctor-portal__lead">
            AiShifokor — Radiology, Ultrasound va boshqa AI modullar yagona platformada ishlaydi.
          </p>
          <a
            className="doctor-portal__cta"
            href={AISHIFOKOR_URL}
          >
            AiShifokorga kirish →
          </a>
          <p className="doctor-portal__help">Brauzerning «Orqaga» tugmasi bilan klinik saytga qaytasiz. Kirish uchun klinikangiz administratori bergan akkauntdan foydalaning.</p>
        </div>
        <a className="doctor-portal__back" href="/ai/doctor-assistant">← Mahsulot sahifasiga qaytish</a>
      </section>
      <aside className="doctor-portal__aside" aria-hidden="true">
        <div />
      </aside>
    </main>
  )
}
