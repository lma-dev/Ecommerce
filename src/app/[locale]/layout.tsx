import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import TanStackQueryClientProvider from '@/providers/QueryClientProvider'
import { routing } from '@/i18n/routing'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    console.error(`Error loading messages for locale "${locale}":`, error)
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TanStackQueryClientProvider>{children}</TanStackQueryClientProvider>
    </NextIntlClientProvider>
  )
}
