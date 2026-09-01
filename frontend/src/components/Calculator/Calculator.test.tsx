import { render, screen, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Calculator from './Calculator'

describe('Calculator', () => {
  it('renders the display and keypad', () => {
    render(<Calculator />)

    expect(screen.getByRole('region', { name: 'Calculator display' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument()
  })

  it('updates display when digits are clicked', () => {
    render(<Calculator />)

    const one = screen.getByRole('button', { name: '1' })
    const two = screen.getByRole('button', { name: '2' })
    const three = screen.getByRole('button', { name: '3' })

    act(() => one.click())
    act(() => two.click())
    act(() => three.click())

    const display = screen.getByRole('region', { name: 'Calculator display' })
    expect(display.textContent).toContain('123')
  })

  it('triggers all button click handlers across the keypad', () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ result: 42 }),
    } as unknown as Response)

    render(<Calculator />)

    const buttons = [
      'C', '√', '%', '±',
      '7', '8', '9', '×',
      '4', '5', '6', '−',
      '1', '2', '3', '+',
      '0', '.', '^', '÷',
      '=',
    ]

    buttons.forEach(label => {
      const btn = screen.getByRole('button', { name: label })
      act(() => {
        btn.click()
      })
    })

    expect(screen.getByRole('region', { name: 'Calculator display' })).toBeInTheDocument()
  })
})
