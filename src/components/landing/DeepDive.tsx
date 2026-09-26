import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown, Cpu, Sparkles, Users, Workflow } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";

const ICONS = [Users, Sparkles, Workflow, Cpu, Bot];

interface DeepDiveItem {
  title: string;
  body: string;
}

export function DeepDive() {
  const { t } = useTranslation();
  const items = t("deepDive.items", { returnObjects: true }) as DeepDiveItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="how-it-works" className="px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("deepDive.eyebrow")}
          title={t("deepDive.title")}
          description={t("deepDive.description")}
        />
      </Reveal>

      <div className="mx-auto mt-14 max-w-3xl divide-y divide-border overflow-hidden rounded-xl border border-border">
        {items.map((item, i) => {
          const Icon = ICONS[i];
          const isOpen = openIndex === i;
          return (
            <div key={i} className="bg-card">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="flex-1 font-display text-sm font-semibold tracking-tight sm:text-base">
                  {item.title}
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 pl-[3.75rem] text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
