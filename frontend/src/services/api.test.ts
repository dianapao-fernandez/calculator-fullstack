import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { calculate } from './api'

describe('api service', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('sends POST request and returns JSON result on success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ result: 42 }),
    } as unknown as Response)

    const res = await calculate('add', { a: 15, b: 27 })

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ a: 15, b: 27 }),
    })
    expect(res).toEqual({ result: 42 })
  })

  it('returns server error payload when operation fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ error: 'division by zero' }),
    } as unknown as Response)

    const res = await calculate('divide', { a: 10, b: 0 })
    expect(res).toEqual({ error: 'division by zero' })
  })

  it('handles non-JSON / unexpected server response gracefully', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => {
        throw new Error('invalid json')
      },
    } as unknown as Response)

    const res = await calculate('add', { a: 1, b: 1 })
    expect(res).toEqual({ error: 'unexpected server response' })
  })
})
