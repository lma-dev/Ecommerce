
import { z } from 'zod'
import { createRegularCostSchema } from '@/features/regular-costs/schemas/createRegularCostSchema'
import { updateRegularCostSchema } from '@/features/regular-costs/schemas/updateRegularCostSchema'
import { generalOutcomeSchema } from '@/features/regular-costs/schemas/regularCostSchema'

export type CreateRegularCostInput = z.infer<typeof createRegularCostSchema>
export type UpdateRegularCostInput = z.infer<typeof updateRegularCostSchema>
export type RegularCost = z.infer<typeof generalOutcomeSchema>
