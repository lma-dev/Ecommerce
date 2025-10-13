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
      return await callCustomerApi<CustomerProfile>({ method: 'GET', url: '/customer/me' })
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  })

export const useUpdateCustomerProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<CustomerProfile>) => {
      return await callCustomerApi<CustomerProfile>({ method: 'PATCH', url: '/customer/me', data: payload })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer','me'] })
    }
  })
}

export const useDeleteCustomerProfile = () => {
  return useMutation({
    mutationFn: async () => {
      return await callCustomerApi<{ success: boolean }>({ method: 'DELETE', url: '/customer/me' })
    },
  })
}
