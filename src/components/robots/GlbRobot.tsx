import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, Clone, useGLTF } from '@react-three/drei'
import type { Group } from 'three'

/** Draco-compressed web model (~3MB). */
export const DISINFECTION_ROBOT_GLB = '/models/disinfection-robot-m2.min.glb'

type Props = {
  reducedMotion?: boolean
}

export default function GlbRobot({ reducedMotion = false }: Props) {
  const root = useRef<Group>(null)
  const { scene } = useGLTF(DISINFECTION_ROBOT_GLB, true)

  useFrame((_, delta) => {
    if (!root.current || reducedMotion) return
    root.current.rotation.y += delta * 0.32
  })

  return (
    <group ref={root} position={[0, -1.05, 0]}>
      <Center>
        <Clone object={scene} scale={1.35} />
      </Center>
    </group>
  )
}

useGLTF.preload(DISINFECTION_ROBOT_GLB, true)
