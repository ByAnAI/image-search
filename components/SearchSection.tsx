"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";

export function SearchSection() {
  const { t } = useLocale();
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

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
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }, []);

  const clearImage = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  }, [preview]);

  return (
    <section className="bg-slate-900/80 rounded-2xl border border-white/10 shadow-lg shadow-black/40 p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-100 mb-3">
        {t("searchSection.uploadYourImage")}
      </h2>

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
              className="px-5 py-2.5 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-colors"
            >
              {t("searchSection.searchSimilar")}
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

      <p className="mt-3 text-slate-400 text-sm">
        {t("searchSection.searchFree")}
      </p>
    </section>
  );
}
