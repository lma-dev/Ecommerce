import { atomWithStorage } from 'jotai/utils'
import { AuthUser } from '@/auth/features/types'

// Persist user to localStorage securely
export const authUserAtom = atomWithStorage<AuthUser | null>('auth_user', null)