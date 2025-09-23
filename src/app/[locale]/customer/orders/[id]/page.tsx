"use client";

import CustomerTopbar from "../../_components/CustomerTopbar";
import { useCustomerOrder } from "@/features/customer/orders/api";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { resolveAssetUrl } from "@/libs/assets";
import { useCustomerProfile } from "@/features/customer/profile/api";
import { useRealtimeOrders } from "@/features/orders/useRealtimeOrders";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CustomerOrderDetailPage() {
  const t = useTranslations("Translation");
  const params = useParams() as { id?: string };
  const id = params?.id;
  const numericId = id ? Number(id) : undefined;
  const { data: profile } = useCustomerProfile();
  useRealtimeOrders({
    orderId: numericId,
    customerId: profile?.id,
    includeGlobalChannel: false,
  });
  const { data: order, isLoading } = useCustomerOrder(id);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <CustomerTopbar />

      <section className="max-w-4xl mx-auto w-full space-y-4">
        <Link
          href={{ pathname: "/customer/orders" }}
          aria-label={t("backToOrders") as string}
        >
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("back")}</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {t("orders")} #{id}
        </h1>

        {isLoading && (
          <div className="text-sm text-neutral-500"> {t("loading")}</div>
        )}
        {!isLoading && !order && (
          <div className="text-sm text-neutral-500">{t("orderNotFound")}</div>
        )}

        {order && (
          <div className="rounded-2xl border bg-white p-4 md:p-6 space-y-4">
            <div className="text-sm text-neutral-700 flex items-center gap-2 flex-wrap">
              <span className={statusBadgeClass(order.status)}>
                {prettyStatus(order.status)}
              </span>
              <span className="text-neutral-500">
                {formatDate(order.createdAt || order.created_at)}
              </span>
              <span className="mx-1 text-neutral-300">•</span>
              <span>
                {t("total")}:{" "}
                <span className="font-semibold">
                  {formatCurrency(order.totalAmount || order.total || 0)}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(order.products || []).map((p: any) => (
                <div
                  key={p.id}
                  className="flex gap-3 items-center border rounded-xl p-3 bg-neutral-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      resolveAssetUrl(p.image?.url || p.imageUrl) ||
                      "https://via.placeholder.com/160x160.png?text=Product"
                    }
                    alt={p.name}
                    className="w-16 h-16 object-contain rounded bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate flex items-center gap-2">
                      <span className="truncate">{p.name}</span>
                      <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        x{p.quantity ?? 1}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500">
                      {formatCurrency(p.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border";
  switch ((status || "").toUpperCase()) {
    case "COMPLETED":
      return base + " bg-emerald-50 text-emerald-700 border-emerald-200";
    case "CANCELLED":
      return base + " bg-rose-50 text-rose-700 border-rose-200";
    case "PENDING":
    default:
      return base + " bg-amber-50 text-amber-700 border-amber-200";
  }
}

function prettyStatus(status?: string) {
  if (!status) return "-";
  return status.charAt(0) + status.slice(1).toLowerCase();
}
