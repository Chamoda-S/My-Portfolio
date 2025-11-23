"use client"

import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { ScrollControls, useScroll, Html, Text } from "@react-three/drei"
import { useState, useEffect } from "react"
import * as THREE from "three"
import { Planet } from "./planet"
import { PlanetOverlay } from "./planet-overlay"
import { StarField } from "./star-field"
import { createBrowserClient } from "@/lib/supabase/client"

function SceneContent({ planets, onPlanetClick, hoveredPlanet, setHoveredPlanet, isLanding, targetPlanetPos }: any) {
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [cameraZ, setCameraZ] = useState(0);
  const scroll = useScroll()
  const { camera, size } = useThree()
  const [endReached, setEndReached] = useState(false)
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);

  useFrame((state, delta) => {
    if (isLanding && targetPlanetPos) {
      const targetPos = new THREE.Vector3(
        0,  // Lock X position
        0,  // Lock Y position
        targetPlanetPos[2] + 4  // Stop 4 units in front
      )
      camera.position.lerp(targetPos, 0.04)
      camera.lookAt(0, 0, targetPlanetPos[2])
    } else {
      // Linear Z-axis movement only
      const maxScrollDistance = 100; // Total scrollable distance
      const currentZ = -scroll.offset * maxScrollDistance;
      
      // Smooth linear movement along Z-axis only
      const targetZ = 10 + currentZ;
      camera.position.z = MathUtils.lerp(
        camera.position.z, 
        targetZ,  // Start at z=10, move back as you scroll
        0.1
      );
      setCameraZ(camera.position.z);
      camera.lookAt(0, 0, -100); // Always look straight ahead

      // Check if end reached
      if (scroll.offset > 0.95) setEndReached(true);
      else setEndReached(false);
    }
  })

  // Fix for the three.js type error
  const { MathUtils } = THREE;

  // Handle hover state with proper cleanup
  const handleHover = (planetId: string) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredPlanetId(planetId);
    setHoveredPlanet(planetId); // Update the parent component's hover state
  };

  const handleUnhover = () => {
    const timeout = setTimeout(() => {
      setHoveredPlanetId(null);
      setHoveredPlanet(null); // Clear the parent component's hover state
    }, 100);
    setHoverTimeout(timeout);
  };

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={1} color="#ffd700" />

      <StarField count={5000} />


      {planets.map((planet: any, index: number) => {
        const isHovered = hoveredPlanetId === planet.id;
        return (
          <group 
            key={planet.id} 
            position={[planet.position[0], planet.position[1], -index * 30]}
          >
            <group
              onPointerOver={() => !isLanding && handleHover(planet.id)}
              onPointerOut={handleUnhover}
              onClick={() => onPlanetClick(planet)}
            >
              <Planet
                {...planet}
                position={[0, 0, 0]} // Relative to group
                isHovered={isHovered}
                onHover={() => {}}
                onUnhover={() => {}}
                onClick={() => {}}
              />
            </group>

            {isHovered && (
              <Html 
                position={[2.5, 0, 0]} 
                center 
                distanceFactor={15} // Increased distance factor for better visibility
                style={{ 
                  pointerEvents: "none",
                  width: '280px',
                  zIndex: 10,
                  opacity: 1,
                  transition: 'opacity 0.3s ease-in-out',
                  transform: 'none',
                  willChange: 'transform, opacity'
                }}
                className="planet-tooltip"
              >
                <div className="transform -translate-x-4">
                  <div className="bg-black/60 backdrop-blur-md border-l-2 border-gold-400 p-4 w-72 rounded-r-lg shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                    <h4 className="text-gold-400 font-bold text-lg font-playfair mb-2">{planet.name}</h4>
                    <p className="text-gray-200 text-sm mb-3">{planet.description}</p>
                    
                    {/* Planet-specific content */}
                    {planet.id === 'about' && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-300">Get to know me and my journey in tech</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-xs bg-blue-500/20 text-blue-200 px-2 py-1 rounded">Full-Stack Dev</span>
                          <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded">UI/UX Enthusiast</span>
                        </div>
                      </div>
                    )}
                    
                    {planet.id === 'projects' && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-300">Featured Project:</p>
                        <p className="text-sm text-white font-medium">Portfolio Website</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-xs bg-amber-500/20 text-amber-200 px-2 py-1 rounded">Next.js</span>
                          <span className="text-xs bg-blue-500/20 text-blue-200 px-2 py-1 rounded">Three.js</span>
                          <span className="text-xs bg-emerald-500/20 text-emerald-200 px-2 py-1 rounded">Tailwind</span>
                        </div>
                      </div>
                    )}
                    
                    {planet.id === 'skills' && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-300">Key Skills:</p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs bg-green-500/20 text-green-200 px-2 py-1 rounded">React</span>
                          <span className="text-xs bg-blue-500/20 text-blue-200 px-2 py-1 rounded">TypeScript</span>
                          <span className="text-xs bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded">Node.js</span>
                          <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded">Three.js</span>
                        </div>
                      </div>
                    )}
                    
                    {planet.id === 'experience' && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-300">Recent Experience:</p>
                        <p className="text-sm text-white font-medium">Full Stack Developer</p>
                        <p className="text-xs text-gray-300">2022 - Present</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-xs bg-blue-500/20 text-blue-200 px-2 py-1 rounded">React</span>
                          <span className="text-xs bg-green-500/20 text-green-200 px-2 py-1 rounded">Node.js</span>
                        </div>
                      </div>
                    )}
                    
                    {planet.id === 'contact' && (
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-300 mb-1">Get in touch:</p>
                          <a 
                            href="mailto:chamoda.suraweera@gmail.com" 
                            className="text-blue-300 hover:text-blue-200 text-sm flex items-center gap-1.5"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                            </svg>
                            chamoda.suraweera@gmail.com
                          </a>
                        </div>
                        
                        <div className="flex gap-3 mt-2">
                          <a 
                            href="https://www.linkedin.com/in/chamoda-suraweera/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            aria-label="LinkedIn"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                          <a 
                            href="https://github.com/Chamoda-S" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white transition-colors"
                            aria-label="GitHub"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="text-[11px] uppercase tracking-wider text-gold-400 border border-gold-400/30 rounded px-2 py-1 inline-flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Click to Explore
                      </div>
                    </div>
                    <div 
                      className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-gold-400 rounded-full transition-transform duration-200"
                      style={{
                        transform: 'translateY(-50%) scaleY(1)'
                      }}
                    ></div>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

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
  
  const planets = [
    {
      id: "about",
      name: "About Me",
      position: [-5, 0, 0],  // Slight left
      color: "#3b82f6",
      size: 1.8,
      description: "Origin Story & Profile",
    },
    {
      id: "projects",
      name: "My Projects",
      position: [6, -1, -30],  // Slight right and down
      color: "#f59e0b",
      size: 2.0,
      description: "Mission Archive",
    },
    {
      id: "skills",
      name: "My Skills",
      position: [-7, 1, -60],  // Further left and slightly up
      color: "#ec4899",
      size: 2.0,
      description: "Technical Arsenal",
    },
    {
      id: "contact",
      name: "Contact Me",
      position: [5, -1, -90],  // Back to right side
      color: "#7dd3fc",
      size: 1.8,
      description: "Comms Frequency",
    },
  ]
  
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

  return (
    <>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} className="w-full h-full bg-black">
        <ScrollControls 
          pages={6} 
          distance={1}
          damping={0.5}
          enabled={!isLanding}
          onScroll={(e) => {
            // Lock scroll to Z-axis only
            e.target.delta.x = 0;
            e.target.delta.y = 0;
          }}
        >
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
