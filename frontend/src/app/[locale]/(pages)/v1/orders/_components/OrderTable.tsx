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
import { useOrdersQuery } from "@/features/orders/api";
import { orderStatusOptions } from "@/features/orders/constants/status";
import { createOrderColumns } from "./OrderTableColumns";

type DialogType = "delete" | null;
type StatusSelectValue = (typeof orderStatusOptions)[number] | "clear";

interface OrderTableProps {
  showDialog: (type: DialogType, method: () => void) => void;
  t: any;
}

const OrderTable: React.FC<OrderTableProps> = ({ showDialog, t }) => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusSelectValue>("clear");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");

  const locale = useLocale();

  const { data, isLoading } = useOrdersQuery(page, {
    status: undefined, // backend filter optional
    customerName: committedSearch || undefined,
  });

  const columns = createOrderColumns(showDialog, t);

  const filteredRows = useMemo(() => {
    const rows = data?.data ?? [];
    if (statusFilter === "clear") return rows;
    return rows.filter((r: any) => r.status === statusFilter);
  }, [data?.data, statusFilter]);

  const table = useReactTable({
    data: filteredRows,
    columns,
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
        <div className="flex items-center justify-between md:hidden">
          <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setMobileFiltersOpen(v => !v)}>
            {t("filterOptions")}
          </button>
          <Link href={`/${locale}/v1/orders/create`} className="inline-flex items-center">
            <Button>{t("createOrder")}</Button>
          </Link>
        </div>
        <div className={`${mobileFiltersOpen ? '' : 'hidden md:flex'} grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4 w-full min-w-0`}>
          <Input
            placeholder={t("searchByCustomer")}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            onBlur={() => setCommittedSearch(searchFilter)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setCommittedSearch(searchFilter);
            }}
            className="w-full md:w-auto"
          />

          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as StatusSelectValue)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t("filterByStatus")} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="clear">{t("allStatuses")}</SelectItem>

              {orderStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Link href={`/${locale}/v1/orders/create`} className="hidden md:inline-flex items-center md:self-auto self-end">
          <Button>{t("createOrder")}</Button>
        </Link>
      </div>

      {!isLoading && filteredRows.length === 0 && (
        <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
          {t("noData")}
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

export default OrderTable;
