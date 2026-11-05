import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Public professional profiles, as listed in the CV. */
const PROFILES = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/marcus-kollosch" },
  { name: "XING", href: "https://www.xing.com/profile/Marcus_Kollosch" },
];

/**
 * Plain outbound links: nothing is loaded from these sites until a visitor
 * clicks, so the strict CSP and the no-third-party-requests rule hold.
 * noreferrer keeps the page URL out of the request; "me" marks them as
 * the author's own profiles.
 */
export function SocialLinks({ className = "" }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {PROFILES.map((p) => (
        <li key={p.name}>
          <a
            href={p.href}
            target="_blank"
            rel="me noopener noreferrer"
            aria-label={t("footer.profileLink", { name: p.name })}
            className="group inline-flex min-h-9 items-center gap-1 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 font-mono text-xs tracking-wider text-foreground/80 transition-colors hover:border-primary/60 hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {p.name}
            <ArrowUpRight
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
