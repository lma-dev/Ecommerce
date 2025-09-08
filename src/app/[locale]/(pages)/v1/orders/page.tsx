"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import OrderTable from "@/v1/orders/_components/OrderTable";
import { ConfirmDialog } from "@/app/[locale]/_components/ui/confirm-dialog";

type DialogType = "delete" | null;

interface DialogState {
  open: boolean;
  type: DialogType;
  method: (() => void) | null;
}

const OrdersPage = () => {
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    type: null,
    method: null,
  });

  const t = useTranslations("Translation");

  const showDialog = (type: DialogType, method: () => void) => {
    setDialog({ open: true, type, method });
  };

  const hideDialog = () => setDialog({ open: false, type: null, method: null });

  return (
    <div>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Order Lists</h1>
        <OrderTable showDialog={showDialog} t={t} />
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

export default OrdersPage;

