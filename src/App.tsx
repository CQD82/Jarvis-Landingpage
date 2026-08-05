import { CursorGlow } from "@/components/landing/CursorGlow"
import { DocumentMeta } from "@/components/landing/DocumentMeta"
import { Features } from "@/components/landing/Features"
import { Footer } from "@/components/landing/Footer"
import { GoLiveCountdown } from "@/components/landing/GoLiveCountdown"
import { Hero } from "@/components/landing/Hero"
import { ModelTiers } from "@/components/landing/ModelTiers"
import { Nav } from "@/components/landing/Nav"
import { NeuralBackground } from "@/components/landing/NeuralBackground"
import { Pipeline } from "@/components/landing/Pipeline"
import { ScrollProgress } from "@/components/landing/ScrollProgress"
import { Security } from "@/components/landing/Security"
import { SystemMap } from "@/components/landing/SystemMap"

function App() {
  return (
    <div className="min-h-screen">
      <DocumentMeta />
      <NeuralBackground />
      <CursorGlow />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <GoLiveCountdown />
        <SystemMap />
        <Features />
        <Pipeline />
        <ModelTiers />
        <Security />
      </main>
      <Footer />
    </div>
  )
}

export default App
