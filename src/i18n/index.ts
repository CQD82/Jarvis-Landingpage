import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import de from "@/i18n/locales/de.json";
import el from "@/i18n/locales/el.json";
import en from "@/i18n/locales/en.json";
import es from "@/i18n/locales/es.json";
import fr from "@/i18n/locales/fr.json";

export const SUPPORTED_LANGUAGES = ["de", "en", "fr", "es", "el"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  de: "Deutsch",
  en: "English",
  fr: "Français",
  es: "Español",
  el: "Ελληνικά",
};

// Detection: whatever the browser/OS reports, first — a manual switch is
// then remembered in localStorage so it sticks across visits without
// overriding a first-time visitor's system language.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      el: { translation: el },
    },
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "jarvis-lang",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
