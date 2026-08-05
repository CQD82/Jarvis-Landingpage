import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { features } from "@/data/jarvis";

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Kernfunktionen"
          title="Was JARVIS leistet"
          description="Vom Bare-Metal-Node bis zur sprechenden Assistenz — jede Fähigkeit läuft im eigenen Netzwerk, deklarativ verwaltet und versioniert."
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <Reveal key={feature.title} delay={Math.min(i * 0.05, 0.3)}>
            <div className="group h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
              <div className="inline-flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary transition-shadow group-hover:shadow-[0_0_16px_color-mix(in_oklab,var(--hud-gold)_40%,transparent)]">
                <feature.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
