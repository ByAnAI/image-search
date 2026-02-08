"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

export default function ResetPasswordPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!token) {
      setError(t("reset.missingToken"));
      return;
    }
    if (password.trim().length < 8) {
      setError(t("reset.passwordTooShort"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("reset.passwordMismatch"));
      return;
    }
    setSending(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? t("reset.failed"));
        return;
      }
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError(t("reset.failed"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">{t("reset.title")}</h1>
          <p className="text-slate-300 mt-1">{t("reset.subtitle")}</p>
        </div>

        <div className="bg-slate-900/90 rounded-3xl border border-white/10 shadow-lg shadow-black/50 p-8">
          {success ? (
            <div className="text-center text-sm text-emerald-200">
              <p className="mb-4">{t("reset.success")}</p>
              <Link href="/login" className="font-semibold text-emerald-200 hover:text-white">
                {t("reset.backToLogin")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="reset-password" className="block text-sm font-medium text-slate-200 mb-1">
                  {t("reset.newPassword")}
                </label>
                <input
                  id="reset-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={sending}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label
                  htmlFor="reset-confirm"
                  className="block text-sm font-medium text-slate-200 mb-1"
                >
                  {t("reset.confirmPassword")}
                </label>
                <input
                  id="reset-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={sending}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-colors"
              >
                {sending ? t("register.verifySending") : t("reset.submit")}
              </button>
              {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
