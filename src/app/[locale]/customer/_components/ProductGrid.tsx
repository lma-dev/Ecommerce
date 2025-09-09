"use client";

import ProductCard from "./ProductCard";
import { useTranslations } from "next-intl";

type Props = {
  products?: any[];
  isLoading?: boolean;
};

export default function ProductGrid({ products, isLoading }: Props) {
  const t = useTranslations("Translation");
  if (!isLoading && (!products || products.length === 0)) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
        {t("noData")}
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {(products ?? []).map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
