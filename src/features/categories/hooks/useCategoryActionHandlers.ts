import { CategoryStatus } from '@/features/categories/constants/status';
import { useRouter } from "next/navigation";
import type { Category } from "../types";
import { useLocale } from "next-intl";
import { useDeleteCategory, useUpdateCategory } from "../api";

export const useCategoryActionHandlers = (category: Category) => {
    const deleteCategory = useDeleteCategory();
    const updateCategory = useUpdateCategory();
    const router = useRouter();
    const locale = useLocale();

    return {
        onEdit: () => router.push(`/${locale}/v1/categories/${category.id}/edit`),
        onDelete: () => deleteCategory.mutate({ id: category.id }),
        onToggleStatus: () => updateCategory.mutate({ id: category.id }),
        isSuspended: category.isActive === CategoryStatus.INACTIVE
    };
};
