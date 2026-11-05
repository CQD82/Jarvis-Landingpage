import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { Cpu, KeyRound, Network, PackageCheck, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { trackPointer } from "@/lib/pointer";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";

/**
 * Groups index into security.highlights (locale order) and match
 * security.groupTitles. Every highlight belongs to exactly one group.
 */
const GROUPS: { icon: LucideIcon; items: number[] }[] = [
  { icon: KeyRound, items: [0, 1, 2, 11] },
  { icon: Network, items: [9, 10] },
  { icon: PackageCheck, items: [5, 6, 7] },
  { icon: Cpu, items: [3, 4, 8, 12] },
];

export function Security() {
  const { t } = useTranslation();
  const highlights = t("security.highlights", { returnObjects: true }) as string[];
  const groupTitles = t("security.groupTitles", { returnObjects: true }) as string[];

  return (
    <section id="security" className="border-t border-border/60 bg-card/30 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("security.eyebrow")}
          title={t("security.title")}
          description={t("security.description")}
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
        {GROUPS.map((group, gi) => {
          const Icon = group.icon;
          return (
            <Reveal key={gi} delay={gi * 0.08} className="h-full">
              <div onPointerMove={trackPointer} className="holo-card group h-full rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent/60 p-6 transition-colors duration-300 hover:border-primary/40 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary hud-icon" style={{ "--i": gi } as CSSProperties}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-base font-semibold tracking-tight">
                    {groupTitles[gi]}
                  </h3>
                  <span className="ml-auto font-mono text-[0.65rem] tracking-widest text-primary/50">
                    {String(group.items.length).padStart(2, "0")}
                  </span>
                </div>
                <ul className="mt-5 space-y-3">
                  {group.items.map((idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed">
                      <ShieldCheck
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{highlights[idx]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2}>
        <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted-foreground">
          {t("security.footerNote")}
        </p>
      </Reveal>
    </section>
  );
}
