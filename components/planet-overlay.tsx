"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PlanetOverlayProps {
  planet: any
  isExpanded?: boolean
  onClose: () => void
  portfolioData: any
}

export function PlanetOverlay({ planet, isExpanded, onClose, portfolioData }: PlanetOverlayProps) {
  if (!isExpanded) return null

  const getContent = () => {
    switch (planet.id) {
      case "projects":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioData.projects?.map((project: any) => (
              <div
                key={project.id}
                className="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-gold-400/50 transition-colors"
              >
                <h3 className="text-xl font-playfair text-gold-400 mb-2">{project.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack?.map((tech: string) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="bg-blue-500/10 border-blue-500/30 text-blue-300 text-xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      case "skills":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolioData.skills?.map((skill: any) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10"
              >
                <span className="text-gray-200">{skill.name}</span>
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-500" style={{ width: `${skill.proficiency}%` }} />
                </div>
              </div>
            ))}
          </div>
        )
      case "about":
        const aboutContent = portfolioData.content?.find((c: any) => c.section === "about")
        return (
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-300 leading-relaxed">{aboutContent?.content?.text || "Loading bio..."}</p>
          </div>
        )
      case "contact":
        const contactContent = portfolioData.content?.find((c: any) => c.section === "contact")
        return (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded border border-white/10">
              <h4 className="text-gold-400 font-bold mb-1">Email</h4>
              <p className="text-gray-300">{contactContent?.content?.email || "contact@example.com"}</p>
            </div>
            {/* Add more contact fields */}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[80vh] bg-zinc-900/90 border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-gold-900/20 to-transparent">
            <div>
              <h2 className="text-3xl font-playfair font-bold text-gold-400">{planet.name}</h2>
              <p className="text-blue-300/80 text-sm font-mono tracking-wider uppercase">System Data Log</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 rounded-full">
              <X className="w-6 h-6 text-gray-400" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-6">{getContent()}</ScrollArea>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
