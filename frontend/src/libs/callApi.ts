import { getSession, signOut } from 'next-auth/react'
import type { AxiosError } from 'axios'
import { isAxiosError } from 'axios'
import httpClient from '@/libs/axios'
import ToastAlert from '@/app/[locale]/_components/ui/toast-box'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text'

const FALLBACK_ERROR_MESSAGE = 'Unexpected error occurred. Please try again.'
const NETWORK_ERROR_MESSAGE = 'Unable to reach the server. Please check your connection and retry.'

interface CallApiParams<TBody = unknown> {
  method: HttpMethod
  url: string
  data?: TBody
  responseType?: ResponseType
}

type ApiErrorOptions = {
  status?: number
  details?: string[]
  cause?: unknown
  isNetworkError?: boolean
}

export class ApiError extends Error {
  status?: number
  details?: string[]
  isNetworkError: boolean

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message)
    this.name = 'ApiError'

    if (typeof options.status === 'number') this.status = options.status
    if (options.details?.length) this.details = options.details
    if (options.cause !== undefined) (this as unknown as { cause?: unknown }).cause = options.cause
    this.isNetworkError = Boolean(options.isNetworkError)
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
      details: this.details,
      isNetworkError: this.isNetworkError,
    }
  }
}

function safeString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed.length) return trimmed
  }
  return undefined
}

function flattenValidationErrors(errors: Record<string, unknown>): string[] {
  return Object.values(errors).flatMap((value) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item))
    }
    if (value == null) return []
    return [String(value)]
  })
}

function messageForStatus(status?: number): string | undefined {
  if (!status) return undefined

  switch (status) {
    case 400:
      return 'Bad request. Please verify the submitted data.'
    case 401:
      return 'Session expired. Please login again.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The requested resource could not be found.'
    case 409:
      return 'The resource is already in use. Please refresh and try again.'
    case 422:
      return 'Validation failed. Please review the highlighted fields.'
    case 429:
      return 'You have reached the request limit. Please wait and try again.'
    default:
      if (status >= 500) {
        return 'Our servers are having trouble right now. Please try again later.'
      }
      return undefined
  }
}

function normalizeAxiosError(error: AxiosError): ApiError {
  const status = error.response?.status
  const data = error.response?.data as Record<string, unknown> | undefined

  const validationBag =
    data && typeof data === 'object' && 'errors' in data
      ? (data as { errors?: Record<string, unknown> }).errors
      : undefined
  const validationErrors =
    validationBag && typeof validationBag === 'object'
      ? flattenValidationErrors(validationBag as Record<string, unknown>)
      : undefined

  const dataMessage =
    data && typeof (data as { message?: unknown }).message === 'string'
      ? ((data as { message?: string }).message as string)
      : undefined
  const dataError =
    data && typeof (data as { error?: unknown }).error === 'string'
      ? ((data as { error?: string }).error as string)
      : undefined

  const apiMessage =
    safeString(dataMessage) ||
    safeString(dataError) ||
    messageForStatus(status) ||
    (error.message ? error.message : undefined) ||
    FALLBACK_ERROR_MESSAGE

  const isNetwork = !error.response

  if (isNetwork) {
    return new ApiError(NETWORK_ERROR_MESSAGE, { cause: error, isNetworkError: true })
  }

  return new ApiError(apiMessage, {
    status,
    details: validationErrors,
    cause: error,
    isNetworkError: false,
  })
}

export function parseApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    return normalizeAxiosError(error)
  }

  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    return new ApiError(error.message || FALLBACK_ERROR_MESSAGE, { cause: error })
  }

  return new ApiError(FALLBACK_ERROR_MESSAGE, { cause: error })
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getSession()
  const token = session?.user.token

  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

function handleSuccess<T>(response: { data: T }) {
  return response.data
}

async function handleError(error: unknown): Promise<never> {
  const apiError = parseApiError(error)

  if (apiError.status === 401) {
    ToastAlert.error({ message: apiError.message })
    await signOut({ redirect: true, callbackUrl: '/login' })
    throw apiError
  }

  if (apiError.details?.length) {
    const uniqueMessages = Array.from(new Set(apiError.details))
    uniqueMessages.forEach((msg) => ToastAlert.error({ message: msg }))
  } else {
    ToastAlert.error({ message: apiError.isNetworkError ? NETWORK_ERROR_MESSAGE : apiError.message })
  }

  throw apiError
}

export async function callApi<TResponse = unknown, TBody = unknown>({
  method,
  url,
  data,
  responseType = 'json',
}: CallApiParams<TBody>): Promise<TResponse> {
  try {
    const headers = await getAuthHeaders()
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
    const requestHeaders: Record<string, string> = { ...headers }

    if (!isFormData) {
      requestHeaders['Content-Type'] = requestHeaders['Content-Type'] || 'application/json'
    }

    const response = await httpClient.request<TResponse>({
      method,
      url,
      data,
      responseType,
      headers: requestHeaders,
    })

    return handleSuccess(response)
  } catch (error) {
    await handleError(error)
    throw error instanceof Error ? error : new ApiError(FALLBACK_ERROR_MESSAGE, { cause: error })
  }
}
