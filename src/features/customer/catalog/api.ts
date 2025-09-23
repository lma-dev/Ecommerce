import { useQuery } from '@tanstack/react-query'
import { fetchCustomerList } from '@/libs/customerApi'

export const useCustomerCategories = () =>
  useQuery({
    queryKey: ['customer','categories'],
    queryFn: async () => {
      const res = await fetchCustomerList('/customer/categories')
      return (res as any).data ?? res
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  })

export const useCustomerProducts = (filters?: { categoryId?: number; search?: string }) =>
  useQuery({
    queryKey: ['customer','products', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.categoryId) params.set('categoryId', String(filters.categoryId))
      // backend expects `name` for search term
      if (filters?.search) params.set('name', filters.search)
      const qs = params.toString()
      const res = await fetchCustomerList(`/customer/products${qs ? `?${qs}` : ''}`)
      return (res as any).data ?? res
    },
    staleTime: 30_000,
    enabled: Boolean(filters?.categoryId),
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  })
