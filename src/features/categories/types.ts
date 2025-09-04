
import { z } from 'zod'
import { createCategorySchema } from '@/features/categories/schemas/createCategorySchema'
import { updateCategorySchema } from '@/features/categories/schemas/updateCategorySchema'
import { categorySchema } from '@/features/categories/schemas/categorySchema'

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type Category = z.infer<typeof categorySchema>
