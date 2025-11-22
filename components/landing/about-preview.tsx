import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function AboutPreview() {
  return (
    <section className="py-24 md:py-32 w-full relative z-10 bg-background/80 backdrop-blur-md border-t border-white/5">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 relative w-full aspect-[3/4] max-w-md lg:max-w-none mx-auto">
            <div className="absolute inset-0 border border-white/10 translate-x-4 translate-y-4 z-0" />
            <div className="relative h-full w-full z-10 grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden">
              <Image src="/minimalist-professional-portrait.jpg" alt="Portrait" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>

          <div className="flex-1 space-y-8 text-center lg:text-left">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">The Pilot</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              Navigating the <br />
              <span className="italic text-white/50">digital frontier.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              With over a decade of experience in product management and engineering, I help visionary companies turn
              abstract concepts into tangible realities.
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              My approach combines the precision of code with the empathy of design, ensuring every product feels
              inevitable.
            </p>

            <div className="pt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-xs group"
              >
                Read Full Bio
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
