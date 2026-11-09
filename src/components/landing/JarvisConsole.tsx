import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Simulated replica of the real JARVIS room-display HUD (see the screenshot
 * in the project-status section): node table, voice orb, alerts / backups /
 * GPU panel and a 12-value KPI strip. Values move within the ranges of the
 * real system but are NOT live data — the section disclaimer says so.
 * Weather and heating panels are left out on purpose (location / presence).
 */

interface NodeDef {
  name: string;
  nvme: boolean;
}

/** 17 Kubernetes nodes as on the real HUD; the Pi Zero watchdog sits outside. */
const NODES: NodeDef[] = [
  { name: "pi4-util", nvme: false },
  { name: "odroid", nvme: true },
  ...Array.from({ length: 14 }, (_, i) => ({ name: `pi5-${String(i + 1).padStart(2, "0")}`, nvme: i < 10 })),
  { name: "z840-01", nvme: false },
];

interface Sample {
  temp: number;
  nvme: number;
  cpu: number;
  ram: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function initial(i: number): Sample {
  const isGpu = i === NODES.length - 1;
  return {
    temp: isGpu ? 30 : 42 + ((i * 7) % 9),
    nvme: 34 + ((i * 5) % 8),
    cpu: isGpu ? 2 : 6 + ((i * 3) % 9),
    ram: isGpu ? 14 : 12 + ((i * 4) % 15),
  };
}

function drift(s: Sample, i: number): Sample {
  const isGpu = i === NODES.length - 1;
  const jitter = (n: number) => (Math.random() - 0.5) * n;
  return {
    temp: clamp(s.temp + jitter(1.4), isGpu ? 28 : 36, isGpu ? 36 : 58),
    nvme: clamp(s.nvme + jitter(1), 32, 60),
    cpu: clamp(s.cpu + jitter(3), 1, isGpu ? 8 : 45),
    ram: clamp(s.ram + jitter(1), 10, 30),
  };
}

const GOLD = "#e0a64a";
const DIM = "rgba(232,214,184,0.55)";

export function JarvisConsole() {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const kpiLabels = t("hud.console.kpis", { returnObjects: true }) as string[];
  const [samples, setSamples] = useState<Sample[]>(() => NODES.map((_, i) => initial(i)));
  const [now, setNow] = useState(() => new Date());
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    if (reduceMotion) return () => window.clearInterval(clock);
    const data = window.setInterval(() => {
      setSamples((prev) => prev.map(drift));
      // Mostly idle like the real HUD, with the occasional answer streaming.
      setTokens(Math.random() < 0.25 ? 40 + Math.random() * 15 : 0);
    }, 2000);
    return () => {
      window.clearInterval(clock);
      window.clearInterval(data);
    };
  }, [reduceMotion]);

  const time = now.toLocaleTimeString(i18n.language, { hour: "2-digit", minute: "2-digit" });
  const secs = String(now.getSeconds()).padStart(2, "0");
  const stamp = now.toLocaleTimeString(i18n.language, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString(i18n.language, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const pis = samples.slice(0, -1);
  const cpuAvg = Math.round(pis.reduce((s, n) => s + n.cpu, 0) / pis.length);
  const ramAvg = Math.round(pis.reduce((s, n) => s + n.ram, 0) / pis.length);
  let warm = 0;
  let warmNvme = 0;
  samples.forEach((s, i) => {
    if (s.temp > samples[warm].temp) warm = i;
    if (NODES[i].nvme && (!NODES[warmNvme].nvme || s.nvme > samples[warmNvme].nvme)) warmNvme = i;
  });
  const gpu = samples[samples.length - 1];

  const kpis = [
    "38",
    tokens.toFixed(1),
    "4/4",
    "271",
    "7",
    "15/15",
    `${cpuAvg} %`,
    `${ramAvg} %`,
    `${Math.round(samples[warm].temp)}° ${NODES[warm].name}`,
    `${Math.round(samples[warmNvme].nvme)}° ${NODES[warmNvme].name}`,
    "4.5 %",
    "↓3.4 ↑2.2",
  ];

  const panel = "relative rounded-md border border-[#e0a64a]/25 bg-[#120d07]/90 p-4 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,0_100%)]";
  const heading = "flex items-center gap-2 font-mono text-[0.62rem] font-semibold tracking-[0.28em] uppercase";
  const bar = (pct: number, color: string) => (
    <span className="block h-[3px] overflow-hidden rounded-full bg-[#e8d6b8]/10">
      <span className="block h-full rounded-full transition-[width] duration-700" style={{ width: `${clamp(pct, 2, 100)}%`, background: color }} />
    </span>
  );

  return (
    <div className="relative text-left text-[#e8d6b8]">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e0a64a]/20 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-[#5fae7a] shadow-[0_0_8px_#5fae7a]" />
          <span className="font-display text-sm tracking-[0.4em] sm:text-base" style={{ color: GOLD }}>J.A.R.V.I.S</span>
          <span className="hidden font-mono text-[0.55rem] tracking-[0.25em] uppercase sm:inline" style={{ color: DIM }}>homelab-cluster</span>
        </div>
        <div className="order-3 w-full text-center sm:order-none sm:w-auto">
          <div className="font-display text-3xl tabular-nums sm:text-5xl">
            {time}
            <span className="text-lg sm:text-2xl" style={{ color: DIM }}>:{secs}</span>
          </div>
          <div className="mt-1 font-mono text-[0.58rem] tracking-[0.25em] uppercase" style={{ color: DIM }}>{date}</div>
        </div>
        <div className="text-right font-mono text-[0.55rem] tracking-[0.2em] uppercase">
          <span className="inline-block rounded-full border border-[#5fae7a]/70 px-2.5 py-0.5 text-[#7fd49b]">{t("hud.console.nominal")}</span>
          <div className="mt-1 normal-case tracking-normal" style={{ color: DIM }}>{t("hud.console.stand")} {stamp}</div>
          <div className="mt-0.5 text-[#7fd49b]">{t("hud.console.voiceReady")}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_1fr_1.05fr]">
        {/* Voice orb (first on mobile) */}
        <div className="flex flex-col items-center justify-center py-2 lg:order-2">
          <div className="relative aspect-square w-[min(66vw,16rem)]">
            <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden="true">
              <circle cx="100" cy="100" r="95" fill="none" stroke={GOLD} strokeOpacity="0.45" strokeWidth="0.7" strokeDasharray="1 3" className={reduceMotion ? undefined : "animate-radar-sweep"} style={{ transformOrigin: "100px 100px", animationDuration: "50s" }} />
              <circle cx="100" cy="100" r="86" fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="46 10 14 22 30 12" strokeLinecap="round" className={reduceMotion ? undefined : "animate-radar-sweep"} style={{ transformOrigin: "100px 100px", animationDuration: "28s", animationDirection: "reverse" }} />
              <circle cx="100" cy="100" r="79" fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.6" />
            </svg>
            {/* particle sphere */}
            <div
              aria-hidden="true"
              className={`absolute inset-[24%] rounded-full ${reduceMotion ? "" : "animate-radar-sweep"}`}
              style={{
                animationDuration: "18s",
                background:
                  "radial-gradient(circle, rgba(255,240,205,0.95) 0%, rgba(240,190,110,0.55) 18%, transparent 46%), repeating-conic-gradient(from 0deg, rgba(240,200,140,0.45) 0deg 0.6deg, transparent 0.6deg 7deg)",
                maskImage: "radial-gradient(circle, #000 40%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(circle, #000 40%, transparent 70%)",
              }}
            />
            <div aria-hidden="true" className="absolute inset-[30%] rounded-full shadow-[0_0_70px_24px_rgba(224,166,74,0.25)]" />
          </div>
          <div className="mt-3 font-mono text-[0.6rem] tracking-[0.5em] uppercase" style={{ color: DIM }}>{t("hud.console.standby")}</div>
          <div className="mt-2 text-sm" style={{ color: DIM }}>{t("hud.console.wake")}</div>
        </div>

        {/* Node table */}
        <div className={`${panel} lg:order-1`}>
          <div className={heading} style={{ color: GOLD }}>
            ◇ {t("hud.console.cluster")} <span className="text-[#e8d6b8]">{NODES.length}/{NODES.length}</span>
          </div>
          <div className="mt-3 grid grid-cols-[4.4rem_1fr_2rem_2rem_2.2rem_2.2rem] gap-x-2 font-mono text-[0.5rem] tracking-[0.15em] uppercase" style={{ color: DIM }}>
            <span>Node</span><span>CPU · RAM</span><span className="text-right">°C</span><span className="text-right">NVMe</span><span className="text-right">CPU</span><span className="text-right">RAM</span>
          </div>
          <ul className="mt-1.5 space-y-[3px] font-mono text-[0.66rem]">
            {NODES.map((n, i) => {
              const s = samples[i];
              const hot = s.temp >= 55 || s.nvme >= 58;
              return (
                <li key={n.name} className="grid grid-cols-[4.4rem_1fr_2rem_2rem_2.2rem_2.2rem] items-center gap-x-2">
                  <span className="flex items-center gap-1.5 truncate font-semibold">
                    <span className="size-1.5 shrink-0 rounded-full bg-[#5fae7a]" />
                    {n.name}
                  </span>
                  <span className="space-y-[2px]">
                    {bar(s.cpu * 2, GOLD)}
                    {bar(s.ram * 2, "rgba(232,214,184,0.45)")}
                  </span>
                  <span className="text-right tabular-nums">{Math.round(s.temp)}°</span>
                  <span className="text-right tabular-nums" style={{ color: hot ? GOLD : undefined }}>{n.nvme ? `${Math.round(s.nvme)}°` : "–"}</span>
                  <span className="text-right tabular-nums">{Math.round(s.cpu)}%</span>
                  <span className="text-right tabular-nums" style={{ color: DIM }}>{Math.round(s.ram)}%</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Alerts, backups, GPU */}
        <div className={`${panel} space-y-4 lg:order-3`}>
          <div>
            <div className={heading} style={{ color: GOLD }}>
              ◇ {t("hud.console.alarms")} <span className="text-[#e8d6b8]">0</span>
            </div>
            <p className="mt-2 border-l-2 border-[#5fae7a] pl-2 text-xs" style={{ color: DIM }}>{t("hud.console.noAlarms")}</p>
          </div>
          <div>
            <div className={heading} style={{ color: GOLD }}>◇ {t("hud.console.backup")}</div>
            <dl className="mt-2 space-y-1 text-xs">
              {[
                [t("hud.console.velero"), t("hud.console.hoursAgo", { h: 6 })],
                [t("hud.console.cnpg"), t("hud.console.active")],
                [t("hud.console.restore"), t("hud.console.hoursAgo", { h: 86 })],
                [t("hud.console.metrics"), t("hud.console.hoursAgo", { h: 16 })],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <dt>{k}</dt>
                  <dd className="font-semibold text-[#7fd49b]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <div className={heading} style={{ color: GOLD }}>◇ Z840 · RTX 5060 Ti</div>
            <dl className="mt-2 space-y-1.5 text-xs">
              {[
                ["GPU", `${tokens > 0 ? Math.round(60 + tokens / 2) : 0} %`, tokens > 0 ? 70 : 0],
                ["VRAM", "15.0 / 15.9 GB", 94],
                ["CPU", `${Math.round(gpu.cpu)} %`, gpu.cpu],
                ["RAM", `9.0 GB · ${Math.round(gpu.ram)} %`, gpu.ram],
              ].map(([k, v, pct]) => (
                <div key={String(k)} className="grid grid-cols-[3.2rem_1fr_auto] items-center gap-2">
                  <dt style={{ color: DIM }}>{k}</dt>
                  <span>{bar(Number(pct), `linear-gradient(90deg, #b86b2a, ${GOLD})`)}</span>
                  <dd className="font-semibold tabular-nums">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-2">
                <dt style={{ color: DIM }}>{t("hud.console.gpuTemp")}</dt>
                <dd className="font-semibold tabular-nums">{Math.round(gpu.temp + (tokens > 0 ? 18 : 5))} °C</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt style={{ color: DIM }}>{t("hud.console.gpuPower")}</dt>
                <dd className="font-semibold tabular-nums">{tokens > 0 ? Math.round(120 + tokens) : 4} W / 180 W</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* KPI strip: 2 × 6 like the real HUD */}
      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[#e0a64a]/25 bg-[#e0a64a]/15 sm:grid-cols-3 lg:grid-cols-6">
        {kpiLabels.map((label, i) => (
          <div key={label} className="bg-[#120d07] px-2 py-2.5 text-center">
            <dt className="font-mono text-[0.48rem] tracking-[0.2em] uppercase" style={{ color: DIM }}>{label}</dt>
            <dd className="mt-1 font-display text-base tabular-nums sm:text-lg">{kpis[i]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
