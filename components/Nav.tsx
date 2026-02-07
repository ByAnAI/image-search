"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Nav() {
  const { t } = useLocale();
  return (
    <header className="border-b border-sciwiz-surface/80 bg-sciwiz-dark/95 backdrop-blur-md sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-sciwiz-light hover:text-white transition-colors"
        >
          {t("nav.appName")}
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />
          <Link
            href="/"
            className="text-sm text-sciwiz-light/90 hover:text-white transition-colors"
          >
            {t("nav.search")}
          </Link>
          <Link
            href="/login"
            className="text-sm text-sciwiz-light/90 hover:text-white transition-colors"
          >
            {t("nav.login")}
          </Link>
          <Link
            href="/"
            className="text-sm text-sciwiz-light/90 hover:text-white transition-colors"
          >
            {t("nav.dashboard")}
          </Link>
          <Link
            href="/store/auth"
            className="text-sm font-semibold text-sciwiz-dark bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
          >
            {t("nav.forStores")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
