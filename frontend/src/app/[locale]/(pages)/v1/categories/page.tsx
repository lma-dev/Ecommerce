"use client";

import { useTranslations } from "next-intl";
import CategoryTable from "@/v1/categories/_components/CategoryTable";
import { useState } from "react";
import { ConfirmDialog } from "@/app/[locale]/_components/ui/confirm-dialog";

type DialogType = "delete" | null;

interface DialogState {
  open: boolean;
  type: DialogType;
  method: (() => void) | null;
}

const CategoryPage = () => {
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    type: null,
    method: null,
  });

  const t = useTranslations("Translation");

  const showDialog = (type: DialogType, method: () => void) => {
    setDialog({
      open: true,
      type,
      method,
    });
  };

  const hideDialog = () => {
    setDialog({
      open: false,
      type: null,
      method: null,
    });
  };

  return (
    <div>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">{t("categoryList")}</h1>
        <CategoryTable showDialog={showDialog} t={t} />
      </div>
      {dialog.type && (
        <ConfirmDialog
          open={dialog.open}
          setOpen={(open) => !open && hideDialog()}
          type={dialog.type}
          method={dialog.method}
          t={t}
        />
      )}
    </div>
  );
};

export default CategoryPage;
