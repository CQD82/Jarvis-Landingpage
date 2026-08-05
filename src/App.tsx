import { CursorGlow } from "@/components/landing/CursorGlow"
import { DeepDive } from "@/components/landing/DeepDive"
import { DocumentMeta } from "@/components/landing/DocumentMeta"
import { Features } from "@/components/landing/Features"
import { Footer } from "@/components/landing/Footer"
import { GoLiveCountdown } from "@/components/landing/GoLiveCountdown"
import { HardwareGallery } from "@/components/landing/HardwareGallery"
import { Hero } from "@/components/landing/Hero"
import { LiveHud } from "@/components/landing/LiveHud"
import { ModelTiers } from "@/components/landing/ModelTiers"
import { Nav } from "@/components/landing/Nav"
import { NeuralBackground } from "@/components/landing/NeuralBackground"
import { Pipeline } from "@/components/landing/Pipeline"
import { PowerConsumption } from "@/components/landing/PowerConsumption"
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
        <HardwareGallery />
        <SystemMap />
        <Features />
        <DeepDive />
        <Pipeline />
        <ModelTiers />
        <PowerConsumption />
        <LiveHud />
        <Security />
      </main>
      <Footer />
    </div>
  )
}

export default App
