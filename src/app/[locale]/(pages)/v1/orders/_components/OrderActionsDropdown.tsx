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
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { useOrderActionHandlers } from "@/features/orders/hooks/useOrderActionHandlers";
import type { Order } from "@/features/orders/types";
import { useTranslations } from "next-intl";

type DialogType = "delete" | null;

interface OrderActionDropdownProps {
  order: Order;
  showDialog: (type: DialogType, method: () => void) => void;
}

export const OrderActionsDropdown: React.FC<OrderActionDropdownProps> = ({
  order,
  showDialog,
}) => {
  const { onEdit, onDelete } = useOrderActionHandlers(order);
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

