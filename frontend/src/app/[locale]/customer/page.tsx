'use client'

import { useEffect, useMemo, useState } from 'react'
import { useCustomerCategories, useCustomerProducts } from '@/features/customer/catalog/api'
import { useTranslations } from 'next-intl'
import HeroHeader from './_components/HeroHeader'
import CategoryPills from './_components/CategoryPills'
import ProductGrid from './_components/ProductGrid'
import CustomerTopbar from './_components/CustomerTopbar'
import CheckoutFloatingCTA from './_components/CheckoutFloatingCTA'

export default function CustomerHomePage() {
  const t = useTranslations('Translation')
  const [categoryId, setCategoryId] = useState<number>()

  const { data: categories } = useCustomerCategories()
  const { data: products, isLoading } = useCustomerProducts({ categoryId })

  const currentCategoryName = useMemo(() => {
    if (!categories || !categoryId) return undefined
    return (categories as any[]).find((c) => c.id === categoryId)?.name as string | undefined
  }, [categories, categoryId])

  useEffect(() => {
    if (!categoryId && Array.isArray(categories) && categories.length > 0) {
      setCategoryId(categories[0].id)
    }
  }, [categories, categoryId])
  return (
    <div className="p-4 md:p-6 space-y-6">
      <CustomerTopbar />
      <HeroHeader />

      <CategoryPills
        categories={(categories ?? []) as any}
        value={categoryId}
        onChange={(id) => setCategoryId(id)}
      />

      <hr className="my-6 border-neutral-200" />

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900">
          {t('featuredLabel')} {currentCategoryName ? currentCategoryName : ''}
        </h2>
        <ProductGrid products={products as any[]} isLoading={isLoading} />
      </section>

      <CheckoutFloatingCTA />
    </div>
  )
}
