"use client";

import { User } from "@/features/users/types";
import { UserActionDropdown } from "@/v1/users/_components/UserActionsDropdown";
import { ColumnDef } from "@tanstack/react-table";

type DialogType = "delete" | "export" | null;

export const createUserColumns = (
  showDialog: (type: DialogType, method: () => void) => void,
  t: any
): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: () => t("name"),
  },
  {
    accessorKey: "email",
    header: () => t("email"),
  },
  {
    accessorKey: "role",
    header: () => t("role"),
  },
  {
    accessorKey: "accountStatus",
    header: () => t("status"),
  },
  {
    accessorKey: "createdAt",
    header: () => t("createdAt"),
  },
  {
    id: "actions",
    header: () => t("actions"),
    cell: ({ row }: { row: any }) => {
      const user = row.original;
      return <UserActionDropdown user={user} showDialog={showDialog} />;
    },
  },
];
