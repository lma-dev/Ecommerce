import { createNavigation } from 'next-intl/navigation';
import { routing } from '@/i18n/routing';

console.log('✅ Navigation is set up with routing');
// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);