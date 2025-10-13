'use client'

import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { getSession } from 'next-auth/react'

type EchoInstance = Echo<'pusher'>

declare global {
  interface Window {
    Pusher: typeof Pusher
    __app_echo?: EchoInstance
  }
}

export function getEcho(): EchoInstance | null {
  if (typeof window === 'undefined') return null

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY as string | undefined
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string | undefined
  if (!key || !cluster) return null

  if (!window.__app_echo) {
    window.Pusher = Pusher

    const useTokenAuth =
      String(process.env.NEXT_PUBLIC_ECHO_TOKEN_AUTH || '').toLowerCase() === 'true'
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string | undefined
    const baseConfig: any = {
      broadcaster: 'pusher',
      key,
      cluster,
      forceTLS: true,
    }
    if (useTokenAuth && backendUrl) {
      baseConfig.authorizer = (channel: any) => {
        return {
          authorize: async (socketId: string, callback: any) => {
            try {
              const session = await getSession()
              const token = (session as any)?.user?.token as string | undefined
              const res = await fetch(`${backendUrl}/broadcasting/auth`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: 'include',
                body: JSON.stringify({ socket_id: socketId, channel_name: channel.name }),
              })
              if (!res.ok) throw new Error(`Auth failed: ${res.status}`)
              const data = await res.json()
              callback(false, data)
            } catch (e) {
              callback(true, (e as any)?.message || e)
            }
          },
        }
      }
    }
    window.__app_echo = new Echo<'pusher'>(baseConfig)
  }

  return window.__app_echo!
}
