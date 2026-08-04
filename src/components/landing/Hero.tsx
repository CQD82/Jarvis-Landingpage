import { motion } from "framer-motion";
import { ArrowRight, Radar } from "lucide-react";
import { GradientShimmer } from "@/components/ui/gradient-shimmer";
import { stats } from "@/data/jarvis";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--hud-cyan)_18%,transparent),transparent_65%)]"
      />

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 font-mono text-xs tracking-wider text-primary"
        >
          <Radar className="size-3.5 animate-pulse" aria-hidden="true" />
          PRIVATES HOMELAB PROJEKT · v4.2 PRODUCTION-READY
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-6xl font-bold tracking-tight sm:text-8xl"
        >
          <GradientShimmer gradient="mint" duration={2.2} spread={4}>
            JARVIS
          </GradientShimmer>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl"
        >
          Ein 18-Node Kubernetes-Homelab, das zuhause denkt, sieht und
          zuhört — vollständig deklarativ betrieben, mit mehrstufiger
          lokaler KI-Inferenz und Zero-Trust-Netzwerksegmentierung.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#features"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--hud-cyan)_35%,transparent)] transition-transform hover:scale-[1.03]"
          >
            Fähigkeiten ansehen
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#architecture"
            className="rounded-md border border-border px-5 py-2.5 font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            Architektur
          </a>
        </motion.div>
      </div>

      <motion.dl
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card px-4 py-6 text-center">
            <dt className="font-display text-3xl font-semibold text-primary text-glow">
              {stat.value}
            </dt>
            <dd className="mt-1 font-mono text-[0.7rem] tracking-wide text-muted-foreground uppercase">
              {stat.label}
            </dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
