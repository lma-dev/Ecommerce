import { describe, expect, it } from 'vitest'
import { AxiosError } from 'axios'
import { ApiError, parseApiError } from '../callApi'

const createAxiosError = ({
  status,
  data,
  message = 'Axios error',
}: {
  status?: number
  data?: Record<string, unknown>
  message?: string
}) => {
  const config = { headers: {}, method: 'get', url: '/test' } as any
  const response = status
    ? ({
        status,
        statusText: String(status),
        headers: {},
        config,
        data,
      } as any)
    : undefined

  return new AxiosError(message, status ? 'ERR_BAD_REQUEST' : 'ERR_NETWORK', config, undefined, response)
}

describe('parseApiError', () => {
  it('returns validation details when present', () => {
    const axiosError = createAxiosError({
      status: 422,
      data: {
        message: 'Validation failed',
        errors: {
          name: ['Name is required'],
          price: ['Price must be greater than zero'],
        },
      },
    })

    const apiError = parseApiError(axiosError)
    expect(apiError).toBeInstanceOf(ApiError)
    expect(apiError.status).toBe(422)
    expect(apiError.message).toBe('Validation failed')
    expect(apiError.details).toEqual([
      'Name is required',
      'Price must be greater than zero',
    ])
  })

  it('falls back to status message when API message missing', () => {
    const axiosError = createAxiosError({
      status: 403,
    })

    const apiError = parseApiError(axiosError)
    expect(apiError).toBeInstanceOf(ApiError)
    expect(apiError.status).toBe(403)
    expect(apiError.message).toBe('You do not have permission to perform this action.')
  })

  it('marks network failures correctly', () => {
    const axiosError = createAxiosError({
      message: 'Network Error',
    })

    const apiError = parseApiError(axiosError)
    expect(apiError).toBeInstanceOf(ApiError)
    expect(apiError.isNetworkError).toBe(true)
    expect(apiError.message).toBe('Unable to reach the server. Please check your connection and retry.')
  })

  it('wraps generic errors', () => {
    const apiError = parseApiError(new Error('Boom'))
    expect(apiError).toBeInstanceOf(ApiError)
    expect(apiError.message).toBe('Boom')
  })
})
