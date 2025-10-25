'use client'

import CustomerTopbar from '../_components/CustomerTopbar'
import { useCustomerOrders } from '@/features/customer/orders/api'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useCustomerProfile } from '@/features/customer/profile/api'
import { useRealtimeOrders } from '@/features/orders/useRealtimeOrders'
import { formatCurrency, formatDate, prettyStatus, statusBadgeClass } from '@/libs/FunctionalHelper'

export default function CustomerOrdersPage() {
  const t = useTranslations('Translation')
  const { data: profile } = useCustomerProfile()
  useRealtimeOrders({ customerId: profile?.id, includeGlobalChannel: false })
  const { data: orders, isLoading } = useCustomerOrders()

  return (
    <div className="p-4 md:p-6 space-y-6">
      <CustomerTopbar />

      <section className="max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-4">{t('orders')}</h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 divide-y divide-amber-100">
          {isLoading && (
            <div className="p-4 text-sm text-neutral-500">
              {t('loadingOrders')}
            </div>
          )}
          {!isLoading && (!orders || orders.length === 0) && (
            <div className="p-4 text-sm text-neutral-500">
              {t('noOrders')}
            </div>
          )}
          {(orders ?? []).map((o: any) => (
            <Link
              key={o.id}
              href={{ pathname: '/customer/orders/' + o.id }}
              className="block p-4 hover:bg-amber-100/60 transition rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-neutral-900">
                  {o.orderCode ? `#${o.orderCode}` : `#${o.id}`}
                </div>
                <div className="text-sm font-semibold">
                  {formatCurrency(o.totalAmount || o.total || 0)}
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className={statusBadgeClass(o.status)}>{prettyStatus(o.status)}</span>
                <span className="text-xs text-neutral-500">
                  {formatDate(o.createdAt || o.created_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
