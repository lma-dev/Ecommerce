import { PriorityStatus } from 'constants/PriorityStatus'
import { VisibilityStatus } from 'constants/VisibilityStatus'
import { locales, Locale } from '@/i18n/routing'
import { ConfirmStatus } from '@/constants/ConfirmStatus'

export function generateUUID() {
  let uuid = '',
    i,
    random
  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-'
    }
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
  }
  return uuid
}

export function changeFormatHumanTime(timestamp: Date | string | number): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(timestamp).toLocaleString(undefined, options)
}

export function getPriority(priority: string): string {
  switch (priority) {
    case '1':
      return PriorityStatus.LOW
    case '2':
      return PriorityStatus.MEDIUM
    case '3':
      return PriorityStatus.HIGH
    default:
      return PriorityStatus.NONE
  }
}

export function getVisibility(isVisible: number): string {
  switch (isVisible) {
    case 1:
      return VisibilityStatus.VISIBLE
    case 0:
      return VisibilityStatus.HIDDEN
    default:
      return VisibilityStatus.UNKNOWN
  }
}

export function getDefaultDueDate(): Date {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow
}

export function getSafeLocale(locale: string): Locale {
  return locales.includes(locale as Locale) ? (locale as Locale) : 'jp'
}

/**
 * Format a date string or Date object into a readable format.
 * Example: "2025-10-21T09:30:00Z" → "Oct 21, 2025, 6:30 PM"
 */
export function formatDate(
  date: string | Date | undefined,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
): string {
  if (!date || !(date instanceof Date || !isNaN(Date.parse(date))) || date === undefined) return ''
  try {
    const d = date instanceof Date ? date : new Date(date)
    return new Intl.DateTimeFormat(locale, options).format(d)
  } catch (err) {
    console.error('Invalid date format:', date)
    return ''
  }
}

export function formatCurrency(n?: number | string | null) {
  if (n === null || n === undefined) return '-'
  const value = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(value)) return String(n)
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'MMK',
    }).format(value)
  } catch {
    return String(value)
  }
}

export function statusBadgeClass(status?: string) {
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border'
  switch ((status || '').toUpperCase()) {
    case ConfirmStatus.DRAFT:
      return base + ' bg-slate-100 text-slate-600 border-slate-200'
    case ConfirmStatus.COMPLETED:
      return base + ' bg-emerald-50 text-emerald-700 border-emerald-200'
    case ConfirmStatus.CANCELLED:
      return base + ' bg-rose-50 text-rose-700 border-rose-200'
    case ConfirmStatus.PENDING:
    default:
      return base + ' bg-amber-50 text-amber-700 border-amber-200'
  }
}

export function prettyStatus(status?: string) {
  if (!status) return '-'
  return status.charAt(0) + status.slice(1).toLowerCase()
}
