"use client";

import { useMemo, useState } from "react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import arLocale from "i18n-iso-countries/langs/ar.json";
import frLocale from "i18n-iso-countries/langs/fr.json";
import itLocale from "i18n-iso-countries/langs/it.json";
import trLocale from "i18n-iso-countries/langs/tr.json";
import faLocale from "i18n-iso-countries/langs/fa.json";
import zhLocale from "i18n-iso-countries/langs/zh.json";
import deLocale from "i18n-iso-countries/langs/de.json";
import ruLocale from "i18n-iso-countries/langs/ru.json";
import { City, Country } from "country-state-city";
import { useLocale } from "@/contexts/LocaleContext";

countries.registerLocale(enLocale);
countries.registerLocale(arLocale);
countries.registerLocale(frLocale);
countries.registerLocale(itLocale);
countries.registerLocale(trLocale);
countries.registerLocale(faLocale);
countries.registerLocale(zhLocale);
countries.registerLocale(deLocale);
countries.registerLocale(ruLocale);

const STORE_CATEGORIES = [
  { id: "marble-slabs", labelKey: "categories.marbleSlabs" },
  { id: "hardwood-flooring", labelKey: "categories.hardwoodFlooring" },
  { id: "ceramics", labelKey: "categories.ceramics" },
  { id: "granite", labelKey: "categories.granite" },
  { id: "fabric", labelKey: "categories.fabric" },
  { id: "carpet-rugs", labelKey: "categories.carpetAndRugs" },
] as const;

const ISO_LOCALE_MAP: Record<string, string> = {
  ar: "ar",
  en: "en",
  fr: "fr",
  it: "it",
  tr: "tr",
  fa: "fa",
  zh: "zh",
  gr: "de",
  ru: "ru",
};

export function RegisterForm() {
  const { t, locale } = useLocale();

  const [storeName, setStoreName] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationState, setVerificationState] = useState<"sent" | "verified" | null>(
    null
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationSending, setVerificationSending] = useState(false);

  const resolvedLocale = ISO_LOCALE_MAP[locale] ?? "en";
  const countryOptions = useMemo(() => {
    const names = countries.getNames(resolvedLocale, { select: "official" });
    return Object.entries(names)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name, resolvedLocale));
  }, [resolvedLocale]);

  const selectedCountry = useMemo(
    () => (country ? Country.getCountryByCode(country) ?? null : null),
    [country]
  );

  const cityOptions = useMemo(() => {
    if (!country) return [];
    const cities = City.getCitiesOfCountry(country) ?? [];
    return [...cities].sort((a, b) => a.name.localeCompare(b.name, resolvedLocale));
  }, [country, resolvedLocale]);

  const sendVerificationEmail = async (targetEmail: string, code: string) => {
    setVerificationSending(true);
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, code }),
      });
      if (!response.ok) {
        setVerificationError(t("register.verifySendError"));
      }
    } catch {
      setVerificationError(t("register.verifySendError"));
    } finally {
      setVerificationSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder: will wire to auth in a later step
    const normalizedEmail = email.trim().toLowerCase();
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("image-search-verified-emails");
      const map = stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
      map[normalizedEmail] = false;
      localStorage.setItem("image-search-verified-emails", JSON.stringify(map));

      const codeMapRaw = localStorage.getItem("image-search-verification-codes");
      const codeMap = codeMapRaw ? (JSON.parse(codeMapRaw) as Record<string, string>) : {};
      const code = String(Math.floor(100000 + Math.random() * 900000));
      codeMap[normalizedEmail] = code;
      localStorage.setItem("image-search-verification-codes", JSON.stringify(codeMap));
      sendVerificationEmail(normalizedEmail, code);
    }
    setVerificationState("sent");
    setVerificationCode("");
    setVerificationError("");
    console.log("Register", {
      storeName,
      storeCategory,
      country,
      city,
      address,
      website,
      phone: `${selectedCountry?.phonecode ? `+${selectedCountry.phonecode}` : ""}${phone}`,
      email,
      password,
    });
  };

  const handleVerify = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    if (typeof window !== "undefined") {
      const codeMapRaw = localStorage.getItem("image-search-verification-codes");
      const codeMap = codeMapRaw ? (JSON.parse(codeMapRaw) as Record<string, string>) : {};
      const expected = codeMap[normalizedEmail];
      if (!expected || verificationCode.trim() !== expected) {
        setVerificationError(t("register.verifyInvalid"));
        return;
      }
      const stored = localStorage.getItem("image-search-verified-emails");
      const map = stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
      map[normalizedEmail] = true;
      localStorage.setItem("image-search-verified-emails", JSON.stringify(map));
    }
    setVerificationState("verified");
    setVerificationError("");
  };

  const handleResend = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    if (typeof window !== "undefined") {
      const codeMapRaw = localStorage.getItem("image-search-verification-codes");
      const codeMap = codeMapRaw ? (JSON.parse(codeMapRaw) as Record<string, string>) : {};
      const code = String(Math.floor(100000 + Math.random() * 900000));
      codeMap[normalizedEmail] = code;
      localStorage.setItem("image-search-verification-codes", JSON.stringify(codeMap));
      sendVerificationEmail(normalizedEmail, code);
    }
    setVerificationState("sent");
    setVerificationCode("");
    setVerificationError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="register-store" className="block text-sm font-medium text-slate-700 mb-1">
          {t("register.storeName")}
        </label>
        <input
          id="register-store"
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
          autoComplete="organization"
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
          placeholder={t("register.storePlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="register-category" className="block text-sm font-medium text-slate-700 mb-1">
          {t("register.storeCategory")}
        </label>
        <select
          id="register-category"
          value={storeCategory}
          onChange={(e) => setStoreCategory(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
        >
          <option value="" disabled>
            {t("register.selectCategory")}
          </option>
          {STORE_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {t(category.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="register-country" className="block text-sm font-medium text-slate-700 mb-1">
          {t("register.country")}
        </label>
        <select
          id="register-country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setCity("");
          }}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
        >
          <option value="" disabled>
            {t("register.selectCountry")}
          </option>
          {countryOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="register-city" className="block text-sm font-medium text-slate-700 mb-1">
          {t("register.city")}
        </label>
        <select
          id="register-city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          disabled={!selectedCountry}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors disabled:bg-slate-100 disabled:text-slate-500"
        >
          <option value="" disabled>
            {t("register.selectCity")}
          </option>
          {cityOptions.map((option) => (
            <option key={option.name} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="register-address" className="block text-sm font-medium text-slate-700 mb-1">
          {t("register.address")}
        </label>
        <input
          id="register-address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          autoComplete="street-address"
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
          placeholder={t("register.addressPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="register-website" className="block text-sm font-medium text-slate-700 mb-1">
          {t("register.website")}
        </label>
        <input
          id="register-website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          autoComplete="url"
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
          placeholder={t("register.websitePlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="register-phone" className="block text-sm font-medium text-slate-700 mb-1">
          {t("register.phone")}
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-lg border border-slate-300 bg-slate-100 text-slate-700 text-sm">
            {selectedCountry?.phonecode ? `+${selectedCountry.phonecode}` : "+"}
          </span>
          <input
            id="register-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className="w-full px-4 py-2.5 rounded-r-lg border border-slate-300 border-l-0 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
            placeholder={t("register.phonePlaceholder")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-slate-700 mb-1">
          {t("register.email")}
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setVerificationState(null);
            setVerificationCode("");
            setVerificationError("");
          }}
          required
          autoComplete="email"
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
          placeholder={t("register.emailPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-slate-700 mb-1">
          {t("register.password")}
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
          placeholder="••••••••"
        />
        <p className="mt-1 text-slate-500 text-xs">{t("register.passwordHint")}</p>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-lg font-semibold bg-primary-500 text-sciwiz-dark hover:bg-primary-600 transition-colors"
      >
        {t("register.submit")}
      </button>

      {verificationState === "sent" ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="mb-3">{t("register.verifyNotice")}</p>
          <label htmlFor="register-code" className="block text-sm font-medium text-slate-700 mb-1">
            {t("register.verifyCodeLabel")}
          </label>
          <input
            id="register-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors mb-3"
            placeholder={t("register.verifyCodePlaceholder")}
          />
          <button
            type="button"
            onClick={handleVerify}
            className="px-4 py-2 rounded-lg font-semibold bg-primary-500 text-sciwiz-dark hover:bg-primary-600 transition-colors"
            disabled={verificationSending}
          >
            {t("register.verifyAction")}
          </button>
          <button
            type="button"
            onClick={handleResend}
            className="ml-2 px-4 py-2 rounded-lg font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
            disabled={verificationSending}
          >
            {verificationSending ? t("register.verifySending") : t("register.verifyResend")}
          </button>
          {verificationError ? (
            <p className="mt-2 text-sm text-red-600">{verificationError}</p>
          ) : null}
        </div>
      ) : null}

      {verificationState === "verified" ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {t("register.verifySuccess")}
        </div>
      ) : null}
    </form>
  );
}
