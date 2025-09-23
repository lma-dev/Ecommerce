import { callCustomerApi } from '@/libs/customerApi'
import { useQuery } from '@tanstack/react-query'

export type CreateCustomerOrderInput = {
  productIds: number[]
  notes?: string
}

export async function createCustomerOrder(payload: CreateCustomerOrderInput) {
  // POST /api/customer/orders (baseURL already includes /api)
  return await callCustomerApi({ method: 'POST', url: '/customer/orders', data: payload })
}

export const useCustomerOrders = () =>
  useQuery({
    queryKey: ['customer','orders'],
    queryFn: async () => {
      const res = await callCustomerApi({ method: 'GET', url: '/customer/orders' })
      return (res as any).data ?? res
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  })

export const useCustomerOrder = (id?: number | string) =>
  useQuery({
    queryKey: ['customer','orders', id],
    queryFn: async () => {
      const res = await callCustomerApi({ method: 'GET', url: `/customer/orders/${id}` })
      return (res as any).data ?? res
    },
    enabled: Boolean(id),
    staleTime: 60_000,
  })
