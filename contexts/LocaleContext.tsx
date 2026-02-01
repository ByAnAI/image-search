"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  Locale,
  STORAGE_KEY,
  SUPPORTED_LOCALES,
} from "@/lib/i18n";
import { t as tFn } from "@/lib/translations";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  supportedLocales: typeof SUPPORTED_LOCALES;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_LOCALE;
  const found = SUPPORTED_LOCALES.some((l) => l.code === stored);
  return found ? stored : DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getStoredLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
      const rtl = ["ar", "he", "fa"].includes(newLocale);
      document.documentElement.dir = rtl ? "rtl" : "ltr";
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale;
    const rtl = ["ar", "he", "fa"].includes(locale);
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [locale, mounted]);

  const t = useCallback(
    (key: string) => tFn(locale, key),
    [locale]
  );

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t,
    supportedLocales: SUPPORTED_LOCALES,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
