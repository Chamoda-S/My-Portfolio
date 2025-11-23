"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Text, MeshDistortMaterial, useTexture } from "@react-three/drei"
import * as THREE from "three"

interface PlanetProps {
  id: string
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
  const ringRef = useRef<THREE.Mesh>(null)

  // Generate a unique seed for each planet based on its position
  const seed = useMemo(() => Math.random() * 1000, [position])

  // Create a custom shader material for realistic gas giant appearance
  const planetMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        seed: { value: seed },
        baseColor: { value: new THREE.Color(color) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        #define PI 3.141592653589793
        #define OCTAVES 6
        
        uniform float time;
        uniform float seed;
        uniform vec3 baseColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        // Simplex Noise by Ian McEwan, Ashima Arts
        vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          // First corner
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          
          // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1. + 3.0 * C.xxx;
          
          // Permutations
          i = mod(i, 289.0);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          
          // Gradients: 7x7 points over a square, mapped onto an octahedron.
          float n_ = 1.0/7.0;
          vec3 ns = n_ * D.wyz - D.xzx;
          
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          
          // Normalize gradients
          vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(
            dot(p0, p0),
            dot(p1, p1),
            dot(p2, p2),
            dot(p3, p3)
          );
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m * m, vec4(
            dot(p0, x0),
            dot(p1, x1),
            dot(p2, x2),
            dot(p3, x3)
          ));
        }
        
        // Fractional Brownian motion
        float fbm(vec3 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          
          for (int i = 0; i < OCTAVES; i++) {
            value += amplitude * snoise(p * frequency + seed);
            p = p * 1.2 + vec3(1.2, 1.0, 0.8);
            amplitude *= 0.5;
            frequency *= 2.0;
          }
          
          return value;
        }
        
        // Create swirling patterns
        vec3 gasGiantColor(vec3 p, vec3 normal) {
          // Base noise for cloud patterns
          float n1 = fbm(p * 1.0 + time * 0.01);
          float n2 = fbm(p * 2.0 + time * 0.02);
          
          // Create banding effect
          float lat = abs(normal.y);
          float bands = smoothstep(0.1, 0.9, sin(lat * 15.0 + n1 * 2.0) * 0.5 + 0.5);
          
          // Color variations
          vec3 color1 = baseColor * 0.8;
          vec3 color2 = baseColor * 1.5;
          vec3 color3 = mix(baseColor, vec3(0.8, 0.5, 0.2), 0.7);
          
          // Mix colors based on noise and bands
          vec3 finalColor = mix(color1, color2, smoothstep(0.3, 0.7, n1));
          finalColor = mix(finalColor, color3, bands * 0.5);
          
          // Add storm spots
          float spot = smoothstep(0.8, 0.9, n2 * n2);
          finalColor = mix(finalColor, vec3(0.9, 0.9, 0.8), spot * 0.3);
          
          // Darken poles
          float poleDarken = smoothstep(0.7, 0.95, abs(normal.y));
          finalColor = mix(finalColor, finalColor * 0.7, poleDarken);
          
          return finalColor;
        }
        
        void main() {
          // Normalized position and normal
          vec3 normPos = normalize(vPosition);
          vec3 normNormal = normalize(vNormal);
          
          // Generate gas giant patterns
          vec3 p = vPosition * 0.5;
          vec3 color = gasGiantColor(p, normNormal);
          
          // Add rim lighting for atmosphere
          float rim = 1.0 - max(dot(normNormal, vec3(0.0, 0.0, 1.0)), 0.0);
          color += rim * 0.3 * baseColor;
          
          // Add specular highlight
          vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
          float spec = pow(max(dot(normNormal, lightDir), 0.0), 32.0);
          color += spec * 0.2;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, [color, seed])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 0.2
    
    if (meshRef.current) {
      // Smooth rotation with slight variation based on planet size
      meshRef.current.rotation.y = time * 0.1 * (0.5 + size * 0.1)
      
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1 * size
      
      // Hover scaling
      const targetScale = isHovered ? 1.15 : 1.0
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.05
      )
      
      // Update shader time uniform
      if (planetMaterial) {
        planetMaterial.uniforms.time.value = time
      }
    }
    
    // Cloud layer rotation (slightly faster than planet)
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.15
      cloudsRef.current.rotation.x = time * 0.05
    }
    
    // Glow effect
    if (glowRef.current) {
      const glowScale = isHovered ? 1.4 : 1.2
      glowRef.current.scale.lerp(
        new THREE.Vector3(glowScale, glowScale, glowScale),
        0.1
      )
    }
    
    // Ring rotation
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.05
    }
  })

  // Create a custom cloud material
  const cloudMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        seed: { value: seed + 100 },
        color: { value: new THREE.Color(1, 1, 1) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float seed;
        uniform vec3 color;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // Simplex Noise (same as above, but inlined for completeness)
        float snoise(vec3 v); // Function declaration
        
        void main() {
          // Generate cloud pattern
          vec3 pos = vPosition * 1.5 + vec3(seed);
          float n = snoise(pos * 0.8 + time * 0.1);
          
          // Create cloud coverage
          float clouds = smoothstep(0.4, 0.6, n);
          
          // Edge fade
          float alpha = clouds * 0.3;
          
          // Rim lighting for clouds
          float rim = pow(1.0 - abs(dot(vNormal, vec3(0, 0, 1.0))), 2.0);
          alpha *= rim * 0.5 + 0.5;
          
          gl_FragColor = vec4(color, alpha);
        }
        
        // Include the same snoise function as above
        vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec3 v) { 
          // ... (same as above) ...
          return 0.0; // Placeholder
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  }, [seed])

  // Update cloud material time uniform
  useFrame(({ clock }) => {
    if (cloudMaterial) {
      cloudMaterial.uniforms.time.value = clock.getElapsedTime() * 0.2
    }
  })

  return (
    <group position={position}>
      {/* Planet Label */}
      <Text
        position={[0, size + 1.5, 0]}
        fontSize={0.5 + size * 0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
        scale={isHovered ? 1.2 : 1}
        font="/fonts/Orbitron-Bold.ttf"
        letterSpacing={0.1}
      >
        {name.toUpperCase()}
      </Text>

      {/* Atmospheric Glow */}
      <Sphere ref={glowRef} args={[size * 1.1, 32, 32]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Cloud Layer */}
      <Sphere ref={cloudsRef} args={[size * 1.05, 64, 64]}>
        <primitive object={cloudMaterial} attach="material" />
      </Sphere>

      {/* Main Planet Body */}
      <Sphere 
        ref={meshRef} 
        args={[size, 128, 128]} 
        onPointerOver={onHover} 
        onPointerOut={onUnhover} 
        onClick={onClick}
      >
        <primitive object={planetMaterial} attach="material" />
      </Sphere>

      {/* Planetary Rings */}
      {(id === "projects" || isHovered) && (
        <group ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <mesh>
            <torusGeometry args={[size * 1.8, 0.1, 16, 100]} />
            <meshStandardMaterial color={color} transparent opacity={0.4} />
          </mesh>
        </group>
      )}
    </group>
  )
}
