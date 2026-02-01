"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { SearchSection } from "@/components/SearchSection";
import { ProductCategories } from "@/components/ProductCategories";

export default function HomePage() {
  const { t } = useLocale();
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <section className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          {t("home.title")}
        </h1>
        <p className="text-slate-600 text-lg max-w-xl mx-auto mb-2">
          {t("home.subtitle")}
        </p>
        <p className="text-slate-500 text-base max-w-xl mx-auto">
          {t("home.forProducts")}
        </p>
      </section>

      <SearchSection />

      <ProductCategories />

      <section className="mt-16 text-center text-slate-500 text-sm">
        <p>
          {t("home.businessOwner")}{" "}
          <Link
            href="/register"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {t("home.addYourStore")}
          </Link>
        </p>
      </section>
    </div>
  );
}
