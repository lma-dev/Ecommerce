import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing, locales, defaultLocale } from '@/i18n/routing'

// Create the next-intl i18n middleware
const intlMiddleware = createIntlMiddleware(routing)

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl

    // Ignore API, next internals and assets (handled via matcher as well)

    // 1) Force locale prefix on all non-static routes
    if (pathname === '/') {
        return NextResponse.redirect(new URL(`/${defaultLocale}${search}`, request.url))
    }

    const [, maybeLocale] = pathname.split('/')
    const hasKnownLocale = locales.includes(maybeLocale as any)

    if (!hasKnownLocale) {
        // Redirect to default locale while preserving path and search
        return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}${search}`, request.url))
    }

    // 2) Role-based protection (only after we know locale)
    const currentLocale = hasKnownLocale ? (maybeLocale as string) : defaultLocale
    const token = request.cookies.get('auth_token')?.value
    const role = request.cookies.get('auth_role')?.value

    const isProtected = pathname.startsWith(`/${currentLocale}/v1`)
    const isAdminOnly = pathname.startsWith(`/${currentLocale}/v1/admin`)
    const isSuperOnly = pathname.startsWith(`/${currentLocale}/v1/super`)

    if (isProtected && !token) {
        const url = new URL(`/${currentLocale}/login`, request.url)
        url.searchParams.set('type', 'console')
        return NextResponse.redirect(url)
    }

    if (isAdminOnly && !['ADMIN', 'SUPER_ADMIN'].includes(role ?? '')) {
        return NextResponse.redirect(new URL(`/${currentLocale}/403`, request.url))
    }

    if (isSuperOnly && role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL(`/${currentLocale}/403`, request.url))
    }

    // 3) Let next-intl handle the rest (locale negotiation, headers, etc.)
    return intlMiddleware(request)
}

export const config = {
    matcher: [
        // Ensure root path is matched explicitly
        '/',
        // All app routes except API, Next internals and static files
        '/((?!api|_next|.*\\..*).*)',
    ],
}
