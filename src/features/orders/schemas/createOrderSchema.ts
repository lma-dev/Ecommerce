import { z } from 'zod'
import { orderStatusOptions } from '../constants/status'

export const createOrderSchema = z.object({
  customerId: z.number().min(1, { message: 'Customer is required' }),
  status: z.enum(orderStatusOptions as [string, ...string[]]),
  notes: z.string().max(1000).nullable().optional(),
  shippingAddress: z.string().min(1, { message: 'Shipping address is required' }),
  productIds: z.array(z.number().min(1)).nonempty({ message: 'Select at least 1 product' }),
})

