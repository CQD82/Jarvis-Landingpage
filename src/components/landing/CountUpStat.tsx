import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface CountUpStatProps {
  /** e.g. "18", "100%" — a leading integer plus an optional suffix. */
  value: string;
  className?: string;
}

/** Animates a stat's digits counting up from 0 once it scrolls into view. */
export function CountUpStat({ value, className }: CountUpStatProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/^(\d+)(.*)$/);
    if (!match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = value;
      return;
    }
    const [, digits, suffix] = match;
    const target = Number(digits);
    el.textContent = `0${suffix}`;

    const counter = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${Math.round(counter.val)}${suffix}`;
          },
        });
      },
    });

    return () => trigger.kill();
  }, [value]);

  return <span ref={ref} className={className} />;
}
