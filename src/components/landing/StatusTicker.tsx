import { gsap } from "gsap";
import { useEffect, useRef } from "react";

const MESSAGES = [
  "NEURAL LINK: STABIL",
  "18/18 NODES ONLINE",
  "INFERENZ-LATENZ: NOMINAL",
  "NETZWERK-SEGMENTIERUNG: AKTIV",
  "GITOPS: SYNCHRONISIERT",
];

/** Rotating single-line HUD readout, cross-faded via GSAP. Static on reduced motion. */
export function StatusTicker() {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let index = 0;
    let cancelled = false;

    const showNext = () => {
      if (cancelled) return;
      index = (index + 1) % MESSAGES.length;
      gsap.to(el, {
        opacity: 0,
        y: -6,
        duration: 0.35,
        ease: "power1.in",
        onComplete: () => {
          if (cancelled) return;
          el.textContent = MESSAGES[index];
          gsap.fromTo(
            el,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.35, ease: "power1.out" },
          );
        },
      });
    };

    const interval = window.setInterval(showNext, 2600);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <span className="inline-flex items-center gap-2">
      <span className="size-1.5 shrink-0 rounded-full bg-[var(--hud-reactor)] shadow-[0_0_6px_var(--hud-reactor)]" />
      <span ref={ref} className="inline-block">
        {MESSAGES[0]}
      </span>
    </span>
  );
}
