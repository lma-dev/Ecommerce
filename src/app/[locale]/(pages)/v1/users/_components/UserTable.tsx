import React, { useState } from "react";
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

type DialogType = "delete" | "export" | null;

interface UserTableProps {
  showDialog: (type: DialogType, method: () => void) => void;
  t: any; // Translation function
}

const UserTable: React.FC<UserTableProps> = ({ showDialog, t }) => {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  const [searchFilter, setSearchFilter] = useState("");

  const locale = useLocale();

  const { data, isLoading, refetch } = useUsersQuery(page, {
    role: roleFilter,
    generalSearch: searchFilter,
    accountStatus: statusFilter,
  });

  const userColumns = createUserColumns(showDialog);

  const table = useReactTable({
    data: data?.data ?? [],
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>{t("loadingUsers")}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search by name or email"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            onBlur={() => refetch()}
          />

          <Select
            value={roleFilter}
            onValueChange={(val) => {
              setRoleFilter(val || undefined);
              refetch();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="clear">All Roles</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val || undefined);
              refetch();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">{t("active")}</SelectItem>
              <SelectItem value="SUSPENDED">{t("suspend")}</SelectItem>
              <SelectItem value="clear">All Statuses</SelectItem>
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
