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

  if (isLoading) return <div>Loading...</div>;
  if (!report) return <div>Report not found</div>;

  return (
    <div>
      <BreadCrumb title={t("reportDetail")} />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">{t("reportDetail")}</h1>
        <ReportForm mode="show" defaultValues={report} t={t} />
      </div>
    </div>
  );
}
