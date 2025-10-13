import { useDeleteReport, useUpdateReport } from "@/features/reports/api";
import { useRouter } from "next/navigation";
import type { Report } from "../types";
import { useLocale } from "next-intl";

export const useReportActionHandlers = (report: Report) => {
    const deleteReport = useDeleteReport();
    const updateStatus = useUpdateReport();
    const router = useRouter();
    const locale = useLocale();

    return {
        onEdit: () => router.push(`/${locale}/v1/reports/${report.id}/edit`),
        onDelete: () => deleteReport.mutate({ id: report.id }),
        onToggleStatus: () => updateStatus.mutate({ id: report.id }),
    };
};
