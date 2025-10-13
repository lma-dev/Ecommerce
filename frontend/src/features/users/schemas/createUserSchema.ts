import { z } from 'zod'
import { userRoleOptions } from '@/features/users/constants/role'
import { userAccountStatusOptions } from '@/features/users/constants/status'

export const createUserSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Name must have at least 1 character' })
        .max(255, { message: 'Name cannot exceed 255 characters' }),

    email: z
        .string()
        .email({ message: 'Enter a valid email address' }),

    role: z.enum(userRoleOptions as [string, ...string[]], {
        message: 'Invalid role'
    }),

    accountStatus: z.enum(userAccountStatusOptions as [string, ...string[]], {
        message: 'Invalid account status'
    }),

    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(128, { message: 'Password cannot exceed 128 characters' }),
})
