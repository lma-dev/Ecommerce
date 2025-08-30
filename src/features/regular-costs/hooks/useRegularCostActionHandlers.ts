import { useDeleteRegularCost, useUpdateRegularCost } from "@/features/regular-costs/api";
import { useRouter } from "next/navigation";
import type { RegularCost } from "@/features/regular-costs/types";
import { useLocale } from "next-intl";

export const useRegularCostActionHandlers = (regularCost: RegularCost) => {
    const deleteRegularCost = useDeleteRegularCost();
    const updateStatus = useUpdateRegularCost();
    const router = useRouter();
    const locale = useLocale();

    return {
        onEdit: () => router.push(`/${locale}/v1/regular-costs/${regularCost.id}/edit`),
        onDelete: () => deleteRegularCost.mutate({ id: regularCost.id }),
        onToggleStatus: () => updateStatus.mutate({ id: regularCost.id }),
    };
};
