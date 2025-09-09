"use client";

import { Button } from "@/components/ui/button";
import CartSheet from "./CartSheet";
import { useCart } from "@/features/customer/cart/hooks";
import { useTranslations } from "next-intl";

export default function CheckoutFloatingCTA() {
  const t = useTranslations("Translation");
  const { subtotal, count } = useCart();
  return (
    <CartSheet>
      <Button className="fixed right-4 bottom-4 md:right-8 md:bottom-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg px-5 py-6 gap-3">
        <span className="hidden sm:inline text-sm font-medium">{t("reviewAndCheckout")}</span>
        <span className="text-sm font-semibold">{formatCurrency(subtotal)}</span>
        {count > 0 && (
          <span className="sr-only">{count}</span>
        )}
      </Button>
    </CartSheet>
  );
}

function formatCurrency(n?: number) {
  if (typeof n !== 'number') return '-'
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'MMK' }).format(n) } catch { return String(n) }
}
