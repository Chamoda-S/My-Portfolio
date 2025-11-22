"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"

export function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center z-10 pointer-events-none">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center space-y-4"
        >
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-muted-foreground border border-white/10 px-4 py-2 rounded-full backdrop-blur-md bg-white/5">
            Portfolio 2025
          </span>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif tracking-tight text-foreground">
            John <span className="italic font-light text-white/60">Doe</span>
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent my-6" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] font-light leading-relaxed">
            Product Manager & Full-Stack Developer crafting <span className="text-white italic">digital artifacts</span>{" "}
            that bridge function and form.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto"
      >
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          className="flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-white transition-colors group"
        >
          <span>Explore</span>
          <ArrowDown className="w-4 h-4 animate-bounce opacity-50 group-hover:opacity-100" />
        </button>
      </motion.div>
    </section>
  )
}
