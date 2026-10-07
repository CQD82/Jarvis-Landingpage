import { motion, useReducedMotion } from "framer-motion";

/**
 * JARVIS mark: a hexagonal HUD emblem — six gold targeting ticks/frame
 * around a glowing white-cyan "arc reactor" core. Echoes the hexagonal
 * layout of the SystemMap section (and the HowItWorks hex nodes) so the
 * brand mark, the system diagram, and the flow diagram read as the same
 * visual language.
 *
 * When animated, it's a genuine 3D object rather than a flat icon: the
 * ticks sit behind the hex frame, the reactor core floats in front of it,
 * and `transform-style: preserve-3d` + a slow rotateY lets perspective
 * actually separate those layers as it turns — the same technique as the
 * HowItWorks hex nodes, just applied to the brand mark itself.
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
  const reduceMotion = useReducedMotion();
  const spin = animated && !reduceMotion;

  return (
    <div
      style={{ width: size, height: size, perspective: size * 9 }}
      className={className}
      role="img"
      aria-label="JARVIS"
    >
      <motion.div
        className="relative size-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={spin ? { rotateY: [0, 20, 0, -20, 0] } : undefined}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* back layer: targeting ticks, set behind the frame */}
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-0 size-full"
          style={{ transform: "translateZ(-7px)" }}
          aria-hidden="true"
        >
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
        </svg>

        {/* mid layer: the hex bezel */}
        <svg viewBox="0 0 48 48" className="absolute inset-0 size-full" aria-hidden="true">
          <polygon
            points={HEX_POINTS}
            fill="none"
            stroke="var(--hud-gold)"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>

        {/* front layer: the reactor core, floating closest to the viewer */}
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-0 size-full"
          style={{ transform: "translateZ(7px)" }}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="jarvis-logo-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--hud-reactor)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--hud-reactor)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle
            cx={24}
            cy={24}
            r={11}
            fill="url(#jarvis-logo-core)"
            className={animated ? "animate-pulse" : undefined}
          />
          <circle cx={24} cy={24} r={3} fill="var(--hud-reactor)" />
        </svg>
      </motion.div>
    </div>
  );
}
