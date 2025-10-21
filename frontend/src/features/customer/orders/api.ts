import { callCustomerApi } from '@/libs/customerApi'
import { useQuery } from '@tanstack/react-query'
import type { Order } from '@/features/orders/types'

type ApiResponse<T> = {
  data: T
  message?: string
  result?: number
}

export type CreateCustomerOrderInput = {
  productIds: number[]
  notes?: string | null
  shippingAddress?: string | null
}

export type UpdateCustomerOrderInput = {
  orderId: number | string
  notes?: string | null
  shippingAddress?: string | null
  productIds?: number[]
}

export async function createCustomerOrder(payload: CreateCustomerOrderInput) {
  // POST /api/customer/orders (baseURL already includes /api)
  const res = await callCustomerApi<ApiResponse<Order>>({
    method: 'POST',
    url: '/customer/orders',
    data: payload,
  })
  return res.data
}

export async function updateCustomerOrder({ orderId, ...data }: UpdateCustomerOrderInput) {
  const res = await callCustomerApi<ApiResponse<Order>>({
    method: 'PATCH',
    url: `/customer/orders/${orderId}`,
    data,
  })
  return res.data
}

export const useCustomerOrders = () =>
  useQuery<Order[]>({
    queryKey: ['customer','orders'],
    queryFn: async (): Promise<Order[]> => {
      const res = await callCustomerApi<ApiResponse<Order[]>>({
        method: 'GET',
        url: '/customer/orders',
      })
      return res.data
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  })

export const useCustomerOrder = (id?: number | string) =>
  useQuery<Order>({
    queryKey: ['customer','orders', id],
    queryFn: async (): Promise<Order> => {
      const res = await callCustomerApi<ApiResponse<Order>>({
        method: 'GET',
        url: `/customer/orders/${id}`,
      })
      return res.data
    },
    enabled: Boolean(id),
    staleTime: 60_000,
  })
