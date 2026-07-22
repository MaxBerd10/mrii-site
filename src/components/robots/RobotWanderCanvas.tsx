import { Canvas } from '@react-three/fiber'
import DisinfectionRobotM2 from './DisinfectionRobotM2'

type Props = {
  facing?: number
}

/**
 * Companion uses the stylized procedural robot so it always paints
 * (GLB/Meshopt can hang Suspense in a tiny overlay canvas).
 * Full GLB remains in the AI section RobotStage.
 */
export default function RobotWanderCanvas({ facing = 1 }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [1.4, 1.2, 2.6], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
    >
      <ambientLight intensity={0.95} />
      <directionalLight position={[3, 5, 2]} intensity={1.55} />
      <pointLight position={[-2, 2, 2]} intensity={0.55} color="#7dd3fc" />
      <group scale={[facing >= 0 ? 1 : -1, 1, 1]} position={[0, -0.15, 0]}>
        <DisinfectionRobotM2 />
      </group>
    </Canvas>
  )
}
