import { z } from 'zod'
import { createRegularCostSchema } from '@/features/regular-costs/schemas/createRegularCostSchema'

const userSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const generalOutcomeSchema = createRegularCostSchema.extend({
    id: z.number(),
    reporter: userSchema,
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
})


export const generalOutcomeListSchema = z.array(generalOutcomeSchema)


