import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, Clone, useGLTF } from '@react-three/drei'
import type { Group } from 'three'

/** Draco-compressed web model (~3MB). */
export const DISINFECTION_ROBOT_GLB = '/models/disinfection-robot-m2.min.glb'

type Props = {
  reducedMotion?: boolean
  /** Continuous Y spin (AI stage). Companion turns via parent instead. */
  autoSpin?: boolean
  scale?: number
  bob?: boolean
}

export default function GlbRobot({
  reducedMotion = false,
  autoSpin = true,
  scale = 1.35,
  bob = false,
}: Props) {
  const root = useRef<Group>(null)
  const { scene } = useGLTF(DISINFECTION_ROBOT_GLB, true)

  useFrame((state, delta) => {
    if (!root.current || reducedMotion) return
    if (autoSpin) root.current.rotation.y += delta * 0.32
    if (bob) {
      root.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.04
    }
  })

  return (
    <group ref={root} position={[0, autoSpin ? -1.05 : 0, 0]}>
      <Center>
        <Clone object={scene} scale={scale} />
      </Center>
    </group>
  )
}

useGLTF.preload(DISINFECTION_ROBOT_GLB, true)
