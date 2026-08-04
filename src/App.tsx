import { Features } from "@/components/landing/Features"
import { Footer } from "@/components/landing/Footer"
import { Hero } from "@/components/landing/Hero"
import { ModelTiers } from "@/components/landing/ModelTiers"
import { Nav } from "@/components/landing/Nav"
import { Pipeline } from "@/components/landing/Pipeline"
import { Security } from "@/components/landing/Security"

function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
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
