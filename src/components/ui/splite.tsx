import { Suspense, lazy, useCallback } from 'react'
import type { Application } from '@splinetool/runtime'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

/** Lazy Spline — built-in orbit; zoom only (never move child meshes) */
export function SplineScene({ scene, className }: SplineSceneProps) {
  const onLoad = useCallback((spline: Application) => {
    const apply = () => spline.setZoom(1.55)
    apply()
    requestAnimationFrame(apply)
    setTimeout(apply, 400)
  }, [])

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="spline-loader" aria-hidden />
        </div>
      }
    >
      <Spline scene={scene} className={className} onLoad={onLoad} />
    </Suspense>
  )
}
