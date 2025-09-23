import { z } from 'zod'
import { productStatusOptions } from '../constants/status'
import { imageFileSchema } from './imageFileSchema'

export const createProductSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Name must have at least 1 character' })
        .max(255, { message: 'Name cannot exceed 255 characters' }),
    description: z
        .string()
        .min(1, { message: 'Description must have at least 1 character' })
        .max(1000, { message: 'Description cannot exceed 1000 characters' })
        .nullable()
        .optional(),
    isActive: z.enum(productStatusOptions as [string, ...string[]], {
        message: 'Invalid product status',
    }),
    // For create requests you’re sending a number – that’s fine
    price: z.number().min(1, { message: 'Price must be at least 1' }),
    image: imageFileSchema.nullable().optional(),
    categoryId: z.number().min(1, { message: 'Category ID must be at least 1' }).positive(),
})
