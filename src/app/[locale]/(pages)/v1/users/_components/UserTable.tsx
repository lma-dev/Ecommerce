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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  const renderSkeleton = () => (
    <div className="rounded-md border overflow-hidden">
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between md:hidden">
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => setMobileFiltersOpen((v) => !v)}
          >
            {t("filterOptions")}
          </button>
          <Link href={`/${locale}/v1/users/create`} className="inline-flex items-center">
            <Button>{t("createUser")}</Button>
          </Link>
        </div>

        <div className={`${mobileFiltersOpen ? '' : 'hidden md:flex'} grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4 w-full min-w-0`}>
          <Input
            placeholder={t("searchByNameOrEmail")}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            onBlur={() => setCommittedSearch(searchFilter)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setCommittedSearch(searchFilter);
            }}
            className="w-full md:w-auto"
          />

          <Select
            value={roleFilter}
            onValueChange={(val) => setRoleFilter(val as RoleSelectValue)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
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
            <SelectTrigger className="w-full md:w-[180px]">
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
          className="hidden md:inline-flex items-center md:self-auto self-end"
        >
          <Button>{t("createUser")}</Button>
        </Link>
      </div>

      {/* No results state */}
      {!isLoading && filteredRows.length === 0 && (
        <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
          {t("noData")} — {t("resetAll")} / {t("clear")}
        </div>
      )}

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
            {isLoading && (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length}>{renderSkeleton()}</TableCell>
              </TableRow>
            )}
            {!isLoading && table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-accent/40 transition-colors">
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
