'use client'

import { useTranslations } from 'next-intl'
import { useDashboardStats } from '@/features/dashboard/api'
import Spinner from '@/app/[locale]/_components/ui/spinner'
import BreadCrumb from '@/app/[locale]/_components/ui/bread-crumb'
import DashboardStatGrid from './_components/DashboardStatGrid'

export default function DashboardPage() {
  const t = useTranslations('Translation')
  const { data, isLoading } = useDashboardStats()

  return (
    <div className="p-6 space-y-6">
      <BreadCrumb title={t('dashboard')} />
      <div>
        <h1 className="text-2xl font-semibold">{t('dashboard')}</h1>
        <p className="text-sm text-muted-foreground">{t('overviewAnalysis')}</p>
      </div>

      {isLoading ? <Spinner /> : <DashboardStatGrid data={data} t={t} />}

      {/* Recent Orders placeholder (extensible) */}
      {/* <div className="rounded-lg border p-4"> ... </div> */}
    </div>
  )
}
