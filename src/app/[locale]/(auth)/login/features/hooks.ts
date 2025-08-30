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
            await signOut({ callbackUrl: `/${currentLocale}/login` })
        } catch (e) {
            console.warn('Logout failed:', e)
        } finally {
            router.push(`/${currentLocale}/login`)
        }
    }
}
