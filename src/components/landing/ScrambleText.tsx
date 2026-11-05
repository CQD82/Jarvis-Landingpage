import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/\\=";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Total decode time in ms. */
  duration?: number;
}

/**
 * HUD-style "decoding" text: characters resolve left to right from random
 * glyphs once the element scrolls into view. Screen readers get the final
 * text immediately; the animated glyphs are aria-hidden. Static under
 * prefers-reduced-motion.
 */
export function ScrambleText({ text, className, duration = 900 }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduceMotion) {
      setDisplay(text);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const resolved = Math.floor(progress * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out += i < resolved || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setDisplay(out);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, text, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
