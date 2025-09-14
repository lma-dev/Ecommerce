"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useCart } from "@/features/customer/cart/hooks";
import { resolveAssetUrl } from "@/libs/assets";

type Props = {
  product: any;
};

export default function ProductCard({ product }: Props) {
  const t = useTranslations("Translation");
  const { add } = useCart();
  const raw = product?.image?.url || product?.imageUrl
  const imageUrl = resolveAssetUrl(raw) || "https://via.placeholder.com/800x800.png?text=Product";
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden transition shadow-sm hover:shadow-md">
      <div className="w-full h-36 sm:h-40 bg-amber-50 flex items-center justify-center p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="font-semibold text-neutral-900 truncate" title={product.name}>{product.name}</div>
        {product?.description && (
          <div className="text-sm text-neutral-500 line-clamp-2 mt-1" title={product.description}>
            {product.description}
          </div>
        )}
        <div className="flex items-center justify-between pt-3">
          <div className="text-neutral-900 font-semibold">{formatCurrency(product.price)}</div>
          <Button
            size="sm"
            className="rounded-full px-4"
            onClick={() => add({ id: product.id, name: product.name, price: product.price, imageUrl }, 1)}
          >
            {t("addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(n?: number) {
  if (typeof n !== 'number') return '-'
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'MMK' }).format(n) } catch { return String(n) }
}
