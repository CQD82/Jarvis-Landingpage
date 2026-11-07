import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * The "JARVIS" skin of the Live-HUD, modelled on the real wall HUD of the
 * cluster: node list with load and temperature, an arc-reactor orb in the
 * centre, alerts/backups/AI tiers on the right and a KPI strip below.
 * All values are simulated (see the section disclaimer) — plausible ranges
 * taken from the real dashboard, no live connection, no addresses.
 */

const NODE_NAMES = [
  "pi4-util",
  "odroid",
  ...Array.from({ length: 14 }, (_, i) => `pi5-${String(i + 1).padStart(2, "0")}`),
];

interface NodeSample {
  name: string;
  temp: number;
  cpu: number;
}

function sample(prev?: NodeSample[]): NodeSample[] {
  return NODE_NAMES.map((name, i) => {
    const base = prev?.[i];
    const temp = base ? base.temp + (Math.random() - 0.5) * 1.6 : 38 + Math.random() * 10;
    const cpu = base ? base.cpu + (Math.random() - 0.5) * 3 : 5 + Math.random() * 10;
    return {
      name,
      temp: Math.min(55, Math.max(34, temp)),
      cpu: Math.min(40, Math.max(3, cpu)),
    };
  });
}

interface JarvisConsoleProps {
  gpuOnline: boolean;
}

export function JarvisConsole({ gpuOnline }: JarvisConsoleProps) {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const kpiLabels = t("hud.console.kpis", { returnObjects: true }) as string[];
  const [nodes, setNodes] = useState<NodeSample[]>(() => sample());
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setNodes((prev) => sample(prev));
      setNow(new Date());
    }, 2000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const all = gpuOnline ? [...nodes, { name: "z840", temp: 52, cpu: 64 }] : nodes;
  const online = all.length;
  const total = nodes.length + 1;
  const avgCpu = Math.round(all.reduce((s, n) => s + n.cpu, 0) / all.length);
  const warmest = all.reduce((a, b) => (b.temp > a.temp ? b : a));
  const reqPerHour = gpuOnline ? 48 + Math.round(Math.random() * 20) : Math.round(Math.random() * 3);
  const tokens = gpuOnline ? (38 + Math.random() * 8).toFixed(1) : "0.0";
  const ram = 21 + (gpuOnline ? 3 : 0);

  const time = now.toLocaleTimeString(i18n.language, { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString(i18n.language, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const kpis = [
    String(reqPerHour),
    tokens,
    "4/4",
    `${avgCpu} %`,
    `${ram} %`,
    `${Math.round(warmest.temp)}° ${warmest.name}`,
    "12/12",
    `↓${(4 + Math.random() * 2).toFixed(1)} ↑${(2 + Math.random()).toFixed(1)}`,
  ];

  const panel = "relative rounded-lg border border-[#f2b545]/20 bg-[#0d1119]/80 p-4";
  const heading = "flex items-center gap-2 font-mono text-[0.65rem] font-semibold tracking-[0.25em] text-[#f2b545] uppercase";

  return (
    <div className="relative text-left text-[#e8dcc8]">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f2b545]/15 pb-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#5ce1e6] shadow-[0_0_8px_#5ce1e6]" />
          <span className="font-display text-sm tracking-[0.35em] sm:text-base">J.A.R.V.I.S</span>
          <span className="hidden font-mono text-[0.55rem] tracking-[0.25em] text-[#e8dcc8]/60 uppercase sm:inline">homelab-cluster</span>
        </div>
        <div className="order-3 w-full text-center sm:order-none sm:w-auto">
          <div className="font-display text-3xl tabular-nums sm:text-4xl">{time}</div>
          <div className="font-mono text-[0.6rem] tracking-[0.2em] text-[#e8dcc8]/70 uppercase">{date}</div>
        </div>
        <div className="text-right">
          <span className="inline-block rounded-full border border-[#5ce1e6]/70 px-2.5 py-0.5 font-mono text-[0.55rem] tracking-[0.2em] text-[#5ce1e6] uppercase">
            {t("hud.console.nominal")}
          </span>
          <div className="mt-1 font-mono text-[0.55rem] tracking-[0.2em] text-[#5ce1e6]/80 uppercase">{t("hud.console.voiceReady")}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.15fr_1fr]">
        {/* Orb (first on mobile) */}
        <div className="flex flex-col items-center justify-center py-2 lg:order-2">
          <div className="relative aspect-square w-[min(68vw,15rem)]">
            <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden="true">
              <circle cx="100" cy="100" r="94" fill="none" stroke="#f2b545" strokeOpacity="0.5" strokeWidth="0.8" strokeDasharray="1 3" className={reduceMotion ? undefined : "animate-radar-sweep"} style={{ transformOrigin: "100px 100px", animationDuration: "40s" }} />
              <circle cx="100" cy="100" r="86" fill="none" stroke="#f2b545" strokeWidth="2.2" strokeDasharray="38 16 8 16" strokeLinecap="round" className={reduceMotion ? undefined : "animate-radar-sweep"} style={{ transformOrigin: "100px 100px", animationDuration: "24s", animationDirection: "reverse" }} />
              <circle cx="100" cy="100" r="78" fill="none" stroke="#f2b545" strokeOpacity="0.35" strokeWidth="0.6" />
            </svg>
            {/* swirling particle disc */}
            <div className={`absolute inset-[22%] rounded-full ${reduceMotion ? "" : "animate-radar-sweep"}`} style={{ animationDuration: "9s", background: "repeating-conic-gradient(from 0deg, rgba(255,226,170,0.55) 0deg 1.2deg, transparent 1.2deg 9deg)", maskImage: "radial-gradient(circle, transparent 18%, #000 30%, #000 60%, transparent 72%)", WebkitMaskImage: "radial-gradient(circle, transparent 18%, #000 30%, #000 60%, transparent 72%)" }} aria-hidden="true" />
            <div className={`absolute inset-[28%] rounded-full ${reduceMotion ? "" : "animate-radar-sweep"}`} style={{ animationDuration: "14s", animationDirection: "reverse", background: "repeating-conic-gradient(from 20deg, rgba(242,181,69,0.5) 0deg 0.8deg, transparent 0.8deg 13deg)", maskImage: "radial-gradient(circle, transparent 25%, #000 40%, transparent 70%)", WebkitMaskImage: "radial-gradient(circle, transparent 25%, #000 40%, transparent 70%)" }} aria-hidden="true" />
            {/* core */}
            <div className="absolute inset-[38%] rounded-full bg-[radial-gradient(circle,#fff8e7_0%,#ffd27a_30%,rgba(242,181,69,0.35)_60%,transparent_75%)] shadow-[0_0_60px_20px_rgba(242,181,69,0.35)]" aria-hidden="true" />
          </div>
          <div className="mt-4 font-mono text-[0.6rem] tracking-[0.45em] uppercase">{t("hud.console.standby")}</div>
          <div className="mt-1 text-sm text-[#5ce1e6]">{t("hud.console.wake")}</div>
        </div>

        {/* Node list */}
        <div className={`${panel} lg:order-1`}>
          <div className={heading}>
            <span>◇ {t("hud.console.cluster")}</span>
            <span className="text-[#e8dcc8]">{online}/{total}</span>
          </div>
          <ul className="mt-3 space-y-1 font-mono text-[0.68rem]">
            {all.map((n) => (
              <li key={n.name} className="grid grid-cols-[4.6rem_1fr_2.6rem_2.4rem] items-center gap-2">
                <span className="flex items-center gap-1.5 truncate">
                  <span className={`size-1.5 shrink-0 rounded-full ${n.name === "z840" ? "bg-[#f2b545] shadow-[0_0_6px_#f2b545]" : "bg-[#5ce1e6]"}`} />
                  {n.name}
                </span>
                <span className="h-1 overflow-hidden rounded-full bg-[#e8dcc8]/10">
                  <span className="block h-full rounded-full bg-gradient-to-r from-[#e8dcc8]/80 to-[#f2b545] transition-[width] duration-700" style={{ width: `${Math.round(n.cpu * 2.2)}%` }} />
                </span>
                <span className="text-right tabular-nums">{Math.round(n.temp)}°C</span>
                <span className="text-right tabular-nums text-[#e8dcc8]/70">{Math.round(n.cpu)}%</span>
              </li>
            ))}
            {!gpuOnline ? (
              <li className="grid grid-cols-[4.6rem_1fr] items-center gap-2 text-[#e8dcc8]/40">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full border border-[#e8dcc8]/40" />
                  z840
                </span>
                <span className="text-[0.6rem] tracking-widest uppercase">wake-on-lan · {t("hud.console.asleep")}</span>
              </li>
            ) : null}
          </ul>
        </div>

        {/* Right column */}
        <div className={`${panel} space-y-4 lg:order-3`}>
          <div>
            <div className={heading}>◇ {t("hud.console.tiers")}</div>
            <dl className="mt-2 space-y-1 text-xs">
              {[
                [t("hud.console.gpu"), gpuOnline ? t("hud.console.awake") : t("hud.console.asleep"), gpuOnline],
                [t("hud.console.cpu"), t("hud.console.ready"), true],
                [t("hud.console.edge"), "4/4", true],
              ].map(([k, v, on]) => (
                <div key={String(k)} className="flex justify-between gap-2">
                  <dt>{k}</dt>
                  <dd className={on ? "text-[#5ce1e6]" : "text-[#e8dcc8]/50"}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <div className={heading}>
              ◇ {t("hud.console.alarms")} <span className="text-[#e8dcc8]">0</span>
            </div>
            <p className="mt-2 border-l-2 border-[#5ce1e6] pl-2 text-xs">{t("hud.console.noAlarms")}</p>
          </div>
          <div>
            <div className={heading}>◇ {t("hud.console.backup")}</div>
            <dl className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between gap-2">
                <dt>{t("hud.console.velero")}</dt>
                <dd className="text-[#5ce1e6]">{t("hud.console.hoursAgo", { h: 22 })}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>{t("hud.console.cnpg")}</dt>
                <dd className="text-[#5ce1e6]">{t("hud.console.active")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#f2b545]/20 bg-[#f2b545]/15 sm:grid-cols-4 lg:grid-cols-8">
        {kpiLabels.map((label, i) => (
          <div key={label} className="bg-[#0d1119] px-2 py-2.5 text-center">
            <dt className="font-mono text-[0.5rem] tracking-[0.18em] text-[#e8dcc8]/60 uppercase">{label}</dt>
            <dd className="mt-1 font-display text-base tabular-nums text-[#e8dcc8] sm:text-lg">{kpis[i]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
