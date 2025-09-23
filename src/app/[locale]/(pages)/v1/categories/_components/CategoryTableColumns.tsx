"use client";

import { ActiveBadge } from "@/app/[locale]/_components/ui/visibility-badge";
import { Category } from "@/features/categories/types";
import { CategoryActionDropdown } from "@/v1/categories/_components/CategoryActionsDropdown";
import { ColumnDef } from "@tanstack/react-table";

type DialogType = "delete" | null;

export const createCategoryColumns = (
  showDialog: (type: DialogType, method: () => void) => void,
  t: any
): ColumnDef<Category>[] => [
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
    accessorKey: "description",
    header: () => t("description"),
  },
  {
    id: "actions",
    header: () => t("actions"),
    cell: ({ row }: { row: any }) => {
      const category = row.original;
      return (
        <CategoryActionDropdown category={category} showDialog={showDialog} />
      );
    },
  },
];
