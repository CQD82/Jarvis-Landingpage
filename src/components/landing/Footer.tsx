import { Radar } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <Radar className="size-4 text-primary" aria-hidden="true" />
          <span className="font-display tracking-widest">JARVIS</span>
          <span className="font-mono text-xs">v4.2</span>
        </div>
        <p className="font-mono text-xs">Privates Homelab-Projekt</p>
      </div>
    </footer>
  );
}
