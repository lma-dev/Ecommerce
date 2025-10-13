import { env } from '@/utils/env'

export function resolveAssetUrl(url?: string | null): string | undefined {
  if (!url) return undefined
  // Already absolute or data URL
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url
  // Join with BACKEND_URL, ensuring single slash
  const base = env.BACKEND_URL?.replace(/\/$/, '') || ''
  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
}

