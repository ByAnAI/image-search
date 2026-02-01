"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t("register.title")}</h1>
          <p className="text-slate-600 mt-1">{t("register.subtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-slate-600 text-sm">
          {t("register.hasAccount")}{" "}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            {t("register.loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
