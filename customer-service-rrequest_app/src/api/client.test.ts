import { describe, expect, it, vi, Mock, beforeEach } from 'vitest'
import { apiRequest, registerAccessTokenProvider, registerUnauthorizedHandler } from './client'
import { ApiError } from './errors'

const fetchMock = vi.fn() as Mock
vi.stubGlobal('fetch', fetchMock)

describe('apiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    registerAccessTokenProvider(() => undefined)
  })

  it('adds authorization header when token is provided', async () => {
    registerAccessTokenProvider(() => 'test-token')
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    const result = await apiRequest<{ ok: boolean }>('requests', { query: { page: 1 } })

    expect(result.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      Authorization: 'Bearer test-token',
    })
  })

  it('calls unauthorized handler on 401', async () => {
    const onUnauthorized = vi.fn()
    registerUnauthorizedHandler(onUnauthorized)
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      }),
    )

    await expect(apiRequest('requests')).rejects.toBeInstanceOf(ApiError)
    expect(onUnauthorized).toHaveBeenCalledTimes(1)
  })

  it('falls back to mock request when network fails for mockable GET', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('Network error'))))

    const result = await apiRequest('requests', { method: 'GET' })
    expect(result).toBeDefined()
  })
})
