import { z } from 'zod'

export const createCustomerBaseSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(255),
  email: z.string().email({ message: 'Invalid email' }),
  phone: z.string().min(1, { message: 'Phone is required' }).max(50),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  password_confirmation: z
    .string()
    .min(8, { message: 'Confirm Password must be at least 8 characters' }),
})

export const createCustomerSchema = createCustomerBaseSchema.refine(
  (data) => data.password === data.password_confirmation,
  {
    path: ['password_confirmation'],
    message: 'Passwords do not match',
  }
)
