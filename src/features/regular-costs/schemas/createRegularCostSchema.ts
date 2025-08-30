import { z } from 'zod'
export const createRegularCostSchema = z.object({
    amount:
        z.coerce.number({
            required_error: "Amount is required",
            invalid_type_error: "Amount must be a number",
        })
            .int({ message: "Please provide a valid amount" })
            .positive({ message: "Amount must be a positive number" })
            .min(500, { message: "Amount must be greater than 500 kyats" })
            .refine((value) => value % 2 === 0, { message: "Amount must be even" }),
    description: z
        .string()
        .min(1, { message: "Please provide a description" })
        .max(255, { message: "Description should not exceed 255 characters" }),

})
