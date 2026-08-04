import { Radar } from "lucide-react";

const links = [
  { href: "#features", label: "Fähigkeiten" },
  { href: "#architecture", label: "Architektur" },
  { href: "#models", label: "KI-Modelle" },
  { href: "#security", label: "Sicherheit" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2">
          <Radar className="size-5 text-primary" aria-hidden="true" />
          <span className="font-display text-lg font-semibold tracking-widest">
            JARVIS
          </span>
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
            v4.2
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="mailto:jarvisclusterhomelab@gmail.com"
          className="rounded-md border border-primary/40 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/10"
        >
          Kontakt
        </a>
      </div>
    </header>
  );
}
