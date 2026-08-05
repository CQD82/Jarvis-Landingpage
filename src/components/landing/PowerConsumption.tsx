import { PowerOff, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { HudCorners } from "@/components/landing/HudCorners";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";

interface PowerRow {
  label: string;
  watts: string;
}

export function PowerConsumption() {
  const { t } = useTranslation();
  const rows = t("power.rows", { returnObjects: true }) as PowerRow[];

  return (
    <section id="power" className="border-t border-border/60 bg-card/30 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("power.eyebrow")}
          title={t("power.title")}
          description={t("power.description")}
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-4xl gap-8 lg:grid-cols-2">
        <Reveal delay={0.1}>
          <div className="relative">
            <HudCorners />
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-background" : "bg-card/60"}
                    >
                      <td className="px-4 py-3 text-muted-foreground">{row.label}</td>
                      <td className="px-4 py-3 text-right font-mono text-primary">
                        {row.watts}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-border bg-primary/5">
                    <td className="px-4 py-3 font-display text-sm font-semibold">
                      {t("power.totalLabel")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-primary text-glow">
                      {t("power.totalValue")}
                    </td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {t("power.monthlyLabel")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
                      {t("power.monthlyValue")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
            <div className="inline-flex size-10 items-center justify-center self-start rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <PowerOff className="size-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 flex items-center gap-2 font-display text-base font-semibold tracking-tight">
              {t("power.wolTitle")}
              <Zap className="size-4 text-primary" aria-hidden="true" />
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("power.wolBody")}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
