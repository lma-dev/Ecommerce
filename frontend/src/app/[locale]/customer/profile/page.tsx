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

export default function CustomerProfilePage() {
  const t = useTranslations('Translation')
  const { data: profile, isLoading } = useCustomerProfile()
  const update = useUpdateCustomerProfile()
  const destroy = useDeleteCustomerProfile()
  const router = useRouter()

  const [form, setForm] = useState<{
    name: string
    email: string
    phone: string
    address: string
  } | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  useEffect(() => {
    if (!profile) return
    setForm({
      name: profile.name ?? '',
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      address: (profile as any).address ?? '',
    })
  }, [profile])

  const hydratedForm =
    form ??
    {
      name: '',
      email: '',
      phone: '',
      address: '',
    }

  const onSubmit = async () => {
    if (!form) return
    try {
      await update.mutateAsync(form)
      toast.success(t('updateSuccess'))
    } catch (e: any) {
      console.error(e)
      toast.error(t('updateFailed'))
    }
  }

  const onDelete = async () => {
    try {
      await destroy.mutateAsync()
      toast.success(t('deleteSuccess'))
      router.push('/')
    } catch (e: any) {
      console.error(e)
      toast.error(t('deleteFailed'))
    } finally {
      setConfirmDeleteOpen(false)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <CustomerTopbar />

      <section className="max-w-2xl mx-auto w-full space-y-4">
        <h1 className="text-2xl font-bold">{t('profile')}</h1>
        <div className="rounded-2xl border bg-white p-4 md:p-6 space-y-4">
          {isLoading || !form ? (
            <div className="text-sm text-neutral-500">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-neutral-700">{t('name')}</label>
                  <Input
                    value={hydratedForm.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...(prev ?? hydratedForm),
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-neutral-700">{t('email')}</label>
                  <Input
                    value={hydratedForm.email}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...(prev ?? hydratedForm),
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-neutral-700">{t('phone')}</label>
                  <Input
                    value={hydratedForm.phone}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...(prev ?? hydratedForm),
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-neutral-700">{t('address')}</label>
                  <Input
                    value={hydratedForm.address}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...(prev ?? hydratedForm),
                        address: e.target.value,
                      }))
                    }
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
                    ? t('processing')
                    : t('save')}
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
                <Button
                  variant="destructive"
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={destroy.isPending}
                >
                  {t('delete')}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteProfileConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={destroy.isPending}>
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={destroy.isPending}>
              {destroy.isPending
                ? t('processing')
                : t('confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
