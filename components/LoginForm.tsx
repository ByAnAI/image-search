"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

type LoginFormProps = {
  onSuccess?: () => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("image-search-verified-emails");
      const map = stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
      if (!map[normalizedEmail]) {
        setError(t("login.verifyRequired"));
        return;
      }
    }
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? t("login.invalidCredentials"));
        return;
      }
    } catch {
      setError(t("login.invalidCredentials"));
      return;
    }
    console.log("Login", { email, password });
    if (typeof window !== "undefined") {
      localStorage.setItem("store-auth-email", normalizedEmail);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-slate-200 mb-1">
          {t("login.email")}
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
          placeholder={t("login.emailPlaceholder")}
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-slate-200 mb-1">
          {t("login.password")}
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-colors"
      >
        {t("login.submit")}
      </button>
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          {t("login.forgotPassword")}
        </Link>
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </form>
  );
}
