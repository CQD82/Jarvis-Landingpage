import { motion, useScroll, useSpring } from "framer-motion";

/** Thin glowing progress line pinned to the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-primary via-[var(--hud-violet)] to-primary shadow-[0_0_8px_var(--hud-cyan)]"
      aria-hidden="true"
    />
  );
}
