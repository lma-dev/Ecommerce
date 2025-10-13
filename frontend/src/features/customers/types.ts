import { z } from 'zod'
import { createCustomerSchema } from './schemas/createCustomerSchema'
import { updateCustomerSchema } from './schemas/updateCustomerSchema'
import { customerSchema } from './schemas/customerSchema'

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
export type Customer = z.infer<typeof customerSchema>

