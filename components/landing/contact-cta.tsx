import Link from "next/link"

export function ContactCTA() {
  return (
    <section className="py-32 w-full relative z-10 bg-black border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />

      <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-8xl font-serif mb-8 tracking-tight">
          Let's build <br />
          <span className="italic text-white/40">the future.</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-12 text-lg">
          Currently available for select projects and advisory roles.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/contact"
            className="px-10 py-4 bg-white text-black hover:bg-white/90 transition-colors text-sm uppercase tracking-widest min-w-[200px]"
          >
            Start a Project
          </Link>
          <a
            href="mailto:hello@example.com"
            className="px-10 py-4 border border-white/20 hover:bg-white/5 transition-colors text-sm uppercase tracking-widest min-w-[200px]"
          >
            Email Me
          </a>
        </div>

        <div className="mt-32 flex flex-col md:flex-row justify-between items-center gap-8 text-xs text-muted-foreground uppercase tracking-wider border-t border-white/5 pt-12">
          <div>© 2025 Space Portfolio</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
