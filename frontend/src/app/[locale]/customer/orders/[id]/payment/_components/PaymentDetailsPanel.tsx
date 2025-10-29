'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { PaymentInfo } from '../types'

type PaymentDetailsPanelProps = {
  t: any
  paymentInfo: PaymentInfo
  shippingAddress: string
  notes: string
  onShippingAddressChange: (value: string) => void
  onNotesChange: (value: string) => void
  hasChanges: boolean
  isSaving: boolean
  hasItems: boolean
  isPendingStatus: boolean
  isCancelling: boolean
  orderStatus?: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onViewOrder: () => void
  onCancel: () => void
}

export function PaymentDetailsPanel({
  t,
  paymentInfo,
  shippingAddress,
  notes,
  onShippingAddressChange,
  onNotesChange,
  hasChanges,
  isSaving,
  hasItems,
  isPendingStatus,
  isCancelling,
  orderStatus,
  onSubmit,
  onViewOrder,
  onCancel,
}: PaymentDetailsPanelProps) {
  const normalizedStatus = (orderStatus ?? '').toUpperCase()
  const isCancelled = normalizedStatus === 'CANCELLED'
  const isCompleted = normalizedStatus === 'COMPLETED'
  const canCancel = normalizedStatus !== 'CANCELLED' && normalizedStatus !== 'COMPLETED'
  const disableProceed =
    !hasItems ||
    isSaving ||
    !shippingAddress.trim() ||
    isCancelled ||
    isCompleted ||
    isPendingStatus

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-5 md:p-6 space-y-4">
        <h2 className="text-lg font-semibold">{t('paymentInformation')}</h2>
        <dl className="space-y-3 text-sm text-neutral-700">
          <div>
            <dt className="text-neutral-500">{t('bankName')}</dt>
            <dd className="font-medium">{paymentInfo.bankName}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">{t('accountName')}</dt>
            <dd className="font-medium">{paymentInfo.accountName}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">{t('accountNumber')}</dt>
            <dd className="font-medium">{paymentInfo.accountNumber}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">{t('instructions')}</dt>
            <dd className="font-medium whitespace-pre-line">{paymentInfo.instructions}</dd>
          </div>
        </dl>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-5 md:p-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            {t('shippingAddress')}
            <span className="text-red-500">* {t('required')}</span>
          </label>
          <Textarea
            value={shippingAddress}
            onChange={(event) => onShippingAddressChange(event.target.value)}
            rows={4}
            placeholder={t('enterShippingAddress')}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">{t('notes')}</label>
          <Textarea
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            rows={4}
            placeholder={t('additionalNotes')}
          />
        </div>
        {hasChanges ? <p className="text-xs text-amber-600">{t('unsavedOrderChanges')}</p> : null}
        {isPendingStatus ? (
          <p className="text-xs text-emerald-600">{t('orderAlreadyPending')}</p>
        ) : null}
        {isCancelled ? <p className="text-xs text-rose-600">{t('orderAlreadyCancelled')}</p> : null}
        {isCompleted ? (
          <p className="text-xs text-emerald-600">{t('orderAlreadyCompleted')}</p>
        ) : null}
        <div className="pt-4 space-y-3">
          {/* First row: stacks on mobile, splits on sm+ */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={onViewOrder}
              className="w-full sm:w-auto sm:flex-1"
            >
              {t('viewOrder')}
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={onCancel}
              disabled={!canCancel || isCancelling}
              className="w-full sm:w-auto sm:flex-1"
            >
              {isCancelling ? t('processing') : t('cancelOrder')}
            </Button>
          </div>

          {/* Second Row: always full width */}
          <Button type="submit" disabled={disableProceed} className="w-full">
            {isSaving ? t('processing') : t('proceedToPayment')}
          </Button>
        </div>
      </form>
    </div>
  )
}
