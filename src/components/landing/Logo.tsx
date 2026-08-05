/**
 * JARVIS mark: a hexagonal HUD emblem — six gold targeting ticks/frame
 * around a glowing white-cyan "arc reactor" core. Echoes the hexagonal
 * layout of the SystemMap section so the brand mark and the system
 * diagram read as the same visual language.
 */
interface LogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

const HEX_POINTS = "24,6 39.59,15 39.59,33 24,42 8.41,33 8.41,15";
const TICKS: [number, number, number, number][] = [
  [24, 6, 24, 2],
  [39.59, 15, 43.05, 13],
  [39.59, 33, 43.05, 35],
  [24, 42, 24, 46],
  [8.41, 33, 4.95, 35],
  [8.41, 15, 4.95, 13],
];

export function Logo({ size = 28, animated = true, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="JARVIS"
    >
      <defs>
        <radialGradient id="jarvis-logo-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--hud-reactor)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--hud-reactor)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {TICKS.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--hud-gold)"
          strokeOpacity={0.6}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ))}

      <polygon
        points={HEX_POINTS}
        fill="none"
        stroke="var(--hud-gold)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      <circle cx={24} cy={24} r={11} fill="url(#jarvis-logo-core)" className={animated ? "animate-pulse" : undefined} />
      <circle cx={24} cy={24} r={3} fill="var(--hud-reactor)" />
    </svg>
  );
}
