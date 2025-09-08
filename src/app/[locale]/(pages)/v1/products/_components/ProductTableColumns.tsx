"use client";

import { ActiveBadge } from "@/app/[locale]/_components/ui/visibility-badge";
import { Product } from "@/features/products/types";
import { ProductActionsDropdown } from "@/v1/products/_components/ProductActionsDropdown";
import { ColumnDef } from "@tanstack/react-table";

type DialogType = "delete" | null;

export const createProductColumns = (
  showDialog: (type: DialogType, method: () => void) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <ActiveBadge value={row.getValue("isActive") as string | null} />
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorFn: (row) => row.category?.name ?? "",
    id: "categoryName",
    header: () => "Category",
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: any }) => {
      const product = row.original;
      return (
        <ProductActionsDropdown product={product} showDialog={showDialog} />
      );
    },
  },
];
