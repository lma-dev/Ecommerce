"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ProductGrid from "./ProductGrid";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Category = { id: number; name: string };

type Props = {
  categories: Category[];
  categoryId?: number;
  onCategoryChange: (id: number) => void;
  products?: any[];
  isLoading?: boolean;
};

export default function BookBrowser({
  categories,
  categoryId,
  onCategoryChange,
  products,
  isLoading,
}: Props) {
  const t = useTranslations("Translation");
  const index = useMemo(() => categories.findIndex((c) => c.id === categoryId), [categories, categoryId]);
  const total = categories.length;
  const current = index >= 0 ? categories[index] : undefined;

  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const goPrev = () => {
    if (index > 0) onCategoryChange(categories[index - 1].id);
  };
  const goNext = () => {
    if (index < total - 1) onCategoryChange(categories[index + 1].id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  };

  const onTouchStart = (e: React.TouchEvent) => setTouchStartX(e.changedTouches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) goPrev();
      else goNext();
    }
    setTouchStartX(null);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="outline-none"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <Button variant="secondary" size="sm" onClick={goPrev} disabled={index <= 0} className="gap-1">
          <ChevronLeft className="size-4" /> {t("previous")}
        </Button>
        <div className="text-sm text-muted-foreground">
          {current ? (
            <span>
              {current.name} • {index + 1} {t("of")} {total}
            </span>
          ) : (
            <span>{t("selectCategory")}</span>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={goNext} disabled={index >= total - 1} className="gap-1">
          {t("next")} <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={categoryId ?? "empty"}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-2xl border bg-background/60 backdrop-blur p-4 md:p-6 shadow-sm"
          >
            <div className="flex items-end justify-between gap-4 flex-wrap mb-1 md:mb-3">
              <div className="min-w-0">
                <div className="text-xl font-bold truncate">{current?.name ?? t("selectCategory")}</div>
                <div className="text-xs text-muted-foreground">
                  {t("browseMenu")}
                </div>
              </div>
            </div>

            <div className="mt-4">
              {categoryId ? (
                <ProductGrid products={products} isLoading={isLoading} />
              ) : (
                <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
                  {t("selectCategoryHint")}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
