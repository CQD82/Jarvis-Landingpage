import { ScrambleText } from "@/components/landing/ScrambleText";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-primary/80 uppercase">
        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-primary/70" />
        <ScrambleText text={eyebrow} />
        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-primary/70" />
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-balance text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
