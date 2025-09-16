import { z } from 'zod'
import { createOrderSchema } from './createOrderSchema'
import { orderStatusOptions } from '../constants/status'

const orderCustomerSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  createdAt: z.string(),
})

const orderProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.number(),
  isActive: z.string(),
  quantity: z.number(),
  imageUrl: z.string().url().optional(),
  image: z.object({ id: z.number().optional(), url: z.string().url() }).optional(),
})

export const orderSchema = z.object({
  id: z.number(),
  // Some single-order responses may omit customer
  customer: orderCustomerSchema.optional().nullable(),
  status: z.enum(orderStatusOptions),
  notes: z.string().nullable().optional(),
  totalAmount: z.number(),
  shippingAddress: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  products: z.array(orderProductSchema),
})

export const orderListSchema = z.array(orderSchema)
