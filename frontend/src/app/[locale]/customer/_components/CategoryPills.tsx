"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  categories: Array<{ id: number; name: string }>;
  value?: number;
  onChange: (id: number) => void;
};

export default function CategoryPills({ categories, value, onChange }: Props) {
  return (
    <div className="flex justify-center">
      <Tabs
        value={value ? String(value) : undefined}
        onValueChange={(val) => onChange(Number(val))}
        className="w-full"
      >
        <div className="relative">
          {/* Scrollable row for many categories on mobile/desktop */}
          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsList className="bg-transparent mx-auto min-w-max flex gap-2">
              {categories.map((c) => (
                <TabsTrigger
                  key={c.id}
                  value={String(c.id)}
                  className="px-4 py-2 rounded-full border border-neutral-200 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:border-emerald-600 text-neutral-700 hover:text-emerald-700 whitespace-nowrap"
                >
                  {c.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
