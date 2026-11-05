import type { PointerEvent } from "react";

/**
 * Writes the pointer position (relative to the element) into the --mx/--my
 * custom properties that drive the .holo-card spotlight. A style write per
 * move, no React state, so no re-renders.
 */
export function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}
