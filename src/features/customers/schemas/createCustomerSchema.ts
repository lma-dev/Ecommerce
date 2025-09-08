import { z } from 'zod'

export const createCustomerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(255),
  email: z.string().email({ message: 'Invalid email' }),
  phone: z.string().min(1, { message: 'Phone is required' }).max(50),
})

