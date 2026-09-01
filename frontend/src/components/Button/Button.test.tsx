import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renders its label', () => {
    render(<Button label="7" onClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button label="=" onClick={handleClick} variant="primary" />)

    await userEvent.click(screen.getByRole('button', { name: '=' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(<Button label="C" onClick={handleClick} variant="danger" disabled />)

    await userEvent.click(screen.getByRole('button', { name: 'C' }))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies variant class names', () => {
    const { rerender } = render(<Button label="Test" onClick={vi.fn()} variant="secondary" />)
    const button = screen.getByRole('button', { name: 'Test' })
    expect(button.className).toContain('secondary')

    rerender(<Button label="Test" onClick={vi.fn()} variant="danger" />)
    expect(button.className).toContain('danger')
  })
})
