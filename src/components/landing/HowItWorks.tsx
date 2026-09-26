import { motion } from "framer-motion";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { howItWorksStageIcons } from "@/data/jarvis";

interface Stage {
  title: string;
  items: string[];
}

/** A flowing pulse between two stage cards — desktop only, mirrors the SystemMap traveling-dot language. */
function FlowConnector({ delay }: { delay: number }) {
  return (
    <div className="relative mx-1 hidden h-px w-10 shrink-0 self-center bg-border lg:block xl:w-14">
      <motion.div
        className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_6px_var(--hud-gold)]"
        initial={{ left: "0%", opacity: 0 }}
        animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay }}
      />
    </div>
  );
}

export function HowItWorks() {
  const { t } = useTranslation();
  const stages = t("howItWorks.stages", { returnObjects: true }) as Stage[];

  return (
    <section id="flow" className="border-t border-border/60 bg-card/30 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("howItWorks.eyebrow")}
          title={t("howItWorks.title")}
          description={t("howItWorks.description")}
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-14 flex max-w-5xl flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:gap-0">
          {stages.map((stage, i) => {
            const Icon = howItWorksStageIcons[i];
            return (
              <Fragment key={i}>
                <div className="w-full rounded-xl border border-border bg-card p-5 text-center lg:flex-1">
                  <div className="mx-auto inline-flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-3 font-display text-sm font-semibold tracking-wide">
                    {stage.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {stage.items.map((item) => (
                      <span
                        key={item}
                        className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                {i < stages.length - 1 ? <FlowConnector delay={i * 0.35} /> : null}
              </Fragment>
            );
          })}
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
