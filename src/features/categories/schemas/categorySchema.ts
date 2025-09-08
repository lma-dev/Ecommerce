import { z } from 'zod'
import { createCategorySchema } from './createCategorySchema';

export const categorySchema = createCategorySchema.extend({
    id: z.number(),
})

export const categoryListSchema = z.array(categorySchema)
