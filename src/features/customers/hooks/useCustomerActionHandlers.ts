import { useRouter } from "next/navigation";
import type { Customer } from "../types";
import { useLocale } from "next-intl";
import { useDeleteCustomer, useUpdateCustomer } from "../api";

export const useCustomerActionHandlers = (customer: Customer) => {
  const deleteCustomer = useDeleteCustomer();
  const updateCustomer = useUpdateCustomer();
  const router = useRouter();
  const locale = useLocale();

  return {
    onEdit: () => router.push(`/${locale}/v1/customers/${customer.id}/edit`),
    onDelete: () => deleteCustomer.mutate({ id: customer.id }),
    onUpdate: (payload: Partial<Customer>) => updateCustomer.mutate({ id: customer.id, ...payload }),
  };
};

