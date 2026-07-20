import { useLanguage } from '../i18n/LanguageContext'
import { useCms } from '../cms/CmsContext'

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : 'tel:+998712345678'
}

export default function TopBar() {
  const { t } = useLanguage()
  const { home } = useCms()
  const badge = home?.settings?.badge || t.topBar.badge
  const hours = home?.settings?.hours || t.topBar.hours
  const phone = home?.settings?.phone || t.topBar.phone

  return (
    <div className="top-bar">
      <div className="container-main top-bar__inner">
        <div className="top-bar__left">
          <span className="top-bar__live">
            <span className="top-bar__live-dot" aria-hidden />
            {badge}
          </span>
          <span className="top-bar__sep" aria-hidden>·</span>
          <span className="top-bar__hours">{hours}</span>
        </div>
        <div className="top-bar__right">
          <a href={telHref(phone)} className="top-bar__phone">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2.5 1.5h2l1 3-1.5 1a7 7 0 003.5 3.5L8.5 7.5l3 1v2a1 1 0 01-1.1 1A10.5 10.5 0 011.5 2.6a1 1 0 011-.9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            {phone}
          </a>
        </div>
      </div>
    </div>
  )
}
