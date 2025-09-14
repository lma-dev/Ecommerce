"use client";

import { ShoppingCart, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/app/[locale]/_components/layout/language-switcher";
import { CustomerUserDropdown } from "./CustomerUserDropdown";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CartSheet from "./CartSheet";
import { useCart } from "@/features/customer/cart/hooks";

export default function CustomerTopbar() {
  const t = useTranslations("Translation");
  const { count } = useCart();
  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-white border-b border-neutral-200 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
      <div className="mx-auto max-w-6xl px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand (left) */}
        <Link
          href={{ pathname: "/customer" }}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="h-9 w-9 rounded-md bg-emerald-600 text-white flex items-center justify-center text-base font-black shadow-sm">
            ✦
          </div>
          <span className="hidden md:inline text-lg font-black tracking-tight truncate text-neutral-900">
            {t("appTitle")}
          </span>
        </Link>

        {/* Nav + actions (right) */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Primary tabs (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-700">
            <Link href={{ pathname: "/customer" }} className="text-emerald-600">
              Menu
            </Link>
            <Link href={{ pathname: "/customer/orders" }} className="hover:text-emerald-700">
              {t("orders")}
            </Link>
          </nav>

          {/* Orders quick access (mobile) */}
          <Link href={{ pathname: "/customer/orders" }} className="md:hidden" aria-label={t("orders") as string}>
            <Button variant="ghost" size="icon" className="text-neutral-700 hover:text-emerald-700">
              <Receipt className="h-5 w-5" />
            </Button>
          </Link>

          {/* Language switcher: icon on mobile, label on desktop */}
          <div className="md:hidden">
            <LanguageSwitcher compact />
          </div>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <CartSheet>
            <Button className="relative bg-emerald-600 hover:bg-emerald-700 text-white h-9 w-9 md:w-auto md:px-4">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] leading-none bg-white text-emerald-700 rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow">
                  {count}
                </span>
              )}
            </Button>
          </CartSheet>
          <CustomerUserDropdown />
        </div>
      </div>
    </header>
  );
}
