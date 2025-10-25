'use client'

import CustomerTopbar from '../customer/_components/CustomerTopbar'
import { useTranslations } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations('Translation')
  return (
    <div className="p-4 md:p-6 space-y-8">
      <CustomerTopbar />
      <section className="max-w-3xl mx-auto text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
          {t('contactTitle')}
        </h1>
        <p className="text-neutral-600">
          {t('contactSubtitle')}
        </p>
      </section>

      <section className="max-w-3xl mx-auto grid grid-cols-1 gap-4">
        <div className="rounded-2xl border p-5 bg-white">
          <div className="text-sm text-neutral-700">
            <div className="mb-2">
              <strong>{t('email')}:</strong> lwinmoeaung.it@gmail.com
            </div>
            <div className="mb-2">
              <strong>{t('phone')}:</strong> +81 9 000 000 000
            </div>
            <div>
              <strong>{t('address')}:</strong> 123 Sample Street, Japan
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
