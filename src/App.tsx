import { GradientShimmer } from "@/components/ui/gradient-shimmer"

function App() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
        <GradientShimmer gradient="sunrise">Get started</GradientShimmer>
      </h1>
      <p className="text-muted-foreground">
        Edit <code className="rounded bg-muted px-1.5 py-0.5">src/App.tsx</code> and save to test HMR
      </p>
    </main>
  )
}

export default App
