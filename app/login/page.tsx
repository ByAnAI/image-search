"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">{t("login.title")}</h1>
          <p className="text-slate-300 mt-1">{t("login.subtitle")}</p>
        </div>

        <div className="flex rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/40 overflow-hidden mb-6">
          <span className="flex-1 text-center py-2.5 text-sm font-semibold bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
            {t("login.signInTab")}
          </span>
          <Link
            href="/register"
            className="flex-1 text-center py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-colors"
          >
            {t("login.signUpTab")}
          </Link>
        </div>

        <div className="bg-slate-900/90 rounded-3xl border border-white/10 shadow-lg shadow-black/50 p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-slate-300 text-sm">
          {t("login.noAccount")}{" "}
          <Link href="/register" className="text-emerald-200 hover:text-white font-medium">
            {t("login.registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
