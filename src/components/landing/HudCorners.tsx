/**
 * Decorative targeting-frame corners (FUI/HUD staple). Drop inside any
 * `relative` container: `<div className="relative">...<HudCorners /></div>`.
 */
export function HudCorners() {
  return (
    <div className="pointer-events-none absolute -inset-2" aria-hidden="true">
      <span className="absolute top-0 left-0 size-3 border-t-2 border-l-2 border-primary/60" />
      <span className="absolute top-0 right-0 size-3 border-t-2 border-r-2 border-primary/60" />
      <span className="absolute bottom-0 left-0 size-3 border-b-2 border-l-2 border-primary/60" />
      <span className="absolute right-0 bottom-0 size-3 border-r-2 border-b-2 border-primary/60" />
    </div>
  );
}
