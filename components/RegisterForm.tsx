"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

type RegisterFormProps = {
  onVerified?: () => void;
};

export function RegisterForm({ onVerified }: RegisterFormProps) {
  const { t } = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationState, setVerificationState] = useState<"sent" | "verified" | null>(
    null
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationSending, setVerificationSending] = useState(false);

  const sendVerificationEmail = async (targetEmail: string, code: string) => {
    setVerificationSending(true);
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, code }),
      });
      if (!response.ok) {
        setVerificationError(t("register.verifySendError"));
      }
    } catch {
      setVerificationError(t("register.verifySendError"));
    } finally {
      setVerificationSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder: will wire to auth in a later step
    const normalizedEmail = email.trim().toLowerCase();
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("image-search-verified-emails");
      const map = stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
      map[normalizedEmail] = false;
      localStorage.setItem("image-search-verified-emails", JSON.stringify(map));

      const codeMapRaw = localStorage.getItem("image-search-verification-codes");
      const codeMap = codeMapRaw ? (JSON.parse(codeMapRaw) as Record<string, string>) : {};
      const code = String(Math.floor(100000 + Math.random() * 900000));
      codeMap[normalizedEmail] = code;
      localStorage.setItem("image-search-verification-codes", JSON.stringify(codeMap));
      sendVerificationEmail(normalizedEmail, code);
    }
    setVerificationState("sent");
    setVerificationCode("");
    setVerificationError("");
    console.log("Register", {
      email,
      password,
    });
  };

  const handleVerify = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    if (typeof window !== "undefined") {
      const codeMapRaw = localStorage.getItem("image-search-verification-codes");
      const codeMap = codeMapRaw ? (JSON.parse(codeMapRaw) as Record<string, string>) : {};
      const expected = codeMap[normalizedEmail];
      if (!expected || verificationCode.trim() !== expected) {
        setVerificationError(t("register.verifyInvalid"));
        return;
      }
      const stored = localStorage.getItem("image-search-verified-emails");
      const map = stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
      map[normalizedEmail] = true;
      localStorage.setItem("image-search-verified-emails", JSON.stringify(map));
    }
    setVerificationState("verified");
    setVerificationError("");
    if (typeof window !== "undefined") {
      localStorage.setItem("store-auth-email", normalizedEmail);
    }
    onVerified?.();
  };

  const handleResend = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    if (typeof window !== "undefined") {
      const codeMapRaw = localStorage.getItem("image-search-verification-codes");
      const codeMap = codeMapRaw ? (JSON.parse(codeMapRaw) as Record<string, string>) : {};
      const code = String(Math.floor(100000 + Math.random() * 900000));
      codeMap[normalizedEmail] = code;
      localStorage.setItem("image-search-verification-codes", JSON.stringify(codeMap));
      sendVerificationEmail(normalizedEmail, code);
    }
    setVerificationState("sent");
    setVerificationCode("");
    setVerificationError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-slate-700 mb-1">
          {t("register.email")}
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setVerificationState(null);
            setVerificationCode("");
            setVerificationError("");
          }}
          required
          autoComplete="email"
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
          placeholder={t("register.emailPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-slate-700 mb-1">
          {t("register.password")}
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
          placeholder="••••••••"
        />
        <p className="mt-1 text-slate-500 text-xs">{t("register.passwordHint")}</p>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
      >
        {t("register.submit")}
      </button>

      {verificationState === "sent" ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="mb-3">{t("register.verifyNotice")}</p>
          <label htmlFor="register-code" className="block text-sm font-medium text-slate-700 mb-1">
            {t("register.verifyCodeLabel")}
          </label>
          <input
            id="register-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors mb-3"
            placeholder={t("register.verifyCodePlaceholder")}
          />
          <button
            type="button"
            onClick={handleVerify}
            className="px-4 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
            disabled={verificationSending}
          >
            {t("register.verifyAction")}
          </button>
          <button
            type="button"
            onClick={handleResend}
            className="ml-2 px-4 py-2 rounded-lg font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
            disabled={verificationSending}
          >
            {verificationSending ? t("register.verifySending") : t("register.verifyResend")}
          </button>
          {verificationError ? (
            <p className="mt-2 text-sm text-red-600">{verificationError}</p>
          ) : null}
        </div>
      ) : null}

      {verificationState === "verified" ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {t("register.verifySuccess")}
        </div>
      ) : null}
    </form>
  );
}
