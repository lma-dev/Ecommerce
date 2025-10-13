import { createReportSchema } from "@/features/reports/schemas/createReportSchema";

export const updateReportSchema = createReportSchema.extend({
    password: createReportSchema.shape.verifier_id.optional()
});
