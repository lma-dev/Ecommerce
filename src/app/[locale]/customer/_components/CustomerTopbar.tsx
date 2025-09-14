"use client";

import { ShoppingCart, Receipt } from "lucide-react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isOrders = /\/(customer)\/orders/.test(pathname);
  const isMenu = /\/(customer)\/?$/.test(pathname);
  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-background border-b border-border shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
      <div className="mx-auto max-w-6xl px-4 md:px-6 h-16 flex items-center justify-between gap-3 md:gap-4">
        {/* Brand (left) */}
        <Link
          href={{ pathname: "/customer" }}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-base font-black shadow-sm">
            ✦
          </div>
          <span className="hidden md:inline text-lg font-black tracking-tight truncate text-foreground">
            {t("appTitle")}
          </span>
        </Link>

        {/* Nav + actions (right) */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Primary tabs (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <Link href={{ pathname: "/customer" }} className={isMenu ? "text-primary" : "hover:text-foreground"}>
              Menu
            </Link>
            <Link href={{ pathname: "/customer/orders" }} className={isOrders ? "text-primary" : "hover:text-foreground"}>
              {t("orders")}
            </Link>
          </nav>

          {/* Orders quick access (mobile) */}
          <Link href={{ pathname: "/customer/orders" }} className="md:hidden" aria-label={t("orders") as string}>
            <Button variant="ghost" size="icon" className={isOrders ? "text-primary" : "text-neutral-700 hover:text-foreground"} title={t("orders") as string}>
              <Receipt className="h-5 w-5" />
            </Button>
          </Link>

          {/* Language switcher: icon at all sizes for customer */}
          <LanguageSwitcher compact />
          <CartSheet>
            <Button className="relative bg-primary hover:bg-primary/90 text-primary-foreground h-9 w-9 md:w-auto md:px-4" aria-label={t("cart") as string} title={t("cart") as string}>
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] leading-none bg-white text-primary rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow">
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
