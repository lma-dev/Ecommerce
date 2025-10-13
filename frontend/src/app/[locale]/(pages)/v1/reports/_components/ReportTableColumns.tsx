import { ConfirmStatus, ConfirmStatusType } from "@/constants/ConfirmStatus";
import { Report } from "@/features/reports/types";
import { ReportActionDropdown } from "@/v1/reports/_components/ReportActionsDropdown";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Example with shadcn/ui

type DialogType = "delete" | null;

export const createReportColumns = (
  locale: string,
  showDialog: (type: DialogType, method: () => void) => void,
  t: any,
  changeConfirmStatusMutation: any
): ColumnDef<Report>[] => [
  {
    accessorKey: "id",
    header: () => t("id"),
    cell: ({ row }) => {
      const report = row.original;
      return (
        <Link
          href={`/${locale}/v1/reports/${report.id}`}
          className="text-blue-600 hover:underline"
        >
          {report.id}
        </Link>
      );
    },
  },
  {
    accessorFn: (row) => row.reporter?.name ?? "",
    id: "reporterName",
    header: () => t("requester"),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "amount",
    header: () => t("amount"),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "type",
    header: () => t("type"),
    cell: (info) => {
      const value = info.getValue();
      return (
        <span
          className={`mr-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            value === "INCOME"
              ? "bg-green-100 text-green-800"
              : value === "EXPENSE"
                ? "bg-red-100 text-red-800"
                : ""
          }`}
        >
          {String(value ?? "unknown")}
        </span>
      );
    },
  },
  {
    accessorKey: "confirmStatus",
    header: () => t("status"),
    cell: ({ row, getValue }) => {
      const id = row.original.id;
      const currentStatus = getValue() as ConfirmStatusType;

      return (
        <Select
          value={currentStatus}
          onValueChange={(newStatus: ConfirmStatusType) => {
            changeConfirmStatusMutation.mutate({
              id,
              confirmStatus: newStatus,
            });
          }}
        >
          <SelectTrigger className="w-[120px]" />
          <SelectContent>
            <SelectItem value={ConfirmStatus.ACCEPTED}>Accepted</SelectItem>
            <SelectItem value={ConfirmStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={ConfirmStatus.REJECTED}>Rejected</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorFn: (row) => row.verifier?.name ?? "",
    id: "verifierName",
    header: () => t("verifier"),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "createdAt",
    header: () => t("requestDate"),
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: () => t("actions"),
    cell: ({ row }) => {
      const report = row.original;
      return <ReportActionDropdown report={report} showDialog={showDialog} />;
    },
  },
];
