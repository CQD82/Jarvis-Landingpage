import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import aiHatBoxes from "@/assets/hardware/ai-hat-boxes.webp";
import aiHatMounted from "@/assets/hardware/ai-hat-mounted.webp";
import apcUps from "@/assets/hardware/apc-ups.webp";
import backupDrive from "@/assets/hardware/wd-backup-drive.webp";
import chipMacro from "@/assets/hardware/pi-chip-macro.webp";
import nodeAssembly from "@/assets/hardware/node-assembly.webp";
import nodeBaysCabled from "@/assets/hardware/node-bays-cabled.webp";
import odroidAssembly from "@/assets/hardware/odroid-assembly.webp";
import odroidH5Case from "@/assets/hardware/odroid-h5-case.webp";
import pi5Heatsinks from "@/assets/hardware/pi5-heatsinks.webp";
import piZero2W from "@/assets/hardware/pi-zero-2w.webp";
import rackCabledFull from "@/assets/hardware/rack-cabled-full.webp";
import rackInteriorCabling from "@/assets/hardware/rack-interior-cabling.webp";
import rackNodeBays from "@/assets/hardware/rack-node-bays.webp";
import rackWithZ840 from "@/assets/hardware/rack-with-z840.webp";
import workbenchSetup from "@/assets/hardware/workbench-setup.webp";

const PHOTOS: { src: string; captionKey: string; span?: string }[] = [
  { src: rackWithZ840, captionKey: "rackWithZ840", span: "col-span-2 row-span-2" },
  { src: rackCabledFull, captionKey: "rackCabledFull", span: "row-span-2" },
  { src: rackNodeBays, captionKey: "rackBays", span: "col-span-2" },
  { src: nodeAssembly, captionKey: "assembly" },
  { src: rackInteriorCabling, captionKey: "rackInteriorCabling" },
  { src: nodeBaysCabled, captionKey: "nodeBaysCabled", span: "col-span-2" },
  { src: odroidH5Case, captionKey: "odroid", span: "col-span-2" },
  { src: odroidAssembly, captionKey: "odroidAssembly" },
  { src: aiHatMounted, captionKey: "aiHat" },
  { src: aiHatBoxes, captionKey: "aiHatBoxes", span: "row-span-2" },
  { src: pi5Heatsinks, captionKey: "heatsinks" },
  { src: piZero2W, captionKey: "piZero" },
  { src: chipMacro, captionKey: "chipMacro" },
  { src: backupDrive, captionKey: "backupDrive" },
  { src: apcUps, captionKey: "apcUps" },
  { src: workbenchSetup, captionKey: "workbench" },
];

/** Tiles shown before "show all" — the first bento block fills cleanly. */
const INITIAL_COUNT = 9;

export function HardwareGallery() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? PHOTOS : PHOTOS.slice(0, INITIAL_COUNT);

  return (
    <section id="hardware" className="border-t border-border/60 bg-card/30 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("gallery.eyebrow")}
          title={t("gallery.title")}
          description={t("gallery.description")}
        />
      </Reveal>

      <div
        id="hardware-grid"
        className="mx-auto mt-14 grid max-w-6xl auto-rows-[150px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-4 lg:grid-cols-4 lg:auto-rows-[210px]"
      >
        {visible.map((photo, i) => (
          <Reveal
            key={photo.captionKey}
            delay={Math.min((i % INITIAL_COUNT) * 0.04, 0.28)}
            className={photo.span}
          >
            <div className="group relative h-full overflow-hidden rounded-xl border border-border">
              <img
                src={photo.src}
                alt={t(`gallery.captions.${photo.captionKey}`)}
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-3 pt-10 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:p-4 sm:pt-12">
                <p className="line-clamp-3 text-[0.7rem] leading-snug text-foreground/90 sm:text-xs">
                  {t(`gallery.captions.${photo.captionKey}`)}
                </p>
              </div>
              <div className="pointer-events-none absolute inset-0 border border-primary/0 transition-colors group-hover:border-primary/40" />
            </div>
          </Reveal>
        ))}
      </div>

      {PHOTOS.length > INITIAL_COUNT ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="hardware-grid"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2.5 font-mono text-xs tracking-wider text-primary uppercase backdrop-blur transition-colors hover:border-primary/60 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {expanded
              ? t("gallery.showLess")
              : t("gallery.showAll", { count: PHOTOS.length })}
            <ChevronDown
              className={`size-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      ) : null}
    </section>
  );
}
