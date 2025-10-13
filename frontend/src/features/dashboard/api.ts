import { useQuery } from '@tanstack/react-query'
import { fetchSingleData } from '@/libs/ApiMethodHelper'
import { z } from 'zod'

export const dashboardStatsSchema = z.object({
  pendingOrdersCount: z.number(),
  completedOrdersTotalAmount: z.number(),
  customersCount: z.number(),
  usersCount: z.number(),
  productsCount: z.number(),
})

export type DashboardStats = z.infer<typeof dashboardStatsSchema>

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const res = (await fetchSingleData('/dashboard')) as any
  const parsed = dashboardStatsSchema.safeParse(res.data)
  if (!parsed.success) {
    // Some backends wrap under data; try res.data?.data
    const fallback = dashboardStatsSchema.safeParse(res.data?.data)
    if (!fallback.success) {
      console.error(
        'Invalid dashboard stats:',
        fallback.error?.format?.() ?? parsed.error?.format?.(),
      )
      throw new Error('Invalid dashboard stats format')
    }
    return fallback.data
  }
  return parsed.data
}

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    staleTime: 30_000,
  })
