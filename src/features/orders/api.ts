import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ToastAlert from '@/app/[locale]/_components/ui/toast-box'
import { orderListSchema, orderSchema } from './schemas/orderSchema'
import type { Order } from './types'
import {
  createData,
  deleteSingleData,
  editData,
  fetchAllData,
  fetchSingleData,
} from '@/libs/ApiMethodHelper'

// Response types
type OrderListResponse = {
  data: Order[]
  meta: {
    currentPage: number
    totalPages: number
    startOffset: number
    endOffset: number
    totalItems: number
  }
}

type OrderFilters = {
  status?: string | undefined
  customerName?: string | undefined
}

// LIST
export const fetchOrders = async (
  page: number,
  filters: OrderFilters = {},
): Promise<OrderListResponse> => {
  const params = new URLSearchParams({ page: String(page) })
  if (filters.status) params.set('status', filters.status)
  if (filters.customerName) params.set('customerName', filters.customerName)

  const res = await fetchAllData(`/orders?${params.toString()}`)
  const result = orderListSchema.safeParse(res.data)

  if (!result.success) {
    console.error('Zod parsing error:', result.error.format())
    throw new Error('Invalid order list format')
  }

  return {
    data: result.data,
    meta: res.meta,
  }
}

export const useOrdersQuery = (
  page: number,
  filters: OrderFilters = {},
) =>
  useQuery({
    queryKey: ['orders', page, filters],
    queryFn: () => fetchOrders(page, filters),
    placeholderData: (prev) => prev,
    // Auto refresh every 1 minute
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    staleTime: 30_000,
  })

// GET by ID
export const fetchOrder = async (id: number): Promise<Order> => {
  const res = await fetchSingleData(`/orders/${id}`)
  const result = orderSchema.safeParse(res.data)

  if (!result.success) {
    console.error('Zod parsing error:', result.error.format())
    throw new Error('Invalid order format')
  }

  return result.data
}

export const useOrderQuery = (id: number) =>
  useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id),
    enabled: !!id,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    staleTime: 30_000,
  })

// CREATE
export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      // Orders are JSON payloads by default
      const res = await createData('/orders', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => {
      ToastAlert.error({ message: 'Failed to create order' })
    },
  })
}

// UPDATE
export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any & { id: number }) => {
      const { id, ...payload } = data
      const res = await editData(`/orders/${id}`, payload)
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] })
    },
    onError: () => {
      ToastAlert.error({ message: 'Failed to update order' })
    },
  })
}

// DELETE
export const useDeleteOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      await deleteSingleData(`/orders/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => {
      ToastAlert.error({ message: 'Failed to delete order' })
    },
  })
}
