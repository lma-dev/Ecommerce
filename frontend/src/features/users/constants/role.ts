// roles.ts
export const UserRole = {
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
    STAFF: 'STAFF',
} as const;

export type UserRoleType = keyof typeof UserRole;

// keep literal types (not just string[])
export const userRoleOptions = Object.values(UserRole) as readonly UserRoleType[];

// nice labels for the UI
export const userRoleLabel: Record<UserRoleType, string> = {
    ADMIN: 'Admin',
    SUPER_ADMIN: 'Super Admin',
    STAFF: 'Staff',
};
