"use client";

import { useLocale } from "next-intl";
import StatCard from "./StatCard";
import { Clock, CircleDollarSign, Users as UsersIcon, User as UserIcon, Package } from "lucide-react";
import type { DashboardStats } from "@/features/dashboard/api";

export default function DashboardStatGrid({
  data,
  t,
}: {
  data?: DashboardStats;
  t: any;
}) {
  const locale = useLocale();
  const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const cf = new Intl.NumberFormat(locale, { style: "currency", currency: "MMK" });

  const items = [
    {
      label: t("pendingOrders"),
      value: data ? nf.format(data.pendingOrdersCount) : "-",
      hint: t("timeLastWeek"),
      icon: Clock,
      iconBg: "bg-amber-100 text-amber-700",
    },
    {
      label: t("completedOrdersTotal"),
      value: data ? cf.format(data.completedOrdersTotalAmount) : "-",
      hint: t("sinceLastUpdate"),
      icon: CircleDollarSign,
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    {
      label: t("customers"),
      value: data ? nf.format(data.customersCount) : "-",
      hint: t("total"),
      icon: UsersIcon,
      iconBg: "bg-blue-100 text-blue-700",
    },
    {
      label: t("users"),
      value: data ? nf.format(data.usersCount) : "-",
      hint: t("total"),
      icon: UserIcon,
      iconBg: "bg-purple-100 text-purple-700",
    },
    {
      label: t("products"),
      value: data ? nf.format(data.productsCount) : "-",
      hint: t("total"),
      icon: Package,
      iconBg: "bg-cyan-100 text-cyan-700",
    },
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <StatCard
          key={String(it.label)}
          label={it.label}
          value={it.value}
          hint={it.hint}
          Icon={it.icon}
          iconBg={it.iconBg}
        />
      ))}
    </div>
  );
}

