import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
    locale: z.enum(["en", "jp", "mm"]),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
