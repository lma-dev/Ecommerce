
import { z } from 'zod'
import { createReportSchema } from '@/features/reports/schemas/createReportSchema'
import { updateReportSchema } from '@/features/reports/schemas/updateReportSchema'
import { reportSchema } from '@/features/reports/schemas/reportSchema'

export type CreateReportInput = z.infer<typeof createReportSchema>
export type UpdateReportInput = z.infer<typeof updateReportSchema>
export type Report = z.infer<typeof reportSchema>
