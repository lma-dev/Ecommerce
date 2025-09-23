import { z } from 'zod'
import { createOrderSchema } from './schemas/createOrderSchema'
import { updateOrderSchema } from './schemas/updateOrderSchema'
import { orderSchema } from './schemas/orderSchema'

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
export type Order = z.infer<typeof orderSchema>

