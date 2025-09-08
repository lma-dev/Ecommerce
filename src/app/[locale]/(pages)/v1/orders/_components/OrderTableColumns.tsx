"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Order } from "@/features/orders/types";
import { Button } from "@/components/ui/button";
import { OrderActionsDropdown } from "@/v1/orders/_components/OrderActionsDropdown";

type DialogType = "delete" | null;

export const createOrderColumns = (
  showDialog: (type: DialogType, method: () => void) => void
): ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorFn: (row) => row.customer?.name ?? "",
    id: "customerName",
    header: () => "Customer",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: any }) => {
      const order = row.original as Order;
      return <OrderActionsDropdown order={order} showDialog={showDialog} />;
    },
  },
];
