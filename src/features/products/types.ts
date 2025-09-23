
import { z } from 'zod'
import { createProductSchema } from '@/features/products/schemas/createProductSchema'
import { updateProductSchema } from '@/features/products/schemas/updateProductSchema'
import { productSchema } from '@/features/products/schemas/productSchema'

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type Product = z.infer<typeof productSchema>
