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
import { DatenschutzPage } from "@/components/legal/Datenschutz"
import { ImpressumPage } from "@/components/legal/Impressum"

function Landing() {
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

function App() {
  // No client-side router in this single-page site — the two legal pages
  // are the only exceptions, plain document pages served at their own
  // path. Cloudflare's SPA fallback (and Vite's dev server) both serve
  // index.html for any unmatched path, so a normal <a href="/impressum">
  // link works without any route configuration.
  const path = window.location.pathname.replace(/\/+$/, "") || "/"

  if (path === "/impressum") return <ImpressumPage />
  if (path === "/datenschutz") return <DatenschutzPage />

  return <Landing />
}

export default App
