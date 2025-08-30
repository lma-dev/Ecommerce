import { z } from 'zod'
import { createUserSchema } from '@/features/users/schemas/createUserSchema'

export const userSchema = createUserSchema.extend({
    id: z.number(),
    createdAt: z.string().nullable().optional(),
}).omit({
    password: true // Remove password from the fetched user schema
})

export const userListSchema = z.array(userSchema)
