import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { MathUtils } from 'three'

type Props = {
  reducedMotion?: boolean
}

/** Stylized Keenon-like disinfection robot (not an official CAD model). */
export default function DisinfectionRobotM2({ reducedMotion = false }: Props) {
  const root = useRef<Group>(null)
  const ring = useRef<Mesh>(null)
  const tubes = useRef<Mesh[]>([])

  const tubePositions = useMemo(() => {
    const left = [-0.22, -0.12, -0.02].map((x, i) => [x, 0.55, -0.08 + i * 0.02] as const)
    const right = [0.02, 0.12, 0.22].map((x, i) => [x, 0.55, -0.08 + i * 0.02] as const)
    return [...left, ...right]
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (root.current && !reducedMotion) {
      root.current.rotation.y = t * 0.45
      root.current.position.y = Math.sin(t * 1.6) * 0.04
    }
    if (ring.current) {
      const mat = ring.current.material as { emissiveIntensity?: number }
      if (mat.emissiveIntensity != null) {
        mat.emissiveIntensity = 1.2 + Math.sin(t * 2.4) * 0.55
      }
    }
    tubes.current.forEach((mesh, i) => {
      if (!mesh) return
      const mat = mesh.material as { emissiveIntensity?: number }
      if (mat.emissiveIntensity != null) {
        mat.emissiveIntensity = 1.4 + Math.sin(t * 3 + i * 0.5) * 0.7
      }
    })
  })

  return (
    <group ref={root} position={[0, -1.05, 0]} scale={1.15}>
      {/* Floor shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.55, 48]} />
        <meshStandardMaterial color="#0b1220" transparent opacity={0.35} />
      </mesh>

      {/* Bumper / base */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.46, 0.22, 48]} />
        <meshStandardMaterial color="#4b5563" roughness={0.55} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.03, 0.38]}>
        <boxGeometry args={[0.12, 0.04, 0.02]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.03, -0.38]}>
        <boxGeometry args={[0.12, 0.04, 0.02]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} />
      </mesh>

      {/* Blue LED ring */}
      <mesh ref={ring} position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.035, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={1.4}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* White base collar + sensors */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.4, 0.16, 48]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.35} metalness={0.05} />
      </mesh>
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, 0.34, 0.36]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.6} />
        </mesh>
      ))}

      {/* Mid gray cone with brand plate */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.34, 0.28, 48]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.55, 0.3]}>
        <circleGeometry args={[0.07, 6]} />
        <meshStandardMaterial color="#2563eb" emissive="#1d4ed8" emissiveIntensity={0.8} />
      </mesh>

      {/* UV chamber shell */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.28, 0.55, 48]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Open slots (darker insets) */}
      <mesh position={[-0.12, 0.95, 0.18]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.16, 0.48, 0.08]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.95, 0.18]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.16, 0.48, 0.08]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* UV tubes */}
      {tubePositions.map((pos, i) => (
        <mesh
          key={i}
          position={[pos[0], pos[1], pos[2]]}
          ref={(el) => {
            if (el) tubes.current[i] = el
          }}
        >
          <cylinderGeometry args={[0.028, 0.028, 0.42, 16]} />
          <meshStandardMaterial
            color="#e0f2fe"
            emissive="#67e8f9"
            emissiveIntensity={1.6}
            transparent
            opacity={0.92}
            roughness={0.15}
          />
        </mesh>
      ))}

      {/* Head / screen */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.26, 0.28, 48]} />
        <meshStandardMaterial color="#ffffff" roughness={0.28} />
      </mesh>
      <mesh position={[0, 1.38, 0.22]} rotation={[MathUtils.degToRad(-12), 0, 0]}>
        <boxGeometry args={[0.22, 0.14, 0.02]} />
        <meshStandardMaterial color="#0b1220" emissive="#1e293b" emissiveIntensity={0.4} />
      </mesh>
      {[-0.06, 0, 0.06].map((x) => (
        <mesh key={x} position={[x, 1.26, 0.25]}>
          <sphereGeometry args={[0.015, 12, 12]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      ))}

      {/* Top cap */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.27, 0.24, 0.1, 48]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.32} />
      </mesh>
    </group>
  )
}
