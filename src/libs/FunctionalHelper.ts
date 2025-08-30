import { PriorityStatus } from "constants/PriorityStatus";
import { VisibilityStatus } from "constants/VisibilityStatus";
import { locales, Locale } from '@/i18n/routing'

export function generateUUID() {
  let uuid = "",
    i,
    random;
  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += "-";
    }
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }
  return uuid;
}

export function changeFormatHumanTime(timestamp: Date | string | number): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(timestamp).toLocaleString(undefined, options);
}

export function getPriority(priority: string): string {
  switch (priority) {
    case "1":
      return PriorityStatus.LOW;
    case "2":
      return PriorityStatus.MEDIUM;
    case "3":
      return PriorityStatus.HIGH;
    default:
      return PriorityStatus.NONE;
  }
}

export function getVisibility(isVisible: number): string {
  switch (isVisible) {
    case 1:
      return VisibilityStatus.VISIBLE;
    case 0:
      return VisibilityStatus.HIDDEN;
    default:
      return VisibilityStatus.UNKNOWN;
  }
}

export function getDefaultDueDate(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

export function getSafeLocale(locale: string): Locale {
  return locales.includes(locale as Locale) ? (locale as Locale) : 'jp'
}