"use client";

import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";

export function ProductCategories() {
  const { t } = useLocale();

  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t("home.categoriesTitle")}
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto">
          {t("home.categoriesSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {PRODUCT_CATEGORIES.map((category) => (
          <article
            key={category.id}
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all"
          >
            <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
              <Image
                src={category.sampleImageUrl}
                alt={t(category.translationKey)}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-semibold text-slate-800">
                {t(category.translationKey)}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
