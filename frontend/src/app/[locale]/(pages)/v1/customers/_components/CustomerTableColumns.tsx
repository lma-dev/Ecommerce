"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import { Customer } from "@/features/customers/types";
import { CustomerActionsDropdown } from "@/v1/customers/_components/CustomerActionsDropdown";

type DialogType = "delete" | null;

export const createCustomerColumns = (
  showDialog: (type: DialogType, method: () => void) => void,
  t: any
): ColumnDef<Customer>[] => [
  { accessorKey: "name", header: () => t("name") },
  { accessorKey: "email", header: () => t("email") },
  {
    accessorKey: "accountStatus",
    header: () => t("status"),
    cell: ({ row }) => {
      const status = row.getValue("accountStatus") as string;
      const isActive = status === "ACTIVE";
      return (
        <Badge
          className={
            isActive
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-rose-100 text-rose-700 border-rose-200"
          }
          variant="secondary"
        >
          {isActive ? t("active") : t("suspend")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "phone",
    header: () => t("phone"),
    cell: ({ row }) => {
      const phone = (row.getValue("phone") as string) ?? "";
      const display = formatPhoneNumber(phone);
      const tel = phone.replace(/\s+/g, "");
      return (
        <a
          href={`tel:${tel}`}
          className="inline-flex items-center gap-1 text-blue-600 hover:underline whitespace-nowrap"
        >
          <Phone className="h-3.5 w-3.5" />
          <span>{display || "-"}</span>
        </a>
      );
    },
  },
  { accessorKey: "createdAt", header: () => t("created") },
  {
    id: "actions",
    header: () => t("actions"),
    cell: ({ row }: { row: any }) => {
      const customer = row.original as Customer;
      return (
        <CustomerActionsDropdown customer={customer} showDialog={showDialog} />
      );
    },
  },
];

function formatPhoneNumber(raw: string) {
  if (!raw) return "";
  // keep plus sign and digits only for grouping
  const plus = raw.trim().startsWith("+") ? "+" : "";
  const digits = raw.replace(/[^0-9]/g, "");
  // group into chunks of 3-4 for readability
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 3) {
    groups.push(digits.slice(i, i + 3));
  }
  return (plus + groups.join(" ")).trim();
}
