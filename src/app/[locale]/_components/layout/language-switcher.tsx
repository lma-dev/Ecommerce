"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

const locales = [
  { code: "en", label: "English" },
  { code: "mm", label: "မြန်မာ" },
  { code: "jp", label: "日本語" },
];

import { Globe } from "lucide-react";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectLocale = (selectedLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = selectedLocale; // update locale segment
    router.push(segments.join("/"));
  };

  const current = locales.find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "sm"}
          className={compact ? undefined : "capitalize"}
          aria-label="Change language"
        >
          {compact ? <Globe className="h-4 w-4" /> : current?.label ?? locale}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => onSelectLocale(l.code)}
            className="capitalize"
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
