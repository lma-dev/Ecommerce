'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createOrderSchema } from '@/features/orders/schemas/createOrderSchema'
import { updateOrderSchema } from '@/features/orders/schemas/updateOrderSchema'
import { useCreateOrder, useUpdateOrder } from '@/features/orders/api'
import { useProductsQuery } from '@/features/products/api'
import { useAllCustomersQuery } from '@/features/customers/api'
import { orderStatusOptions, OrderStatusType } from '@/features/orders/constants/status'
import ToastAlert from '@/app/[locale]/_components/ui/toast-box'
import { FormSubmitButton } from '@/app/[locale]/_components/ui/button'
import CustomLink from '@/app/[locale]/_components/ui/custom-link'
import { useLocale, useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/libs/utils'

type FormValues = z.infer<typeof updateOrderSchema>

interface Customer {
  id: number
  name: string
  email?: string
}

const OrderForm = ({ mode, defaultValues }: { mode: 'create' | 'edit'; defaultValues?: any }) => {
  const locale = useLocale()
  const t = useTranslations('Translation')

  const isCreateMode = mode === 'create'
  const defaultCustomer = defaultValues?.customer

  // 🧩 Prepare initial product counts
  const initialCounts = useMemo(() => {
    const counts = new Map<number, number>()
    for (const p of defaultValues?.products ?? []) {
      const qty = Number(p?.quantity ?? 1)
      counts.set(p.id, (counts.get(p.id) ?? 0) + qty)
    }
    return counts
  }, [defaultValues?.products])

  // 🧩 Prepare form defaults
  const mappedDefaults: FormValues = defaultValues
    ? {
        customerId: defaultCustomer?.id,
        status: defaultValues.status,
        notes: defaultValues.notes ?? null,
        shippingAddress: defaultValues.shippingAddress,
        productIds: defaultValues.products?.map((p: any) => p.id) ?? [],
      }
    : {
        customerId: undefined,
        status: 'DRAFT',
        notes: null,
        shippingAddress: '',
        productIds: [],
      }

  const activeSchema = isCreateMode ? createOrderSchema : updateOrderSchema
  const form = useForm<FormValues>({
    resolver: zodResolver(activeSchema),
    defaultValues: mappedDefaults,
  })

  const create = useCreateOrder()
  const update = useUpdateOrder()

  // 🧩 Customers
  const { data: customersRes, isLoading: isLoadingCustomers } = useAllCustomersQuery()
  const customers = customersRes?.data ?? []

  // Merge in default customer if not already in the list
  const allCustomers: Customer[] = useMemo(() => {
    if (!defaultCustomer) return customers
    const exists = customers.some((c) => c.id === defaultCustomer.id)
    return exists
      ? customers
      : [
          ...customers,
          { id: defaultCustomer.id, name: defaultCustomer.name, email: defaultCustomer.email },
        ]
  }, [customers, defaultCustomer])

  // 🧩 Products
  const [productPage, setProductPage] = useState(1)
  const [productSearch, setProductSearch] = useState('')
  const { data: productsRes, isLoading: isLoadingProducts } = useProductsQuery(productPage, {
    name: productSearch || undefined,
  })

  // 🧩 Local product counts
  const [productCounts, setProductCounts] = useState<Map<number, number>>(initialCounts)

  // Sync form productIds on mount
  useEffect(() => {
    if (productCounts.size > 0) {
      const ids: number[] = []
      productCounts.forEach((q, id) => {
        for (let i = 0; i < q; i++) ids.push(id)
      })
      form.setValue('productIds', ids)
    }
  }, [productCounts, form])

  // 🧩 Helper to recompute product IDs from counts
  const computeProductIdsFromCounts = useCallback(() => {
    const ids: number[] = []
    productCounts.forEach((qty, id) => {
      for (let i = 0; i < qty; i++) ids.push(id)
    })
    return ids
  }, [productCounts])

  // 🧩 Submit handler
  const onSubmit = (values: FormValues) => {
    const productIds = computeProductIdsFromCounts()
    const payload = { ...values, productIds }

    if (!productIds.length) {
      ToastAlert.error({ message: t('pleaseSelectProducts') })
      return
    }

    if (isCreateMode) {
      create.mutate(payload, {
        onSuccess: () => ToastAlert.success({ message: t('orderCreatedSuccessfully') }),
      })
    } else if (defaultValues?.id) {
      update.mutate(
        { id: defaultValues.id, ...payload },
        { onSuccess: () => ToastAlert.success({ message: t('orderUpdatedSuccessfully') }) },
      )
    }
  }

  // 🧩 UI rendering
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Customer */}
      <Controller
        name="customerId"
        control={form.control}
        render={({ field }) => {
          const handleChange = (value: string) => field.onChange(Number(value))
          const currentId = field.value ? String(field.value) : undefined

          return (
            <Select
              value={currentId}
              onValueChange={handleChange}
              disabled={isLoadingCustomers || allCustomers.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectCustomer')} />
              </SelectTrigger>
              <SelectContent>
                {allCustomers.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                    {c.email ? ` (${c.email})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }}
      />

      {/* Status */}
      <Controller
        name="status"
        control={form.control}
        render={({ field }) => (
          <Select
            value={field.value ?? undefined}
            onValueChange={(v) => field.onChange(v as OrderStatusType)}
            disabled={isCreateMode}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('selectStatus')} />
            </SelectTrigger>
            <SelectContent>
              {orderStatusOptions.map((st) => (
                <SelectItem key={st} value={st}>
                  {t(st.toLowerCase() as any, { default: st })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {/* Shipping Address */}
      <Textarea {...form.register('shippingAddress')} placeholder={t('shippingAddress')} />

      {/* Notes */}
      <Textarea {...form.register('notes')} placeholder={t('notesOptional')} />

      {/* Products */}
      <div className="space-y-2">
        <div className="font-medium">{t('products')}</div>
        <div className="flex gap-2 items-center">
          <Input
            placeholder={t('searchProducts')}
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setProductPage(1)}
            onBlur={() => setProductPage(1)}
          />
          <div className="text-sm text-muted-foreground">
            {t('selected')}: {Array.from(productCounts.values()).reduce((a, b) => a + b, 0)}
          </div>
        </div>

        <div className="border rounded max-h-64 overflow-auto p-2">
          {isLoadingProducts ? (
            <div className="p-2 text-sm">{t('loadingProducts')}</div>
          ) : (
            (productsRes?.data ?? []).map((p: any) => {
              const qty = productCounts.get(p.id) ?? 0
              const setQty = (next: number) => {
                const normalized = Math.max(0, Math.floor(next || 0))
                setProductCounts((prev) => {
                  const map = new Map(prev)
                  if (normalized <= 0) map.delete(p.id)
                  else map.set(p.id, normalized)

                  // keep form productIds in sync
                  const ids: number[] = []
                  map.forEach((q, id) => {
                    for (let i = 0; i < q; i++) ids.push(id)
                  })
                  form.setValue('productIds', ids)
                  return map
                })
              }

              const active = qty > 0
              return (
                <div
                  key={p.id}
                  className={cn(
                    'flex items-center justify-between gap-2 py-2 px-2 rounded-md transition-colors',
                    active && 'bg-amber-50 border border-amber-200',
                  )}
                  aria-selected={active}
                >
                  <div className="truncate flex items-center gap-2">
                    <span className="truncate">
                      {p.name} - ${p.price}
                    </span>
                    {active && (
                      <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        x{qty}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQty(qty - 1)}
                    >
                      -
                    </Button>
                    <Input
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="w-16 text-center"
                      type="number"
                      min={0}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQty(qty + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm">
          <div>
            {t('page')} {productPage} {t('of')} {productsRes?.meta?.totalPages ?? 1}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setProductPage((p) => Math.max(1, p - 1))}
              disabled={productPage <= 1}
            >
              {t('previous')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setProductPage((p) => Math.min(productsRes?.meta?.totalPages ?? 1, p + 1))
              }
              disabled={productPage >= (productsRes?.meta?.totalPages ?? 1)}
            >
              {t('next')}
            </Button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-between items-center">
        <CustomLink href={`/${locale}/v1/orders`}>{t('back')}</CustomLink>
        <FormSubmitButton text={isCreateMode ? t('createOrder') : t('updateOrder')} />
      </div>
    </form>
  )
}

export default OrderForm
