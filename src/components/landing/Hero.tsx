import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Radar } from "lucide-react";
import { useTranslation } from "react-i18next";
import clusterArt from "@/assets/hero/cluster-art.jpg";
import { GradientShimmer } from "@/components/ui/gradient-shimmer";
import { CountUpStat } from "@/components/landing/CountUpStat";
import { HudCorners } from "@/components/landing/HudCorners";
import { StatusTicker } from "@/components/landing/StatusTicker";
import { TiltPanel } from "@/components/landing/TiltPanel";

/** Repulsor-red → armor-gold sweep for the hero title. */
const TITLE_GRADIENT = [
  { position: 0, color: "#ff5c3d" },
  { position: 0.5, color: "#f2b545" },
  { position: 1, color: "#ffe3a3" },
];

interface Stat {
  value: string;
  label: string;
}

export function Hero() {
  const { t } = useTranslation();
  const stats = t("stats", { returnObjects: true }) as Stat[];
  const reduceMotion = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28">
      {/* Ambient glow — layered gold + red for depth, armor-plate style */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--hud-gold)_20%,transparent),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 left-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,color-mix(in_oklab,var(--hud-red)_18%,transparent),transparent_70%)] blur-2xl"
      />
      {/* Thin rotating targeting ring behind the title */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 left-1/2 -z-10 size-[420px] -translate-x-1/2 rounded-full border border-primary/10 sm:size-[520px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 left-1/2 -z-10 size-[420px] -translate-x-1/2 animate-radar-sweep rounded-full border-t border-primary/25 sm:size-[520px]"
        style={{ animationDuration: "14s" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto mb-10 max-w-sm sm:max-w-md lg:max-w-lg"
      >
        <HudCorners />
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <TiltPanel
            className="border-glow relative overflow-hidden rounded-2xl border border-border"
            maxTiltX={6}
            maxTiltY={8}
          >
            <img
              src={clusterArt}
              alt={t("hero.artAlt")}
              className="aspect-[4/3] w-full object-cover"
              style={{
                maskImage: "radial-gradient(ellipse at center, black 65%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 65%, transparent 100%)",
              }}
            />
          </TiltPanel>
        </motion.div>
      </motion.div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 font-mono text-xs tracking-wider text-primary"
        >
          <Radar className="size-3.5 animate-pulse" aria-hidden="true" />
          {t("hero.badge")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-6xl font-bold tracking-tight sm:text-8xl"
        >
          <GradientShimmer gradient={TITLE_GRADIENT} duration={2.2} spread={4}>
            JARVIS
          </GradientShimmer>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl"
        >
          {t("hero.description")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#features"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--hud-gold)_35%,transparent)] transition-transform hover:scale-[1.03]"
          >
            {t("hero.ctaPrimary")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#architecture"
            className="rounded-md border border-border px-5 py-2.5 font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            {t("hero.ctaSecondary")}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 font-mono text-[0.7rem] tracking-widest text-muted-foreground uppercase"
        >
          <StatusTicker />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative mx-auto mt-20 max-w-3xl"
      >
        <HudCorners />
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card px-4 py-6 text-center">
              <dt className="font-display text-3xl font-semibold text-primary text-glow">
                <CountUpStat value={stat.value} />
              </dt>
              <dd className="mt-1 font-mono text-[0.7rem] tracking-wide text-muted-foreground uppercase">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
