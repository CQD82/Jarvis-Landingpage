import { useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { TiltPanel } from "@/components/landing/TiltPanel";

interface GroupText {
  name: string;
  role: string;
}

interface GroupGeo {
  hub: [number, number];
  count: number;
  /** Ring radius for the member nodes (0 = single node on the hub). */
  ring: number;
  tone: "gold" | "reactor" | "muted";
  /** Out-of-band link (dashed, no packets) — the watchdog sits outside Kubernetes. */
  oob?: boolean;
}

/** Index-matched to topology.groups in the locale files. Counts sum to 18. */
const GROUPS: GroupGeo[] = [
  { hub: [400, 255], count: 3, ring: 30, tone: "gold" }, // control plane
  { hub: [150, 250], count: 7, ring: 56, tone: "gold" }, // storage workers
  { hub: [640, 110], count: 4, ring: 40, tone: "gold" }, // edge / npu
  { hub: [680, 300], count: 1, ring: 0, tone: "reactor" }, // gpu tier
  { hub: [575, 435], count: 1, ring: 0, tone: "gold" }, // cpu tier
  { hub: [215, 445], count: 1, ring: 0, tone: "gold" }, // utility
  { hub: [400, 480], count: 1, ring: 0, tone: "muted", oob: true }, // watchdog
];

const CORE = GROUPS[0].hub;

const TONE: Record<GroupGeo["tone"], string> = {
  gold: "var(--hud-gold)",
  reactor: "var(--hud-reactor)",
  muted: "color-mix(in oklab, var(--hud-gold) 45%, transparent)",
};

function nodesOf(g: GroupGeo): [number, number][] {
  if (g.ring === 0) return [g.hub];
  return Array.from({ length: g.count }, (_, i) => {
    const a = (i / g.count) * Math.PI * 2 - Math.PI / 2;
    return [g.hub[0] + Math.cos(a) * g.ring, g.hub[1] + Math.sin(a) * g.ring];
  });
}

function linkPath(from: [number, number], to: [number, number]): string {
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2 - 40;
  return `M ${from[0]} ${from[1]} Q ${mx} ${my} ${to[0]} ${to[1]}`;
}

export function ClusterTopology() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const groups = t("topology.groups", { returnObjects: true }) as GroupText[];
  const [active, setActive] = useState(0);

  const select = (i: number) => setActive(i);
  const onKey = (i: number) => (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(i);
    }
  };

  const current = GROUPS[active];

  return (
    <section id="topology" className="px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("topology.eyebrow")}
          title={t("topology.title")}
          description={t("topology.description")}
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-6xl items-center gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Reveal>
          <TiltPanel className="relative overflow-hidden rounded-2xl border border-border bg-card/60" maxTiltX={4} maxTiltY={5}>
            <svg viewBox="0 0 800 540" className="block h-auto w-full" role="group" aria-label={t("topology.title")}>
              <defs>
                <filter id="topo-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* links */}
              {GROUPS.slice(1).map((g, idx) => {
                const i = idx + 1;
                const d = linkPath(g.hub, CORE);
                const on = active === i || active === 0;
                return (
                  <g key={`l${i}`}>
                    <path
                      d={d}
                      fill="none"
                      stroke={TONE[g.tone]}
                      strokeOpacity={on ? 0.55 : 0.18}
                      strokeWidth={on ? 1.6 : 1}
                      strokeDasharray={g.oob ? "4 6" : undefined}
                      className={g.oob || reduceMotion ? undefined : "animate-dash-flow"}
                    />
                    {!reduceMotion && !g.oob ? (
                      <circle r={3.2} fill="var(--hud-reactor)" filter="url(#topo-glow)">
                        <animateMotion dur={`${2.4 + (i % 3) * 0.7}s`} repeatCount="indefinite" path={d} keyPoints={i % 2 ? "0;1" : "1;0"} keyTimes="0;1" calcMode="linear" begin={`${i * 0.35}s`} />
                      </circle>
                    ) : null}
                  </g>
                );
              })}

              {/* groups */}
              {GROUPS.map((g, i) => {
                const isActive = active === i;
                const color = TONE[g.tone];
                const pts = nodesOf(g);
                const r = g.ring === 0 ? 15 : 8;
                return (
                  <g
                    key={`g${i}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    aria-label={`${groups[i]?.name} · ${g.count}`}
                    onClick={() => select(i)}
                    onKeyDown={onKey(i)}
                    className="cursor-pointer outline-none focus-visible:[&>circle:first-child]:stroke-[var(--hud-reactor)]"
                  >
                    {/* generous hit area + selection halo */}
                    <circle
                      cx={g.hub[0]}
                      cy={g.hub[1]}
                      r={(g.ring || 0) + 30}
                      fill={isActive ? "color-mix(in oklab, var(--hud-gold) 8%, transparent)" : "transparent"}
                      stroke={isActive ? color : "transparent"}
                      strokeOpacity={0.5}
                      strokeDasharray="2 5"
                      className={isActive && !reduceMotion ? "animate-radar-sweep" : undefined}
                      style={{ transformOrigin: `${g.hub[0]}px ${g.hub[1]}px`, transformBox: "view-box" }}
                    />
                    {g.ring > 0
                      ? pts.map(([x, y], k) => (
                          <line key={`s${k}`} x1={g.hub[0]} y1={g.hub[1]} x2={x} y2={y} stroke={color} strokeOpacity={0.25} />
                        ))
                      : null}
                    {pts.map(([x, y], k) => (
                      <g key={`n${k}`}>
                        {!reduceMotion ? (
                          <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeOpacity={0.6} className="animate-ping-ring" style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box", animationDelay: `${(i * 0.4 + k * 0.25) % 2.6}s` }} />
                        ) : null}
                        <circle cx={x} cy={y} r={r} fill="var(--background)" stroke={color} strokeWidth={isActive ? 2.2 : 1.4} filter={isActive ? "url(#topo-glow)" : undefined} />
                        <circle cx={x} cy={y} r={r * 0.38} fill={color} opacity={isActive ? 1 : 0.7} />
                      </g>
                    ))}
                    <text
                      x={g.hub[0]}
                      y={g.hub[1] + (g.ring || 0) + (g.ring ? 26 : 34)}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize={17}
                      letterSpacing={1.5}
                      fill={isActive ? color : "var(--muted-foreground)"}
                    >
                      {(groups[i]?.name ?? "").toUpperCase()} ×{g.count}
                    </text>
                  </g>
                );
              })}
            </svg>
          </TiltPanel>
        </Reveal>

        <Reveal delay={0.1}>
          <div aria-live="polite" className="holo-card rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-accent/60 p-6 sm:p-7">
            <p className="font-mono text-[0.65rem] tracking-[0.3em] text-primary/70 uppercase">
              NODE GROUP {String(active + 1).padStart(2, "0")} / {String(GROUPS.length).padStart(2, "0")}
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">{groups[active]?.name}</h3>
            <p className="mt-1 font-mono text-sm" style={{ color: TONE[current.tone] }}>
              {current.count} × {current.count === 1 ? "node" : "nodes"}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{groups[active]?.role}</p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {GROUPS.map((_, i) => (
                <button
                  key={`b${i}`}
                  type="button"
                  onClick={() => select(i)}
                  aria-label={groups[i]?.name}
                  aria-pressed={active === i}
                  className="group/dot flex h-11 cursor-pointer items-center rounded-full px-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${active === i ? "w-10 bg-primary" : "w-6 bg-primary/25 group-hover/dot:bg-primary/50"}`}
                  />
                </button>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground/70">{t("topology.hint")}</p>
          </div>
        </Reveal>
      </div>

      <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted-foreground">{t("topology.disclaimer")}</p>
    </section>
  );
}
