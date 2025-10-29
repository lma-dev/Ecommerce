'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ErrorBoundaryProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminSectionError({ error, reset }: ErrorBoundaryProps) {
  const params = useParams<{ locale: string }>()
  const locale = params?.locale ?? 'en'

  useEffect(() => {
    console.error('[v1] section error boundary', error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 rounded-xl border bg-card px-6 py-10 text-center shadow">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-7" aria-hidden />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">We hit a snag</h2>
        <p className="text-muted-foreground">
          An unexpected issue prevented this admin page from loading. You can try again or return to
          the dashboard while we figure things out.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => reset()}>Retry</Button>
        <Button asChild variant="outline">
          <Link href={`/${locale}/v1/dashboard`}>Go to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
