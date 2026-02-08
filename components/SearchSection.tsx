"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { City, Country } from "country-state-city";
import { useLocale } from "@/contexts/LocaleContext";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";
import { extractImageFeatures, resizeImageFile } from "@/lib/imageFeatures";

countries.registerLocale(enLocale);

export function SearchSection() {
  const { t } = useLocale();
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [results, setResults] = useState<
    {
      id: string;
      imageUrl: string;
      similarity: number;
      store: {
        store_name: string | null;
        country: string | null;
        city: string | null;
        website: string | null;
        phone: string | null;
      } | null;
    }[]
  >([]);

  const countryOptions = useMemo(() => {
    const names = countries.getNames("en", { select: "official" });
    return Object.entries(names)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "en"));
  }, []);
  const countryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    countryOptions.forEach((option) => map.set(option.code, option.name));
    return map;
  }, [countryOptions]);

  const selectedCountry = useMemo(
    () => (country ? Country.getCountryByCode(country) ?? null : null),
    [country]
  );

  const cityOptions = useMemo(() => {
    if (!country) return [];
    const cities = City.getCitiesOfCountry(country) ?? [];
    return [...cities].sort((a, b) => a.name.localeCompare(b.name, "en"));
  }, [country]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFile(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFile(file);
    }
  }, []);

  const clearImage = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setResults([]);
    setSearchError("");
  }, [preview]);

  const handleSearch = useCallback(async () => {
    if (!file || !category) {
      setSearchError(t("searchSection.missingFilters"));
      return;
    }
    setSearchError("");
    setSearching(true);
    try {
      const resizedFile = await resizeImageFile(file);
      const featureVector = await extractImageFeatures(resizedFile);
      const response = await fetch("/api/search/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featureVector,
          category,
          country,
          city,
        }),
      });
      if (!response.ok) {
        setSearchError(t("searchSection.searchError"));
        return;
      }
      const data = (await response.json()) as { results: typeof results };
      setResults(data.results ?? []);
    } catch {
      setSearchError(t("searchSection.searchError"));
    } finally {
      setSearching(false);
    }
  }, [file, category, country, city, t, results]);

  return (
    <section className="bg-slate-900/80 rounded-2xl border border-white/10 shadow-lg shadow-black/40 p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-100 mb-3">
        {t("searchSection.uploadYourImage")}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 mb-5">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            {t("searchSection.categoryLabel")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
          >
            <option value="">{t("searchSection.categoryPlaceholder")}</option>
            {PRODUCT_CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>
                {t(item.translationKey)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            {t("searchSection.countryLabel")}
          </label>
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setCity("");
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
          >
            <option value="">{t("searchSection.allCountries")}</option>
            {countryOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-200 mb-1">
            {t("searchSection.cityLabel")}
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!selectedCountry}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors disabled:bg-slate-800 disabled:text-slate-500"
          >
            <option value="">{t("searchSection.allCities")}</option>
            {cityOptions.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!preview ? (
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
            onChange={handleFileInput}
            className="hidden"
          />
          <svg
            className="w-8 h-8 text-slate-400 mb-1 -mt-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-slate-200 font-medium -mt-1">
            {t("searchSection.dragOrClick")}
          </span>
          <span className="text-slate-400 text-xs mt-1">
            {t("searchSection.formats")}
          </span>
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative inline-block rounded-xl overflow-hidden border border-white/10 max-h-72">
            <div className="relative h-72 w-[20rem] sm:w-[24rem]">
              <Image
                src={preview}
                alt={t("searchSection.uploadPreview")}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 rounded-lg bg-slate-950/80 hover:bg-slate-900 shadow text-slate-200 hover:text-white transition-colors"
              aria-label={t("searchSection.removeImage")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching}
              className="px-5 py-2.5 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-colors"
            >
              {searching ? t("searchSection.searching") : t("searchSection.searchSimilar")}
            </button>
            <button
              type="button"
              onClick={clearImage}
              className="px-5 py-2.5 rounded-xl font-medium border border-white/10 text-slate-200 hover:bg-white/10 transition-colors"
            >
              {t("searchSection.chooseAnother")}
            </button>
          </div>
        </div>
      )}

      {searchError ? <p className="mt-3 text-sm text-rose-300">{searchError}</p> : null}

      <p className="mt-3 text-slate-400 text-sm">
        {t("searchSection.searchFree")}
      </p>

      {results.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {results.map((result) => (
            <article
              key={result.id}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-24 w-24 rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={result.imageUrl}
                    alt={t("searchSection.resultImageAlt")}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-100">
                    {result.store?.store_name ?? t("searchSection.unknownStore")}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {result.store?.city ?? t("searchSection.unknownCity")}
                    {result.store?.country
                      ? `, ${countryNameMap.get(result.store.country) ?? result.store.country}`
                      : ""}
                  </p>
                  {result.store?.phone ? (
                    <p className="text-xs text-slate-300 mt-1">
                      {t("searchSection.phoneLabel")} {result.store.phone}
                    </p>
                  ) : null}
                  {result.store?.website ? (
                    <a
                      href={result.store.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-200 hover:text-emerald-100 mt-1 inline-flex"
                    >
                      {t("searchSection.websiteLabel")}
                    </a>
                  ) : null}
                  <p className="text-xs text-slate-500 mt-1">
                    {t("searchSection.similarityLabel")}{" "}
                    {Math.round(result.similarity * 100)}%
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
