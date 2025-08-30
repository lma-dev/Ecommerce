"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyType } from "@/constants/CurrencyType";

interface RegularCostFilterDropDownType {
  amount?: number;
  createdAt?: string;
  onAmountChange: (amount: number) => void;
  onCreatedAtChange: (createdAt: string) => void;
  t: any;
}

export default function RegularCostFilterDropDown({
  amount,
  createdAt,
  onAmountChange,
  onCreatedAtChange,
  t,
}: RegularCostFilterDropDownType) {
  const [open, setOpen] = useState(false);

  const handleClear = () => {
    onAmountChange(0);
    onCreatedAtChange("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="ml-2" aria-label="Filter">
          <Filter size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("filterOptions")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white block mb-1">
              {t("amount")} ({CurrencyType.MMK})
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => onAmountChange(Number(e.target.value))}
              placeholder={t("amount")}
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white block mb-1">
              {t("createDate")}
            </label>
            <Input
              type="date"
              value={createdAt}
              onChange={(e) => onCreatedAtChange(e.target.value)}
            />
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={handleClear}
          >
            {t("resetAll")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
