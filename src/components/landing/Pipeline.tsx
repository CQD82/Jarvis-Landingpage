import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { pipeline } from "@/data/jarvis";

export function Pipeline() {
  return (
    <section id="architecture" className="border-y border-border/60 bg-card/30 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Architektur"
          title="Vollständig deklarative Ausrollung"
          description="Kein imperatives Bash mehr: jede Ebene des Clusters wird von einem dedizierten Tool verwaltet, jede Änderung ist ein Commit."
        />
      </Reveal>

      <div className="mx-auto mt-14 flex max-w-5xl flex-col items-stretch gap-4 lg:flex-row lg:items-center">
        {pipeline.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.08} className="flex flex-1 items-center gap-4">
            <div className="w-full rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto inline-flex size-11 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <step.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-sm font-semibold tracking-wide">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
            {i < pipeline.length - 1 ? (
              <ArrowRight
                className="hidden size-5 shrink-0 text-primary/50 lg:block"
                aria-hidden="true"
              />
            ) : null}
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <p className="mx-auto mt-10 max-w-2xl text-center font-mono text-xs text-muted-foreground">
          git commit → git push → Flux reconciled Cluster-Zustand automatisch zurück auf den Git-Stand
        </p>
      </Reveal>
    </section>
  );
}
