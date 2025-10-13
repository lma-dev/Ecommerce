"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import OrderTable from "@/v1/orders/_components/OrderTable";
import { ConfirmDialog } from "@/app/[locale]/_components/ui/confirm-dialog";
import { RealtimeOrdersListener } from "@/features/orders/useRealtimeOrders";
import React from "react";

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
        <h1 className="text-2xl font-semibold">{t("orderList")}</h1>
        <OrderTable showDialog={showDialog} t={t} />
        <RealtimeOrdersListener />
        <RealtimeStatusNote />
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

function RealtimeStatusNote() {
  return (
    <div className="text-[12px] text-muted-foreground">
      Realtime: Listens on channel <code>orders</code>. Configure via
      <code> NEXT_PUBLIC_PUSHER_ORDERS_CHANNEL</code> and optional
      <code> NEXT_PUBLIC_PUSHER_EXTRA_CHANNEL/NEXT_PUBLIC_PUSHER_EXTRA_EVENT</code> for testing.
    </div>
  );
}
