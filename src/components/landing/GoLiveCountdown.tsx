import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { HudCorners } from "@/components/landing/HudCorners";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";

const GO_LIVE = new Date("2026-12-01T00:00:00");

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeParts(): TimeParts {
  const diff = Math.max(0, GO_LIVE.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const UNIT_KEYS: (keyof TimeParts)[] = ["days", "hours", "minutes", "seconds"];

/** HUD-style countdown to go-live, ticking every second with a GSAP flip pulse per digit change. */
export function GoLiveCountdown() {
  const { t } = useTranslation();
  const unitLabels = t("goLive.units", { returnObjects: true }) as Record<
    keyof TimeParts,
    string
  >;
  const refs = useRef<Partial<Record<keyof TimeParts, HTMLSpanElement | null>>>({});
  const hasRunOnce = useRef(false);

  useEffect(() => {
    const motionEnabled = !window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tick = () => {
      const parts = getTimeParts();
      for (const key of UNIT_KEYS) {
        const el = refs.current[key];
        if (!el) continue;
        const value =
          key === "days" ? String(parts[key]) : String(parts[key]).padStart(2, "0");
        if (el.textContent !== value) {
          el.textContent = value;
          if (motionEnabled && hasRunOnce.current) {
            gsap.fromTo(
              el,
              { y: -6, opacity: 0.3 },
              { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
            );
          }
        }
      }
      hasRunOnce.current = true;
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="go-live" className="border-t border-border/60 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("goLive.eyebrow")}
          title={t("goLive.title")}
          description={t("goLive.description")}
        />
      </Reveal>

      <Reveal delay={0.15}>
        <div className="relative mx-auto mt-14 max-w-xl">
          <HudCorners />
          <p className="mb-4 text-center font-mono text-xs tracking-[0.3em] text-primary/80 uppercase">
            {t("goLive.target")}
          </p>
          <div className="grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-border bg-border">
            {UNIT_KEYS.map((key) => (
              <div key={key} className="bg-card px-3 py-6 text-center">
                <span
                  ref={(el) => {
                    refs.current[key] = el;
                  }}
                  className="block font-display text-3xl font-semibold tabular-nums text-primary text-glow sm:text-4xl"
                >
                  00
                </span>
                <span className="mt-1 block font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
                  {unitLabels[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
