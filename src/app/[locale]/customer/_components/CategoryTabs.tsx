"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

type Props = {
  categories: Array<{ id: number; name: string }>;
  value?: number;
  onChange: (id: number) => void;
};

export default function CategoryTabs({ categories, value, onChange }: Props) {
  const t = useTranslations("Translation");
  return (
    <div className="space-y-2">
      <div className="min-w-0">
        <div className="text-base font-semibold truncate">
          {value ? categories.find((c) => c.id === value)?.name : t("selectCategory")}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {t("browseMenu")}
        </div>
      </div>
      <Tabs
        value={value ? String(value) : undefined}
        onValueChange={(val) => onChange(Number(val))}
        className="w-full"
      >
        <div className="overflow-x-auto">
          <TabsList className="min-w-max">
            {categories.map((c) => (
              <TabsTrigger key={c.id} value={String(c.id)} className="px-3 py-2">
                {c.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}

