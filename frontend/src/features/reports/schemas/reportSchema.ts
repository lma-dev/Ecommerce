import { z } from 'zod'
import { createReportSchema } from '@/features/reports/schemas/createReportSchema'

const userSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const reportSchema = createReportSchema.extend({
    id: z.number(),
    reporter: userSchema,
    verifier: userSchema.nullish(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
})


export const reportListSchema = z.array(reportSchema)


