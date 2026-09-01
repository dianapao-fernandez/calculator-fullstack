import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

describe('App', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('renders the calculator', () => {
    render(<App />)
    expect(screen.getByRole('region', { name: 'Calculator display' })).toBeInTheDocument()
  })

  it('performs a full calculation through the UI', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ result: 7 }),
    } as unknown as Response)

    const user = userEvent.setup()
    render(<App />)

    await act(async () => {
      await user.click(screen.getByRole('button', { name: '5' }))
    })
    await act(async () => {
      await user.click(screen.getByRole('button', { name: '+' }))
    })
    await act(async () => {
      await user.click(screen.getByRole('button', { name: '2' }))
    })
    await act(async () => {
      await user.click(screen.getByRole('button', { name: '=' }))
    })

    await waitFor(() => {
      const display = screen.getByRole('region', { name: 'Calculator display' })
      expect(display.textContent).toContain('7')
    })
  })
})
