"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export function RegisterForm() {
  const { t } = useLocale();
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: will wire to auth in a later step
    console.log("Register", { storeName, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
