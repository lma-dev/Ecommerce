"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MapPinned,
  Download,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import type { Report } from "@/features/reports/types";
import { useTranslations, useLocale } from "next-intl";
import { useReportActionHandlers } from "@/features/reports/hooks/useReportActionHandlers";

type DialogType = "delete" | null;

interface ReportActionDropdownProps {
  report: Report;
  showDialog: (type: DialogType, method: () => void) => void;
}

export const ReportActionDropdown: React.FC<ReportActionDropdownProps> = ({
  report,
  showDialog,
}) => {
  const locale = useLocale();
  const { onEdit, onDelete } = useReportActionHandlers(report);
  const t = useTranslations("Translation");

  const handleDeleteClick = () => {
    showDialog("delete", onDelete);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>{t("setting")}</DropdownMenuLabel>
        {/* {(role === "ADMIN" || role === "SUPER_ADMIN") && ( */}
        <>
          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            {t("edit")}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t("dangerZone")}</DropdownMenuLabel>

          <DropdownMenuItem
            onSelect={handleDeleteClick}
            className="text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("delete")}
          </DropdownMenuItem>
        </>
        {/* )} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
