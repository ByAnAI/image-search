"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? t("register.verifySendError"));
        return;
      }
      setSubmitted(true);
      // Placeholder: will wire to auth in a later step
      console.log("Forgot password", { email });
    } catch {
      setError(t("register.verifySendError"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">{t("forgot.title")}</h1>
          <p className="text-slate-300 mt-1">{t("forgot.subtitle")}</p>
        </div>

        <div className="bg-slate-900/90 rounded-3xl border border-white/10 shadow-lg shadow-black/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-200 mb-1">
                {t("login.email")}
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={sending}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                placeholder={t("login.emailPlaceholder")}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-colors"
            >
              {sending ? t("register.verifySending") : t("forgot.submit")}
            </button>
          </form>
        </div>

        {error ? <p className="mt-4 text-center text-sm text-rose-300">{error}</p> : null}

        {submitted ? (
          <p className="mt-4 text-center text-sm text-slate-300">{t("forgot.sentNotice")}</p>
        ) : null}

        <p className="mt-6 text-center text-slate-300 text-sm">
          <Link href="/login" className="text-emerald-200 hover:text-white font-medium">
            {t("forgot.backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
