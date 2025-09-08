"use client";

import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import { useTranslations } from "next-intl";
import OrderForm from "../_components/OrderForm";

export default function OrderCreatePage() {
  const t = useTranslations("Translation");
  return (
    <div>
      <BreadCrumb title={t("createOrder")} />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">{t("createOrder")}</h1>
        <OrderForm mode="create" />
      </div>
    </div>
  );
}
