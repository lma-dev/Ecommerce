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

    // 2) Auth protection (after we know locale)
    const currentLocale = hasKnownLocale ? (maybeLocale as string) : defaultLocale

    const adminToken = request.cookies.get('auth_token')?.value
        || request.cookies.get('next-auth.session-token')?.value
        || request.cookies.get('__Secure-next-auth.session-token')?.value
    const customerToken = request.cookies.get('customer_token')?.value
    const anyToken = adminToken || customerToken
    const role = request.cookies.get('auth_role')?.value

    const isAdminArea = pathname.startsWith(`/${currentLocale}/v1`)
    const isCustomerArea = pathname.startsWith(`/${currentLocale}/customer`)
    const isAdminOnly = pathname.startsWith(`/${currentLocale}/v1/admin`)
    const isSuperOnly = pathname.startsWith(`/${currentLocale}/v1/super`)
    const isPublic = pathname === `/${currentLocale}` || pathname === `/${currentLocale}/login`

    // Public pages: landing and login
    if (isPublic) {
        return intlMiddleware(request)
    }

    // Admin area requires admin token
    if (isAdminArea && !adminToken) {
        const url = new URL(`/${currentLocale}/login`, request.url)
        url.searchParams.set('type', 'console')
        url.searchParams.set('reason', 'auth')
        return NextResponse.redirect(url)
    }

    // Customer area requires customer token
    if (isCustomerArea && !customerToken) {
        const url = new URL(`/${currentLocale}/login`, request.url)
        url.searchParams.set('reason', 'auth')
        return NextResponse.redirect(url)
    }

    // Other pages require any authenticated token
    if (!anyToken) {
        const url = new URL(`/${currentLocale}/login`, request.url)
        url.searchParams.set('reason', 'auth')
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
