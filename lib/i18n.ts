export type Locale = string;

export const SUPPORTED_LOCALES: { code: Locale; flag: string; name: string }[] = [
  { code: "en", flag: "🇺🇸", name: "English" },
  { code: "ar", flag: "🇸🇦", name: "العربية" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "gr", flag: "🇩🇪", name: "Deutsch" },
  { code: "it", flag: "🇮🇹", name: "Italiano" },
  { code: "ru", flag: "🇷🇺", name: "Русский" },
  { code: "tr", flag: "🇹🇷", name: "Türkçe" },
  { code: "fa", flag: "🇮🇷", name: "فارسی" },
  { code: "zh", flag: "🇨🇳", name: "中文" },
];

export const DEFAULT_LOCALE: Locale = "en";

export const STORAGE_KEY = "image-search-locale";
