"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export function StoreDashboard() {
  const { t } = useLocale();
  const [dragActive, setDragActive] = useState(false);

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
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {t("storeDashboard.addProductImage")}
        </h2>
        <p className="text-slate-600 text-sm mb-4">
          {t("storeDashboard.addProductDescription")}
        </p>
        <label
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition-colors
            ${dragActive ? "border-primary-500 bg-primary-50" : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"}
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
          <span className="text-slate-600 font-medium">
            {t("storeDashboard.dragOrClick")}
          </span>
        </label>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {t("storeDashboard.yourProducts")}
        </h2>
        <p className="text-slate-500 text-sm">
          {t("storeDashboard.noProducts")}
        </p>
      </section>
    </div>
  );
}
