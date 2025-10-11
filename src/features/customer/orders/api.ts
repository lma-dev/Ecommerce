import { callCustomerApi } from '@/libs/customerApi'
import { useQuery } from '@tanstack/react-query'
import type { Order } from '@/features/orders/types'

export type CreateCustomerOrderInput = {
  productIds: number[]
  notes?: string
}

export async function createCustomerOrder(payload: CreateCustomerOrderInput) {
  // POST /api/customer/orders (baseURL already includes /api)
  return await callCustomerApi<Order>({ method: 'POST', url: '/customer/orders', data: payload })
}

export const useCustomerOrders = () =>
  useQuery({
    queryKey: ['customer','orders'],
    queryFn: async (): Promise<Order[]> => {
      return await callCustomerApi<Order[]>({ method: 'GET', url: '/customer/orders' })
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  })

export const useCustomerOrder = (id?: number | string) =>
  useQuery({
    queryKey: ['customer','orders', id],
    queryFn: async (): Promise<Order> => {
      return await callCustomerApi<Order>({ method: 'GET', url: `/customer/orders/${id}` })
    },
    enabled: Boolean(id),
    staleTime: 60_000,
  })
