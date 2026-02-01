import { Locale } from "@/lib/i18n";
import en from "./en";
import fr from "./fr";
import es from "./es";
import de from "./de";
import ar from "./ar";

export type Translations = typeof en;

const translations: Partial<Record<Locale, Translations>> = {
  en,
  fr,
  es,
  de,
  ar,
};

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function getTranslations(locale: Locale): Translations {
  const t = translations[locale] ?? en;
  return t as Translations;
}

export function t(locale: Locale, key: string): string {
  const dict = getTranslations(locale);
  const value = getNested(dict as unknown as Record<string, unknown>, key);
  return value ?? getNested(en as unknown as Record<string, unknown>, key) ?? key;
}
