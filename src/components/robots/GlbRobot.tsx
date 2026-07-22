import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bounds, Center, Clone, useGLTF } from '@react-three/drei'
import type { Group } from 'three'

/**
 * Meshopt-compressed GLB (~2.5MB) — more reliable than Draco in small canvases.
 * Keep .min.glb (Draco) as alternate for the large AI stage if needed.
 */
export const DISINFECTION_ROBOT_GLB = '/models/disinfection-robot-m2.web.glb'

type Props = {
  reducedMotion?: boolean
  autoSpin?: boolean
  scale?: number
  bob?: boolean
  /** Auto-fit camera framing (companion bubble). */
  fit?: boolean
}

export default function GlbRobot({
  reducedMotion = false,
  autoSpin = true,
  scale = 1,
  bob = false,
  fit = false,
}: Props) {
  const root = useRef<Group>(null)
  const { scene } = useGLTF(DISINFECTION_ROBOT_GLB)

  useFrame((state, delta) => {
    if (!root.current || reducedMotion) return
    if (autoSpin) root.current.rotation.y += delta * 0.32
    if (bob) {
      root.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.05
    }
  })

  const body = (
    <Center>
      <Clone object={scene} scale={scale} />
    </Center>
  )

  return (
    <group ref={root}>
      {fit ? (
        <Bounds fit observe margin={1.25}>
          {body}
        </Bounds>
      ) : (
        <group position={[0, autoSpin ? -1.05 : 0, 0]}>{body}</group>
      )}
    </group>
  )
}

useGLTF.preload(DISINFECTION_ROBOT_GLB)
