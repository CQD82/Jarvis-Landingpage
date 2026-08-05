import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import aiHatBoxes from "@/assets/hardware/ai-hat-boxes.jpg";
import aiHatMounted from "@/assets/hardware/ai-hat-mounted.jpg";
import backupDrive from "@/assets/hardware/wd-backup-drive.jpg";
import chipMacro from "@/assets/hardware/pi-chip-macro.jpg";
import nodeAssembly from "@/assets/hardware/node-assembly.jpg";
import odroidAssembly from "@/assets/hardware/odroid-assembly.jpg";
import odroidH5Case from "@/assets/hardware/odroid-h5-case.jpg";
import pi5Heatsinks from "@/assets/hardware/pi5-heatsinks.jpg";
import rackNodeBays from "@/assets/hardware/rack-node-bays.jpg";
import rackWithZ840 from "@/assets/hardware/rack-with-z840.jpg";
import workbenchSetup from "@/assets/hardware/workbench-setup.jpg";

const PHOTOS: { src: string; captionKey: string; span?: string }[] = [
  { src: rackWithZ840, captionKey: "rackWithZ840", span: "sm:row-span-2" },
  { src: rackNodeBays, captionKey: "rackBays" },
  { src: nodeAssembly, captionKey: "assembly" },
  { src: odroidH5Case, captionKey: "odroid" },
  { src: odroidAssembly, captionKey: "odroidAssembly" },
  { src: aiHatMounted, captionKey: "aiHat" },
  { src: aiHatBoxes, captionKey: "aiHatBoxes" },
  { src: pi5Heatsinks, captionKey: "heatsinks" },
  { src: chipMacro, captionKey: "chipMacro" },
  { src: backupDrive, captionKey: "backupDrive" },
  { src: workbenchSetup, captionKey: "workbench" },
];

export function HardwareGallery() {
  const { t } = useTranslation();

  return (
    <section id="hardware" className="border-t border-border/60 bg-card/30 px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("gallery.eyebrow")}
          title={t("gallery.title")}
          description={t("gallery.description")}
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
        {PHOTOS.map((photo, i) => (
          <Reveal
            key={photo.captionKey}
            delay={Math.min(i * 0.05, 0.3)}
            className={photo.span}
          >
            <div className="group relative h-full overflow-hidden rounded-xl border border-border">
              <img
                src={photo.src}
                alt={t(`gallery.captions.${photo.captionKey}`)}
                loading="lazy"
                className="h-full max-h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:max-h-none"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent p-4 pt-10">
                <p className="text-xs text-foreground/90">
                  {t(`gallery.captions.${photo.captionKey}`)}
                </p>
              </div>
              <div className="pointer-events-none absolute inset-0 border border-primary/0 transition-colors group-hover:border-primary/40" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
