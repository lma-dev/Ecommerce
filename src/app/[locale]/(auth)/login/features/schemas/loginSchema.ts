import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

export type LoginInput = z.infer<typeof loginSchema>
