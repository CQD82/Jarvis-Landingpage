import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Simulated cluster journal. Generic, harmless event lines only — no
 * hostnames, addresses or real configuration, in line with the site's
 * "nothing internal is published" rule.
 */
const EVENTS: { tag: string; msg: string }[] = [
  { tag: "flux", msg: "reconciled kustomization apps-ai · 0 drift" },
  { tag: "tetragon", msg: "policy bifrost-runtime enforced · 0 violations" },
  { tag: "cilium", msg: "wireguard mesh healthy · 18/18 peers" },
  { tag: "kyverno", msg: "admission: image signature verified (cosign)" },
  { tag: "bifrost", msg: "route jarvis-chat → gpu tier · 42 ms" },
  { tag: "llama-swap", msg: "model warm · context 64k" },
  { tag: "vision", msg: "known face tracked · ptz locked" },
  { tag: "velero", msg: "nightly backup verified · restore test ok" },
  { tag: "falco", msg: "runtime scan clean · 0 alerts" },
  { tag: "renovate", msg: "opened PR: chore(deps) minor updates" },
  { tag: "hailo", msg: "edge intent classified in 9 ms" },
  { tag: "kured", msg: "no reboot required · kernel current" },
];

const MAX_LINES = 6;
const CHAR_MS = 16;
const LINE_PAUSE_MS = 900;

function stamp(offsetS: number): string {
  const d = new Date(Date.now() - offsetS * 1000);
  return d.toTimeString().slice(0, 8);
}

interface Line {
  id: number;
  time: string;
  tag: string;
  msg: string;
}

export function LiveTerminal() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });

  const [lines, setLines] = useState<Line[]>(() =>
    EVENTS.slice(0, 3).map((e, i) => ({ id: i, time: stamp(30 - i * 9), ...e })),
  );
  const [typing, setTyping] = useState("");
  const next = useRef(3);

  useEffect(() => {
    if (reduceMotion || !inView) return;
    let cancelled = false;
    let timer = 0;

    const typeLine = () => {
      if (cancelled) return;
      const event = EVENTS[next.current % EVENTS.length];
      const full = event.msg;
      let i = 0;
      const step = () => {
        if (cancelled) return;
        i += 1;
        setTyping(full.slice(0, i));
        if (i < full.length) {
          timer = window.setTimeout(step, CHAR_MS);
        } else {
          setLines((prev) =>
            [...prev, { id: next.current, time: stamp(0), ...event }].slice(-MAX_LINES),
          );
          setTyping("");
          next.current += 1;
          timer = window.setTimeout(typeLine, LINE_PAUSE_MS);
        }
      };
      step();
    };
    timer = window.setTimeout(typeLine, LINE_PAUSE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [inView, reduceMotion]);

  const pending = EVENTS[next.current % EVENTS.length];

  return (
    <div
      ref={ref}
      role="img"
      aria-label={t("liveTerminal.label")}
      className="relative overflow-hidden rounded-xl border border-primary/25 bg-background/80 text-left shadow-[0_0_40px_-12px_color-mix(in_oklab,var(--hud-gold)_35%,transparent)] backdrop-blur"
    >
      <div className="flex items-center gap-2 border-b border-primary/15 px-3 py-2">
        <span className="size-2 rounded-full bg-[var(--hud-red)]/80" />
        <span className="size-2 rounded-full bg-primary/70" />
        <span className="size-2 rounded-full bg-[var(--hud-reactor)]/70" />
        <span className="ml-2 truncate font-mono text-[0.65rem] tracking-wider text-muted-foreground">
          {t("liveTerminal.title")}
        </span>
        <span className="ml-auto rounded-sm border border-primary/30 px-1.5 py-0.5 font-mono text-[0.55rem] tracking-widest text-primary/80 uppercase">
          {t("liveTerminal.badge")}
        </span>
      </div>
      <div aria-hidden="true" className="h-[9.5rem] space-y-1 overflow-hidden px-3 py-2.5 font-mono text-[0.68rem] leading-relaxed sm:text-xs">
        {lines.map((line) => (
          <p key={line.id} className="truncate">
            <span className="text-muted-foreground/60">{line.time} </span>
            <span className="text-primary">{line.tag}</span>
            <span className="text-muted-foreground/60"> │ </span>
            <span className="text-foreground/85">{line.msg}</span>
          </p>
        ))}
        {!reduceMotion ? (
          <p className="truncate">
            <span className="text-muted-foreground/60">{stamp(0)} </span>
            <span className="text-primary">{typing ? pending.tag : ""}</span>
            <span className="text-muted-foreground/60">{typing ? " │ " : ""}</span>
            <span className="text-[var(--hud-reactor)]">{typing}</span>
            <span className="animate-rec-blink ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-primary" />
          </p>
        ) : null}
      </div>
      {/* scanline sheen */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_2px,rgba(242,181,69,0.025)_3px)]" />
    </div>
  );
}
