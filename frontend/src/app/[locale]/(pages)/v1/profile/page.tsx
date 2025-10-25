'use client'

import { useSession } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { useUserQuery } from '@/features/users/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ConsoleProfilePage() {
  const { data: session } = useSession()
  const t = useTranslations('Translation')
  const locale = useLocale()

  const id = (session?.user as any)?.id as number | undefined
  const { data: user, isLoading } = useUserQuery(id as number)

  if (!id) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="rounded-xl border p-6 bg-card">
          <h1 className="text-xl font-semibold mb-2">{t('profile')}</h1>
          <p className="text-sm text-muted-foreground">{t('userNotFound')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="rounded-xl border p-6 bg-card">
        <h1 className="text-2xl font-bold mb-4">{t('profile')}</h1>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ) : (
          <div className="grid gap-4">
            <div>
              <div className="text-xs text-muted-foreground">{t('name')}</div>
              <div className="font-medium">{user?.name}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t('email')}</div>
              <div className="font-medium">{user?.email}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">{t('role')}</div>
                <div className="font-medium">{user?.role}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t('status')}</div>
                <div className="font-medium">{user?.accountStatus}</div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <Link href={`/${locale}/v1/users/${id}/edit`}>
            <Button>{t('updateUser')}</Button>
          </Link>
          <Link href={`/${locale}/v1/dashboard`}>
            <Button variant="outline">{t('back')}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
