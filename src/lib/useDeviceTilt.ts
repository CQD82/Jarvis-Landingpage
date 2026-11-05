import { useEffect, useRef } from "react";

/**
 * Tilts the referenced element with the phone's orientation (gyroscope).
 * Only where no permission prompt is needed (Android/Chromium) — iOS gates
 * DeviceOrientationEvent behind requestPermission(), and an unprompted
 * permission dialog on page load would be worse than no effect. Off for
 * fine pointers (desktop uses the pointer tilt) and under reduced motion.
 * Writes the transform straight to the element, once per animation frame.
 */
export function useDeviceTilt<T extends HTMLElement>(maxDeg = 8) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const DOE = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: unknown } }).DeviceOrientationEvent;
    if (!DOE || typeof DOE.requestPermission === "function") return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let base: { b: number; g: number } | null = null;
    const clamp = (v: number) => Math.max(-maxDeg, Math.min(maxDeg, v));

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      // Calibrate against however the phone is held when the page opens.
      base ??= { b: e.beta, g: e.gamma };
      const rx = clamp((base.b - e.beta) * 0.35);
      const ry = clamp((e.gamma - base.g) * 0.35);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    };
    window.addEventListener("deviceorientation", onOrient);
    return () => {
      window.removeEventListener("deviceorientation", onOrient);
      cancelAnimationFrame(frame);
      el.style.transform = "";
    };
  }, [maxDeg]);

  return ref;
}
