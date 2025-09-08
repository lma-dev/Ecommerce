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
  const [searchFilter, setSearchFilter] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");

  const locale = useLocale();

  const { data, isLoading } = useOrdersQuery(page, {
    status: undefined, // backend filter optional
    customerName: committedSearch || undefined,
  });

  const columns = createOrderColumns(showDialog);

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

  if (isLoading) return <div>{t("loadingOrders", { default: "Loading orders..." })}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search by customer"
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
              <SelectValue placeholder={t("filterByStatus", { default: "Filter by status" })} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="clear">All statuses</SelectItem>

              {orderStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Link
          href={`/${locale}/v1/orders/create`}
          className="inline-flex items-center"
        >
          <Button>Create Order</Button>
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

export default OrderTable;

