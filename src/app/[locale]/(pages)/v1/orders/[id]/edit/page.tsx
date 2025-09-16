"use client";

import { useParams } from "next/navigation";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import { useTranslations } from "next-intl";
import OrderForm from "../../_components/OrderForm";
import { useOrderQuery } from "@/features/orders/api";
import { RealtimeOrdersListener } from "@/features/orders/useRealtimeOrders";

export default function OrderEditPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrderQuery(Number(id));
  const t = useTranslations("Translation");

  if (isLoading) return <div>{t("loadingOrders", { default: "Loading orders..." })}</div>;
  if (!order) return <div>{t("orderNotFound", { default: "Order not found" })}</div>;

  return (
    <div>
      <BreadCrumb title={t("editOrder")} />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">{t("editOrder")}</h1>
        <OrderForm mode="edit" defaultValues={order} />
        <RealtimeOrdersListener orderId={Number(id)} />
      </div>
    </div>
  );
}
