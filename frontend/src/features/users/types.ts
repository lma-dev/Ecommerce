
import { z } from 'zod'
import { createUserSchema } from '@/features/users/schemas/createUserSchema'
import { updateUserSchema } from '@/features/users/schemas/updateUserSchema'
import { userSchema } from '@/features/users/schemas/userSchema'

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type User = z.infer<typeof userSchema>
