"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { StoreDashboard } from "@/components/StoreDashboard";

export default function StoreDashboardPage() {
  const { t } = useLocale();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("storeDashboard.title")}</h1>
          <p className="text-slate-300 mt-1">{t("storeDashboard.subtitle")}</p>
        </div>
        <Link href="/store/auth" className="text-sm text-slate-300 hover:text-white">
          {t("storeDashboard.logOut")}
        </Link>
      </div>

      <StoreDashboard />
    </div>
  );
}
