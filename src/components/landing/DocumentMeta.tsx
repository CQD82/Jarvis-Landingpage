import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/** Keeps <html lang>, the tab title, and meta/OG description in sync with the active language. Renders nothing. */
export function DocumentMeta() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? "en";
    document.title = t("meta.title");

    const setContent = (selector: string, value: string) => {
      document.querySelector(selector)?.setAttribute("content", value);
    };
    setContent('meta[name="description"]', t("meta.description"));
    setContent('meta[property="og:title"]', t("meta.title"));
    setContent('meta[property="og:description"]', t("meta.description"));
  }, [t, i18n.resolvedLanguage]);

  return null;
}
