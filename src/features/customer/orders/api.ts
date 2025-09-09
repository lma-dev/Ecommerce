import { callCustomerApi } from '@/libs/customerApi'

export type CreateCustomerOrderInput = {
  productIds: number[]
  notes?: string
}

export async function createCustomerOrder(payload: CreateCustomerOrderInput) {
  // POST /api/customer/orders (baseURL already includes /api)
  return await callCustomerApi({ method: 'POST', url: '/customer/orders', data: payload })
}
