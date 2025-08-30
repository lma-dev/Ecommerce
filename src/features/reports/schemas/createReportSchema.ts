import { z } from 'zod'
import { userRoleOptions } from '@/features/users/constants/role'
import { userAccountStatusOptions } from '@/features/users/constants/status'
import { ConfirmStatus } from '@/constants/ConfirmStatus'

export const createReportSchema = z.object({
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
    type: z.enum(["INCOME", "EXPENSE"], {
        message: "Please select a valid type",
    }),
    confirmStatus: z.string().min(1).max(255).refine((val) => [ConfirmStatus.ACCEPTED, ConfirmStatus.PENDING, ConfirmStatus.REJECTED].includes(val), {
        message: "Please select a valid status",
    }),
    verifier_id: z
        .number({ message: "Please provide a valid ID" })
        .int({ message: "Please provide a valid ID" })
        .positive({ message: "Please provide a valid verifier ID" })
        .optional(),
})
