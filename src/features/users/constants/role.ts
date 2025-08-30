export const UserRole = {
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
    MEMBER: 'MEMBER'
} as const

export type UserRoleType = keyof typeof UserRole
export const userRoleOptions = Object.values(UserRole)
