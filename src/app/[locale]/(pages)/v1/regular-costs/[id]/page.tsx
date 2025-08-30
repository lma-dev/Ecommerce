"use client";

import { useParams } from "next/navigation";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import { useRegularCostQuery } from "@/features/regular-costs/api";
import { useTranslations } from "next-intl";
import RegularCostForm from "@/app/[locale]/(pages)/v1/regular-costs/_components/RegularCostForm";

export default function RegularCostEditPage() {
  const { id } = useParams();
  const { data: regularCost, isLoading } = useRegularCostQuery(Number(id));
  const t = useTranslations("Translation");

  if (isLoading) return <div>Loading...</div>;
  if (!regularCost) return <div>RegularCost not found</div>;

  return (
    <div>
      <BreadCrumb title={t("regularCostDetail")} />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">{t("regularCostDetail")}</h1>
        <RegularCostForm mode="show" defaultValues={regularCost} t={t} />
      </div>
    </div>
  );
}
