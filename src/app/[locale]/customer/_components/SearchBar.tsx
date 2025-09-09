"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Props = {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
};

export default function SearchBar({ value, onChange, disabled }: Props) {
  const t = useTranslations("Translation");
  return (
    <div className="flex gap-3">
      <Input
        placeholder={disabled ? t("selectCategoryFirst") : t("searchProducts")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
        disabled={disabled}
      />
      <Button variant="secondary" onClick={() => onChange("")} disabled={!value}>
        {t("clear")}
      </Button>
    </div>
  );
}

