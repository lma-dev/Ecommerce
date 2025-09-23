export const orderStatusOptions = [
  'PENDING',
  'CANCELLED',
  'COMPLETED',
] as const

export type OrderStatusType = typeof orderStatusOptions[number]

