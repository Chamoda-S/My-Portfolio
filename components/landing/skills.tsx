"use client"

import { motion } from "framer-motion"

const skills = [
  { category: "Product", items: ["Strategy", "Roadmapping", "User Research", "Agile"] },
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "Three.js"] },
  { category: "Backend", items: ["Node.js", "Supabase", "PostgreSQL", "Redis"] },
  { category: "Design", items: ["Figma", "UI Systems", "Motion", "Prototyping"] },
]

export function SkillsShowcase() {
  return (
    <section className="py-24 w-full relative z-10 bg-black/40 backdrop-blur-sm border-t border-white/5">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-4xl font-serif">
              Technical
              <br />
              <span className="italic text-muted-foreground">Constellation</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              A balanced blend of strategic thinking and engineering precision. I build systems that are as robust as
              they are beautiful.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((group, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-panel p-8 hover:bg-white/5 transition-colors"
              >
                <h3 className="text-xl font-serif mb-6 text-white/90 border-b border-white/10 pb-4 inline-block pr-12">
                  {group.category}
                </h3>
                <ul className="grid grid-cols-2 gap-4">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1 h-1 bg-accent rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
