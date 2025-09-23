"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/features/orders/types";
import { OrderActionsDropdown } from "@/v1/orders/_components/OrderActionsDropdown";
import { Badge } from "@/components/ui/badge";
import type { OrderStatusType } from "@/features/orders/constants/status";

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
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatusType;
      let cls = "bg-slate-100 text-slate-700 border-slate-200";
      let label = status;
      if (status === "PENDING") {
        cls = "bg-amber-100 text-amber-700 border-amber-200";
        label = t("pending", { default: "Pending" });
      } else if (status === "COMPLETED") {
        cls = "bg-emerald-100 text-emerald-700 border-emerald-200";
        label = t("completed", { default: "Completed" });
      } else if (status === "CANCELLED") {
        cls = "bg-rose-100 text-rose-700 border-rose-200";
        label = t("cancelled", { default: "Cancelled" });
      }
      return (
        <Badge className={cls} variant="secondary">
          {label}
        </Badge>
      );
    },
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
