import { lazy, Suspense, useEffect } from "react"
import type { ComponentType } from "react"
import { CursorGlow } from "@/components/landing/CursorGlow"
import { DocumentMeta } from "@/components/landing/DocumentMeta"
import { Features } from "@/components/landing/Features"
import { Footer } from "@/components/landing/Footer"
import { GoLiveCountdown } from "@/components/landing/GoLiveCountdown"
import { HardwareGallery } from "@/components/landing/HardwareGallery"
import { Hero } from "@/components/landing/Hero"
import { Nav } from "@/components/landing/Nav"
import { NeuralBackground } from "@/components/landing/NeuralBackground"
import { ScrollProgress } from "@/components/landing/ScrollProgress"
import { DatenschutzPage } from "@/components/legal/Datenschutz"
import { ImpressumPage } from "@/components/legal/Impressum"

// Below-the-fold sections ship as separate chunks so the hero paints
// first; they start loading right after the initial render, so in-page
// anchors still resolve within a moment.
const named = <K extends string>(load: () => Promise<Record<K, ComponentType>>, key: K) =>
  lazy(() => load().then((m) => ({ default: m[key] })))
const SystemMap = named(() => import("@/components/landing/SystemMap"), "SystemMap")
const HowItWorks = named(() => import("@/components/landing/HowItWorks"), "HowItWorks")
const DeepDive = named(() => import("@/components/landing/DeepDive"), "DeepDive")
const Pipeline = named(() => import("@/components/landing/Pipeline"), "Pipeline")
const ModelTiers = named(() => import("@/components/landing/ModelTiers"), "ModelTiers")
const PowerConsumption = named(() => import("@/components/landing/PowerConsumption"), "PowerConsumption")
const LiveHud = named(() => import("@/components/landing/LiveHud"), "LiveHud")
const Security = named(() => import("@/components/landing/Security"), "Security")

/**
 * A deep link like /#security arrives before the lazy sections exist, so
 * the browser's own jump finds nothing. Rendered as the last child of the
 * Suspense boundary, this runs once everything below the fold has mounted.
 */
function ScrollToHashOnMount() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])
  return null
}

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
        <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
        <SystemMap />
        <Features />
        <HowItWorks />
        <DeepDive />
        <Pipeline />
        <ModelTiers />
        <PowerConsumption />
        <LiveHud />
        <Security />
        <ScrollToHashOnMount />
        </Suspense>
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
