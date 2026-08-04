import { ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { securityHighlights } from "@/data/jarvis";

export function Security() {
  return (
    <section id="security" className="border-t border-border/60 bg-card/30 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Sicherheit & Compliance"
          title="An ISO 27001, NIS-2 und CIS orientiert"
          description="Auch als privates Projekt betrieben wie ein produktives System — mit dokumentierten Kontrollen statt Vertrauen auf Zuruf."
        />
      </Reveal>

      <Reveal delay={0.1}>
        <ul className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
          {securityHighlights.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm"
            >
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted-foreground">
          Infrastruktur-Details, interne Netzwerkadressen und Betriebs-Skripte
          bleiben privat und werden auf dieser Seite bewusst nicht
          veröffentlicht.
        </p>
      </Reveal>
    </section>
  );
}
