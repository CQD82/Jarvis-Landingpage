import type { CSSProperties } from "react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Activity, BookOpen, Bot, BrainCircuit, CalendarClock, ChevronDown, Mic, ShieldCheck, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import comfySample from "@/assets/screens/comfyui-sample.webp";
import { HudCorners } from "@/components/landing/HudCorners";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { trackPointer } from "@/lib/pointer";

type Status = "live" | "done" | "fixed" | "ready" | "wip" | "planned";

interface Item {
  title: string;
  desc?: string;
  status: Status;
}

interface Group {
  title: string;
  note?: string;
  items: Item[];
}

interface Metric {
  value: string;
  label: string;
}

/** Matches updates.groups in the locale files. */
const GROUP_ICONS: LucideIcon[] = [Mic, BookOpen, Bot, BrainCircuit, Activity, ShieldCheck, Wrench, CalendarClock];

/** Display order for legends and per-card summaries. */
const STATUS_ORDER: Status[] = ["live", "done", "fixed", "ready", "wip", "planned"];

const STATUS_BADGE: Record<Status, string> = {
  live: "border-[var(--hud-reactor)]/50 bg-[var(--hud-reactor)]/10 text-[var(--hud-reactor)]",
  done: "border-[var(--hud-reactor)]/30 bg-transparent text-[var(--hud-reactor)]/80",
  fixed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  ready: "border-primary/50 bg-primary/10 text-primary",
  wip: "border-primary/40 bg-primary/5 text-primary/90",
  planned: "border-border bg-muted/40 text-muted-foreground",
};

const STATUS_DOT: Record<Status, string> = {
  live: "bg-[var(--hud-reactor)] shadow-[0_0_6px_var(--hud-reactor)]",
  done: "border border-[var(--hud-reactor)] bg-transparent",
  fixed: "bg-emerald-400",
  ready: "bg-primary",
  wip: "bg-primary/70",
  planned: "bg-muted-foreground/50",
};

/**
 * "New since go-live": everything added after 10 Nov 2026. Each category is
 * a native <details> card — collapsed it shows a compact, scannable list of
 * names with a status dot; expanded it adds the one-line descriptions.
 * Two real screenshots sit above (names, weather, backups and presence
 * pixelated). High level only.
 */
export function WhatsNew() {
  const { t } = useTranslation();
  const groups = t("updates.groups", { returnObjects: true }) as Group[];
  const metrics = t("updates.metrics", { returnObjects: true }) as Metric[];
  const all = groups.flatMap((g) => g.items);
  // Fixed problems are not features: the headline count covers additions only.
  const features = all.filter((i) => i.status !== "fixed");
  const running = features.filter((i) => i.status === "live" || i.status === "done").length;
  const present = STATUS_ORDER.filter((s) => all.some((i) => i.status === s));
  const summary = (items: Item[]) =>
    STATUS_ORDER.map((s) => [s, items.filter((i) => i.status === s).length] as const)
      .filter(([, n]) => n > 0)
      .map(([s, n]) => `${n} ${t(`updates.status.${s}`)}`)
      .join(" · ");
  const [open, setOpen] = useState<boolean[]>(() => groups.map(() => false));
  const allOpen = open.every(Boolean);

  const setGroup = (gi: number, value: boolean) =>
    setOpen((prev) => (prev[gi] === value ? prev : prev.map((v, i) => (i === gi ? value : v))));

  return (
    <section id="updates" className="border-t border-border/60 px-6 py-24">
      <Reveal>
        <SectionHeading eyebrow={t("updates.eyebrow")} title={t("updates.title")} description={t("updates.description")} />
      </Reveal>

      <Reveal delay={0.05}>
        <p className="mx-auto mt-6 max-w-2xl text-center font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {t("updates.counter", { live: running, total: features.length })}
        </p>
      </Reveal>

      {/* Key measurements */}
      <Reveal delay={0.08}>
        <dl aria-label={t("updates.metricsTitle")} className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col-reverse rounded-xl border border-border bg-card/60 px-4 py-3 text-center">
              <dt className="mt-1 text-[0.7rem] leading-snug text-muted-foreground">{m.label}</dt>
              <dd className="font-display text-2xl text-primary text-glow tabular-nums">{m.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* Locally generated image (the current HUD screenshot sits in the progress section above) */}
      <Reveal>
        <figure className="relative mx-auto mt-12 max-w-md">
          <HudCorners />
          <div className="border-glow relative overflow-hidden rounded-2xl border border-border">
            <img src={comfySample} alt={t("updates.alt.comfy")} loading="lazy" width={1024} height={1024} className="block aspect-square h-auto w-full object-cover" />
            <span aria-hidden="true" className="absolute top-3 left-3 rounded-sm bg-background/75 px-2 py-1 font-mono text-[0.6rem] tracking-widest text-primary backdrop-blur-sm">
              LOCAL · SDXL
            </span>
          </div>
          <figcaption className="mt-3 text-center text-sm text-muted-foreground">{t("updates.comfyCaption")}</figcaption>
        </figure>
      </Reveal>
      <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground/80">{t("updates.note")}</p>

      {/* Legend + expand all */}
      <div className="mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap items-center gap-4 font-mono text-[0.65rem] tracking-wider text-muted-foreground uppercase">
          {present.map((s) => (
            <li key={s} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${STATUS_DOT[s]}`} aria-hidden="true" />
              {t(`updates.status.${s}`)}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setOpen(groups.map(() => !allOpen))}
          className="rounded-md border border-border px-3 py-1.5 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          {allOpen ? t("updates.collapseAll") : t("updates.expandAll")}
        </button>
      </div>

      {/* Collapsible categories */}
      <div className="mx-auto mt-6 grid max-w-6xl items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group, gi) => {
          const Icon = GROUP_ICONS[gi] ?? Activity;
          const isOpen = open[gi] ?? false;
          return (
            <Reveal key={group.title} delay={(gi % 3) * 0.08}>
              <details
                open={isOpen}
                onToggle={(e) => setGroup(gi, e.currentTarget.open)}
                onPointerMove={trackPointer}
                className="holo-card group/cat rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent/60 open:border-primary/40"
              >
                <summary className="block cursor-pointer list-none p-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-3">
                  <span className="hud-icon inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary" style={{ "--i": gi } as CSSProperties}>
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base font-semibold tracking-tight">{group.title}</span>
                    <span className="mt-0.5 block font-mono text-[0.65rem] tracking-wider text-muted-foreground uppercase">
                      {summary(group.items)}
                    </span>
                  </span>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open/cat:rotate-180" aria-hidden="true" />
                  </span>
                  {/* Collapsed: compact names with a status dot (inside the
                      summary, since <details> hides everything else) */}
                  {!isOpen ? (
                    <span className="mt-4 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span key={item.title} className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background/40 px-2.5 py-1 text-[0.72rem] text-foreground/85">
                          <span className={`size-1.5 shrink-0 rounded-full ${STATUS_DOT[item.status]}`} aria-hidden="true" />
                          {item.title}
                          <span className="sr-only"> — {t(`updates.status.${item.status}`)}</span>
                        </span>
                      ))}
                    </span>
                  ) : null}
                </summary>

                {/* Expanded: full list with descriptions */}
                {group.note ? (
                  <p className="mx-5 mb-4 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground">{group.note}</p>
                ) : null}
                <ul className="space-y-4 border-t border-border/60 px-5 pt-4 pb-5">
                  {group.items.map((item) => (
                    <li key={item.title}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-display text-sm font-semibold tracking-tight">{item.title}</p>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[0.58rem] tracking-wider whitespace-nowrap uppercase ${STATUS_BADGE[item.status]}`}>
                          {t(`updates.status.${item.status}`)}
                        </span>
                      </div>
                      {item.desc ? <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p> : null}
                    </li>
                  ))}
                </ul>
              </details>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
