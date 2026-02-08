"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";

type RegisterFormProps = {
  onVerified?: () => void;
};

export function RegisterForm({ onVerified }: RegisterFormProps) {
  const { t } = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationState, setVerificationState] = useState<"sent" | "verified" | null>(
    null
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [submitError, setSubmitError] = useState("");
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
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setVerificationError(data.error ?? t("register.verifySendError"));
        return;
      }
      setVerificationError("");
    } catch {
      setVerificationError(t("register.verifySendError"));
    } finally {
      setVerificationSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder: will wire to auth in a later step
    const normalizedEmail = email.trim().toLowerCase();
    setSubmitError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setSubmitError(data.error ?? t("register.verifySendError"));
        return;
      }
    } catch {
      setSubmitError(t("register.verifySendError"));
      return;
    }
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
      setVerificationState("sent");
      setVerificationCode("");
      setVerificationError("");
      sendVerificationEmail(normalizedEmail, code);
    }
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
    router.push("/store/dashboard");
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
      setVerificationState("sent");
      setVerificationCode("");
      setVerificationError("");
      sendVerificationEmail(normalizedEmail, code);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-slate-200 mb-1">
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
          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
          placeholder={t("register.emailPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-slate-200 mb-1">
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
          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
          placeholder="••••••••"
        />
        <p className="mt-1 text-slate-400 text-xs">{t("register.passwordHint")}</p>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-colors"
      >
        {t("register.submit")}
      </button>

      {submitError ? <p className="text-sm text-rose-300">{submitError}</p> : null}

      {verificationState === "sent" ? (
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
          <p className="mb-3">{t("register.verifyNotice")}</p>
          <label htmlFor="register-code" className="block text-sm font-medium text-slate-200 mb-1">
            {t("register.verifyCodeLabel")}
          </label>
          <input
            id="register-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors mb-3"
            placeholder={t("register.verifyCodePlaceholder")}
          />
          <button
            type="button"
            onClick={handleVerify}
            className="px-4 py-2 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 transition-colors"
            disabled={verificationSending}
          >
            {t("register.verifyAction")}
          </button>
          <button
            type="button"
            onClick={handleResend}
            className="ml-2 px-4 py-2 rounded-xl font-semibold border border-white/10 text-slate-200 hover:bg-white/10 transition-colors"
            disabled={verificationSending}
          >
            {verificationSending ? t("register.verifySending") : t("register.verifyResend")}
          </button>
          {verificationError ? (
            <p className="mt-2 text-sm text-rose-300">{verificationError}</p>
          ) : null}
        </div>
      ) : null}

      {verificationState === "verified" ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          {t("register.verifySuccess")}
        </div>
      ) : null}
    </form>
  );
}
