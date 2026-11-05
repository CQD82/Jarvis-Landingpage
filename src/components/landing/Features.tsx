import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { featureIcons } from "@/data/jarvis";

interface FeatureText {
  title: string;
  description: string;
}

/**
 * Bento spans for the 3-column desktop grid (10 items -> 5 full rows:
 * 2+1, 1+2, 1+1+1, 2+1, 3). Index-matched to features.items.
 */
const BENTO_SPANS = [
  "sm:col-span-2 lg:col-span-2",
  "",
  "",
  "lg:col-span-2",
  "",
  "",
  "",
  "lg:col-span-2",
  "",
  "sm:col-span-2 lg:col-span-3",
];

export function Features() {
  const { t } = useTranslation();
  const items = t("features.items", { returnObjects: true }) as FeatureText[];

  return (
    <section id="features" className="px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("features.eyebrow")}
          title={t("features.title")}
          description={t("features.description")}
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((feature, i) => {
          const Icon = featureIcons[i];
          return (
            <Reveal key={i} delay={Math.min(i * 0.05, 0.3)} className={BENTO_SPANS[i]}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent/60 p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--hud-gold)_30%,transparent)] sm:p-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--hud-gold)_14%,transparent),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span aria-hidden="true" className="absolute top-6 right-6 font-mono text-[0.65rem] tracking-widest text-primary/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="inline-flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary hud-icon transition-shadow group-hover:shadow-[0_0_16px_color-mix(in_oklab,var(--hud-gold)_40%,transparent)]" style={{ "--i": i } as CSSProperties}>
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
