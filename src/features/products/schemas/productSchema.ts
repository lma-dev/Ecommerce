import { z } from "zod"
import { createProductSchema } from "./createProductSchema"
import { productStatusOptions } from "../constants/status"

const categorySchema = z.object({
    id: z.number(),
    name: z.string(),
})

const productImageSchema = z.object({
    id: z.number(),
    // Accept absolute URLs (http/https) or backend relative paths starting with '/'
    url: z.union([z.string().url(), z.string().startsWith('/')]),
})

export const productSchema = createProductSchema
    .omit({
        categoryId: true, // response has category object instead
        image: true,      // request: File, response: { id, url }
    })
    .extend({
        id: z.number(),
        // Some responses may omit category entirely
        category: categorySchema.nullable().optional(),
        image: productImageSchema.nullable(),
    })

export const productListSchema = z.array(productSchema)
