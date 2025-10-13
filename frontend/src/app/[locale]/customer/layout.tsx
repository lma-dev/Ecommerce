import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ClientCustomerAuthEnforcer from './ClientCustomerAuthEnforcer'

export default async function CustomerLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const cookieStore = await cookies()
  const customerToken = cookieStore.get('customer_token')?.value

  if (!customerToken) {
    redirect(`/${locale}/login`)
  }

  return (
    <>
      {/* Client-side guard for customer area when cookie is cleared post-render */}
      <ClientCustomerAuthEnforcer locale={locale} />
      {children}
    </>
  )
}
