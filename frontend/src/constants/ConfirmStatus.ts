export const ConfirmStatus = {
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  DRAFT: 'DRAFT',
}

export type ConfirmStatusType = (typeof ConfirmStatus)[keyof typeof ConfirmStatus]
