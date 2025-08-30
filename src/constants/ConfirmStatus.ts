

export const ConfirmStatus = {
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  PENDING: "PENDING",
}

export type ConfirmStatusType = typeof ConfirmStatus[keyof typeof ConfirmStatus];
