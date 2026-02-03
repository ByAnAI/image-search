import { Locale } from "@/lib/i18n";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import ar from "@/locales/ar.json";
import fa from "@/locales/fa.json";
import it from "@/locales/it.json";
import tr from "@/locales/tr.json";
import zh from "@/locales/zh.json";

export type Translations = typeof en;

const translations: Partial<Record<Locale, Translations>> = {
  en,
  fr,
  ar,
  fa,
  it,
  tr,
  zh,
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
