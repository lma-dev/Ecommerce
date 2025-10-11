import { z } from 'zod'
import { createProductSchema } from './createProductSchema'

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
})

const legacyProductImageSchema = z.object({
  id: z.number().optional(),
  // Accept absolute URLs (http/https) or backend relative paths starting with '/'
  url: z.union([z.string().url(), z.string().startsWith('/')]),
})

const cloudinaryProductImageSchema = z.object({
  public_id: z.string(),
  url: z.string().url(),
  format: z.string(),
  width: z.number(),
  height: z.number(),
  bytes: z.number(),
})

const productImageSchema = z.union([legacyProductImageSchema, cloudinaryProductImageSchema])

export const productSchema = createProductSchema
  .omit({
    categoryId: true, // response has category object instead
    image: true, // request: File, response: { id, url }
  })
  .extend({
    id: z.number(),
    // Some responses may omit category entirely
    category: categorySchema.nullable().optional(),
    image: productImageSchema.nullable(),
  })

export const productListSchema = z.array(productSchema)
