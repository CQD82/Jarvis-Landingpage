import { useTranslation } from "react-i18next";
import { JarvisConsole } from "@/components/landing/JarvisConsole";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";

/**
 * Live system status: a simulated replica of the wall-mounted JARVIS HUD as
 * it currently runs in the cluster. Values are illustrative only.
 */
export function LiveHud() {
  const { t } = useTranslation();

  return (
    <section id="hud" className="border-t border-border/60 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("hud.eyebrow")}
          title={t("hud.title")}
          description={t("hud.description")}
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div
          className="relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-2xl border p-4 sm:p-6"
          style={{ background: "#02060f", borderColor: "rgba(92, 225, 255, 0.3)", boxShadow: "0 0 48px rgba(61, 139, 255, 0.12)" }}
        >
          <JarvisConsole />
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mx-auto mt-6 max-w-xl text-center font-mono text-[0.65rem] text-muted-foreground">
          {t("hud.disclaimer")}
        </p>
      </Reveal>
    </section>
  );
}
