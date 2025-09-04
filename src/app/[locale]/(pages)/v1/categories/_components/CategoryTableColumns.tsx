"use client";

import { Category } from "@/features/categories/types";
import { CategoryActionDropdown } from "@/v1/categories/_components/CategoryActionsDropdown";
import { ColumnDef } from "@tanstack/react-table";

type DialogType = "delete" | null;

export const createCategoryColumns = (
  showDialog: (type: DialogType, method: () => void) => void
): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isActive",
    header: "is Active",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: any }) => {
      const category = row.original;
      return (
        <CategoryActionDropdown category={category} showDialog={showDialog} />
      );
    },
  },
];
