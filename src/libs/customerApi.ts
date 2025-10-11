import axios from '@/libs/axios'

export async function callCustomerApi<T = any>({
  method,
  url,
  data,
  params,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  data?: any
  params?: any
}): Promise<T> {
  const token = typeof document !== 'undefined'
    ? document.cookie.split('; ').find(c => c.startsWith('customer_token='))?.split('=')[1]
    : undefined

  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${decodeURIComponent(token)}`

  const res = await axios.request({ method, url, data, params, headers })
  return res.data
}

export async function fetchCustomerList<T = any>(url: string, params?: any): Promise<T> {
  return await callCustomerApi<T>({ method: 'GET', url, params })
}
