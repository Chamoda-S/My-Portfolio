"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Text, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

interface PlanetProps {
  id: string // Added ID to differentiate styles
  name: string
  position: [number, number, number]
  color: string
  size: number
  isHovered: boolean
  onHover: () => void
  onUnhover: () => void
  onClick: () => void
}

export function Planet({ id, name, position, color, size, isHovered, onHover, onUnhover, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
      // Gentle floating
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.2

      const targetScale = isHovered ? 1.1 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.003
      cloudsRef.current.rotation.z += 0.001
    }
    if (glowRef.current) {
      const glowScale = isHovered ? 1.4 : 1.2
      glowRef.current.scale.lerp(new THREE.Vector3(glowScale, glowScale, glowScale), 0.1)
      glowRef.current.rotation.z -= 0.01
    }
  })

  const getMaterial = () => {
    switch (id) {
      case "about": // Earth-like
        return <meshStandardMaterial color={color} roughness={0.8} metalness={0.2} />
      case "projects": // Gas Giant (distorted)
        return <MeshDistortMaterial color={color} speed={2} distort={0.4} radius={1} roughness={0.4} />
      case "skills": // Tech World (Wireframe/Metallic)
        return <meshStandardMaterial color={color} roughness={0.2} metalness={0.9} wireframe={isHovered} />
      case "contact": // Ice World
        return <meshPhysicalMaterial color={color} roughness={0.1} metalness={0.1} transmission={0.2} thickness={2} />
      default:
        return <meshStandardMaterial color={color} />
    }
  }

  return (
    <group position={position}>
      {/* Planet Label - Always visible but bolder on hover */}
      <Text
        position={[0, size + 1.5, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
        scale={isHovered ? 1.2 : 1}
      >
        {name.toUpperCase()}
      </Text>

      {/* Outer Glow / Atmosphere */}
      <Sphere ref={glowRef} args={[size * 1.1, 32, 32]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Cloud Layer */}
      <Sphere ref={cloudsRef} args={[size * 1.05, 32, 32]}>
        <meshStandardMaterial color="white" transparent opacity={0.3} depthWrite={false} side={THREE.DoubleSide} />
      </Sphere>

      {/* Main Planet Body */}
      <Sphere ref={meshRef} args={[size, 64, 64]} onPointerOver={onHover} onPointerOut={onUnhover} onClick={onClick}>
        {getMaterial()}
      </Sphere>

      {/* Rings for specific planets */}
      {(id === "projects" || isHovered) && (
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[size * 1.8, 0.1, 16, 100]} />
          <meshStandardMaterial color={color} transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  )
}
