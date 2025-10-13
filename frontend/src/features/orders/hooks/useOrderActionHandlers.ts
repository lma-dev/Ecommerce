import { useRouter } from "next/navigation";
import type { Order } from "../types";
import { useLocale } from "next-intl";
import { useDeleteOrder, useUpdateOrder } from "../api";

export const useOrderActionHandlers = (order: Order) => {
  const deleteOrder = useDeleteOrder();
  const updateOrder = useUpdateOrder();
  const router = useRouter();
  const locale = useLocale();

  return {
    onEdit: () => router.push(`/${locale}/v1/orders/${order.id}/edit`),
    onDelete: () => deleteOrder.mutate({ id: order.id }),
    // Placeholder for future updates (e.g., status change)
    onUpdate: (payload: Partial<Order>) => updateOrder.mutate({ id: order.id, ...payload }),
  };
};

