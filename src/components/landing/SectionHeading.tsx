interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-xs tracking-[0.3em] text-primary/80 uppercase">
        {eyebrow}
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
