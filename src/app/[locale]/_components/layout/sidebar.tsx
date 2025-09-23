"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/libs/utils";
import { env } from "@/utils/env";

export function Sidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const t = useTranslations("Translation");
  const locale = useLocale();
  const version = env.APP_VERSION;

  const links = [
    { label: t("dashboard"), href: `/${locale}/${version}/dashboard` },
    { label: t("categories"), href: `/${locale}/${version}/categories` },
    { label: t("products"), href: `/${locale}/${version}/products` },
    { label: t("orders"), href: `/${locale}/${version}/orders` },
    { label: t("users"), href: `/${locale}/${version}/users` },
    { label: t("customers"), href: `/${locale}/${version}/customers` },
  ];

  return (
    <nav className="flex flex-col space-y-2 text-sm font-medium">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={cn(
            "rounded-md px-3 py-2 hover:bg-muted transition-colors border-l-2",
            pathname === link.href
              ? "bg-muted font-semibold border-primary"
              : "text-muted-foreground border-transparent"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
