"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function CometTrail() {
  const cometRef = useRef<THREE.Mesh>(null)
  const trailRef = useRef<THREE.Line>(null)

  useFrame((state) => {
    if (cometRef.current) {
      const t = state.clock.elapsedTime * 0.3
      cometRef.current.position.x = Math.cos(t) * 8
      cometRef.current.position.y = Math.sin(t * 0.7) * 3
      cometRef.current.position.z = Math.sin(t) * 5 - 5
    }

    if (trailRef.current && cometRef.current) {
      const positions = trailRef.current.geometry.attributes.position.array as Float32Array

      // Shift trail positions
      for (let i = positions.length - 3; i >= 3; i -= 3) {
        positions[i] = positions[i - 3]
        positions[i + 1] = positions[i - 2]
        positions[i + 2] = positions[i - 1]
      }

      // Update head position
      positions[0] = cometRef.current.position.x
      positions[1] = cometRef.current.position.y
      positions[2] = cometRef.current.position.z

      trailRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const trailPoints = new Float32Array(150) // 50 points * 3 coordinates
  const trailGeometry = new THREE.BufferGeometry()
  trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPoints, 3))

  return (
    <group>
      {/* Comet head */}
      <mesh ref={cometRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Comet trail */}
      <line ref={trailRef} geometry={trailGeometry}>
        <lineBasicMaterial color="#6366f1" transparent opacity={0.6} linewidth={2} />
      </line>
    </group>
  )
}
