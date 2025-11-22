"use client"

import { SpaceScene } from "@/components/space-scene"

export default function Home() {
  return (
    <main className="w-full h-screen bg-black overflow-hidden">
      {/* The Scene is now the entire page content */}
      <SpaceScene />
    </main>
  )
}
