"use client";

import { useEffect, useMemo, useState } from "react";
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

type StoreProfile = {
  email: string;
  storeName: string;
  country: string;
  city: string;
  website?: string;
  phone?: string;
};

export function StoreDashboard() {
  const { t, locale } = useLocale();
  const [email, setEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneFromProfile, setPhoneFromProfile] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [dragActive, setDragActive] = useState(false);

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

  useEffect(() => {
    const storedEmail =
      typeof window !== "undefined" ? localStorage.getItem("store-auth-email") ?? "" : "";
    setEmail(storedEmail);
    if (!storedEmail) {
      setLoadingProfile(false);
      return;
    }
    const loadProfile = async () => {
      try {
        const response = await fetch(
          `/api/store/profile?email=${encodeURIComponent(storedEmail)}`
        );
        if (!response.ok) return;
        const data = (await response.json()) as { profile?: StoreProfile };
        if (!data.profile) return;
        setStoreName(data.profile.storeName ?? "");
        setCountry(data.profile.country ?? "");
        setCity(data.profile.city ?? "");
        setWebsite(data.profile.website ?? "");
        setPhoneFromProfile(data.profile.phone ?? "");
      } catch {
        setProfileError(t("storeProfile.loadError"));
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, [t]);

  useEffect(() => {
    if (!phoneFromProfile || phoneNumber) return;
    if (selectedCountry?.phonecode) {
      const prefix = `+${selectedCountry.phonecode}`;
      setPhoneNumber(
        phoneFromProfile.startsWith(prefix)
          ? phoneFromProfile.slice(prefix.length)
          : phoneFromProfile
      );
    } else {
      setPhoneNumber(phoneFromProfile);
    }
  }, [phoneFromProfile, phoneNumber, selectedCountry?.phonecode]);

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");
    if (!email) {
      setProfileError(t("storeProfile.missingEmail"));
      return;
    }
    if (!country || !city || !storeName) {
      setProfileError(t("storeProfile.missingFields"));
      return;
    }
    setSavingProfile(true);
    try {
    const fullPhone =
      phoneNumber && phoneNumber.startsWith("+")
        ? phoneNumber
        : phoneNumber && selectedCountry?.phonecode
          ? `+${selectedCountry.phonecode}${phoneNumber}`
          : phoneNumber;
      const response = await fetch("/api/store/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          storeName,
          country,
          city,
          website,
          phone: fullPhone,
        }),
      });
      if (!response.ok) {
        setProfileError(t("storeProfile.saveError"));
        return;
      }
      setProfileMessage(t("storeProfile.saveSuccess"));
    } catch {
      setProfileError(t("storeProfile.saveError"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) {
      // Placeholder: will upload in a later step
      console.log("Upload product image", file.name);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-slate-900/80 rounded-2xl border border-white/10 shadow-lg shadow-black/40 p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {t("storeProfile.title")}
        </h2>
        {loadingProfile ? (
          <p className="text-slate-400 text-sm">{t("storeProfile.loading")}</p>
        ) : !email ? (
          <p className="text-slate-400 text-sm">{t("storeProfile.signInFirst")}</p>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-slate-200 mb-1">
                {t("register.email")}
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-slate-300"
              />
            </div>
            <div>
              <label htmlFor="profile-store" className="block text-sm font-medium text-slate-200 mb-1">
                {t("register.storeName")}
              </label>
              <input
                id="profile-store"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                placeholder={t("register.storePlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="profile-country" className="block text-sm font-medium text-slate-200 mb-1">
                {t("register.country")}
              </label>
              <select
                id="profile-country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setCity("");
                }}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
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
              <label htmlFor="profile-city" className="block text-sm font-medium text-slate-200 mb-1">
                {t("register.city")}
              </label>
              <select
                id="profile-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={!selectedCountry}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors disabled:bg-slate-800 disabled:text-slate-500"
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
              <label htmlFor="profile-website" className="block text-sm font-medium text-slate-200 mb-1">
                {t("register.website")}
              </label>
              <input
                id="profile-website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                placeholder={t("register.websitePlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="profile-phone" className="block text-sm font-medium text-slate-200 mb-1">
                {t("register.phone")}
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-white/10 bg-slate-900/60 text-slate-300 text-sm">
                  {selectedCountry?.phonecode ? `+${selectedCountry.phonecode}` : "+"}
                </span>
                <input
                  id="profile-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-r-xl border border-white/10 border-l-0 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                  placeholder={t("register.phonePlaceholder")}
                />
              </div>
            </div>
            {profileError ? <p className="text-sm text-rose-300">{profileError}</p> : null}
            {profileMessage ? (
              <p className="text-sm text-emerald-300">{profileMessage}</p>
            ) : null}
            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-3 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-colors disabled:opacity-70"
            >
              {savingProfile ? t("storeProfile.saving") : t("storeProfile.save")}
            </button>
          </form>
        )}
      </section>
      <section className="bg-slate-900/80 rounded-2xl border border-white/10 shadow-lg shadow-black/40 p-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          {t("storeDashboard.addProductImage")}
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          {t("storeDashboard.addProductDescription")}
        </p>
        <label
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition-colors
            ${dragActive ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 hover:border-white/30 hover:bg-white/5"}
          `}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) console.log("Upload product image", file.name);
            }}
          />
          <svg
            className="w-10 h-10 text-slate-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-slate-200 font-medium">
            {t("storeDashboard.dragOrClick")}
          </span>
        </label>
      </section>

      <section className="bg-slate-900/80 rounded-2xl border border-white/10 shadow-lg shadow-black/40 p-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          {t("storeDashboard.yourProducts")}
        </h2>
        <p className="text-slate-400 text-sm">
          {t("storeDashboard.noProducts")}
        </p>
      </section>
    </div>
  );
}
