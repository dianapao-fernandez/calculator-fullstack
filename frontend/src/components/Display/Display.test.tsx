import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Display from './Display'

describe('Display', () => {
  it('renders the current value', () => {
    render(<Display value="123" previousValue={null} operation={null} error={null} isLoading={false} />)
    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('renders history with operation symbol', () => {
    render(<Display value="5" previousValue="10" operation="add" error={null} isLoading={false} />)
    expect(screen.getByText('10 +')).toBeInTheDocument()
  })

  it('renders error in red', () => {
    render(<Display value="0" previousValue={null} operation={null} error="division by zero" isLoading={false} />)
    const error = screen.getByText('division by zero')
    expect(error).toBeInTheDocument()
  })

  it('renders loading dots', () => {
    render(<Display value="0" previousValue={null} operation={null} error={null} isLoading />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('formats very large numbers in exponential notation', () => {
    render(<Display value="10000000000000" previousValue={null} operation={null} error={null} isLoading={false} />)
    expect(screen.getByText('1.000000e+13')).toBeInTheDocument()
  })
})
