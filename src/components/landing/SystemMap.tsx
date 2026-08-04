import { motion } from "framer-motion";
import { Radar } from "lucide-react";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { techCategories } from "@/data/jarvis";

/**
 * Six spokes evenly spaced around the hub, starting at the top (-90deg).
 * Precomputed on a 0-100 viewBox so the SVG lines and the HTML cards share
 * the exact same coordinate space — no runtime trig, no drift between them.
 */
const RADIUS = 38;
const ANGLES_DEG = [-90, -30, 30, 90, 150, 210];
const SPOKES = ANGLES_DEG.map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: 50 + RADIUS * Math.cos(rad),
    y: 50 + RADIUS * Math.sin(rad),
  };
});

export function SystemMap() {
  return (
    <section id="system-map" className="border-t border-border/60 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow="System-Übersicht"
          title="Die gesamte Werkzeugkette auf einen Blick"
          description="JARVIS als Knotenpunkt aus sechs Domänen — von GitOps über KI-Inferenz bis Sicherheit, Voice & Vision und Observability."
        />
      </Reveal>

      {/* Radial constellation — large screens only, precise absolute layout doesn't reflow well below it */}
      <Reveal delay={0.1}>
        <div className="relative mx-auto mt-16 hidden aspect-square max-w-3xl lg:block">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 size-full"
            aria-hidden="true"
          >
            {SPOKES.map((spoke, i) => (
              <line
                key={i}
                x1={50}
                y1={50}
                x2={spoke.x}
                y2={spoke.y}
                stroke="var(--hud-cyan)"
                strokeOpacity={0.35}
                strokeWidth={0.4}
                className="animate-dash-flow"
              />
            ))}
          </svg>

          {/* Traveling pulses along each spoke — plain CSS keyframes, one shared
              animation driven by per-node --dot-x/--dot-y custom properties */}
          {SPOKES.map((spoke, i) => (
            <div
              key={i}
              className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary animate-dot-travel"
              style={
                {
                  "--dot-x": `${spoke.x}%`,
                  "--dot-y": `${spoke.y}%`,
                  animationDelay: `${i * 0.3}s`,
                } as CSSProperties
              }
            />
          ))}

          {/* Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full border border-primary/40 opacity-60 animate-ping-ring" />
            <div className="absolute inset-0 rounded-full border border-primary/30 opacity-40 animate-ping-ring [animation-delay:0.9s]" />
            <div className="relative flex size-20 items-center justify-center rounded-full border border-primary/50 bg-card border-glow">
              <div className="absolute inset-1 overflow-hidden rounded-full">
                <div className="absolute inset-0 animate-radar-sweep bg-[conic-gradient(from_0deg,transparent_0deg,color-mix(in_oklab,var(--hud-cyan)_35%,transparent)_25deg,transparent_50deg)]" />
              </div>
              <Radar className="relative size-7 text-primary" aria-hidden="true" />
            </div>
            <p className="mt-3 text-center font-display text-xs font-semibold tracking-[0.2em] text-primary">
              JARVIS
            </p>
          </div>

          {/* Category cards */}
          {techCategories.map((category, i) => {
            const spoke = SPOKES[i];
            return (
              <div
                key={category.title}
                className="absolute w-48 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${spoke.x}%`, top: `${spoke.y}%` }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                  className="rounded-lg border border-border bg-card/90 p-3 text-center backdrop-blur-sm"
                >
                  <div className="mx-auto inline-flex size-8 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                    <category.icon className="size-4" aria-hidden="true" />
                  </div>
                  <p className="mt-2 font-display text-xs font-semibold tracking-wide">
                    {category.title}
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    {category.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Fallback grid — small/medium screens */}
      <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {techCategories.map((category, i) => (
          <Reveal key={category.title} delay={Math.min(i * 0.05, 0.3)}>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="inline-flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                <category.icon className="size-4" aria-hidden="true" />
              </div>
              <p className="mt-3 font-display text-sm font-semibold tracking-wide">
                {category.title}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {category.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[0.7rem] text-muted-foreground"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
