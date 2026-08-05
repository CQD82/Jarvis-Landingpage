import { gsap } from "gsap";
import { useEffect, useRef } from "react";

const SIZE = 520;

/** Soft gold spotlight that trails the pointer. Skipped on touch devices and reduced motion. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!hasFinePointer || prefersReducedMotion) return;

    const xTo = gsap.quickTo(el, "left", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "top", { duration: 0.7, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX - SIZE / 2);
      yTo(e.clientY - SIZE / 2);
      el.style.opacity = "1";
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed -z-10 rounded-full opacity-0 mix-blend-screen"
      style={{
        width: SIZE,
        height: SIZE,
        background:
          "radial-gradient(circle, color-mix(in oklab, var(--hud-gold) 13%, transparent), transparent 70%)",
      }}
    />
  );
}
