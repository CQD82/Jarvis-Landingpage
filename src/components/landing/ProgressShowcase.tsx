import { useReducedMotion } from "framer-motion";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import grafanaDashboard from "@/assets/hardware/grafana-dashboard.webp";
import chatLogin from "@/assets/screens/chat-login.webp";
import hudKiosk from "@/assets/screens/hud-kiosk.webp";
import { HudCorners } from "@/components/landing/HudCorners";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { TiltPanel } from "@/components/landing/TiltPanel";
import { trackPointer } from "@/lib/pointer";

interface Item {
  title: string;
  desc: string;
}

/**
 * "What's already running": the two real screen photos (wall HUD and the
 * monitoring dashboard) as proof of progress, followed by a plain-language
 * status list. Deliberately high level — no instructions, addresses or
 * configuration, in line with the rest of the site.
 */
export function ProgressShowcase() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const live = t("progress.live", { returnObjects: true }) as Item[];
  const wip = t("progress.wip", { returnObjects: true }) as Item[];
  const done = live.length;
  const total = live.length + wip.length;
  const pct = Math.round((done / total) * 100);

  // The HUD screenshot leads full width; dashboard photo and chat sign-in
  // sit side by side below it.
  const photos = [
    { src: hudKiosk, caption: t("progress.hudCaption"), tag: "LIVE · HUD", w: 1600, h: 1000, wide: true },
    { src: grafanaDashboard, caption: t("progress.grafanaCaption"), tag: "LIVE · MONITORING", w: 1600, h: 909, wide: false },
    { src: chatLogin, caption: t("progress.chatCaption"), tag: "LIVE · CHAT", w: 1600, h: 1000, wide: false },
  ];

  return (
    <section id="progress" className="border-t border-border/60 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("progress.eyebrow")}
          title={t("progress.title")}
          description={t("progress.description")}
        />
      </Reveal>

      {/* Real screens, front and centre */}
      <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-2">
        {photos.map((photo, i) => (
          <Reveal key={photo.tag} delay={i * 0.1} className={photo.wide ? "lg:col-span-2" : undefined}>
            <figure className="relative">
              <HudCorners />
              <TiltPanel className="border-glow relative overflow-hidden rounded-2xl border border-border" maxTiltX={4} maxTiltY={5}>
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  width={photo.w}
                  height={photo.h}
                  className="block aspect-[16/10] h-auto w-full object-cover"
                />
                <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-sm bg-background/75 px-2 py-1 font-mono text-[0.6rem] tracking-widest text-primary backdrop-blur-sm">
                  <span className="animate-rec-blink size-1.5 rounded-full bg-[var(--hud-red)]" />
                  {photo.tag}
                </span>
              </TiltPanel>
              <figcaption className="mt-3 text-center text-sm text-muted-foreground">{photo.caption}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground/80">{t("progress.note")}</p>

      {/* Overall progress */}
      <Reveal delay={0.1}>
        <div className="mx-auto mt-14 max-w-3xl">
          <div className="flex items-baseline justify-between font-mono text-xs tracking-widest text-muted-foreground uppercase">
            <span>
              {t("progress.liveLabel")} {done} / {total}
            </span>
            <span className="font-display text-2xl text-primary text-glow">{pct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={t("progress.title")}>
            <div className="relative h-full rounded-full bg-gradient-to-r from-[var(--hud-red)] via-primary to-[var(--hud-reactor)]" style={{ width: `${pct}%` }}>
              {!reduceMotion ? <span className="animate-packet absolute top-0 left-0 h-full w-[18%] bg-gradient-to-r from-transparent via-white/70 to-transparent" /> : null}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Status lists */}
      <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Reveal>
          <div onPointerMove={trackPointer} className="holo-card h-full rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent/60 p-6 sm:p-7">
            <h3 className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-[var(--hud-reactor)] uppercase">
              <span className="size-2 rounded-full bg-[var(--hud-reactor)] shadow-[0_0_8px_var(--hud-reactor)]" />
              {t("progress.liveLabel")}
            </h3>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {live.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--hud-reactor)]" aria-hidden="true" />
                  <div>
                    <p className="font-display text-sm font-semibold tracking-tight">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div onPointerMove={trackPointer} className="holo-card h-full rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-accent/60 p-6 sm:p-7">
            <h3 className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-primary uppercase">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_var(--hud-gold)]" />
              {t("progress.wipLabel")}
            </h3>
            <ul className="mt-5 space-y-4">
              {wip.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <LoaderCircle className={`mt-0.5 size-5 shrink-0 text-primary ${reduceMotion ? "" : "animate-spin [animation-duration:2.4s]"}`} aria-hidden="true" />
                  <div>
                    <p className="font-display text-sm font-semibold tracking-tight">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
