// status.ts
export const UserAccountStatus = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
} as const;

export type UserAccountStatusType = keyof typeof UserAccountStatus;

// keep literal union, not just string[]
export const userAccountStatusOptions =
    Object.values(UserAccountStatus) as readonly UserAccountStatusType[];
