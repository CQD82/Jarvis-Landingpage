import type { CSSProperties } from "react";
import { BatteryCharging, Leaf, PowerOff, TrendingDown, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { HudCorners } from "@/components/landing/HudCorners";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";

interface PowerRow {
  label: string;
  /** Estimated average draw in watts. */
  w: number;
}

const HOURS_PER_MONTH = 730;
const HOURS_PER_YEAR = 8760;
const EUR_PER_KWH = 0.3;

/**
 * Estimated power budget. Watt values live in the locale files (identical in
 * every language); totals, kWh, cost and shares are derived here so the
 * numbers can never drift apart.
 */
export function PowerConsumption() {
  const { t, i18n } = useTranslation();
  const rows = t("power.rows", { returnObjects: true }) as PowerRow[];
  const savings = t("power.savings", { returnObjects: true }) as PowerRow[];

  const total = rows.reduce((sum, r) => sum + r.w, 0);
  const max = Math.max(...rows.map((r) => r.w));
  const saved = savings.reduce((sum, s) => sum + s.w, 0);
  const optimised = total - saved;

  const num = (v: number, digits = 0) =>
    v.toLocaleString(i18n.language, { maximumFractionDigits: digits, minimumFractionDigits: digits });
  const eur = (v: number) =>
    v.toLocaleString(i18n.language, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const kwhMonth = (w: number) => (w * HOURS_PER_MONTH) / 1000;

  return (
    <section id="power" className="border-t border-border/60 bg-card/30 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("power.eyebrow")}
          title={t("power.title")}
          description={t("power.description")}
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-6xl gap-8 lg:grid-cols-[1.45fr_1fr]">
        <Reveal delay={0.1}>
          <div className="relative">
            <HudCorners />
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="sr-only">
                  <tr>
                    <th scope="col">{t("power.title")}</th>
                    <th scope="col">W</th>
                    <th scope="col">{t("power.shareLabel")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const share = (row.w / total) * 100;
                    return (
                      <tr key={row.label} className={i % 2 === 0 ? "bg-background" : "bg-card/60"}>
                        <td className="px-4 py-3">
                          <span className="block text-muted-foreground">{row.label}</span>
                          <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-primary/10" aria-hidden="true">
                            <span
                              className="block h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                              style={{ width: `${(row.w / max) * 100}%` }}
                            />
                          </span>
                        </td>
                        <td className="px-2 py-3 text-right align-top font-mono whitespace-nowrap text-primary">~{row.w} W</td>
                        <td className="py-3 pr-4 pl-2 text-right align-top font-mono text-xs whitespace-nowrap text-muted-foreground">
                          {num(share)} %
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-border bg-primary/5">
                    <td className="px-4 py-3 font-display text-sm font-semibold">{t("power.totalLabel")}</td>
                    <td colSpan={2} className="px-4 py-3 text-right font-mono font-semibold whitespace-nowrap text-primary text-glow">
                      ~{total} W
                    </td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="px-4 py-2 text-xs text-muted-foreground">{t("power.monthlyLabel")}</td>
                    <td colSpan={2} className="px-4 py-2 text-right font-mono text-xs whitespace-nowrap text-muted-foreground">
                      ~{num(kwhMonth(total))} kWh
                    </td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="px-4 py-2 text-xs text-muted-foreground">{t("power.yearlyLabel")}</td>
                    <td colSpan={2} className="px-4 py-2 text-right font-mono text-xs whitespace-nowrap text-muted-foreground">
                      ~{num((total * HOURS_PER_YEAR) / 1000)} kWh
                    </td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="px-4 py-2 pb-3 text-xs text-muted-foreground">{t("power.costLabel")}</td>
                    <td colSpan={2} className="px-4 py-2 pb-3 text-right font-mono text-xs whitespace-nowrap text-muted-foreground">
                      ~{eur(kwhMonth(total) * EUR_PER_KWH)} {t("power.perMonth")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal delay={0.15}>
            <div className="rounded-xl border border-[var(--hud-reactor)]/40 bg-card p-6">
              <div className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--hud-reactor)]/40 bg-[var(--hud-reactor)]/10 text-[var(--hud-reactor)] hud-icon" style={{ "--i": 1 } as CSSProperties}>
                <Leaf className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold tracking-tight">{t("power.savingsTitle")}</h3>
              <ul className="mt-3 space-y-2.5">
                {savings.map((s) => (
                  <li key={s.label} className="flex items-start justify-between gap-3 text-sm">
                    <span className="flex gap-2 text-muted-foreground">
                      <TrendingDown className="mt-0.5 size-4 shrink-0 text-[var(--hud-reactor)]" aria-hidden="true" />
                      {s.label}
                    </span>
                    <span className="font-mono whitespace-nowrap text-[var(--hud-reactor)]">−{s.w} W</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-border pt-3">
                <span className="font-display text-sm font-semibold">{t("power.savingsResult")}</span>
                <span className="text-right font-mono text-sm whitespace-nowrap">
                  <span className="text-[var(--hud-reactor)]">~{optimised} W</span>
                  <span className="block text-xs text-muted-foreground">
                    ~{num(kwhMonth(optimised))} kWh · {eur(kwhMonth(optimised) * EUR_PER_KWH)} {t("power.perMonth")}
                  </span>
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="inline-flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary hud-icon" style={{ "--i": 0 } as CSSProperties}>
                <PowerOff className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 flex items-center gap-2 font-display text-base font-semibold tracking-tight">
                {t("power.wolTitle")}
                <Zap className="size-4 text-primary" aria-hidden="true" />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("power.wolBody")}</p>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="inline-flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary hud-icon" style={{ "--i": 3 } as CSSProperties}>
                <BatteryCharging className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold tracking-tight">{t("power.upsTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("power.upsBody")}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
