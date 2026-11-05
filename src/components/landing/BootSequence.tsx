import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const STORAGE_KEY = "jarvis-booted";
const BOOT_MS = 1500;

const LINES = [
  "JARVIS v5.5 // COLD BOOT",
  "NEURAL LINK ............ OK",
  "CLUSTER MESH ........... 18/18",
  "ZERO-TRUST POLICIES .... ARMED",
  "INFERENCE TIERS ........ ONLINE",
];

function alreadyBooted(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markBooted() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* storage blocked (private mode etc.) — boot just shows again */
  }
}

/**
 * A short terminal-style boot overlay, shown once per browser session.
 * Decorative only (aria-hidden), skippable by click or any key, and never
 * shown under prefers-reduced-motion.
 */
export function BootSequence() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => !alreadyBooted());

  useEffect(() => {
    if (!visible) return;
    if (reduceMotion) {
      setVisible(false);
      return;
    }
    markBooted();
    const done = () => setVisible(false);
    const timer = window.setTimeout(done, BOOT_MS);
    window.addEventListener("keydown", done, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", done);
    };
  }, [visible, reduceMotion]);

  return (
    <AnimatePresence>
      {visible && !reduceMotion ? (
        <motion.div
          aria-hidden="true"
          onClick={() => setVisible(false)}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-background"
        >
          <div className="w-[min(92vw,26rem)] font-mono text-xs tracking-wider text-primary sm:text-sm">
            {LINES.map((line, i) => (
              <p
                key={line}
                className="animate-boot-line whitespace-pre"
                style={{ animationDelay: `${i * 180}ms` }}
              >
                <span className="text-primary/50">&gt; </span>
                {line}
              </p>
            ))}
            <div className="mt-5 h-px w-full overflow-hidden bg-primary/15">
              <div className="animate-boot-bar h-full w-full bg-gradient-to-r from-[var(--hud-red)] via-primary to-[var(--hud-reactor)]" />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
