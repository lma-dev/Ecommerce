"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import CustomerForm from "../../_components/CustomerForm";
import { useCustomerQuery } from "@/features/customers/api";

export default function CustomerEditPage() {
  const { id } = useParams();
  const { data: customer, isLoading } = useCustomerQuery(Number(id));
  const t = useTranslations("Translation");

  if (isLoading) return <div>{t("loadingCustomers")}</div>;
  if (!customer) return <div>{t("customerNotFound", { default: "Customer not found" })}</div>;

  return (
    <div>
      <BreadCrumb title="Edit Customer" />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Edit Customer</h1>
        <CustomerForm mode="edit" defaultValues={customer} />
      </div>
    </div>
  );
}
