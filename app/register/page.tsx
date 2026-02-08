"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">{t("register.title")}</h1>
        </div>

        <div className="bg-slate-900/90 rounded-3xl border border-white/10 shadow-lg shadow-black/50 p-8">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-slate-300 text-sm">
          {t("register.hasAccount")}{" "}
          <Link href="/login" className="text-emerald-200 hover:text-white font-medium">
            {t("register.loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
