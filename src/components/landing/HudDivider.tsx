interface HudDividerProps {
  /** Short mono label, e.g. "SEC-03". Decorative. */
  label: string;
}

/**
 * Thin HUD rule between sections: a gradient line, a data packet that
 * travels along it, and a small sector label. Purely decorative.
 */
export function HudDivider({ label }: HudDividerProps) {
  return (
    <div aria-hidden="true" className="mx-auto flex max-w-6xl items-center gap-3 px-6">
      <span className="font-mono text-[0.6rem] tracking-[0.3em] text-primary/40">{label}</span>
      <div className="relative h-px flex-1 overflow-hidden bg-gradient-to-r from-primary/30 via-primary/10 to-transparent">
        <span className="animate-packet absolute top-1/2 left-0 h-[3px] w-[10%] -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-[var(--hud-reactor)] to-transparent opacity-0" />
      </div>
      <span className="size-1.5 rotate-45 border border-primary/50" />
    </div>
  );
}
