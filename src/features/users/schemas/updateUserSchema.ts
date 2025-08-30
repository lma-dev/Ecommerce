import { createUserSchema } from '@/features/users/schemas/createUserSchema'

export const updateUserSchema = createUserSchema.extend({
    password: createUserSchema.shape.password.optional()
})
