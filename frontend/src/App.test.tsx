import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the calculator', () => {
    render(<App />)
    expect(screen.getByRole('region', { name: 'Calculator display' })).toBeInTheDocument()
  })

  it('performs a full calculation through the UI', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(screen.getByText('7')).toBeInTheDocument()
  })
})
