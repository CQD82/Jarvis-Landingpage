import { useEffect, useState } from "react";
import { Logo } from "@/components/landing/Logo";

const links = [
  { href: "#system-map", label: "Übersicht" },
  { href: "#features", label: "Fähigkeiten" },
  { href: "#architecture", label: "Architektur" },
  { href: "#models", label: "KI-Modelle" },
  { href: "#security", label: "Sicherheit" },
];

/** Highlights the nav link for whichever section is currently in view. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function Nav() {
  const active = useActiveSection(links.map((l) => l.href.slice(1)));

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo size={26} />
          <span className="font-display text-lg font-semibold tracking-widest">
            JARVIS
          </span>
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
            v4.2
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "text-primary text-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
