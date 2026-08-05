import { gsap } from "gsap";
import { useEffect, useRef } from "react";
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

const UNITS: { key: keyof TimeParts; label: string }[] = [
  { key: "days", label: "Tage" },
  { key: "hours", label: "Std" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sek" },
];

/** HUD-style countdown to go-live, ticking every second with a GSAP flip pulse per digit change. */
export function GoLiveCountdown() {
  const refs = useRef<Partial<Record<keyof TimeParts, HTMLSpanElement | null>>>({});
  const hasRunOnce = useRef(false);

  useEffect(() => {
    const motionEnabled = !window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tick = () => {
      const parts = getTimeParts();
      for (const { key } of UNITS) {
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
          eyebrow="Zeitplan"
          title="Go-Live Countdown"
          description="Geplanter produktiver Start des gesamten Clusters — vom Bare-Metal-Bootstrap bis zur sprechenden Assistenz."
        />
      </Reveal>

      <Reveal delay={0.15}>
        <div className="relative mx-auto mt-14 max-w-xl">
          <HudCorners />
          <p className="mb-4 text-center font-mono text-xs tracking-[0.3em] text-primary/80 uppercase">
            Zielsetzung · 01. Dezember 2026
          </p>
          <div className="grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-border bg-border">
            {UNITS.map(({ key, label }) => (
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
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
