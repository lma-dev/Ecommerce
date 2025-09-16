import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerListSchema, customerSchema } from './schemas/customerSchema'
import type { Customer } from './types'
import ToastAlert from '@/app/[locale]/_components/ui/toast-box'
import {
  createData,
  deleteSingleData,
  editData,
  fetchAllData,
  fetchSingleData,
} from '@/libs/ApiMethodHelper'

// Response types
type CustomerListResponse = {
  data: Customer[]
  meta: {
    currentPage: number
    totalPages: number
    startOffset: number
    endOffset: number
    totalItems: number
  }
}

type CustomerFilters = {
  generalSearch?: string | undefined
  // Back-compat: allow name/email but prefer generalSearch
  name?: string | undefined
  email?: string | undefined
}

// LIST
export const fetchCustomers = async (
    page: number,
    filters: CustomerFilters = {},
): Promise<CustomerListResponse> => {
    const params = new URLSearchParams({ page: String(page) })
  if (filters.generalSearch) {
    params.set('generalSearch', filters.generalSearch)
  } else {
    // fallback for older callers
    if (filters.name) params.set('name', filters.name)
    if (filters.email) params.set('email', filters.email)
  }

  const res = await fetchAllData(`/customers?${params.toString()}`)
  const result = customerListSchema.safeParse(res.data)

  if (!result.success) {
    console.error('Zod parsing error:', result.error.format())
    throw new Error('Invalid customer list format')
  }

  return {
    data: result.data,
    meta: res.meta,
  }
}

export const useCustomersQuery = (
  page: number,
  filters: CustomerFilters = {},
) =>
  useQuery({
    queryKey: ['customers', page, filters],
    queryFn: () => fetchCustomers(page, filters),
    placeholderData: (prev) => prev,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    staleTime: 30_000,
  })

// GET by ID
export const fetchCustomer = async (id: number): Promise<Customer> => {
  const res = await fetchSingleData(`/customers/${id}`)
  const result = customerSchema.safeParse(res.data)

  if (!result.success) {
    console.error('Zod parsing error:', result.error.format())
    throw new Error('Invalid customer format')
  }

  return result.data
}

export const useCustomerQuery = (id: number) =>
  useQuery({
    queryKey: ['customer', id],
    queryFn: () => fetchCustomer(id),
    enabled: !!id,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    staleTime: 30_000,
  })

// CREATE
export const useCreateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Customer, 'id' | 'createdAt'>) => {
      const res = await createData('/customers', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      ToastAlert.success({ message: 'Customer created successfully' })
    },
    onError: () => {
      ToastAlert.error({ message: 'Failed to create customer' })
    },
  })
}

// UPDATE
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Customer> & { id: number }) => {
      const { id, ...payload } = data
      const res = await editData(`/customers/${id}`, payload)
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] })
    },
    onError: () => {
      ToastAlert.error({ message: 'Failed to update customer' })
    },
  })
}

// DELETE
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      await deleteSingleData(`/customers/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
    onError: () => {
      ToastAlert.error({ message: 'Failed to delete customer' })
    },
  })
}
