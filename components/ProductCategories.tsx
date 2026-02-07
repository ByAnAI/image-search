"use client";

import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";

export function ProductCategories() {
  const { t } = useLocale();

  return (
    <section className="mt-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {t("home.categoriesTitle")}{" "}
          <span className="text-slate-600 font-normal">
            {t("home.categoriesSubtitle")}
          </span>
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {PRODUCT_CATEGORIES.map((category) => (
          <article
            key={category.id}
            className="group w-36 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all"
          >
            <div className="h-32 w-32 mx-auto mt-4 relative bg-slate-100 overflow-hidden rounded-xl">
              <Image
                src={category.sampleImageUrl}
                alt={t(category.translationKey)}
                fill
                sizes="128px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="font-semibold text-sm text-slate-800">
                {t(category.translationKey)}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
