import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";

interface TierRow {
  tier: string;
  hardware: string;
  role: string;
}

export function ModelTiers() {
  const { t } = useTranslation();
  const rows = t("modelTiers.rows", { returnObjects: true }) as TierRow[];
  const headers = t("modelTiers.headers", { returnObjects: true }) as {
    tier: string;
    hardware: string;
    role: string;
  };

  return (
    <section id="models" className="px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("modelTiers.eyebrow")}
          title={t("modelTiers.title")}
          description={t("modelTiers.description")}
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-xl border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-card font-mono text-xs tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-3 font-medium">{headers.tier}</th>
                <th className="px-5 py-3 font-medium">{headers.hardware}</th>
                <th className="px-5 py-3 font-medium">{headers.role}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-background" : "bg-card/40"}
                >
                  <td className="px-5 py-4 font-display text-sm font-semibold text-primary">
                    {row.tier}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{row.hardware}</td>
                  <td className="px-5 py-4">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}
