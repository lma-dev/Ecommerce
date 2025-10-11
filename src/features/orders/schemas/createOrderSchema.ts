import { z } from 'zod'
import { orderStatusOptions } from '../constants/status'

export const createOrderSchema = z.object({
  customerId: z.number().min(1, { message: 'Customer is required' }),
  status: z.enum(orderStatusOptions),
  notes: z.string().max(1000).nullable().optional(),
  shippingAddress: z.string().max(2000).nullable().optional(),
  productIds: z.array(z.number().min(1)).min(1, { message: 'Select at least 1 product' }),
})
