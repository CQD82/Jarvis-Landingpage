import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MatrixRain } from "@/components/landing/MatrixRain";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { useSimulatedTelemetry } from "@/components/landing/useSimulatedTelemetry";

type HudKey = "jarvis" | "kitt" | "matrix";

interface HudTheme {
  panelBg: string;
  color: string;
  borderIdle: string;
  borderOn: string;
}

const THEMES: Record<HudKey, HudTheme> = {
  jarvis: {
    panelBg: "#0c0705",
    color: "#f2b545",
    borderIdle: "rgba(242, 181, 69, 0.15)",
    borderOn: "rgba(242, 181, 69, 0.55)",
  },
  kitt: {
    panelBg: "#0a0000",
    color: "#ef4444",
    borderIdle: "rgba(239, 68, 68, 0.15)",
    borderOn: "rgba(239, 68, 68, 0.6)",
  },
  matrix: {
    panelBg: "#000500",
    color: "#22c55e",
    borderIdle: "rgba(34, 197, 94, 0.15)",
    borderOn: "rgba(34, 197, 94, 0.6)",
  },
};

const HUD_KEYS: HudKey[] = ["jarvis", "kitt", "matrix"];

export function LiveHud() {
  const { t } = useTranslation();
  const [active, setActive] = useState<HudKey>("jarvis");
  const { nodes, powerW } = useSimulatedTelemetry();
  const theme = THEMES[active];

  return (
    <section id="hud" className="border-t border-border/60 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("hud.eyebrow")}
          title={t("hud.title")}
          description={t("hud.description")}
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-10 flex max-w-xl justify-center gap-2">
          {HUD_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`rounded-md border px-4 py-1.5 font-mono text-xs tracking-wide transition-colors ${
                active === key
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(`hud.tabs.${key}`)}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div
          className="relative mx-auto mt-8 max-w-3xl overflow-hidden rounded-xl border p-6 transition-colors duration-500"
          style={{ background: theme.panelBg, borderColor: theme.borderOn }}
        >
          {active === "matrix" ? (
            <MatrixRain className="pointer-events-none absolute inset-0 size-full opacity-30" />
          ) : null}
          {active === "kitt" ? (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 overflow-hidden">
              <div
                className="animate-kitt-scan h-full w-1/3"
                style={{
                  background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)`,
                }}
              />
            </div>
          ) : null}

          <div className="relative flex flex-col items-center gap-1 text-center">
            <span
              className="font-mono text-[0.7rem] tracking-[0.3em] uppercase"
              style={{ color: theme.color, opacity: 0.75 }}
            >
              {t("hud.powerLabel")}
            </span>
            <span
              className="font-display text-4xl font-bold tabular-nums sm:text-5xl"
              style={{ color: theme.color, textShadow: `0 0 18px ${theme.color}` }}
            >
              {powerW} W
            </span>
          </div>

          <div className="relative mt-8 grid grid-cols-6 gap-2 sm:grid-cols-9">
            {nodes.map((node) => {
              const isOnline = node.status === "online";
              return (
                <div
                  key={node.id}
                  className="flex flex-col items-center justify-center gap-1 rounded border py-2 font-mono text-[0.55rem] transition-colors duration-500"
                  style={{
                    borderColor: isOnline ? theme.borderOn : theme.borderIdle,
                    color: isOnline ? theme.color : "rgba(255,255,255,0.25)",
                    boxShadow: isOnline ? `0 0 8px ${theme.color}55` : undefined,
                  }}
                >
                  <span>{node.id}</span>
                  <span className="opacity-70">
                    {isOnline ? t("hud.nodeOnline") : t("hud.nodeSuspended")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mx-auto mt-6 max-w-xl text-center font-mono text-[0.65rem] text-muted-foreground">
          {t("hud.disclaimer")}
        </p>
      </Reveal>
    </section>
  );
}
