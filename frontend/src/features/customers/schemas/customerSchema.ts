import { z } from 'zod'
import { createCustomerBaseSchema } from './createCustomerSchema'
import { userAccountStatusOptions } from '@/features/users/constants/status'

// Response schema should not include password fields
export const customerSchema = createCustomerBaseSchema
  .omit({ password: true, password_confirmation: true })
  .extend({
    id: z.number(),
    createdAt: z.string(),
    // Some backends expose customer account status similar to users
    accountStatus: z.enum(userAccountStatusOptions as unknown as [string, ...string[]]).optional(),
  })

export const customerListSchema = z.array(customerSchema)
