// status.ts
export const CategoryStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
} as const;

export type CategoryStatusType = keyof typeof CategoryStatus;


// keep literal union, not just string[]
export const categoryStatusOptions =
    Object.values(CategoryStatus) as readonly CategoryStatusType[];
