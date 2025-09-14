"use client";

import CustomerTopbar from "../_components/CustomerTopbar";
import { useCustomerOrders } from "@/features/customer/orders/api";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function CustomerOrdersPage() {
  const t = useTranslations("Translation");
  const { data: orders, isLoading } = useCustomerOrders();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <CustomerTopbar />

      <section className="max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-4">{t("orders")}</h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 divide-y divide-amber-100">
          {isLoading && (
            <div className="p-4 text-sm text-neutral-500">{t("loadingOrders", { default: "Loading orders..." })}</div>
          )}
          {!isLoading && (!orders || orders.length === 0) && (
            <div className="p-4 text-sm text-neutral-500">{t("noOrders", { default: "No orders yet" })}</div>
          )}
          {(orders ?? []).map((o: any) => (
            <Link
              key={o.id}
              href={{ pathname: "/customer/orders/" + o.id }}
              className="block p-4 hover:bg-amber-100/60 transition rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-neutral-900">#{o.id}</div>
                <div className="text-sm font-semibold">{formatCurrency(o.totalAmount || o.total || 0)}</div>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className={statusBadgeClass(o.status)}>{prettyStatus(o.status)}</span>
                <span className="text-xs text-neutral-500">{formatDate(o.createdAt || o.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatCurrency(n?: number) {
  if (typeof n !== "number") return "-";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "MMK",
    }).format(n);
  } catch {
    return String(n);
  }
}
function formatDate(s?: string) {
  if (!s) return "-";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(s));
  } catch {
    return s;
  }
}

function statusBadgeClass(status?: string) {
  const base =
    'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border';
  switch ((status || '').toUpperCase()) {
    case 'COMPLETED':
      return base + ' bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'CANCELLED':
      return base + ' bg-rose-50 text-rose-700 border-rose-200';
    case 'PENDING':
    default:
      return base + ' bg-amber-50 text-amber-700 border-amber-200';
  }
}

function prettyStatus(status?: string) {
  if (!status) return '-'
  return status.charAt(0) + status.slice(1).toLowerCase()
}
