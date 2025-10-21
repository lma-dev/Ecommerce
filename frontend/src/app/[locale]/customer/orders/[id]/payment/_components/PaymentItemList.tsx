'use client'

import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { PaymentItem } from '../types'

type PaymentItemListProps = {
  items: PaymentItem[]
  onQuantityChange: (productId: number, nextQuantity: number) => void
  onRemoveItem: (productId: number) => void
  formatCurrency: (value?: number | string | null) => string
  total: number
  t: any
}

export function PaymentItemList({
  items,
  onQuantityChange,
  onRemoveItem,
  formatCurrency,
  total,
  t,
}: PaymentItemListProps) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">
        {t('orderItemsEmpty', {
          default: 'There are no items in this order yet.',
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 md:flex-row md:items-center md:gap-4"
          >
            <div className="flex items-start gap-3 md:flex-1">
              <img
                src={item.imageUrl || 'https://via.placeholder.com/120x120.png?text=Product'}
                alt={item.name}
                className="h-16 w-16 rounded-lg border bg-white object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
                    <p className="text-xs text-neutral-500">{formatCurrency(item.price)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                    className="h-8 w-8 text-neutral-400 hover:text-rose-600"
                    aria-label={t('removeItem', { default: 'Remove item' })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 md:w-48">
              <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {t('quantity', { default: 'Quantity' })}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label={t('decreaseQuantity', {
                    default: 'Decrease quantity',
                  })}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                  aria-label={t('increaseQuantity', {
                    default: 'Increase quantity',
                  })}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-sm">
        <span>{t('orderSummary', { default: 'Order Summary' })}</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
