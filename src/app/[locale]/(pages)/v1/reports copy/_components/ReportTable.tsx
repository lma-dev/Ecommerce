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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReportsQuery, useUpdateReport } from "@/features/reports/api";
import { createReportColumns } from "./ReportTableColumns";
import { PaginationFooter } from "@/app/[locale]/_components/ui/pagination-footer";
import ReportFilterDropDown from "./ReportFilterDropDown";
import { useMutation } from "@tanstack/react-query";
import { ConfirmStatusType } from "@/constants/ConfirmStatus";

type DialogType = "delete" | null;

interface ReportTableProps {
  showDialog: (type: DialogType, method: () => void) => void;
  t: any;
}

const ReportTable: React.FC<ReportTableProps> = ({ showDialog, t }) => {
  const [page, setPage] = useState(1);
  const [generalSearch, setGeneralSearch] = useState<string | undefined>(
    undefined
  );
  const [amountFilter, setAmountFilter] = useState<number | undefined>(
    undefined
  );
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [type, setType] = useState<string | undefined>(undefined);
  const [createdAt, setCreatedAt] = useState<string | undefined>(undefined);
  const [tab, setTab] = useState<"PENDING" | "ACCEPTED" | "REJECTED">(
    "PENDING"
  );

  const locale = useLocale();
  const updateReport = useUpdateReport();

  const { data, isLoading, refetch } = useReportsQuery(page, {
    amount: amountFilter,
    confirmStatus: statusFilter,
    type,
    createdAt,
    generalSearch,
  });

  const changeConfirmStatusMutation = useMutation({
    mutationFn: ({
      id,
      confirmStatus,
    }: {
      id: number;
      confirmStatus: ConfirmStatusType;
    }) => updateReport.mutateAsync({ id, confirmStatus }),
  });

  const reportColumns = createReportColumns(
    locale,
    showDialog,
    t,
    changeConfirmStatusMutation
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns: reportColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>{t("loadingReports")}</div>;

  return (
    <div className="space-y-4">
      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(value as any);
          setStatusFilter(value);
          setPage(1);
          refetch();
        }}
      >
        <TabsList>
          <TabsTrigger value="PENDING">{t("uncheckedReports")}</TabsTrigger>
          <TabsTrigger value="ACCEPTED">{t("acceptedReports")}</TabsTrigger>
          <TabsTrigger value="REJECTED">{t("rejectedReports")}</TabsTrigger>
        </TabsList>
      </Tabs>
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
          <ReportFilterDropDown
            amount={Number(amountFilter) || 0}
            type={type ?? ""}
            createdAt={createdAt ?? ""}
            onAmountChange={(val) => {
              setAmountFilter(val ? val : undefined);
              setPage(1);
              refetch();
            }}
            onTypeChange={(val) => {
              setType(val || undefined);
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
          href={`/${locale}/v1/reports/create`}
          className="inline-flex items-center"
        >
          <Button>{t("createReport")}</Button>
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

export default ReportTable;
