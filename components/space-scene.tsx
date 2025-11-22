"use client"

import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { ScrollControls, useScroll, Html, Text } from "@react-three/drei"
import { useState, useEffect } from "react"
import * as THREE from "three"
import { Planet } from "./planet"
import { PlanetOverlay } from "./planet-overlay"
import { StarField } from "./star-field"
import { Spaceship } from "./spaceship"
import { createBrowserClient } from "@/lib/supabase/client"

function SceneContent({ planets, onPlanetClick, hoveredPlanet, setHoveredPlanet, isLanding, targetPlanetPos }: any) {
  const scroll = useScroll()
  const { camera } = useThree()
  const [endReached, setEndReached] = useState(false)

  useFrame((state, delta) => {
    if (isLanding && targetPlanetPos) {
      const targetPos = new THREE.Vector3(
        targetPlanetPos[0],
        targetPlanetPos[1],
        targetPlanetPos[2] + 4, // Stop 4 units in front
      )
      camera.position.lerp(targetPos, 0.04)
      camera.lookAt(targetPlanetPos[0], targetPlanetPos[1], targetPlanetPos[2])
    } else {
      // Normal Space Travel
      const currentZ = -scroll.offset * 120 // Increased distance

      // Smooth camera movement
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5 + currentZ, 0.1)

      // Check if end reached
      if (scroll.offset > 0.95) setEndReached(true)
      else setEndReached(false)
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={1} color="#ffd700" />

      <StarField count={5000} />

      {/* Hide spaceship during landing for "First Person" re-entry feel */}
      {!isLanding && (
        <group position={[0, 0, camera.position.z - 5]}>
          <Spaceship />
        </group>
      )}

      {planets.map((planet: any, index: number) => (
        <group key={planet.id} position={[planet.position[0], planet.position[1], -index * 30]}>
          <Planet
            {...planet}
            position={[0, 0, 0]} // Relative to group
            isHovered={hoveredPlanet === planet.id}
            onHover={() => !isLanding && setHoveredPlanet(planet.id)}
            onUnhover={() => setHoveredPlanet(null)}
            onClick={() => onPlanetClick(planet)}
          />

          <Html position={[2.5, 0, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
            <div
              className={`transition-all duration-500 transform ${
                hoveredPlanet === planet.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
            >
              <div className="bg-black/40 backdrop-blur-md border-l-2 border-gold-400 p-4 w-64 rounded-r-lg shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                <h4 className="text-gold-400 font-bold text-lg font-playfair">{planet.name}</h4>
                <p className="text-gray-200 text-xs mt-1 mb-2">{planet.description}</p>
                <div className="text-[10px] uppercase tracking-widest text-blue-300 border border-blue-500/30 rounded px-2 py-1 inline-block">
                  Click to Land
                </div>
              </div>
            </div>
          </Html>
        </group>
      ))}

      <group position={[0, 0, -140]}>
        <Text fontSize={4} color="#fbbf24" anchorX="center" anchorY="middle" fillOpacity={endReached ? 1 : 0}>
          EDGE OF KNOWN SPACE
        </Text>
        <Text
          position={[0, -3, 0]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          fillOpacity={endReached ? 1 : 0}
        >
          Scroll up to return to base
        </Text>
      </group>
    </>
  )
}

export function SpaceScene() {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [isLanding, setIsLanding] = useState(false)
  const [landingPlanetPos, setLandingPlanetPos] = useState<[number, number, number] | null>(null)

  const [portfolioData, setPortfolioData] = useState<any>({
    projects: [],
    skills: [],
    content: [],
  })
  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes, contentRes] = await Promise.all([
          supabase.from("projects").select("*").eq("is_visible", true).order("order_index"),
          supabase.from("skills").select("*").eq("is_visible", true).order("order_index"),
          supabase.from("portfolio_content").select("*").eq("is_visible", true).order("order_index"),
        ])

        setPortfolioData({
          projects: projectsRes.data || [],
          skills: skillsRes.data || [],
          content: contentRes.data || [],
        })
      } catch (error) {
        console.error("[v0] Error fetching portfolio data:", error)
      }
    }

    fetchData()
  }, [])

  const handlePlanetClick = (planet: any) => {
    setIsLanding(true)
    // Calculate absolute position based on index logic in SceneContent
    // Planets are at -index * 30
    const zPos = -planets.findIndex((p) => p.id === planet.id) * 30
    setLandingPlanetPos([planet.position[0], planet.position[1], zPos])

    // 2.5s delay before showing modal
    setTimeout(() => {
      setSelectedPlanet(planet.id)
    }, 2500)
  }

  const handleCloseOverlay = () => {
    setSelectedPlanet(null)
    setIsLanding(false)
    setLandingPlanetPos(null)
  }

  const planets = [
    {
      id: "about",
      name: "About Me",
      position: [-4, 1, 0],
      color: "#3b82f6", // Earth Blue
      size: 2,
      description: "Origin Story & Profile",
    },
    {
      id: "projects",
      name: "My Projects",
      position: [4, -1, 0],
      color: "#fbbf24", // Gold Gas Giant
      size: 2.8,
      description: "Mission Archive",
    },
    {
      id: "skills",
      name: "My Skills",
      position: [-3, -2, 0],
      color: "#ec4899", // Neon Tech World
      size: 1.8,
      description: "Technical Arsenal",
    },
    {
      id: "contact",
      name: "Contact Me",
      position: [2, 1, 0],
      color: "#a5f3fc", // Ice World
      size: 1.5,
      description: "Comms Frequency",
    },
  ]

  return (
    <>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} className="w-full h-full bg-black">
        <ScrollControls pages={6} damping={0.4} enabled={!isLanding}>
          <SceneContent
            planets={planets}
            onPlanetClick={handlePlanetClick}
            hoveredPlanet={hoveredPlanet}
            setHoveredPlanet={setHoveredPlanet}
            isLanding={isLanding}
            targetPlanetPos={landingPlanetPos}
          />
        </ScrollControls>
      </Canvas>

      {isLanding && !selectedPlanet && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/10 to-transparent animate-pulse" />
          <div className="text-gold-400 font-mono text-xl tracking-[0.5em] animate-bounce">INITIATING LANDING...</div>
        </div>
      )}

      {selectedPlanet && (
        <PlanetOverlay
          planet={planets.find((p) => p.id === selectedPlanet)!}
          isExpanded={true}
          onClose={handleCloseOverlay}
          portfolioData={portfolioData}
        />
      )}

      {!selectedPlanet && !isLanding && (
        <div className="fixed bottom-8 w-full text-center text-white/30 font-mono text-xs pointer-events-none z-50">
          SCROLL TO EXPLORE &bull; CLICK TO LAND
        </div>
      )}
    </>
  )
}
