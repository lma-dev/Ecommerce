// src/lib/auth.ts
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'

const trimTrailingSlash = (value: string) => value.replace(/\/$/, '')

const resolveBackendApiBase = () => {
  if (typeof window === 'undefined') {
    const internalBase = process.env.BACKEND_INTERNAL_API_URL ?? process.env.BACKEND_API_URL
    if (internalBase) return trimTrailingSlash(internalBase)
  }

  const publicBase = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL

  return publicBase ? trimTrailingSlash(publicBase) : null
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const baseUrl = resolveBackendApiBase()
        if (!baseUrl) return null
        const res = await fetch(`${baseUrl}/staff/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          credentials: 'include',
        })

        const data = await res.json()

        if (res.ok && data.user) {
          const authorizedUser = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            accountStatus: data.user.accountStatus,
            token: data.token, // if your backend returns token
          }

          return authorizedUser
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
