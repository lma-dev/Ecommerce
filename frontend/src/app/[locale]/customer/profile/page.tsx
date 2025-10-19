'use client'

import { useTranslations } from 'next-intl'
import {
  useCustomerProfile,
  useUpdateCustomerProfile,
  useDeleteCustomerProfile,
} from '@/features/customer/profile/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import CustomerTopbar from '../_components/CustomerTopbar'
import { useRouter } from 'next/navigation'

export default function CustomerProfilePage() {
  const t = useTranslations('Translation')
  const { data: profile, isLoading } = useCustomerProfile()
  const update = useUpdateCustomerProfile()
  const destroy = useDeleteCustomerProfile()
  const router = useRouter()

  const [form, setForm] = useState<{
    name?: string
    email?: string
    phone?: string
    address?: string | null
  }>({})
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        address: (profile as any).address ?? '',
      })
    }
  }, [profile])

  const onSubmit = async () => {
    try {
      await update.mutateAsync(form)
      toast.success(t('updateSuccess', { default: 'Successfully updated' }))
    } catch (e: any) {
      console.error(e)
      toast.error(t('updateFailed', { default: 'Update failed' }))
    }
  }

  const onDelete = async () => {
    try {
      await destroy.mutateAsync()
      toast.success(t('deleteSuccess'))
      router.push('/')
    } catch (e: any) {
      console.error(e)
      toast.error(t('deleteFailed', { default: 'Delete failed' }))
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <CustomerTopbar />

      <section className="max-w-2xl mx-auto w-full space-y-4">
        <h1 className="text-2xl font-bold">{t('profile')}</h1>
        <div className="rounded-2xl border bg-white p-4 md:p-6 space-y-4">
          {isLoading ? (
            <div className="text-sm text-neutral-500">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-neutral-700">{t('name')}</label>
                  <Input
                    value={form.name ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm text-neutral-700">{t('email')}</label>
                  <Input
                    value={form.email ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm text-neutral-700">{t('phone')}</label>
                  <Input
                    value={form.phone ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm text-neutral-700">{t('address')}</label>
                  <Input
                    value={form.address ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={onSubmit}
                  disabled={update.isPending}
                >
                  {update.isPending
                    ? t('processing', { default: 'Processing...' })
                    : t('save', { default: 'Save changes' })}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setForm({
                      name: profile?.name ?? '',
                      email: profile?.email ?? '',
                      phone: profile?.phone ?? '',
                      address: (profile as any)?.address ?? '',
                    })
                  }
                >
                  {t('resetAll')}
                </Button>
                <div className="ml-auto" />
                <Button variant="destructive" onClick={onDelete} disabled={destroy.isPending}>
                  {t('delete', { default: 'Delete' })}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
