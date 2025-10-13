import { useRouter } from "next/navigation";
import type { Product } from "../types";
import { useLocale } from "next-intl";
import { useDeleteProduct, useUpdateProduct } from "../api";
import { ProductStatus } from "../constants/status";

export const useProductActionHandlers = (product: Product) => {
    const deleteProduct = useDeleteProduct();
    const updateProduct = useUpdateProduct();
    const router = useRouter();
    const locale = useLocale();

    return {
        onEdit: () => router.push(`/${locale}/v1/products/${product.id}/edit`),
        onDelete: () => deleteProduct.mutate({ id: product.id }),
        onToggleStatus: () => updateProduct.mutate({ id: product.id }),
        isSuspended: product.isActive === ProductStatus.INACTIVE
    };
};
