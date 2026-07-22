import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import GlbRobot from './GlbRobot'

type Props = {
  facing?: number
}

/** Companion canvas — real uploaded GLB (same model as AI stage). */
export default function RobotWanderCanvas({ facing = 1 }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [1.15, 1.05, 2.35], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
    >
      <ambientLight intensity={1.05} />
      <directionalLight position={[3, 5, 2]} intensity={1.65} />
      <pointLight position={[-2, 2, 2]} intensity={0.6} color="#7dd3fc" />
      <Suspense fallback={null}>
        <group scale={[facing >= 0 ? 1 : -1, 1, 1]} position={[0, -0.05, 0]}>
          <GlbRobot autoSpin={false} bob scale={1.05} />
        </group>
      </Suspense>
    </Canvas>
  )
}
