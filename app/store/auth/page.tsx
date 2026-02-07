"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";

type Mode = "signin" | "signup";

export default function StoreAuthPage() {
  const { t } = useLocale();
  const [mode, setMode] = useState<Mode>("signin");
  const [success, setSuccess] = useState<Mode | null>(null);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-sky-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t("storeAuth.title")}</h1>
          <p className="text-slate-600 mt-1">{t("storeAuth.subtitle")}</p>
        </div>

        <div className="flex rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setSuccess(null);
            }}
            className={`flex-1 text-center py-2.5 text-sm font-semibold transition-colors ${
              mode === "signin"
                ? "bg-primary-500 text-sciwiz-dark"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t("storeAuth.signInTab")}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setSuccess(null);
            }}
            className={`flex-1 text-center py-2.5 text-sm font-semibold transition-colors ${
              mode === "signup"
                ? "bg-primary-500 text-sciwiz-dark"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t("storeAuth.signUpTab")}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          {mode === "signin" ? (
            <LoginForm onSuccess={() => setSuccess("signin")} />
          ) : (
            <RegisterForm onVerified={() => setSuccess("signup")} />
          )}
        </div>

        {success ? (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 text-center">
            <p className="mb-2">
              {success === "signin"
                ? t("storeAuth.signInSuccess")
                : t("storeAuth.signUpSuccess")}
            </p>
            <Link href="/store/dashboard" className="font-semibold text-emerald-800 hover:underline">
              {t("storeAuth.completeProfile")}
            </Link>
          </div>
        ) : null}

        <p className="mt-6 text-center text-slate-600 text-sm">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            {t("storeAuth.backToSearch")}
          </Link>
        </p>
      </div>
    </div>
  );
}
