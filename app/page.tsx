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

      <section className="mt-16 text-center text-slate-500 text-sm">
        <p>
          {t("home.businessOwner")}{" "}
          <Link
            href="/store/auth"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {t("home.addYourStore")}
          </Link>
        </p>
      </section>
    </div>
  );
}
