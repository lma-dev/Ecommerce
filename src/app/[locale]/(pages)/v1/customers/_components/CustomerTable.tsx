"use client";

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
import { PaginationFooter } from "@/app/[locale]/_components/ui/pagination-footer";
import { useCustomersQuery } from "@/features/customers/api";
import { createCustomerColumns } from "./CustomerTableColumns";
import {
  userAccountStatusOptions,
  UserAccountStatusType,
} from "@/features/users/constants/status";

type DialogType = "delete" | null;

interface CustomerTableProps {
  showDialog: (type: DialogType, method: () => void) => void;
  t: any;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ showDialog, t }) => {
  const [page, setPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  type StatusSelectValue = UserAccountStatusType | "clear";
  const [statusFilter, setStatusFilter] = useState<StatusSelectValue>("clear");

  const locale = useLocale();

  const { data, isLoading } = useCustomersQuery(page, {
    generalSearch: committedSearch || undefined,
  });

  const columns = createCustomerColumns(showDialog);

  const rows = useMemo(() => data?.data ?? [], [data?.data]);
  const filteredRows = useMemo(() => {
    if (statusFilter === "clear") return rows;
    return rows.filter((c: any) => c.accountStatus === statusFilter);
  }, [rows, statusFilter]);

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>{t("loadingCustomers", { default: "Loading customers..." })}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search by name or email"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            onBlur={() => setCommittedSearch(searchFilter)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setCommittedSearch(searchFilter);
            }}
          />

          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as StatusSelectValue)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("filterByStatus") ?? "Filter by status"} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="clear">{t("allStatuses") ?? "All statuses"}</SelectItem>
              {userAccountStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "ACTIVE" ? (t("active") ?? "Active") : (t("suspend") ?? "Suspended")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Link
          href={`/${locale}/v1/customers/create`}
          className="inline-flex items-center"
        >
          <Button>Create Customer</Button>
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

export default CustomerTable;
