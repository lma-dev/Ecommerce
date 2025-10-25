'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/features/customer/cart/hooks'
import { useLocale, useTranslations } from 'next-intl'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { resolveAssetUrl } from '@/libs/assets'
import { useState } from 'react'
import { formatCurrency } from '@/libs/FunctionalHelper'
import { useRouter } from 'next/navigation'
import { createCustomerOrder } from '@/features/customer/orders/api'
import { toast } from 'sonner'

export default function CartSheet({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Translation')
  const { items, updateQty, remove, subtotal, clear } = useCart()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const locale = useLocale()

  const handleCheckout = async () => {
    if (items.length === 0 || isSubmitting) return
    setIsSubmitting(true)
    try {
      const productIds = items.flatMap((item) =>
        Array.from({ length: Math.max(1, item.qty || 1) }, () => item.id),
      )
      const order = await createCustomerOrder({ productIds, status: 'DRAFT' })
      toast.success(
        t('orderDraftCreated'),
      )
      clear()
      setOpen(false)
      if (order?.id) {
        setTimeout(() => {
          router.push(`/${locale}/customer/orders/${order.id}/payment`)
        }, 150)
      }
    } catch (error) {
      console.error('Checkout failed', error)
      toast.error(
        t('orderDraftFailed'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md bg-white">
        <SheetHeader className="border-b border-neutral-200 pb-3 bg-white px-4">
          <SheetTitle>{t('cart')}</SheetTitle>
        </SheetHeader>
        <div className="mt-2 px-4 flex flex-col gap-4 h-[calc(100%-6.5rem)] bg-white">
          <div className="flex-1 overflow-auto space-y-3 bg-white pb-2">
            {items.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-10">
                {t('emptyCart')}
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 items-center border border-neutral-200 rounded-xl p-3 bg-neutral-50"
                >
                  <img
                    src={
                      resolveAssetUrl(item.imageUrl) ||
                      'https://via.placeholder.com/160x160.png?text=Product'
                    }
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md bg-muted"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate text-neutral-900">{item.name}</div>
                    <div className="text-xs text-neutral-500">{formatCurrency(item.price)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="icon"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <Button
                        size="icon"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => remove(item.id)}
                    className="text-neutral-500 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-neutral-200 pt-4 pb-4 space-y-3 bg-white px-4 -mx-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600">{t('total')}</div>
              <div className="text-base font-semibold text-neutral-900">
                {formatCurrency(subtotal)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={items.length === 0 || isSubmitting}
                onClick={handleCheckout}
              >
                {isSubmitting
                  ? t('processing')
                  : t('checkout')}
              </Button>
              <Button
                variant="secondary"
                onClick={clear}
                disabled={items.length === 0}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              >
                {t('clear')}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
