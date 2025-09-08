"use client";

import { ColumnDef } from "@tanstack/react-table";
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
  },
  { accessorKey: "phone", header: () => t("phone") },
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
