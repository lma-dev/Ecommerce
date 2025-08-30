export const UserAccountStatus = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED'
} as const

export type UserAccountStatusType = keyof typeof UserAccountStatus
export const userAccountStatusOptions = Object.values(UserAccountStatus)
