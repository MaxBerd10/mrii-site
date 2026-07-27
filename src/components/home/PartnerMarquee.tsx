import { useLanguage } from '../../i18n/LanguageContext'

/** CH.09 — the research partners, on a continuous loop that pauses on hover. */
export default function PartnerMarquee() {
  const { t } = useLanguage()
  const copy = t.homeDark.partners
  const names = t.partners.partnerNames

  // Duplicated once so the -50% translate loops seamlessly.
  const track = [...names, ...names]

  return (
    <section className="hd-partners" aria-labelledby="hd-partners-title">
      <div className="container-main">
        <h2 id="hd-partners-title" className="hd-partners__title">
          {copy.title}
        </h2>
      </div>

      <div className="hd-marquee">
        <ul className="hd-marquee__track">
          {track.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="hd-marquee__item"
              aria-hidden={i >= names.length}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
