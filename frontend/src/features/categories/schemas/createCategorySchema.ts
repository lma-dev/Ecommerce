import { z } from 'zod'
import { categoryStatusOptions } from '@/features/categories/constants/status'
export const createCategorySchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Name must have at least 1 character' })
        .max(255, { message: 'Name cannot exceed 255 characters' }),
    description: z
        .string()
        .min(1, { message: 'Description must have at least 1 character' })
        .max(1000, { message: 'Description cannot exceed 1000 characters' }),
    isActive: z.enum(categoryStatusOptions as [string, ...string[]], {
        message: 'Invalid account status'
    }),

})
