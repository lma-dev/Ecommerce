"use client";

import { useParams } from "next/navigation";
import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import ReportForm from "@/v1/reports/_components/ReportForm";
import { useReportQuery } from "@/features/reports/api";
import { useTranslations } from "next-intl";

export default function ReportEditPage() {
  const { id } = useParams();
  const { data: report, isLoading } = useReportQuery(Number(id));
  const t = useTranslations("Translation");

  if (isLoading) return <div>{t("loadingReports")}</div>;
  if (!report) return <div>{t("reportNotFound")}</div>;

  return (
    <div>
      <BreadCrumb title={t("editReport")} />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">{t("editReport")}</h1>
        <ReportForm mode="edit" defaultValues={report} t={t} />
      </div>
    </div>
  );
}
