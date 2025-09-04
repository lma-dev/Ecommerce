"use client";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";

import ReportForm from "../_components/ReportForm";
import { useTranslations } from "next-intl";

export default function CreateReportPage() {
  const t = useTranslations("Translation");

  return (
    <div>
      <BreadCrumb title={t("createReport")} />
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">{t("createReport")}</h1>
        <ReportForm mode="create" t={t} />
      </div>
    </div>
  );
}
