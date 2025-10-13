import { z } from 'zod'
import { createUserSchema } from '@/features/users/schemas/createUserSchema'

// Extend the fetched user with id and timestamps which exist in API payloads
export const userSchema = createUserSchema
  .partial()
  .omit({ password: true })
  .extend({
    id: z.number(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })

export const userListSchema = z.array(userSchema)
