import { motion, useReducedMotion } from "framer-motion";

/**
 * JARVIS mark: a hexagonal HUD emblem, built as an actual extruded 3D
 * prism (not a flat icon with a fake rotateY wobble) — six glass side
 * panels form a short hexagonal drum, capped top and bottom by the hex
 * bezel + glowing arc-reactor core. A fixed baseline tilt means it reads
 * as a 3D object even in a single still frame; a slow continuous spin on
 * top of that tilt is what makes it feel alive.
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

function HexCap({ dim }: { dim: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="absolute inset-0 size-full" aria-hidden="true">
      {!dim &&
        TICKS.map(([x1, y1, x2, y2], i) => (
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
        fill={dim ? "rgba(242,181,69,0.06)" : "rgba(242,181,69,0.08)"}
        stroke="var(--hud-gold)"
        strokeOpacity={dim ? 0.35 : 1}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {!dim && (
        <>
          <defs>
            <radialGradient id="jarvis-logo-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--hud-reactor)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="var(--hud-reactor)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={24} cy={24} r={13} fill="url(#jarvis-logo-core)" className="animate-pulse" />
          <circle cx={24} cy={24} r={3.5} fill="var(--hud-reactor)" />
        </>
      )}
    </svg>
  );
}

export function Logo({ size = 28, animated = true, className }: LogoProps) {
  const reduceMotion = useReducedMotion();
  const spin = animated && !reduceMotion;

  const R = size * 0.34;
  const apothem = (R * Math.sqrt(3)) / 2;
  const sideLen = R;
  const drumHeight = size * 0.3;
  const capSize = R * 2;

  return (
    <div style={{ width: size, height: size, perspective: size * 7 }} className={className} role="img" aria-label="JARVIS">
      <motion.div
        className="relative size-full"
        style={{
          transformStyle: "preserve-3d",
          rotateX: -20,
          rotateY: 0,
        }}
        animate={spin ? { rotateY: 360 } : undefined}
        transition={spin ? { duration: 10, repeat: Infinity, ease: "linear" } : undefined}
      >
        {/* six glass side panels forming the drum wall */}
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{
              width: sideLen,
              height: drumHeight,
              marginLeft: -sideLen / 2,
              marginTop: -drumHeight / 2,
              background:
                "linear-gradient(to bottom, color-mix(in oklab, var(--hud-gold) 22%, transparent), color-mix(in oklab, var(--hud-gold) 4%, transparent))",
              borderLeft: "1px solid color-mix(in oklab, var(--hud-gold) 70%, transparent)",
              borderRight: "1px solid color-mix(in oklab, var(--hud-gold) 70%, transparent)",
              transform: `rotateY(${i * 60}deg) translateZ(${apothem}px)`,
            }}
          />
        ))}

        {/* top cap: hex bezel + reactor core, facing up */}
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            width: capSize,
            height: capSize,
            marginLeft: -capSize / 2,
            marginTop: -capSize / 2,
            transform: `rotateX(90deg) translateZ(${drumHeight / 2}px)`,
          }}
        >
          <HexCap dim={false} />
        </div>

        {/* bottom cap: dim hex outline, facing down */}
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            width: capSize,
            height: capSize,
            marginLeft: -capSize / 2,
            marginTop: -capSize / 2,
            transform: `rotateX(90deg) translateZ(${-drumHeight / 2}px)`,
          }}
        >
          <HexCap dim />
        </div>
      </motion.div>
    </div>
  );
}
