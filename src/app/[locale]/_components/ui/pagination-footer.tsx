// components/ui/pagination-footer.tsx
import React from "react";
import { Button } from "@/components/ui/button";

type PaginationFooterProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  t: any; // Translation function
};

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
  page,
  totalPages,
  onPageChange,
  t,
}) => {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        {t("previous")}
      </Button>

      <div className="text-sm text-muted-foreground">
        {t("page")} {page} {t("of")} {totalPages}
      </div>

      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {t("next")}
      </Button>
    </div>
  );
};
