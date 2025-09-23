"use client";

import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import CustomerForm from "../_components/CustomerForm";
import { useTranslations } from "next-intl";

export default function CustomerCreatePage() {
  const t = useTranslations("Translation");
  return (
    <div>
      <BreadCrumb title={t("createCustomer")} />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">{t("createCustomer")}</h1>
        <CustomerForm mode="create" />
      </div>
    </div>
  );
}
