"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

const STORE_CATEGORIES = [
  { id: "marble-slabs", labelKey: "categories.marbleSlabs" },
  { id: "hardwood-flooring", labelKey: "categories.hardwoodFlooring" },
  { id: "ceramics", labelKey: "categories.ceramics" },
  { id: "granite", labelKey: "categories.granite" },
  { id: "fabric", labelKey: "categories.fabric" },
  { id: "carpet-rugs", labelKey: "categories.carpetAndRugs" },
] as const;

export function RegisterForm() {
  const { t } = useLocale();

  const [storeName, setStoreName] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder: will wire to auth in a later step
    console.log("Register", {
      storeName,
      storeCategory,
      email,
      password,
    });
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
        <label htmlFor="register-email" className="block text-sm font-medium text-slate-700 mb-1">
          {t("register.email")}
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
    </form>
  );
}
