"use client";

import { ActiveBadge } from "@/app/[locale]/_components/ui/visibility-badge";
import { Product } from "@/features/products/types";
import { ProductActionsDropdown } from "@/v1/products/_components/ProductActionsDropdown";
import { ColumnDef } from "@tanstack/react-table";

type DialogType = "delete" | null;

export const createProductColumns = (
  showDialog: (type: DialogType, method: () => void) => void,
  t: any
): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: () => t("name"),
  },
  {
    accessorKey: "isActive",
    header: () => t("status"),
    cell: ({ row }) => (
      <ActiveBadge value={row.getValue("isActive") as string | null} />
    ),
  },
  {
    accessorKey: "price",
    header: () => t("price"),
  },
  {
    accessorFn: (row) => row.category?.name ?? "",
    id: "categoryName",
    header: () => t("category"),
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: () => t("actions"),
    cell: ({ row }: { row: any }) => {
      const product = row.original;
      return (
        <ProductActionsDropdown product={product} showDialog={showDialog} />
      );
    },
  },
];
