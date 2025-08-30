import { defineRouting } from 'next-intl/routing';

export const locales = ['mm', 'en', 'jp'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale = 'jp';

export const routing = defineRouting({
    locales: locales,
    defaultLocale: defaultLocale
});