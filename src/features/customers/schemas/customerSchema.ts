import { z } from 'zod'
import { createCustomerSchema } from './createCustomerSchema'
import { userAccountStatusOptions } from '@/features/users/constants/status'

export const customerSchema = createCustomerSchema.extend({
  id: z.number(),
  createdAt: z.string(),
  // Some backends expose customer account status similar to users
  accountStatus: z
    .enum(userAccountStatusOptions as unknown as [string, ...string[]])
    .optional(),
})

export const customerListSchema = z.array(customerSchema)
