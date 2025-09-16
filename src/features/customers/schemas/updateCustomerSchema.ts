import { createCustomerBaseSchema } from './createCustomerSchema'

export const updateCustomerSchema = createCustomerBaseSchema.partial()
