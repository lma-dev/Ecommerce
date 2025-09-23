// status.ts
export const ProductStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
} as const;

export type ProductStatusType = keyof typeof ProductStatus;

// keep literal union, not just string[]
export const productStatusOptions =
    Object.values(ProductStatus) as readonly ProductStatusType[];
