import { Card } from '@/components/ui/card'
import type { CSSProperties } from 'react'

type Props = {
  productName: string
  productTag: string
  productDescription: string
  metric: string
  metricLabel: string
  demoLabel: string
  detailLabel: string
  demoHref: string
  detailHref: string
  imageSrc: string
  accent: string
}

/** A calm, product-led hero: the physician's work remains the visual centre. */
export function ClinicalAiHero({
  productName,
  productTag,
  productDescription,
  metric,
  metricLabel,
  demoLabel,
  detailLabel,
  demoHref,
  detailHref,
  imageSrc,
  accent,
}: Props) {
  return (
    <Card className="clinical-ai-hero" style={{ '--ai-accent': accent } as CSSProperties}>
      <div className="clinical-ai-hero__copy">
        <span className="clinical-ai-hero__tag"><i aria-hidden />{productTag}</span>
        <h1>{productName}</h1>
        <p>{productDescription}</p>
        <div className="clinical-ai-hero__actions">
          <a href={demoHref} className="clinical-ai-hero__primary-action">
            {demoLabel}
          </a>
          <a href={detailHref} className="clinical-ai-hero__secondary-action">{detailLabel}</a>
        </div>
      </div>

      <div className="clinical-ai-hero__visual">
        <img src={imageSrc} alt={productName} fetchPriority="high" decoding="async" />
        <div className="clinical-ai-hero__metric" aria-label={`${metric} ${metricLabel}`}>
          <strong>{metric}</strong>
          <span>{metricLabel}</span>
        </div>
      </div>
    </Card>
  )
}
