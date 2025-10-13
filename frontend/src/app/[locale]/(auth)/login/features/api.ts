import axios from '@/libs/axios'
import { LoginInput } from '@/auth/features/schemas/loginSchema'
import { LoginResponse } from '@/auth/features/types'

export const login = async (payload: LoginInput): Promise<LoginResponse> => {
    const res = await axios.post('/login', payload)
    return res.data
}

export const logout = async () => {
    await axios.post('/logout')
}