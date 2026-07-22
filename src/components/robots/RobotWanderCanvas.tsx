import { Component, Suspense, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import GlbRobot from './GlbRobot'
import DisinfectionRobotM2 from './DisinfectionRobotM2'

type Props = {
  facing?: number
}

class RobotErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return <DisinfectionRobotM2 />
    }
    return this.props.children
  }
}

/** Compact canvas for the site-wide wandering robot. */
export default function RobotWanderCanvas({ facing = 1 }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.15, 3.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 2]} intensity={1.5} />
      <directionalLight position={[-2, 2, -1]} intensity={0.45} />
      <pointLight position={[1, 2, 2]} intensity={0.55} color="#7dd3fc" />
      <group scale={[facing >= 0 ? 1 : -1, 1, 1]}>
        <Suspense fallback={null}>
          <RobotErrorBoundary>
            <GlbRobot autoSpin={false} bob fit scale={1} />
          </RobotErrorBoundary>
        </Suspense>
      </group>
      <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={6} blur={2.4} far={3.5} />
    </Canvas>
  )
}
