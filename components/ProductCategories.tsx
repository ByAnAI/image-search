"use client";

import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";

export function ProductCategories() {
  const { t } = useLocale();

  return (
    <section className="mt-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-100">
          {t("home.categoriesTitle")}{" "}
          <span className="text-slate-400 font-normal">
            {t("home.categoriesSubtitle")}
          </span>
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {PRODUCT_CATEGORIES.map((category) => (
          <article
            key={category.id}
            className="group w-36 bg-slate-900/80 rounded-2xl border border-white/10 shadow-lg shadow-black/40 overflow-hidden hover:shadow-xl hover:border-white/20 transition-all"
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
              <h3 className="font-semibold text-sm text-slate-100">
                {t(category.translationKey)}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
