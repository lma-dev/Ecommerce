import Axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { ensureSanctumCookie, getXsrfToken } from '@/libs/sanctum'

const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
}

const axios = Axios.create(apiConfig)

axios.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const method = (config.method || 'get').toUpperCase()
  const headers =
    config.headers instanceof AxiosHeaders ? config.headers : new AxiosHeaders(config.headers ?? {})
  const needsCsrf = method !== 'GET' && config.withCredentials !== false

  if (needsCsrf) {
    let xsrf = getXsrfToken()
    if (!xsrf) {
      await ensureSanctumCookie(true)
      xsrf = getXsrfToken()
    }
    if (xsrf) headers.set('X-XSRF-TOKEN', xsrf)
  }

  config.headers = headers
  return config
})

export default axios
