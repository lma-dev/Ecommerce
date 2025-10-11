import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productListSchema, productSchema } from './schemas/productSchema'
import type { CreateProductPayload, Product, UpdateProductPayload } from './types'
import ToastAlert from '@/app/[locale]/_components/ui/toast-box'
import {
    createData,
    deleteSingleData,
    editData,
    fetchAllData,
    fetchSingleData,
} from '@/libs/ApiMethodHelper'

const stripUndefined = <T extends Record<string, unknown>>(input: T): T => {
    const entries = Object.entries(input).filter(([, value]) => value !== undefined)
    return Object.fromEntries(entries) as T
}

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
        staleTime: 60_000,
        refetchInterval: 60_000,
        refetchIntervalInBackground: true,
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
        staleTime: 60_000,
        refetchInterval: 60_000,
        refetchIntervalInBackground: true,
    })

// ------------------------
// ✅ CREATE CATEGORY
// ------------------------
export const useCreateProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateProductPayload) => {
            const body = stripUndefined({
                name: data.name,
                description: data.description ?? null,
                isActive: data.isActive,
                price: data.price,
                categoryId: data.categoryId,
                image: data.image ?? null,
            })

            const res = await createData('/products', body)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
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
        mutationFn: async (data: UpdateProductPayload) => {
            const { id, ...payload } = data;

            const body = stripUndefined({
                name: payload.name,
                description: payload.description ?? null,
                isActive: payload.isActive,
                price: payload.price,
                categoryId: payload.categoryId,
                image: payload.image,
            })

            return await editData(`/products/${id}`, body);
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
