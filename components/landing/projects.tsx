"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const projects = [
  {
    title: "Cosmic Dashboard",
    category: "Analytics Platform",
    year: "2024",
    description: "Real-time mission control interface for interstellar logistics.",
    image: "/futuristic-dashboard.png",
  },
  {
    title: "Nebula Chat",
    category: "Communication",
    year: "2023",
    description: "Encrypted quantum-link messaging for deep space teams.",
    image: "/minimalist-chat-interface-dark.jpg",
  },
  {
    title: "Star Map",
    category: "Visualization",
    year: "2024",
    description: "Interactive 3D stellar cartography using WebGL.",
    image: "/3d-star-map-visualization.jpg",
  },
]

export function ProjectsPreview() {
  return (
    <section className="py-24 md:py-32 w-full relative z-10 bg-background/50 backdrop-blur-sm border-t border-white/5">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-2">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Selected Works</span>
            <h2 className="text-4xl md:text-5xl font-serif">Curated Projects</h2>
          </div>
          <Link
            href="/projects"
            className="group flex items-center gap-2 text-sm uppercase tracking-widest hover:text-accent transition-colors pb-2 border-b border-transparent hover:border-accent"
          >
            View All Archive
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] relative overflow-hidden mb-6 bg-white/5">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex justify-between items-start border-b border-white/10 pb-4 group-hover:border-white/30 transition-colors">
                <div>
                  <h3 className="text-2xl font-serif mb-1 group-hover:text-white transition-colors">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.category}</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground border border-white/10 px-2 py-1 rounded-full">
                  {project.year}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                {project.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
