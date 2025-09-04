import { z } from 'zod'
import { createCategorySchema } from './createCategorySchema';

export const categorySchema = createCategorySchema.extend({
    id: z.number(),
    createdAt: z.string().nullable().optional(),
})

export const categoryListSchema = z.array(categorySchema)
