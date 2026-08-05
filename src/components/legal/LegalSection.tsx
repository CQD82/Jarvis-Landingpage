import type { ReactNode } from "react";

interface LegalSectionProps {
  title?: string;
  children: ReactNode;
}

/** A titled block of legal text — consistent spacing/typography for every section. */
export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section>
      {title ? (
        <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      ) : null}
      <div className="mt-3 space-y-3 [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/40 [&_a]:underline-offset-4 hover:[&_a]:text-primary/80">
        {children}
      </div>
    </section>
  );
}
