"use client";

import { User } from "@/features/users/types";
import { UserActionDropdown } from "@/v1/users/_components/UserActionsDropdown";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

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
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const cls =
        role === "SUPER_ADMIN"
          ? "bg-indigo-100 text-indigo-700 border-indigo-200"
          : role === "ADMIN"
          ? "bg-blue-100 text-blue-700 border-blue-200"
          : "bg-slate-100 text-slate-700 border-slate-200";
      const label =
        role === "SUPER_ADMIN"
          ? t("superAdmin")
          : role === "ADMIN"
          ? t("admin")
          : t("staff");
      return (
        <Badge className={cls} variant="secondary">
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "accountStatus",
    header: () => t("status"),
    cell: ({ row }) => {
      const status = row.getValue("accountStatus") as string;
      const isActive = status === "ACTIVE";
      return (
        <Badge
          className={
            isActive
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-rose-100 text-rose-700 border-rose-200"
          }
          variant="secondary"
        >
          {isActive ? t("active") : t("suspend")}
        </Badge>
      );
    },
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
