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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRegularCostsQuery } from "@/features/regular-costs/api";
import { createRegularCostColumns } from "./RegularCostTableColumns";
import { PaginationFooter } from "@/app/[locale]/_components/ui/pagination-footer";
import RegularCostFilterDropDown from "./RegularCostFilterDropDown";

type DialogType = "delete" | null;

interface RegularCostTableProps {
  showDialog: (type: DialogType, method: () => void) => void;
  t: any;
}

const RegularCostTable: React.FC<RegularCostTableProps> = ({
  showDialog,
  t,
}) => {
  const [page, setPage] = useState(1);
  const [generalSearch, setGeneralSearch] = useState<string | undefined>(
    undefined
  );
  const [amountFilter, setAmountFilter] = useState<number | undefined>(
    undefined
  );

  const [createdAt, setCreatedAt] = useState<string | undefined>(undefined);

  const locale = useLocale();

  const { data, isLoading, refetch } = useRegularCostsQuery(page, {
    amount: amountFilter,
    createdAt,
    generalSearch,
  });

  const regularCostColumns = createRegularCostColumns(locale, showDialog, t);

  const table = useReactTable({
    data: data?.data ?? [],
    columns: regularCostColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>{t("loadingRegularCosts")}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input
            placeholder={t("generalSearch")}
            value={generalSearch}
            onChange={(e) => {
              setGeneralSearch(e.target.value);
              setPage(1);
              refetch();
            }}
          />
          <RegularCostFilterDropDown
            amount={Number(amountFilter) || 0}
            createdAt={createdAt ?? ""}
            onAmountChange={(val) => {
              setAmountFilter(val ? val : undefined);
              setPage(1);
              refetch();
            }}
            onCreatedAtChange={(val) => {
              setCreatedAt(val || undefined);
              setPage(1);
              refetch();
            }}
            t={t}
          />
        </div>
        <Link
          href={`/${locale}/v1/regular-costs/create`}
          className="inline-flex items-center"
        >
          <Button>{t("createRegularCost")}</Button>
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

export default RegularCostTable;
