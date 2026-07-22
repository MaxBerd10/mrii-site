import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import GlbRobot from './GlbRobot'

type Props = {
  title: string
  hint: string
}

function StageInner({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={['#07111f']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 7, 4]} intensity={1.55} castShadow />
      <directionalLight position={[-3, 3, -2]} intensity={0.45} />
      <pointLight position={[2, 2, 3]} intensity={0.55} color="#38bdf8" />
      <hemisphereLight args={['#e0f2fe', '#0f172a', 0.4]} />
      <Suspense fallback={null}>
        <GlbRobot reducedMotion={reducedMotion} autoSpin={!reducedMotion} scale={1.35} />
        <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={8} blur={2.6} far={4} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.75}
        minDistance={1.8}
        maxDistance={5}
        autoRotate={false}
        target={[0, 0.2, 0]}
      />
    </>
  )
}

export default function RobotStage({ title, hint }: Props) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return (
    <div className="robot-stage">
      <div className="robot-stage__meta">
        <p className="robot-stage__kicker">3D GLB</p>
        <h3 className="robot-stage__title">{title}</h3>
        <p className="robot-stage__hint">{hint}</p>
      </div>
      <div className="robot-stage__canvas" role="img" aria-label={title}>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [2.4, 1.5, 3.1], fov: 36 }}
          gl={{ antialias: true, alpha: false }}
        >
          <StageInner reducedMotion={reducedMotion} />
        </Canvas>
      </div>
    </div>
  )
}
