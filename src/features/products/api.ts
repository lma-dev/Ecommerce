import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productListSchema, productSchema } from './schemas/productSchema'
import type { Product } from './types'
import ToastAlert from '@/app/[locale]/_components/ui/toast-box'
import {
    createData,
    createFormData,
    deleteSingleData,
    editData,
    fetchAllData,
    fetchSingleData,
} from '@/libs/ApiMethodHelper'

// Response types
type ProductListResponse = {
    data: Product[]
    meta: {
        currentPage: number
        totalPages: number
        startOffset: number
        endOffset: number
        totalItems: number
    }
}

type ProductFilters = {
    name?: string | undefined
    isActive?: string | undefined
}

// ------------------------
// ✅ LIST Products (with pagination + filters)
// ------------------------
export const fetchProducts = async (
    page: number,
    filters: ProductFilters = {},
): Promise<ProductListResponse> => {
    const params = new URLSearchParams({ page: String(page) })

    if (filters.name) {
        params.set('name', filters.name)
    }
    if (filters.isActive) {
        params.set('isActive', filters.isActive)
    }

    const res = await fetchAllData(`/products?${params.toString()}`)
    const result = productListSchema.safeParse(res.data)

    if (!result.success) {
        console.error("Zod parsing error:", result.error.format())
        throw new Error("Invalid product list format")
    }

    return {
        data: result.data,
        meta: res.meta,
    }
}

export const useProductsQuery = (
    page: number,
    filters: ProductFilters = {},
) =>
    useQuery({
        queryKey: ['products', page, filters],
        queryFn: () => fetchProducts(page, filters),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 5,
    })

// ------------------------
// ✅ GET CATEGORY BY ID
// ------------------------
export const fetchProduct = async (id: number): Promise<Product> => {
    const res = await fetchSingleData(`/products/${id}`)
    const result = productSchema.safeParse(res.data)

    if (!result.success) {
        console.error("Zod parsing error:", result.error.format())
        throw new Error("Invalid product format")
    }

    return result.data
}

export const useProductQuery = (id: number) =>
    useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id),
        enabled: !!id,
    })

// ------------------------
// ✅ CREATE CATEGORY
// ------------------------
export const useCreateProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { image?: File | null }) => {
            // Build multipart form data to support image uploads
            const form = new FormData()
            form.append('name', String((data as any).name ?? ''))
            if ((data as any).description != null) form.append('description', String((data as any).description ?? ''))
            form.append('isActive', String((data as any).isActive))
            form.append('price', String((data as any).price))
            if ((data as any).categoryId != null) form.append('categoryId', String((data as any).categoryId))
            if ((data as any).image instanceof File) form.append('image', (data as any).image)

            const res = await createData('/products', form)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            ToastAlert.success({ message: 'Product deleted successfully' })
        },
        onError: () => {
            ToastAlert.error({ message: "Failed to create product" })
        },
    })
}

// ------------------------
// ✅ UPDATE CATEGORY
// ------------------------
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Product> & { id: number; image?: File | null }) => {
            const { id, ...payload } = data;

            // Build FormData
            const form = new FormData();
            Object.entries(payload).forEach(([key, value]) => {
                if (value === undefined || value === null) return;

                if (key === "image" && value instanceof File) {
                    form.append("image", value);
                } else {
                    // Convert everything else to string for safety
                    form.append(key, String(value));
                }
            });
            return await editData(`/products/${id}`, form);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
        },
        onError: () => {
            ToastAlert.error({ message: "Failed to update product" });
        },
    });
};

// ------------------------
// ✅ DELETE CATEGORY
// ------------------------
export const useDeleteProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            await deleteSingleData(`/products/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: () => {
            ToastAlert.error({ message: "Failed to delete product" })
        },
    })
}
