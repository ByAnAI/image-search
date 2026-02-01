"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export function LanguageSwitcher() {
  const { locale, setLocale, supportedLocales } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = supportedLocales.find((l) => l.code === locale) ?? supportedLocales[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span className="text-xl leading-none" aria-hidden>
          {current.flag}
        </span>
        <span className="text-sm font-medium hidden sm:inline">{current.name}</span>
        <svg
          className={`w-4 h-4 text-sciwiz-light/60 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-full mt-1 z-50 w-56 max-h-[70vh] overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg py-1"
            role="listbox"
            aria-label="Language list"
          >
            {supportedLocales.map((option) => (
              <button
                key={option.code}
                type="button"
                role="option"
                aria-selected={option.code === locale}
                onClick={() => {
                  setLocale(option.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  option.code === locale
                    ? "bg-primary-100 text-primary-800 font-medium"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="text-xl leading-none">{option.flag}</span>
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
