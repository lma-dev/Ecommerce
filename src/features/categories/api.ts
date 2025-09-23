import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryListSchema, categorySchema } from './schemas/categorySchema'
import type { Category } from './types'
import ToastAlert from '@/app/[locale]/_components/ui/toast-box'
import {
    createData,
    deleteSingleData,
    editData,
    fetchAllData,
    fetchSingleData,
} from '@/libs/ApiMethodHelper'

// Response types
type CategoryListResponse = {
    data: Category[]
    meta: {
        currentPage: number
        totalPages: number
        startOffset: number
        endOffset: number
        totalItems: number
    }
}

type CategoryFilters = {
    name?: string | undefined
    isActive?: string | undefined
}

// ------------------------
// ✅ LIST Categories (with pagination + filters)
// ------------------------
export const fetchCategories = async (
    page: number,
    filters: CategoryFilters = {},
): Promise<CategoryListResponse> => {
    const params = new URLSearchParams({ page: String(page) })

    if (filters.name) {
        params.set('name', filters.name)
    }
    if (filters.isActive) {
        params.set('isActive', filters.isActive)
    }

    const res = await fetchAllData(`/categories?${params.toString()}`)
    const result = categoryListSchema.safeParse(res.data)

    if (!result.success) {
        console.error("Zod parsing error:", result.error.format())
        throw new Error("Invalid category list format")
    }

    return {
        data: result.data,
        meta: res.meta,
    }
}

export const useCategoriesQuery = (
    page: number,
    filters: CategoryFilters = {},
) =>
    useQuery({
        queryKey: ['categories', page, filters],
        queryFn: () => fetchCategories(page, filters),
        placeholderData: (prev) => prev,
        staleTime: 60_000,
        refetchInterval: 60_000,
        refetchIntervalInBackground: true,
    })

// ------------------------
// ✅ GET CATEGORY BY ID
// ------------------------
export const fetchCategory = async (id: number): Promise<Category> => {
    const res = await fetchSingleData(`/categories/${id}`)
    const result = categorySchema.safeParse(res.data)

    if (!result.success) {
        console.error("Zod parsing error:", result.error.format())
        throw new Error("Invalid category format")
    }

    return result.data
}

export const useCategoryQuery = (id: number) =>
    useQuery({
        queryKey: ['category', id],
        queryFn: () => fetchCategory(id),
        enabled: !!id,
        staleTime: 60_000,
        refetchInterval: 60_000,
        refetchIntervalInBackground: true,
    })

// ------------------------
// ✅ CREATE CATEGORY
// ------------------------
export const useCreateCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
            const res = await createData('/categories', data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            ToastAlert.success({ message: 'Category created successfully' })
        },
        onError: () => {
            ToastAlert.error({ message: "Failed to create category" })
        },
    })
}

// ------------------------
// ✅ UPDATE CATEGORY
// ------------------------
export const useUpdateCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: Partial<Category> & { id: number }) => {
            const { id, ...payload } = data
            const res = await editData(`/categories/${id}`, payload)
            return res.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.invalidateQueries({ queryKey: ['category', variables.id] })
        },
        onError: () => {
            ToastAlert.error({ message: "Failed to update category" })
        },
    })
}

// ------------------------
// ✅ DELETE CATEGORY
// ------------------------
export const useDeleteCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            await deleteSingleData(`/categories/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
        onError: () => {
            ToastAlert.error({ message: "Failed to delete category" })
        },
    })
}
