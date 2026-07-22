import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, Clone, useGLTF } from '@react-three/drei'
import type { Group } from 'three'

/** Meshopt web model (~2.5MB). */
export const DISINFECTION_ROBOT_GLB = '/models/disinfection-robot-m2.web.glb'

// Local Draco decoders (also helps if a Draco asset is used later)
useGLTF.setDecoderPath('/draco/')

type Props = {
  reducedMotion?: boolean
  autoSpin?: boolean
  scale?: number
  bob?: boolean
}

export default function GlbRobot({
  reducedMotion = false,
  autoSpin = true,
  scale = 1,
  bob = false,
}: Props) {
  const root = useRef<Group>(null)
  // useDraco=true, useMeshopt=true — required for .web.glb (EXT_meshopt_compression)
  const { scene } = useGLTF(DISINFECTION_ROBOT_GLB, true, true)

  useFrame((state, delta) => {
    if (!root.current || reducedMotion) return
    if (autoSpin) root.current.rotation.y += delta * 0.32
    if (bob) {
      root.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.05
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

useGLTF.preload(DISINFECTION_ROBOT_GLB, true, true)
