import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/landing/Logo";

interface LegalLayoutProps {
  title: string;
  children: ReactNode;
}

/**
 * Shared shell for the standalone legal pages (Impressum, Datenschutz).
 * These are plain document pages rather than animated landing sections —
 * legal text should read cleanly, not compete with HUD effects.
 */
export function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-6">
          <a href="/" className="flex shrink-0 items-center gap-2.5">
            <Logo size={26} animated={false} />
            <span className="font-display text-lg font-semibold tracking-widest">
              JARVIS
            </span>
          </a>
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Zurück zur Startseite
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <div className="prose-legal mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </main>

      <footer className="border-t border-border/60 px-6 py-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Logo size={18} animated={false} />
            <span className="font-display tracking-widest">JARVIS</span>
            <span className="font-mono text-xs">v4.2</span>
          </div>
          <nav className="flex items-center gap-5 font-mono text-xs">
            <a href="/" className="transition-colors hover:text-foreground">
              Home
            </a>
            <a href="/impressum" className="transition-colors hover:text-foreground">
              Impressum
            </a>
            <a href="/datenschutz" className="transition-colors hover:text-foreground">
              Datenschutz
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
