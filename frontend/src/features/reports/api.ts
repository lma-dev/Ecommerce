import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportListSchema, reportSchema } from './schemas/reportSchema'
import type { Report } from './types'
import ToastAlert from '@/app/[locale]/_components/ui/toast-box'
import {
  createData,
  deleteSingleData,
  editData,
  fetchAllData,
  fetchSingleData,
} from '@/libs/ApiMethodHelper'

// Types
type ReportListResponse = {
  data: Report[]
  meta: {
    currentPage: number
    totalPages: number
    startOffset: number
    endOffset: number
    totalItems: number
  }
}

type ReportFilters = {
  amount?: number
  confirmStatus?: string
  type?: string
  createdAt?: string
  generalSearch?: string
}

// ------------------------
// ✅ LIST REPORTS (with pagination + filters)
// ------------------------
export const fetchReports = async (
  page: number,
  filters: ReportFilters = {},
): Promise<ReportListResponse> => {
  const params = new URLSearchParams({ page: String(page) })

  if (filters.amount !== undefined) params.set('amount', String(filters.amount))
  if (filters.confirmStatus) params.set('confirmStatus', filters.confirmStatus)
  if (filters.type) params.set('type', filters.type)
  if (filters.createdAt) params.set('createdAt', filters.createdAt)
  if (filters.generalSearch) params.set('generalSearch', filters.generalSearch)

  const res = await fetchAllData<ReportListResponse>(`/reports?${params.toString()}`)
  const result = reportListSchema.safeParse(res.data)

  if (!result.success) {
    console.error('Zod parsing error:', result.error.format())
    throw new Error('Invalid report list format')
  }

  return {
    data: result.data,
    meta: res.meta,
  }
}

export const useReportsQuery = (page: number, filters: ReportFilters = {}) =>
  useQuery({
    queryKey: ['reports', page, filters],
    queryFn: () => fetchReports(page, filters),
    placeholderData: (prev) => prev,
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  })

// ------------------------
// ✅ GET REPORT BY ID
// ------------------------
export const fetchReport = async (id: number): Promise<Report> => {
  const res = await fetchSingleData<{ data: unknown }>(`/reports/${id}`)
  const result = reportSchema.safeParse(res.data)

  if (!result.success) {
    console.error('Zod parsing error:', result.error.format())
    throw new Error('Invalid report format')
  }

  return result.data
}

export const useReportQuery = (id: number) =>
  useQuery({
    queryKey: ['report', id],
    queryFn: () => fetchReport(id),
    enabled: !!id,
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  })

// ------------------------
// ✅ CREATE REPORT
// ------------------------
export const useCreateReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      data: Omit<Report, 'id' | 'reporter' | 'verifier' | 'createdAt' | 'updatedAt'>,
    ) => {
      const res = await createData<{ data: Report }>('/reports', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      ToastAlert.success({ message: 'Report created successfully' })
    },
    onError: () => {
      ToastAlert.error({ message: 'Failed to create report' })
    },
  })
}

// ------------------------
// ✅ UPDATE REPORT
// ------------------------
export const useUpdateReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Report> & { id: number }) => {
      const { id, ...payload } = data
      const res = await editData<{ data: Report }>(`/reports/${id}`, payload)
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['report', variables.id] })
    },
    onError: () => {
      ToastAlert.error({ message: 'Failed to update report' })
    },
  })
}

// ------------------------
// ✅ DELETE REPORT
// ------------------------
export const useDeleteReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      await deleteSingleData(`/reports/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
    onError: () => {
      ToastAlert.error({ message: 'Failed to delete report' })
    },
  })
}
