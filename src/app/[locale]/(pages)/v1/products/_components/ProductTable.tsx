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
import { useProductsQuery } from "@/features/products/api";
import { PaginationFooter } from "@/app/[locale]/_components/ui/pagination-footer";
import {
  productStatusOptions,
  ProductStatusType,
} from "@/features/products/constants/status";
import { createProductColumns } from "./ProductTableColumns";

type DialogType = "delete" | null;
// include 'clear' explicitly; keep it as the Select's value type
type StatusSelectValue = ProductStatusType | "clear";

interface ProductTableProps {
  showDialog: (type: DialogType, method: () => void) => void;
  t: any;
}

const ProductTable: React.FC<ProductTableProps> = ({ showDialog, t }) => {
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // 👇 status is local-only; no refetch
  const [statusFilter, setStatusFilter] = useState<StatusSelectValue>("clear");

  // search has a "draft" input and a "committed" value (used by the query)
  const [searchFilter, setSearchFilter] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");

  const locale = useLocale();

  const { data, isLoading } = useProductsQuery(page, {
    name: committedSearch || undefined,
    isActive: undefined, // keep unfiltered on backend
  });

  const productColumns = createProductColumns(showDialog, t);

  const filteredRows = useMemo(() => {
    const rows = data?.data ?? [];
    if (statusFilter === "clear") return rows;
    return rows.filter((r: any) => r.isActive === statusFilter);
  }, [data?.data, statusFilter]);

  const table = useReactTable({
    data: filteredRows,
    columns: productColumns,
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
          <Link href={`/${locale}/v1/products/create`} className="inline-flex items-center">
            <Button>{t("createProduct")}</Button>
          </Link>
        </div>
        <div className={`${mobileFiltersOpen ? '' : 'hidden md:flex'} grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4 w-full min-w-0`}>
          <Input
            placeholder={t("searchByName")}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            onBlur={() => setCommittedSearch(searchFilter)} // refetch only when committed
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

              {productStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "ACTIVE" ? t("active") : t("inactive")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Link href={`/${locale}/v1/products/create`} className="hidden md:inline-flex items-center md:self-auto self-end">
          <Button>{t("createProduct")}</Button>
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

export default ProductTable;
