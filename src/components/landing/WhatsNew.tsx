import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { Activity, BrainCircuit, CalendarClock, Mic, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import comfySample from "@/assets/screens/comfyui-sample.webp";
import hudKiosk from "@/assets/screens/hud-kiosk-v2.webp";
import { HudCorners } from "@/components/landing/HudCorners";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { trackPointer } from "@/lib/pointer";

type Status = "live" | "ready" | "wip" | "planned";

interface Item {
  title: string;
  desc?: string;
  status: Status;
}

interface Group {
  title: string;
  items: Item[];
}

/** Matches updates.groups in the locale files. */
const GROUP_ICONS: LucideIcon[] = [Mic, BrainCircuit, Activity, ShieldCheck, CalendarClock];

const STATUS_STYLE: Record<Status, string> = {
  live: "border-[var(--hud-reactor)]/50 bg-[var(--hud-reactor)]/10 text-[var(--hud-reactor)]",
  ready: "border-primary/50 bg-primary/10 text-primary",
  wip: "border-primary/40 bg-primary/5 text-primary/90",
  planned: "border-border bg-muted/40 text-muted-foreground",
};

/**
 * "New since go-live": everything added after 10 Nov 2026, grouped, with a
 * status badge per item and two real screenshots (kiosk HUD with names and
 * presence pixelated, and a locally generated test image). High level only.
 */
export function WhatsNew() {
  const { t } = useTranslation();
  const groups = t("updates.groups", { returnObjects: true }) as Group[];
  const all = groups.flatMap((g) => g.items);
  const liveCount = all.filter((i) => i.status === "live").length;

  return (
    <section id="updates" className="border-t border-border/60 px-6 py-24">
      <Reveal>
        <SectionHeading eyebrow={t("updates.eyebrow")} title={t("updates.title")} description={t("updates.description")} />
      </Reveal>

      <Reveal delay={0.05}>
        <p className="mt-6 text-center font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {t("updates.counter", { live: liveCount, total: all.length })}
        </p>
      </Reveal>

      {/* Screenshots */}
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.9fr_1fr]">
        <Reveal>
          <figure className="relative">
            <HudCorners />
            <div className="border-glow relative overflow-hidden rounded-2xl border border-border">
              <img src={hudKiosk} alt={t("updates.hudCaption")} loading="lazy" width={1920} height={1080} className="block h-auto w-full" />
              <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-sm bg-background/75 px-2 py-1 font-mono text-[0.6rem] tracking-widest text-primary backdrop-blur-sm">
                <span className="animate-rec-blink size-1.5 rounded-full bg-[var(--hud-red)]" />
                LIVE · KIOSK-HUD
              </span>
            </div>
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">{t("updates.hudCaption")}</figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.1}>
          <figure className="relative">
            <HudCorners />
            <div className="border-glow relative overflow-hidden rounded-2xl border border-border">
              <img src={comfySample} alt={t("updates.comfyCaption")} loading="lazy" width={1024} height={1024} className="block aspect-square h-auto w-full object-cover" />
              <span className="absolute top-3 left-3 rounded-sm bg-background/75 px-2 py-1 font-mono text-[0.6rem] tracking-widest text-primary backdrop-blur-sm">
                LOCAL · SDXL
              </span>
            </div>
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">{t("updates.comfyCaption")}</figcaption>
          </figure>
        </Reveal>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground/80">{t("updates.note")}</p>

      {/* Feature groups */}
      <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group, gi) => {
          const Icon = GROUP_ICONS[gi] ?? Activity;
          return (
            <Reveal key={group.title} delay={(gi % 3) * 0.08}>
              <div onPointerMove={trackPointer} className="holo-card h-full rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent/60 p-6">
                <h3 className="flex items-center gap-3 font-display text-base font-semibold tracking-tight">
                  <span className="hud-icon inline-flex size-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary" style={{ "--i": gi } as CSSProperties}>
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-4">
                  {group.items.map((item) => (
                    <li key={item.title}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-display text-sm font-semibold tracking-tight">{item.title}</p>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[0.58rem] tracking-wider whitespace-nowrap uppercase ${STATUS_STYLE[item.status]}`}>
                          {t(`updates.status.${item.status}`)}
                        </span>
                      </div>
                      {item.desc ? <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
