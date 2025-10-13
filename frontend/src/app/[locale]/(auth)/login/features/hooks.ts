import { useMutation } from '@tanstack/react-query'
import { LoginInput } from '@/auth/features/schemas/loginSchema'
import { useRouter, usePathname } from 'next/navigation'
import { signIn, signOut } from 'next-auth/react'

export const useLogin = () => {
    return useMutation({
        mutationFn: async (data: LoginInput) => {
            const res = await signIn("credentials", {
                redirect: false,
                ...data,
            })

            if (!res?.ok) throw new Error("Invalid credentials")
            return res
        },
    })
}

export const useLogout = () => {
    const router = useRouter()
    const pathname = usePathname()
    const currentLocale = pathname.split('/')[1] || 'en'

    return async () => {
        try {
            // Best-effort clear of app-specific cookies
            const expire = 'Thu, 01 Jan 1970 00:00:00 GMT'
            const clear = (name: string) => {
                try { document.cookie = `${name}=; expires=${expire}; path=/`; } catch {}
            }
            ;[
                'auth_token',
                'auth_role',
                'customer_token',
                'next-auth.session-token',
                '__Secure-next-auth.session-token',
                'next-auth.csrf-token'
            ].forEach(clear)
            // NextAuth will clear its own cookies
            await signOut({ callbackUrl: `/${currentLocale}/login` })
        } catch (e) {
            console.warn('Logout failed:', e)
        } finally {
            router.push(`/${currentLocale}/login`)
            router.refresh()
        }
    }
}
