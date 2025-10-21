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
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onViewOrder: () => void
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
  onSubmit,
  onViewOrder,
}: PaymentDetailsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-5 md:p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {t('paymentInformation', { default: 'Payment Information' })}
        </h2>
        <dl className="space-y-3 text-sm text-neutral-700">
          <div>
            <dt className="text-neutral-500">{t('bankName', { default: 'Bank' })}</dt>
            <dd className="font-medium">{paymentInfo.bankName}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">{t('accountName', { default: 'Account Name' })}</dt>
            <dd className="font-medium">{paymentInfo.accountName}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">
              {t('accountNumber', { default: 'Account Number' })}
            </dt>
            <dd className="font-medium">{paymentInfo.accountNumber}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">{t('instructions', { default: 'Instructions' })}</dt>
            <dd className="font-medium whitespace-pre-line">{paymentInfo.instructions}</dd>
          </div>
        </dl>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-5 md:p-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            {t('shippingAddress', { default: 'Shipping Address' })}
            <span className="text-red-500">* {t('required')}</span>
          </label>
          <Textarea
            value={shippingAddress}
            onChange={(event) => onShippingAddressChange(event.target.value)}
            rows={4}
            placeholder={t('enterShippingAddress', {
              default: 'Enter your delivery address',
            })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            {t('notes', { default: 'Notes' })}
          </label>
          <Textarea
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            rows={4}
            placeholder={t('additionalNotes', {
              default: 'Any additional notes for the shop',
            })}
          />
        </div>
        {hasChanges ? (
          <p className="text-xs text-amber-600">
            {t('unsavedOrderChanges', {
              default: 'You have unsaved updates. Save to keep them.',
            })}
          </p>
        ) : null}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" onClick={onViewOrder}>
            {t('viewOrder', { default: 'View Order' })}
          </Button>
          <Button type="submit" disabled={!hasItems || isSaving || !hasChanges}>
            {isSaving
              ? t('saving', { default: 'Saving...' })
              : t('saveChanges', { default: 'Save Changes' })}
          </Button>
        </div>
      </form>
    </div>
  )
}
