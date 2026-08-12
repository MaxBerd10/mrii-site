import { useLanguage } from '../i18n/LanguageContext'
import Reveal from './ui/Reveal'
import { blurUp } from '../lib/animations'
import { media } from '../data/media'
import { ADMISSIONS_PHONES, EDUCATION_COPY } from '../data/educationCopy'
import '../styles/education-page.css'

const FJSTI_URL = 'https://fermi.uz'

export default function Education() {
  const { lang } = useLanguage()
  const copy = EDUCATION_COPY[lang]

  return (
    <section id="education" className="education-section education-section--page">
      <div className="container-main education-page">
        <Reveal variants={blurUp}>
          <header className="education-hero">
            <div className="education-hero__copy">
              <span className="education-hero__label">
                <span className="education-hero__dot" aria-hidden />
                {copy.eyebrow}
              </span>
              <h1 className="education-hero__title">
                {copy.title1} <em>{copy.titleEm}</em>
              </h1>
              <p className="education-hero__desc">{copy.description}</p>
              <p className="education-hero__uni">
                {copy.universityNote}{' '}
                <a href={FJSTI_URL} target="_blank" rel="noopener noreferrer">
                  {copy.universityLink}
                </a>
              </p>
            </div>
            <div className="education-hero__aside">
              <figure className="education-hero__photo">
                <img src={media.facilities.education} alt={copy.eyebrow} decoding="async" />
              </figure>
            </div>
          </header>
        </Reveal>

        <Reveal variants={blurUp}>
          <section id="ordinatura" className="edu-block" aria-labelledby="edu-ordinatura-title">
            <header className="edu-block__head">
              <span className="edu-block__eyebrow">01</span>
              <h2 id="edu-ordinatura-title">{copy.ordinaturaTitle}</h2>
              <p>{copy.ordinaturaIntro}</p>
            </header>

            <div className="edu-facts">
              <div className="edu-fact">
                <span className="edu-fact__label">{copy.eligibilityLabel}</span>
                <ul>
                  {copy.eligibility.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="edu-fact">
                <span className="edu-fact__label">{copy.timelineLabel}</span>
                <strong>{copy.timelineValue}</strong>
              </div>
            </div>

            <h3 className="edu-subhead">{copy.processTitle}</h3>
            <ol className="edu-steps">
              {copy.processSteps.map((step, i) => (
                <li key={step.title} className="edu-step">
                  <span className="edu-step__num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="edu-step__body">
                    <strong>{step.title}</strong>
                    <p>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h3 className="edu-subhead">{copy.docsTitle}</h3>
            <p className="edu-subhead__hint">{copy.docsSubtitle}</p>
            <ul className="edu-docs" aria-label={copy.docsTitle}>
              {copy.docs.map((doc, i) => (
                <li key={doc.title} className="edu-doc">
                  <span className="edu-doc__index">{String(i + 1).padStart(2, '0')}</span>
                  <strong>{doc.title}</strong>
                  <span>{doc.hint}</span>
                </li>
              ))}
            </ul>

            <h3 className="edu-subhead">{copy.phonesTitle}</h3>
            <p className="edu-subhead__hint">{copy.phonesSubtitle}</p>
            <ul className="edu-phones" aria-label={copy.phonesTitle}>
              {ADMISSIONS_PHONES.map((phone) => (
                <li key={phone.tel}>
                  <a href={`tel:${phone.tel}`} className="edu-phone">
                    <span className="edu-phone__dot" aria-hidden />
                    <strong>{phone.display}</strong>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal variants={blurUp}>
          <section id="kurslar" className="edu-block" aria-labelledby="edu-kurslar-title">
            <header className="edu-block__head">
              <span className="edu-block__eyebrow">02</span>
              <h2 id="edu-kurslar-title">{copy.kurslarTitle}</h2>
              <p>{copy.kurslarIntro}</p>
            </header>

            <h3 className="edu-subhead">{copy.categoriesTitle}</h3>
            <div className="edu-cats">
              {copy.categories.map((cat) => (
                <article key={cat.title} className="edu-cat">
                  <span className="edu-cat__meta">{cat.meta}</span>
                  <strong>{cat.title}</strong>
                  <p>{cat.desc}</p>
                </article>
              ))}
            </div>

            <a className="edu-cta" href="/contacts">
              <div className="edu-cta__copy">
                <strong>{copy.kurslarContactTitle}</strong>
                <span>{copy.kurslarContactDesc}</span>
              </div>
              <span className="edu-cta__btn">
                {copy.kurslarContactCta} <em aria-hidden>→</em>
              </span>
            </a>
          </section>
        </Reveal>
      </div>
    </section>
  )
}
