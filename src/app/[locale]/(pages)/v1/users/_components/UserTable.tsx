import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsersQuery } from "@/features/users/api";
import { createUserColumns } from "./UserTableColumns";
import { PaginationFooter } from "@/app/[locale]/_components/ui/pagination-footer";
import {
  userRoleLabel,
  userRoleOptions,
  UserRoleType,
} from "@/features/users/constants/role";
import {
  userAccountStatusOptions,
  UserAccountStatusType,
} from "@/features/users/constants/status";

type DialogType = "delete" | "export" | null;
type RoleSelectValue = UserRoleType | "clear";
type StatusSelectValue = UserAccountStatusType | "clear";

interface UserTableProps {
  showDialog: (type: DialogType, method: () => void) => void;
  t: any; // Translation function
}

const UserTable: React.FC<UserTableProps> = ({ showDialog, t }) => {
  const [page, setPage] = useState(1);

  // local-only filters (no refetch)
  const [roleFilter, setRoleFilter] = useState<RoleSelectValue>("clear");
  const [statusFilter, setStatusFilter] = useState<StatusSelectValue>("clear");

  // search: draft vs committed
  const [searchFilter, setSearchFilter] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");

  const locale = useLocale();

  // backend query: only page + committed search drive it
  const { data, isLoading } = useUsersQuery(page, {
    role: undefined, // keep unfiltered on backend
    generalSearch: committedSearch || undefined,
    accountStatus: undefined, // keep unfiltered on backend
  });

  const userColumns = createUserColumns(showDialog, t);

  // client-side role + status filtering
  const filteredRows = useMemo(() => {
    const rows = data?.data ?? [];
    return rows.filter((u: any) => {
      const roleOk = roleFilter === "clear" || u.role === roleFilter;
      const statusOk =
        statusFilter === "clear" || u.accountStatus === statusFilter;
      return roleOk && statusOk;
    });
  }, [data?.data, roleFilter, statusFilter]);

  const table = useReactTable({
    data: filteredRows,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>{t("loadingUsers")}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Input
            placeholder={t("searchByNameOrEmail")}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            onBlur={() => setCommittedSearch(searchFilter)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setCommittedSearch(searchFilter);
            }}
          />

          <Select
            value={roleFilter}
            onValueChange={(val) => setRoleFilter(val as RoleSelectValue)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("filterByRole")} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="clear">{t("allRoles")}</SelectItem>
              {userRoleOptions.map((role) => (
                <SelectItem key={role} value={role}>
                  {userRoleLabel[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as StatusSelectValue)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("filterByStatus")} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="clear">{t("allStatuses")}</SelectItem>
              {userAccountStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "ACTIVE" ? t("active") : t("suspend")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Link
          href={`/${locale}/v1/users/create`}
          className="inline-flex items-center"
        >
          <Button>{t("createUser")}</Button>
        </Link>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationFooter
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
        t={t}
      />
    </div>
  );
};

export default UserTable;
