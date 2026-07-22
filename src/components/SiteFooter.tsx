import { useLanguage } from '../i18n/LanguageContext'

/** Compact footer on non-contact pages. */
export default function SiteFooter() {
  const { t } = useLanguage()
  return (
    <footer className="site-footer">
      <div className="container-main site-footer__inner">
        <p className="site-footer__copy">{t.footer.copyright}</p>
        <a href="/contacts" className="site-footer__link">{t.nav.contacts}</a>
      </div>
    </footer>
  )
}
