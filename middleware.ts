import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing, locales, defaultLocale } from '@/i18n/routing'

// 1. Create the next-intl i18n middleware
const intlMiddleware = createIntlMiddleware(routing)

export function middleware(request: NextRequest) {
    // First run next-intl middleware
    const intlResponse = intlMiddleware(request)
    const pathname = request.nextUrl.pathname

    const pathnameParts = pathname.split('/')
    const locale = pathnameParts[1]
    const currentLocale = locales.includes(locale as any) ? locale : defaultLocale

    // Read cookies for auth + role
    const token = request.cookies.get('auth_token')?.value
    const role = request.cookies.get('auth_role')?.value

    // Apply your role-based protection
    const isProtected = pathname.startsWith(`/${currentLocale}/v1`)
    const isAdminOnly = pathname.startsWith(`/${currentLocale}/v1/admin`)
    const isSuperOnly = pathname.startsWith(`/${currentLocale}/v1/super`)

    if (isProtected && !token) {
        // Console area uses admin login; append type=console for clarity
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

    return intlResponse
}

export const config = {
    matcher: [
        '/((?!api|_next|.*\\..*).*)', // All pages except API/static
    ],
}
