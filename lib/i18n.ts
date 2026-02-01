export type Locale = string;

export const SUPPORTED_LOCALES: { code: Locale; flag: string; name: string }[] = [
  { code: "en", flag: "🇺🇸", name: "English" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "ar", flag: "🇸🇦", name: "العربية" },
  { code: "zh", flag: "🇨🇳", name: "中文" },
  { code: "hi", flag: "🇮🇳", name: "हिन्दी" },
  { code: "pt", flag: "🇧🇷", name: "Português" },
  { code: "ru", flag: "🇷🇺", name: "Русский" },
  { code: "ja", flag: "🇯🇵", name: "日本語" },
  { code: "ko", flag: "🇰🇷", name: "한국어" },
  { code: "it", flag: "🇮🇹", name: "Italiano" },
  { code: "nl", flag: "🇳🇱", name: "Nederlands" },
  { code: "tr", flag: "🇹🇷", name: "Türkçe" },
  { code: "pl", flag: "🇵🇱", name: "Polski" },
  { code: "vi", flag: "🇻🇳", name: "Tiếng Việt" },
  { code: "th", flag: "🇹🇭", name: "ไทย" },
  { code: "id", flag: "🇮🇩", name: "Bahasa Indonesia" },
  { code: "sv", flag: "🇸🇪", name: "Svenska" },
  { code: "uk", flag: "🇺🇦", name: "Українська" },
  { code: "he", flag: "🇮🇱", name: "עברית" },
  { code: "bn", flag: "🇧🇩", name: "বাংলা" },
  { code: "ro", flag: "🇷🇴", name: "Română" },
  { code: "hu", flag: "🇭🇺", name: "Magyar" },
  { code: "el", flag: "🇬🇷", name: "Ελληνικά" },
  { code: "fa", flag: "🇮🇷", name: "فارسی" },
  { code: "no", flag: "🇳🇴", name: "Norsk" },
  { code: "fi", flag: "🇫🇮", name: "Suomi" },
  { code: "da", flag: "🇩🇰", name: "Dansk" },
  { code: "cs", flag: "🇨🇿", name: "Čeština" },
  { code: "ms", flag: "🇲🇾", name: "Bahasa Melayu" },
];

export const DEFAULT_LOCALE: Locale = "en";

export const STORAGE_KEY = "image-search-locale";
