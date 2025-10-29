'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ErrorBoundaryProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorBoundaryProps) {
  const router = useRouter()

  useEffect(() => {
    console.error('Root layout error boundary', error)
  }, [error])

  return (
    <div className="min-h-[60vh] bg-background text-foreground flex items-center justify-center px-4">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded-xl border bg-card px-8 py-10 text-center shadow-lg">
        <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert className="size-8" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground">
            We detected an unexpected error while rendering this page. You can try again or head
            back to the dashboard.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/70">
              Reference code: <span className="font-mono">{error.digest}</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => reset()}>Try again</Button>
          <Button
            variant="outline"
            onClick={() => {
              router.push('/')
            }}
          >
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  )
}
