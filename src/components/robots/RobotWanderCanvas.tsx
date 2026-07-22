import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import GlbRobot from './GlbRobot'

type Props = {
  facing?: number
}

/** Compact canvas for the site-wide wandering robot. */
export default function RobotWanderCanvas({ facing = 1 }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [1.6, 1.1, 2.2], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />
      <pointLight position={[-2, 1, 2]} intensity={0.4} color="#38bdf8" />
      <group scale={[facing >= 0 ? 1 : -1, 1, 1]}>
        <GlbRobot autoSpin={false} bob scale={1.15} />
      </group>
      <ContactShadows position={[0, -1.15, 0]} opacity={0.35} scale={5} blur={2.2} far={3} />
    </Canvas>
  )
}
