"use client";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";

import RegularCostForm from "@/v1/regular-costs/_components/RegularCostForm";
import { useTranslations } from "next-intl";

export default function CreateRegularCostPage() {
  const t = useTranslations("Translation");

  return (
    <div>
      <BreadCrumb title={t("createRegularCost")} />
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">
          {t("createRegularCost")}
        </h1>
        <RegularCostForm mode="create" t={t} />
      </div>
    </div>
  );
}
