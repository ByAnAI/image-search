"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    // Placeholder: will wire to auth in a later step
    console.log("Forgot password", { email });
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t("forgot.title")}</h1>
          <p className="text-slate-600 mt-1">{t("forgot.subtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-700 mb-1">
                {t("login.email")}
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
                placeholder={t("login.emailPlaceholder")}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold bg-primary-500 text-sciwiz-dark hover:bg-primary-600 transition-colors"
            >
              {t("forgot.submit")}
            </button>
          </form>
        </div>

        {submitted ? (
          <p className="mt-4 text-center text-sm text-slate-600">{t("forgot.sentNotice")}</p>
        ) : null}

        <p className="mt-6 text-center text-slate-600 text-sm">
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            {t("forgot.backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
