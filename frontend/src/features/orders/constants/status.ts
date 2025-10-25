export const orderStatusOptions = ['DRAFT', 'PENDING', 'CANCELLED', 'COMPLETED'] as const

export type OrderStatusType = (typeof orderStatusOptions)[number]
