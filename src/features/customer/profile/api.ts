import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { callCustomerApi } from '@/libs/customerApi'

export type CustomerProfile = {
  id?: number
  name?: string
  email?: string
  phone?: string
  address?: string | null
  [key: string]: any
}

export const useCustomerProfile = () =>
  useQuery({
    queryKey: ['customer','me'],
    queryFn: async (): Promise<CustomerProfile> => {
      const res = await callCustomerApi({ method: 'GET', url: '/customer/me' })
      return (res as any).data ?? res
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  })

export const useUpdateCustomerProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<CustomerProfile>) => {
      const res = await callCustomerApi({ method: 'PATCH', url: '/customer/me', data: payload })
      return (res as any).data ?? res
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer','me'] })
    }
  })
}

export const useDeleteCustomerProfile = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await callCustomerApi({ method: 'DELETE', url: '/customer/me' })
      return (res as any).data ?? res
    },
  })
}
