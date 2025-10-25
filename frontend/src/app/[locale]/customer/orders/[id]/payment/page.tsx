'use client'

import CustomerTopbar from '@/app/[locale]/customer/_components/CustomerTopbar'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useCustomerOrder, updateCustomerOrder } from '@/features/customer/orders/api'
import { useCustomerProfile } from '@/features/customer/profile/api'
import { useRealtimeOrders } from '@/features/orders/useRealtimeOrders'
import { Link } from '@/i18n/navigation'
import { resolveAssetUrl } from '@/libs/assets'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { PaymentItemList } from './_components/PaymentItemList'
import { PaymentDetailsPanel } from './_components/PaymentDetailsPanel'
import type { PaymentInfo, PaymentItem } from './types'
import { formatCurrency, formatDate, prettyStatus, statusBadgeClass } from '@/libs/FunctionalHelper'

export default function CustomerOrderPaymentPage() {
  const t = useTranslations('Translation')
  const params = useParams() as { id?: string }
  const orderId = params?.id
  const numericId = orderId ? Number(orderId) : undefined
  const { data: profile } = useCustomerProfile()
  const { data: order, isLoading } = useCustomerOrder(orderId)
  const [shippingAddress, setShippingAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<PaymentItem[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const router = useRouter()
  const locale = useLocale()
  const qc = useQueryClient()

  useRealtimeOrders({
    orderId: numericId,
    customerId: profile?.id,
    includeGlobalChannel: false,
  })

  const formatItems = useCallback((products: any[] | undefined) => {
    if (!products) return []
    return products.map((product) => {
      const baseQuantity = product?.quantity ?? 1
      const quantity =
        typeof baseQuantity === 'number' && baseQuantity > 0 ? Math.floor(baseQuantity) : 1
      const src = product?.image?.url ?? product?.imageUrl ?? product?.image_path ?? ''
      const resolved = src ? resolveAssetUrl(src) : null
      return {
        id: product.id,
        name: product.name,
        quantity,
        price: Number(product.price ?? 0),
        imageUrl: resolved || null,
      } as PaymentItem
    })
  }, [])

  useEffect(() => {
    if (!order) return
    setShippingAddress(order.shippingAddress ?? '')
    setNotes(order.notes ?? '')
    setItems(formatItems(order.products))
    setHasChanges(false)
  }, [order, formatItems])

  const paymentInfo = useMemo<PaymentInfo>(
    () => ({
      bankName: process.env.NEXT_PUBLIC_PAYMENT_BANK_NAME || 'Sample Bank',
      accountName: process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME || 'YaungKyaMl Store',
      accountNumber: process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NUMBER || '000-1234567890',
      instructions:
        process.env.NEXT_PUBLIC_PAYMENT_INSTRUCTIONS ||
        'Please transfer the total amount to the account above and include your order number in the payment reference.',
    }),
    [],
  )

  const { mutateAsync: saveOrder, isPending: isSaving } = useMutation({
    mutationFn: updateCustomerOrder,
    onSuccess: (updated) => {
      toast.success(t('orderProceedSuccess'))
      const normalized = formatItems(updated?.products)
      setItems(normalized)
      setShippingAddress(updated?.shippingAddress ?? '')
      setNotes(updated?.notes ?? '')
      setHasChanges(false)
      if (updated?.id) {
        qc.setQueryData(['customer', 'orders', updated.id], updated)
        qc.invalidateQueries({ queryKey: ['customer', 'orders'] })
      }
    },
    onError: () => {
      toast.error(t('orderUpdateFailed'))
    },
  })

  const handleShippingAddressChange = (value: string) => {
    setShippingAddress(value)
    setHasChanges(true)
  }

  const handleNotesChange = (value: string) => {
    setNotes(value)
    setHasChanges(true)
  }

  const handleQuantityChange = (productId: number, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      handleRemoveItem(productId)
      return
    }

    let didChange = false
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item
        const normalized = Math.max(1, nextQuantity)
        if (normalized !== item.quantity) {
          didChange = true
          return { ...item, quantity: normalized }
        }
        return item
      }),
    )
    if (didChange) {
      setHasChanges(true)
    }
  }

  const handleRemoveItem = (productId: number) => {
    if (items.length <= 1) {
      toast.error(t('orderMustHaveItem'))
      return
    }
    let removed = false
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== productId)
      removed = next.length !== prev.length
      return next
    })
    if (removed) {
      setHasChanges(true)
    }
  }

  const {
    mutateAsync: cancelOrderMutation,
    isPending: isCancelling,
  } = useMutation({
    mutationFn: async (orderId: number) => {
      return updateCustomerOrder({ orderId, status: 'CANCELLED' })
    },
    onSuccess: (updated) => {
      toast.success(t('orderCancelSuccess'))
      if (updated?.id) {
        qc.setQueryData(['customer', 'orders', updated.id], updated)
        qc.invalidateQueries({ queryKey: ['customer', 'orders'] })
      }
      router.push(`/${locale}/customer/orders`)
    },
    onError: () => {
      toast.error(t('orderCancelFailed'))
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!order) return
    const trimmedAddress = shippingAddress.trim()
    if (!trimmedAddress) {
      toast.error(t('shippingAddressRequired'))
      return
    }
    const productIds = items.flatMap((item) => Array.from({ length: item.quantity }, () => item.id))
    if (productIds.length === 0) {
      toast.error(t('orderMustHaveItem'))
      return
    }
    await saveOrder({
      orderId: order.id,
      shippingAddress: trimmedAddress,
      notes: notes.trim() || null,
      productIds,
      status: 'PENDING',
    })
  }

  const requestCancelOrder = () => {
    if (!order) return
    setIsCancelDialogOpen(true)
  }

  const confirmCancelOrder = async () => {
    if (!order) return
    try {
      await cancelOrderMutation(order.id)
      setIsCancelDialogOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const goToOrderDetail = () => {
    if (!orderId) return
    router.push(`/${locale}/customer/orders/${orderId}`)
  }

  const computedTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price ?? 0) * item.quantity, 0)
  }, [items])

  const originalTotal = useMemo(() => {
    if (!order) return 0
    const base = Number(order.totalAmount ?? order.total ?? 0)
    return Number.isFinite(base) ? base : 0
  }, [order])

  const displayedTotal = items.length > 0 ? computedTotal : originalTotal

  const hasItems = items.length > 0

  return (
    <div className="p-4 md:p-6 space-y-6">
      <CustomerTopbar />

      <section className="max-w-4xl mx-auto w-full space-y-4">
        <Link
          href={{ pathname: '/customer/orders' }}
          aria-label={t('backToOrders')}
        >
          <Button variant="ghost" size="sm" className="-ml-2 mb-1 flex items-center gap-2">
            <span aria-hidden>←</span>
            <span>{t('back')}</span>
          </Button>
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            {t('paymentTitle')}
          </h1>
          {order && (
            <p className="text-sm text-neutral-600">
              {t('orderNumberLabel')}:{' '}
              <span className="font-semibold">#{order.orderCode || order.id}</span>
            </p>
          )}
        </div>

        {isLoading && (
          <div className="text-sm text-neutral-500">{t('loading')}</div>
        )}

        {!isLoading && !order && (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">
            {t('orderNotFound')}
          </div>
        )}

        {order && (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-5 md:p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-neutral-600">
                    {t('orderNumberLabel')}:{' '}
                    <span className="font-semibold text-neutral-900">
                      #{order.orderCode || order.id}
                    </span>
                  </p>
                  <p className="text-xs text-neutral-500">{formatDate(order.created_at)}</p>
                </div>
                <span className={statusBadgeClass(order.status)}>{prettyStatus(order.status)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                <span>
                  {t('total')}:{' '}
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(displayedTotal)}
                  </span>
                </span>
                <span className="text-neutral-300">•</span>
                <span>
                  {t('status')}: {prettyStatus(order.status)}
                </span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
              <PaymentItemList
                items={items}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                formatCurrency={formatCurrency}
                total={displayedTotal}
                t={t}
              />
              <PaymentDetailsPanel
                t={t}
                paymentInfo={paymentInfo}
                shippingAddress={shippingAddress}
                notes={notes}
                onShippingAddressChange={handleShippingAddressChange}
                onNotesChange={handleNotesChange}
                hasChanges={hasChanges}
                isSaving={isSaving}
                hasItems={hasItems}
                isPendingStatus={order?.status === 'PENDING'}
                isCancelling={isCancelling}
                orderStatus={order?.status}
                onSubmit={handleSubmit}
                onViewOrder={goToOrderDetail}
                onCancel={requestCancelOrder}
              />
            </div>
          </div>
        )}
      </section>
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('cancelOrder')}</AlertDialogTitle>
            <AlertDialogDescription>{t('confirmCancelOrder')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelOrder} disabled={isCancelling}>
              {isCancelling ? t('processing') : t('confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
