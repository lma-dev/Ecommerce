"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/features/customers/types";
import { CustomerActionsDropdown } from "@/v1/customers/_components/CustomerActionsDropdown";

type DialogType = "delete" | null;

export const createCustomerColumns = (
  showDialog: (type: DialogType, method: () => void) => void
): ColumnDef<Customer>[] => [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "accountStatus",
    header: "Status",
  },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "createdAt", header: "Created" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: any }) => {
      const customer = row.original as Customer;
      return (
        <CustomerActionsDropdown customer={customer} showDialog={showDialog} />
      );
    },
  },
];
