import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/i18n";

/**
 * Manual override for the auto-detected system language. A native <select>
 * for accessibility/simplicity — styled to match the HUD chrome.
 */
export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage ?? "en") as SupportedLanguage;

  return (
    <div className="relative flex items-center">
      <Languages
        className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground"
        aria-hidden="true"
      />
      <select
        value={current}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        aria-label="Language"
        className="appearance-none rounded-md border border-border bg-card py-1.5 pr-3 pl-8 font-mono text-xs text-foreground transition-colors hover:border-primary/50 focus:border-primary/50 focus:outline-none"
      >
        {SUPPORTED_LANGUAGES.map((lng) => (
          <option key={lng} value={lng} className="bg-card">
            {LANGUAGE_LABELS[lng]}
          </option>
        ))}
      </select>
    </div>
  );
}
