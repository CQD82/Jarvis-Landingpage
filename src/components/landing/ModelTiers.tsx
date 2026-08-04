import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { modelTiers } from "@/data/jarvis";

export function ModelTiers() {
  return (
    <section id="models" className="px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow="KI-Modell-Layer"
          title="Die richtige Hardware für jede Anfrage"
          description="Anfragen werden über gestaffelte Tiers geroutet — vom Edge-Beschleuniger bis zur GPU-Workstation. Cloud ist ein eng begrenzter Fallback, kein Regelfall."
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-xl border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-card font-mono text-xs tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-3 font-medium">Tier</th>
                <th className="px-5 py-3 font-medium">Hardware</th>
                <th className="px-5 py-3 font-medium">Rolle</th>
              </tr>
            </thead>
            <tbody>
              {modelTiers.map((row, i) => (
                <tr
                  key={row.tier}
                  className={i % 2 === 0 ? "bg-background" : "bg-card/40"}
                >
                  <td className="px-5 py-4 font-display text-sm font-semibold text-primary">
                    {row.tier}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{row.hardware}</td>
                  <td className="px-5 py-4">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}
