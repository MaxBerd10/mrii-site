import { SplineScene } from '@/components/ui/splite'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'

type Props = {
  title: string
  description: string
  kicker?: string
  scene?: string
}

const DEFAULT_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

/** Left copy + large right-side robot */
export function SplineSceneBasic({
  title,
  description,
  kicker,
  scene = DEFAULT_SCENE,
}: Props) {
  return (
    <Card className="spline-ai-stage relative h-[480px] w-full overflow-hidden border-0 bg-black/[0.96]">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" size={320} />

      <div className="spline-ai-stage__layout">
        <div className="spline-ai-stage__copy">
          {kicker ? (
            <span className="spline-ai-badge">
              <span className="spline-ai-badge__dot" aria-hidden />
              {kicker}
            </span>
          ) : null}
          <h1 className="spline-ai-stage__title">{title}</h1>
          <p className="spline-ai-stage__hint">{description}</p>
        </div>

        <div className="spline-ai-stage__scene">
          <SplineScene scene={scene} className="h-full w-full" />
        </div>
      </div>
    </Card>
  )
}
