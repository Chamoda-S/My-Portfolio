"use client"

import { motion } from "framer-motion"

interface NavigationHUDProps {
  planets: Array<{
    id: string
    name: string
  }>
  onPlanetSelect: (id: string) => void
}

export function NavigationHUD({ planets, onPlanetSelect }: NavigationHUDProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-8 left-1/2 -translate-x-1/2 z-10"
    >
      <nav className="glass-panel rounded-full px-6 py-3">
        <ul className="flex items-center gap-6">
          {planets.map((planet) => (
            <li key={planet.id}>
              <button
                onClick={() => onPlanetSelect(planet.id)}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hover:cosmic-glow px-3 py-1 rounded-full"
              >
                {planet.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  )
}
