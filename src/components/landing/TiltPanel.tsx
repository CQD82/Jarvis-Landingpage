import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { useRef } from "react";

interface TiltPanelProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the panel's edge. */
  maxTiltX?: number;
  maxTiltY?: number;
  /** Holographic sheen + scanning glint overlay. Default on; some panels (e.g. a photo with its own glow treatment) turn it off. */
  sheen?: boolean;
}

/**
 * Any panel (HUD console, hero image, …) tilted in 3D toward the cursor —
 * desktop only, a no-op without a pointer — with a holographic sheen that
 * slides across the glass following the tilt, plus a diagonal scanning
 * glint (the same keyframes as the KITT HUD skin), like light catching an
 * angled display.
 */
export function TiltPanel({ children, className, maxTiltX = 7, maxTiltY = 9, sheen = true }: TiltPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [maxTiltX, -maxTiltX]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-maxTiltY, maxTiltY]), {
    stiffness: 150,
    damping: 18,
  });
  const sheenX = useTransform(pointerX, [-0.5, 0.5], ["10%", "90%"]);
  const sheenY = useTransform(pointerY, [-0.5, 0.5], ["10%", "90%"]);
  const sheenBackground = useTransform(
    [sheenX, sheenY],
    // Explicit ellipse size (not "circle"/farthest-corner): width/height
    // percentages are each relative to the panel's own width/height, so the
    // glow covers the same proportion of the panel regardless of its aspect
    // ratio — a "circle ... 55%" sized off the diagonal left tall mobile
    // panels (e.g. the flow diagram's stacked stages) with the glow fading
    // out before it reached the bottom.
    ([x, y]) => `radial-gradient(ellipse 75% 75% at ${x} ${y}, rgba(255,255,255,0.12), transparent 100%)`,
  );

  function handlePointerMove(event: ReactMouseEvent<HTMLDivElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div style={{ perspective: 1400 }}>
      <motion.div
        ref={ref}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className={className}
      >
        {sheen && (
          <>
            {/* Holographic sheen that follows the tilt */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-10"
              style={{ background: sheenBackground }}
              aria-hidden="true"
            />
            {/* Diagonal scanning glint, same keyframes as the KITT HUD skin */}
            <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
              <div className="animate-kitt-scan absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </>
        )}
        {children}
      </motion.div>
    </div>
  );
}
