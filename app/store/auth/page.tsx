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
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            {t("storeAuth.title")}
          </p>
          <h1 className="text-3xl font-semibold text-white mt-2">
            {t("storeAuth.subtitle")}
          </h1>
        </div>

        <div className="flex rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/40 overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setSuccess(null);
            }}
            className={`flex-1 text-center py-2.5 text-sm font-semibold transition-colors ${
              mode === "signin"
                ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                : "text-slate-200 hover:bg-white/10"
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
                ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                : "text-slate-200 hover:bg-white/10"
            }`}
          >
            {t("storeAuth.signUpTab")}
          </button>
        </div>

        <div className="bg-slate-900/90 rounded-3xl border border-white/10 shadow-lg shadow-black/50 p-8">
          {mode === "signin" ? (
            <LoginForm onSuccess={() => setSuccess("signin")} />
          ) : (
            <RegisterForm onVerified={() => setSuccess("signup")} />
          )}
        </div>

        {success ? (
          <div className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200 text-center shadow-sm shadow-black/30">
            <p className="mb-2">
              {success === "signin"
                ? t("storeAuth.signInSuccess")
                : t("storeAuth.signUpSuccess")}
            </p>
            <Link href="/store/dashboard" className="font-semibold text-emerald-200 hover:underline">
              {t("storeAuth.completeProfile")}
            </Link>
          </div>
        ) : null}

        <p className="mt-6 text-center text-slate-300 text-sm">
          <Link href="/" className="text-emerald-200 hover:text-white font-medium">
            {t("storeAuth.backToSearch")}
          </Link>
        </p>
      </div>
    </div>
  );
}
