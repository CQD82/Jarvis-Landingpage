import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";

export function Security() {
  const { t } = useTranslation();
  const highlights = t("security.highlights", { returnObjects: true }) as string[];

  return (
    <section id="security" className="border-t border-border/60 bg-card/30 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("security.eyebrow")}
          title={t("security.title")}
          description={t("security.description")}
        />
      </Reveal>

      <Reveal delay={0.1}>
        <ul className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
          {highlights.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm"
            >
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted-foreground">
          {t("security.footerNote")}
        </p>
      </Reveal>
    </section>
  );
}
