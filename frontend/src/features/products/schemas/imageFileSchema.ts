import { z } from "zod";

export const imageFileSchema = z
    .instanceof(File)
    .refine((f) => ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'].includes(f.type), 'Invalid image type')
    .refine((f) => f.size <= 2 * 1024 * 1024, 'Max file size is 2MB')
