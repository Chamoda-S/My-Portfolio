"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useScroll } from "@react-three/drei"
import * as THREE from "three"

export function Spaceship() {
  const ship = useRef<THREE.Group>(null)
  const scroll = useScroll()

  useFrame((state, delta) => {
    if (!ship.current) return

    ship.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime) * 0.1
    const targetRotationZ = -state.mouse.x * 0.8
    const targetRotationX = -state.mouse.y * 0.3

    ship.current.rotation.z = THREE.MathUtils.lerp(ship.current.rotation.z, targetRotationZ, 0.05)
    ship.current.rotation.x = THREE.MathUtils.lerp(ship.current.rotation.x, targetRotationX, 0.05)
  })

  return (
    <group ref={ship} position={[0, -2, -4]} scale={[0.4, 0.4, 0.4]}>
      {/* Main Hull - Smooth White Capsule */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[1, 3, 8, 16]} />
        <meshPhysicalMaterial color="#ffffff" metalness={0.8} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>

      {/* Cockpit Glass - Tinted Blue */}
      <mesh position={[0, 0.8, 0.6]} rotation={[0.4, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshPhysicalMaterial color="#3b82f6" metalness={0.9} roughness={0.0} transmission={0.5} thickness={0.5} />
      </mesh>

      {/* Wings - Swept Back */}
      <group position={[0, -0.5, 0]}>
        <mesh position={[1.5, 0, 0.5]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[2.5, 0.2, 1.5]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[-1.5, 0, 0.5]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[2.5, 0.2, 1.5]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.4} />
        </mesh>

        {/* Wing Tips */}
        <mesh position={[2.5, 0.5, 0.5]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.2, 1.5, 0.8]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-2.5, 0.5, 0.5]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.2, 1.5, 0.8]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Engines */}
      <group position={[0, -1.5, 0]}>
        {/* Main Thruster */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.5, 1, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Engine Glow */}
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>
        <pointLight position={[0, -1, 0]} color="#60a5fa" intensity={5} distance={10} decay={2} />

        {/* Side Thrusters */}
        <mesh position={[0.8, 0.2, 0]}>
          <cylinderGeometry args={[0.3, 0.2, 0.8, 16]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[-0.8, 0.2, 0]}>
          <cylinderGeometry args={[0.3, 0.2, 0.8, 16]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>
    </group>
  )
}
