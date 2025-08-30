import { RegularCost } from "@/features/regular-costs/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { RegularCostActionDropdown } from "@/app/[locale]/(pages)/v1/regular-costs/_components/RegularCostActionsDropdown";

type DialogType = "delete" | null;

export const createRegularCostColumns = (
  locale: string,
  showDialog: (type: DialogType, method: () => void) => void,
  t: any
): ColumnDef<RegularCost>[] => [
  {
    accessorKey: "id",
    header: () => t("id"),
    cell: ({ row }) => {
      const regularCost = row.original;
      return (
        <Link
          href={`/${locale}/v1/regular-costs/${regularCost.id}`}
          className="text-blue-600 hover:underline"
        >
          {regularCost.id}
        </Link>
      );
    },
  },
  {
    accessorFn: (row) => row.reporter?.name ?? "",
    id: "reporterName",
    header: () => t("requester"),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "amount",
    header: () => t("amount"),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "description",
    header: () => t("description"),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "createdAt",
    header: () => t("requestDate"),
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const regularCost = row.original;
      return (
        <RegularCostActionDropdown
          regularCost={regularCost}
          showDialog={showDialog}
        />
      );
    },
  },
];
