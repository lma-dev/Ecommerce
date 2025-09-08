"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Order } from "@/features/orders/types";
import { Button } from "@/components/ui/button";
import { OrderActionsDropdown } from "@/v1/orders/_components/OrderActionsDropdown";

type DialogType = "delete" | null;

export const createOrderColumns = (
  showDialog: (type: DialogType, method: () => void) => void,
  t: any
): ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorFn: (row) => row.customer?.name ?? "",
    id: "customerName",
    header: () => t("customer"),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "status",
    header: () => t("status"),
  },
  {
    accessorKey: "totalAmount",
    header: () => t("total"),
  },
  {
    accessorKey: "createdAt",
    header: () => t("created"),
  },
  {
    id: "actions",
    header: () => t("actions"),
    cell: ({ row }: { row: any }) => {
      const order = row.original as Order;
      return <OrderActionsDropdown order={order} showDialog={showDialog} />;
    },
  },
];
