import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { generalOutcomeListSchema, generalOutcomeSchema } from '@/features/regular-costs/schemas/regularCostSchema'
import type { RegularCost } from '@/features/regular-costs/types'
import ToastAlert from '@/app/[locale]/_components/ui/toast-box'
import {
    createData,
    deleteSingleData,
    editData,
    exportData,
    fetchAllData,
    fetchSingleData,
} from '@/libs/ApiMethodHelper'

// Types
type RegularCostListResponse = {
    data: RegularCost[]
    meta: {
        currentPage: number
        totalPages: number
        startOffset: number
        endOffset: number
        totalItems: number
    }
}

type RegularCostFilters = {
    amount?: number
    confirmStatus?: string
    type?: string
    createdAt?: string
    generalSearch?: string
}

type SortOption = {
    field: string
    direction: 'asc' | 'desc'
}

// ------------------------
// ✅ LIST REGULAR COSTS (with pagination + filters)
// ------------------------
export const fetchRegularCosts = async (
    page: number,
    filters: RegularCostFilters = {},
    sort?: SortOption
): Promise<RegularCostListResponse> => {
    const params = new URLSearchParams({ page: String(page) })

    if (filters.amount !== undefined) params.set('amount', String(filters.amount))
    if (filters.createdAt) params.set('createdAt', filters.createdAt)
    if (filters.generalSearch) params.set('generalSearch', filters.generalSearch)

    const res = await fetchAllData(`/general-outcomes?${params.toString()}`)
    const result = generalOutcomeListSchema.safeParse(res.data)

    if (!result.success) {
        console.error("Zod parsing error:", result.error.format())
        throw new Error("Invalid generalOutcome list format")
    }

    return {
        data: result.data,
        meta: res.meta,
    }
}

export const useRegularCostsQuery = (
    page: number,
    filters: RegularCostFilters = {},
    sort?: SortOption
) =>
    useQuery({
        queryKey: ['regularCosts', page, filters, sort],
        queryFn: () => fetchRegularCosts(page, filters, sort),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 5,
    })

// --------------------
// ✅ GET REGULAR COST BY ID
// ------------------------
export const fetchRegularCost = async (id: number): Promise<RegularCost> => {
    const res = await fetchSingleData(`/general-outcomes/${id}`)
    const result = generalOutcomeSchema.safeParse(res.data)

    if (!result.success) {
        console.error("Zod parsing error:", result.error.format())
        throw new Error("Invalid generalOutcome format")
    }

    return result.data
}

export const useRegularCostQuery = (id: number) =>
    useQuery({
        queryKey: ['regularCosts', id],
        queryFn: () => fetchRegularCost(id),
        enabled: !!id,
    })

// ------------------------
// ✅ CREATE REGULAR COST
// ------------------------
export const useCreateRegularCost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: Omit<RegularCost, 'id' | 'verifier' | 'createdAt' | 'updatedAt'>) => {
            const res = await createData('/general-outcomes', data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regularCosts'] })
        },
        onError: () => {
            ToastAlert.error({ message: "Failed to create regularCost" })
        }
    })
}

// ------------------------
// ✅ UPDATE REGULAR COST
// ------------------------
export const useUpdateRegularCost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: Partial<RegularCost> & { id: number }) => {
            const { id, ...payload } = data
            const res = await editData(`/general-outcomes/${id}`, payload)
            return res.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['regularCosts'] })
            queryClient.invalidateQueries({ queryKey: ['regularCost', variables.id] })
        },
        onError: () => {
            ToastAlert.error({ message: "Failed to update regularCost" })
        }
    })
}

// ------------------------
// ✅ DELETE GENERAL OUTCOME
// ------------------------
export const useDeleteRegularCost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            await deleteSingleData(`/general-outcomes/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regularCosts'] })
        },
        onError: () => {
            ToastAlert.error({ message: "Failed to delete regularCost" })
        }
    })
}
