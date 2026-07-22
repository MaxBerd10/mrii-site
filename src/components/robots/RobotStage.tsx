import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import DisinfectionRobotM2 from './DisinfectionRobotM2'

type Props = {
  title: string
  hint: string
}

function StageInner({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={['#07111f']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} castShadow />
      <pointLight position={[-3, 2, -2]} intensity={0.65} color="#38bdf8" />
      <pointLight position={[2, 1.5, 3]} intensity={0.45} color="#a78bfa" />
      <hemisphereLight args={['#e0f2fe', '#0f172a', 0.35]} />
      <Suspense fallback={null}>
        <DisinfectionRobotM2 reducedMotion={reducedMotion} />
        <ContactShadows position={[0, -1.05, 0]} opacity={0.45} scale={6} blur={2.4} far={3} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.85}
        minDistance={2.4}
        maxDistance={4.2}
        autoRotate={false}
        target={[0, 0.15, 0]}
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
        <p className="robot-stage__kicker">3D preview</p>
        <h3 className="robot-stage__title">{title}</h3>
        <p className="robot-stage__hint">{hint}</p>
      </div>
      <div className="robot-stage__canvas" role="img" aria-label={title}>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [2.2, 1.4, 2.8], fov: 38 }}
          gl={{ antialias: true, alpha: false }}
        >
          <StageInner reducedMotion={reducedMotion} />
        </Canvas>
      </div>
    </div>
  )
}
