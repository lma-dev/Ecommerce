"use client";

import { User } from "@/features/users/types";
import { UserActionDropdown } from "@/v1/users/_components/UserActionsDropdown";
import { ColumnDef } from "@tanstack/react-table";

type DialogType = "delete" | "export" | null;

export const createUserColumns = (
  showDialog: (type: DialogType, method: () => void) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "accountStatus",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: any }) => {
      const user = row.original;
      return <UserActionDropdown user={user} showDialog={showDialog} />;
    },
  },
];
