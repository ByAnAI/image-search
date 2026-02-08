"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { SearchSection } from "@/components/SearchSection";
import { ProductCategories } from "@/components/ProductCategories";

export default function HomePage() {
  const { t } = useLocale();
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
      <SearchSection />

      <ProductCategories />

      <section className="mt-12 text-center text-slate-400 text-sm">
        <p>
          {t("home.businessOwner")}{" "}
          <Link
            href="/store/auth"
            className="text-emerald-300 hover:text-emerald-200 font-medium"
          >
            {t("home.addYourStore")}
          </Link>
        </p>
      </section>
    </div>
  );
}
