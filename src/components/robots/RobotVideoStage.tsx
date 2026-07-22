import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

type Props = {
  title: string
  hint: string
  src: string
}

export default function RobotVideoStage({ title, hint, src }: Props) {
  const reduce = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (reduce || failed) return
    const el = videoRef.current
    if (!el) return
    el.play().catch(() => setFailed(true))
  }, [reduce, failed, src])

  const showVideo = !reduce && !failed

  return (
    <div className="robot-stage robot-stage--video">
      <div className="robot-stage__meta">
        <p className="robot-stage__kicker">Keenon · Video</p>
        <h3 className="robot-stage__title">{title}</h3>
        <p className="robot-stage__hint">{hint}</p>
      </div>
      <div className="robot-stage__canvas robot-stage__video-wrap" role="img" aria-label={title}>
        {showVideo ? (
          <video
            ref={videoRef}
            className="robot-stage__video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <div className="robot-stage__video-fallback">
            <p>{title}</p>
          </div>
        )}
      </div>
    </div>
  )
}
