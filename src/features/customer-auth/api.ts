import axios from '@/libs/axios'

export type CustomerLoginInput = { email: string; password: string }
export type CustomerLoginResponse = {
  token?: string
  data?: { token?: string }
  user?: any
}

export const customerLogin = async (
  payload: CustomerLoginInput,
): Promise<CustomerLoginResponse> => {
  const res = await axios.post('/customer/login', payload)
  return res.data
}

