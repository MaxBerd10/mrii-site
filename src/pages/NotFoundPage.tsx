import { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import type { Lang } from '../i18n/types'

const COPY: Record<
  Lang,
  { code: string; title: string; text: string; home: string; clinic: string }
> = {
  uz: {
    code: '404',
    title: 'Sahifa topilmadi',
    text: 'Bu manzil mavjud emas yoki ko‘chirib yuborilgan. Bosh sahifaga qayting yoki klinikani ko‘ring.',
    home: 'Bosh sahifa',
    clinic: 'Klinika',
  },
  ru: {
    code: '404',
    title: 'Страница не найдена',
    text: 'Этот адрес не существует или был перенесён. Вернитесь на главную или откройте клинику.',
    home: 'Главная',
    clinic: 'Клиника',
  },
  en: {
    code: '404',
    title: 'Page not found',
    text: 'This address does not exist or has been moved. Go home or browse the clinic.',
    home: 'Home',
    clinic: 'Clinic',
  },
  kaa: {
    code: '404',
    title: 'Bet tabılmadı',
    text: 'Bul adres joq yamasa kóshirip jiberilgen. Bas betke qaytıń yamasa klinikani kóriń.',
    home: 'Bas bet',
    clinic: 'Klinika',
  },
}

export default function NotFoundPage() {
  const { lang, t: i18n } = useLanguage()
  const t = COPY[lang] ?? COPY.uz

  useEffect(() => {
    document.title = `${t.code} — ${t.title} | ${i18n.nav.brand}`
    window.scrollTo(0, 0)
  }, [t.code, t.title, i18n.nav.brand])

  return (
    <main className="not-found">
      <div className="not-found__glow" aria-hidden />
      <div className="container-main not-found__inner">
        <p className="not-found__code">{t.code}</p>
        <h1 className="not-found__title">{t.title}</h1>
        <p className="not-found__text">{t.text}</p>
        <div className="not-found__actions">
          <a href="/" className="hp-btn hp-btn--primary">
            {t.home}
          </a>
          <a href="/clinic" className="hp-btn hp-btn--ghost">
            {t.clinic}
          </a>
        </div>
      </div>
    </main>
  )
}
