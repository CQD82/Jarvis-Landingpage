import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import { HudCorners } from "@/components/landing/HudCorners";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { TiltPanel } from "@/components/landing/TiltPanel";
import { howItWorksStageIcons } from "@/data/jarvis";

interface Stage {
  title: string;
  items: string[];
}

const HEX_POINTS = "24,4 41.6,14 41.6,34 24,44 6.4,34 6.4,14";
const CYCLE = 3.2;
const STEP = CYCLE / 4;

/**
 * Hexagonal node badge, built as a true 3D object (preserve-3d + per-layer
 * translateZ): a dim rim sits behind, the reactor glow floats in the
 * middle, the icon sits in front — then the whole badge slowly rotates on
 * its Y axis like a hologram, so perspective actually separates the layers
 * instead of just implying depth with a drop-shadow.
 */
function HexNode({ icon: Icon, delay }: { icon: LucideIcon; delay: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <div style={{ perspective: 300 }} className="mx-auto size-16 shrink-0">
      <motion.div
        className="relative size-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={reduceMotion ? undefined : { rotateY: [0, 14, 0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, delay, ease: "easeInOut" }}
      >
        {/* back rim — set behind the glow */}
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-0 size-full"
          style={{ transform: "translateZ(-10px)" }}
          aria-hidden="true"
        >
          <polygon
            points={HEX_POINTS}
            fill="none"
            stroke="var(--hud-gold)"
            strokeWidth={1.5}
            strokeLinejoin="round"
            opacity={0.3}
          />
        </svg>

        {/* reactor glow — mid depth */}
        <motion.div
          className="absolute inset-[6px] rounded-full"
          style={{
            background: "radial-gradient(circle, var(--hud-reactor) 0%, transparent 72%)",
            transform: "translateZ(-2px)",
          }}
          animate={{ opacity: [0.12, 0.65, 0.12], scale: [0.85, 1.05, 0.85] }}
          transition={{ duration: CYCLE, repeat: Infinity, delay, ease: "easeInOut" }}
        />

        {/* front rim — bright, pushed toward the viewer like a glass bezel */}
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-0 size-full"
          style={{ transform: "translateZ(10px)" }}
          aria-hidden="true"
        >
          <polygon
            points={HEX_POINTS}
            fill="none"
            stroke="var(--hud-gold)"
            strokeWidth={1.5}
            strokeLinejoin="round"
            opacity={0.8}
          />
        </svg>

        {/* icon — furthest forward */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: "translateZ(16px)" }}
        >
          <Icon className="size-6 text-primary" aria-hidden="true" />
        </div>
      </motion.div>
    </div>
  );
}

/** Connector between two nodes: a persistently energized dashed line plus a
 * bright traveling pulse with a glow trail, synced to the node it arrives at. */
function FlowConnector({ delay }: { delay: number }) {
  return (
    <div className="relative mx-1 hidden h-px w-12 shrink-0 self-center lg:block xl:w-16">
      <svg viewBox="0 0 100 2" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
        <line
          x1={0}
          y1={1}
          x2={100}
          y2={1}
          stroke="var(--hud-gold)"
          strokeOpacity={0.4}
          strokeWidth={1.5}
          className="animate-dash-flow"
        />
      </svg>
      <motion.div
        className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-primary"
        style={{
          boxShadow:
            "0 0 6px 2px var(--hud-gold), 0 0 16px 4px color-mix(in oklab, var(--hud-gold) 60%, transparent)",
        }}
        initial={{ left: "0%", opacity: 0 }}
        animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: STEP, repeat: Infinity, repeatDelay: CYCLE - STEP, ease: "easeInOut", delay }}
      />
    </div>
  );
}

/**
 * Each stage card tracks its own scroll progress and drifts/fades into
 * place independently — the parallax effect (depth via differing speeds)
 * rather than a single fade-in trigger. `depth` sets how far it travels:
 * higher depth = feels farther back = moves more relative to the scroll.
 */
function ParallaxStage({ depth, children }: { depth: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 45%"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : depth, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div ref={ref} style={{ y, opacity }} className="w-full lg:flex-1">
      {children}
    </motion.div>
  );
}

export function HowItWorks() {
  const { t } = useTranslation();
  const stages = t("howItWorks.stages", { returnObjects: true }) as Stage[];

  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-12%", "12%"]);
  const headingY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [40, -40]);

  return (
    <section
      ref={sectionRef}
      id="flow"
      className="relative overflow-hidden border-t border-border/60 bg-card/30 px-6 py-24"
    >
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,color-mix(in_oklab,var(--hud-reactor)_10%,transparent),transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <motion.div style={{ y: headingY }}>
        <Reveal>
          <SectionHeading
            eyebrow={t("howItWorks.eyebrow")}
            title={t("howItWorks.title")}
            description={t("howItWorks.description")}
          />
        </Reveal>
      </motion.div>

      <Reveal delay={0.1}>
        <div className="relative mx-auto mt-16 max-w-5xl">
          <HudCorners />
          <TiltPanel className="border-glow relative overflow-hidden rounded-2xl border border-border bg-background/40 px-6 py-10 backdrop-blur-sm sm:px-10">
            <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:gap-0">
              {stages.map((stage, i) => {
                const Icon = howItWorksStageIcons[i];
                return (
                  <Fragment key={i}>
                    <ParallaxStage depth={30 + i * 18}>
                      <HexNode icon={Icon} delay={i * STEP} />
                      <h3 className="mt-3 text-center font-display text-sm font-semibold tracking-wide">
                        {stage.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                        {stage.items.map((item) => (
                          <span
                            key={item}
                            className="rounded border border-border bg-card/80 px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </ParallaxStage>
                    {i < stages.length - 1 ? <FlowConnector delay={i * STEP} /> : null}
                  </Fragment>
                );
              })}
            </div>
          </TiltPanel>
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <p className="mx-auto mt-10 max-w-2xl text-center font-mono text-xs text-muted-foreground">
          {t("howItWorks.footerNote")}
        </p>
      </Reveal>
    </section>
  );
}
