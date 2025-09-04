import { createCategorySchema } from './createCategorySchema'

export const updateCategorySchema = createCategorySchema.extend({
    isActive: createCategorySchema.shape.isActive.optional(),
})
