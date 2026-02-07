"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t("login.title")}</h1>
          <p className="text-slate-600 mt-1">{t("login.subtitle")}</p>
        </div>

        <div className="flex rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
          <span className="flex-1 text-center py-2.5 text-sm font-semibold bg-primary-500 text-sciwiz-dark">
            {t("login.signInTab")}
          </span>
          <Link
            href="/register"
            className="flex-1 text-center py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {t("login.signUpTab")}
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-slate-600 text-sm">
          {t("login.noAccount")}{" "}
          <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            {t("login.registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
