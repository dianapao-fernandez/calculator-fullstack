import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Operation, OperationRequest, OperationResponse } from '../types/calculator'
import { useCalculator } from './useCalculator'

describe('useCalculator', () => {
  const createMockCalculate =
    (responses: Record<string, OperationResponse> = {}) =>
    async (operation: Operation, _data: OperationRequest): Promise<OperationResponse> => {
      await Promise.resolve()
      return responses[operation] ?? { result: 0 }
    }

  it('starts with display set to "0"', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.display).toBe('0')
  })

  it('inputs digits and replaces "0"', () => {
    const { result } = renderHook(() => useCalculator({ calculate: vi.fn() }))

    act(() => result.current.inputDigit('1'))
    act(() => result.current.inputDigit('2'))

    expect(result.current.display).toBe('12')
  })

  it('computes an operation using the injected calculate function', async () => {
    const mockCalculate = vi.fn(createMockCalculate({ add: { result: 7 } }))
    const { result } = renderHook(() => useCalculator({ calculate: mockCalculate }))

    act(() => result.current.inputDigit('5'))
    act(() => result.current.chooseOperation('add'))
    act(() => result.current.inputDigit('2'))
    act(() => result.current.compute())

    await waitFor(() => expect(result.current.display).toBe('7'))
    expect(mockCalculate).toHaveBeenCalledWith('add', { a: 5, b: 2 })
  })

  it('chains multiple operations like 5 + 3 - 5 + 7 = 10', async () => {
    const mockCalculate = vi.fn(async (op: Operation, req: OperationRequest): Promise<OperationResponse> => {
      if (op === 'add') return { result: req.a + (req.b ?? 0) }
      if (op === 'subtract') return { result: req.a - (req.b ?? 0) }
      return { result: 0 }
    })

    const { result } = renderHook(() => useCalculator({ calculate: mockCalculate }))

    // 5 + 3
    act(() => result.current.inputDigit('5'))
    act(() => result.current.chooseOperation('add'))
    act(() => result.current.inputDigit('3'))

    // Press '-' -> triggers 5 + 3 = 8
    act(() => result.current.chooseOperation('subtract'))
    await waitFor(() => expect(result.current.display).toBe('8'))
    expect(mockCalculate).toHaveBeenCalledWith('add', { a: 5, b: 3 })

    // - 5
    act(() => result.current.inputDigit('5'))

    // Press '+' -> triggers 8 - 5 = 3
    act(() => result.current.chooseOperation('add'))
    await waitFor(() => expect(result.current.display).toBe('3'))
    expect(mockCalculate).toHaveBeenCalledWith('subtract', { a: 8, b: 5 })

    // + 7
    act(() => result.current.inputDigit('7'))

    // Press '=' -> triggers 3 + 7 = 10
    act(() => result.current.compute())
    await waitFor(() => expect(result.current.display).toBe('10'))
    expect(mockCalculate).toHaveBeenCalledWith('add', { a: 3, b: 7 })
  })

  it('allows switching operator before typing second operand (e.g. 5 + then * 3 = 15)', async () => {
    const mockCalculate = vi.fn(createMockCalculate({ multiply: { result: 15 } }))
    const { result } = renderHook(() => useCalculator({ calculate: mockCalculate }))

    act(() => result.current.inputDigit('5'))
    act(() => result.current.chooseOperation('add'))
    // Switch operator to multiply
    act(() => result.current.chooseOperation('multiply'))
    expect(result.current.operation).toBe('multiply')

    act(() => result.current.inputDigit('3'))
    act(() => result.current.compute())

    await waitFor(() => expect(result.current.display).toBe('15'))
    expect(mockCalculate).toHaveBeenCalledWith('multiply', { a: 5, b: 3 })
  })

  it('handles sqrt immediately', async () => {
    const mockCalculate = vi.fn(createMockCalculate({ sqrt: { result: 3 } }))
    const { result } = renderHook(() => useCalculator({ calculate: mockCalculate }))

    act(() => result.current.inputDigit('9'))
    act(() => result.current.chooseOperation('sqrt'))

    await waitFor(() => expect(result.current.display).toBe('3'))
    expect(mockCalculate).toHaveBeenCalledWith('sqrt', { a: 9 })
  })

  it('handles percentage calculation', async () => {
    const mockCalculate = vi.fn(createMockCalculate({ percentage: { result: 0.5 } }))
    const { result } = renderHook(() => useCalculator({ calculate: mockCalculate }))

    act(() => result.current.inputDigit('50'))
    act(() => result.current.inputPercent())

    await waitFor(() => expect(result.current.display).toBe('0.5'))
    expect(mockCalculate).toHaveBeenCalledWith('percentage', { a: 50, b: 1 })
  })

  it('toggles sign correctly', () => {
    const { result } = renderHook(() => useCalculator({ calculate: vi.fn() }))

    act(() => result.current.inputDigit('42'))
    act(() => result.current.toggleSign())
    expect(result.current.display).toBe('-42')

    act(() => result.current.toggleSign())
    expect(result.current.display).toBe('42')
  })

  it('does not call API when compute is pressed with no pending operation', () => {
    const mockCalculate = vi.fn()
    const { result } = renderHook(() => useCalculator({ calculate: mockCalculate }))

    act(() => result.current.inputDigit('5'))
    act(() => result.current.compute())

    expect(mockCalculate).not.toHaveBeenCalled()
    expect(result.current.display).toBe('5')
  })

  it('shows API error messages', async () => {
    const mockCalculate = vi.fn().mockResolvedValue({ error: 'division by zero' })
    const { result } = renderHook(() => useCalculator({ calculate: mockCalculate }))

    act(() => result.current.inputDigit('8'))
    act(() => result.current.chooseOperation('divide'))
    act(() => result.current.inputDigit('0'))
    act(() => result.current.compute())

    await waitFor(() => expect(result.current.error).toBe('division by zero'))
  })

  it('handles undefined result in API response', async () => {
    const mockCalculate = vi.fn().mockResolvedValue({})
    const { result } = renderHook(() => useCalculator({ calculate: mockCalculate }))

    act(() => result.current.inputDigit('8'))
    act(() => result.current.chooseOperation('add'))
    act(() => result.current.inputDigit('2'))
    act(() => result.current.compute())

    await waitFor(() => expect(result.current.error).toBe('No result'))
  })

  it('handles network errors with Error instance', async () => {
    const mockCalculate = vi.fn().mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useCalculator({ calculate: mockCalculate }))

    act(() => result.current.inputDigit('8'))
    act(() => result.current.chooseOperation('add'))
    act(() => result.current.inputDigit('2'))
    act(() => result.current.compute())

    await waitFor(() => expect(result.current.error).toBe('Network error'))
  })

  it('handles non-Error rejected exceptions with fallback message', async () => {
    const mockCalculate = vi.fn().mockRejectedValue('Unknown network failure')
    const { result } = renderHook(() => useCalculator({ calculate: mockCalculate }))

    act(() => result.current.inputDigit('8'))
    act(() => result.current.chooseOperation('add'))
    act(() => result.current.inputDigit('2'))
    act(() => result.current.compute())

    await waitFor(() => expect(result.current.error).toBe('Network error'))
  })

  it('prevents multiple decimal points in the same value', () => {
    const { result } = renderHook(() => useCalculator({ calculate: vi.fn() }))

    act(() => result.current.inputDecimal())
    act(() => result.current.inputDecimal())
    act(() => result.current.inputDigit('5'))
    act(() => result.current.inputDecimal())

    expect(result.current.display).toBe('0.5')
  })

  it('handles decimal input when waiting for operand', () => {
    const { result } = renderHook(() => useCalculator({ calculate: vi.fn() }))

    act(() => result.current.inputDigit('4'))
    act(() => result.current.chooseOperation('add'))
    act(() => result.current.inputDecimal())

    expect(result.current.display).toBe('0.')
  })

  it('stores the previous value when choosing an operation', () => {
    const { result } = renderHook(() => useCalculator({ calculate: vi.fn() }))

    act(() => result.current.inputDigit('4'))
    act(() => result.current.chooseOperation('add'))

    expect(result.current.previousValue).toBe('4')
    expect(result.current.operation).toBe('add')
  })

  it('clears all state', () => {
    const { result } = renderHook(() => useCalculator({ calculate: vi.fn() }))

    act(() => result.current.inputDigit('5'))
    act(() => result.current.clear())

    expect(result.current.display).toBe('0')
    expect(result.current.previousValue).toBeNull()
    expect(result.current.operation).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('handles invalid numbers during NaN edge cases', async () => {
    const mockCalculate = vi.fn().mockResolvedValue({ result: NaN })
    const { result } = renderHook(() => useCalculator({ calculate: mockCalculate }))

    act(() => result.current.inputDigit('5'))
    act(() => result.current.chooseOperation('add'))
    act(() => result.current.inputDigit('5'))
    act(() => result.current.compute())

    await waitFor(() => expect(result.current.display).toBe('NaN'))

    // toggleSign with NaN display
    act(() => result.current.toggleSign())
    expect(result.current.display).toBe('NaN')

    // compute with NaN
    act(() => result.current.chooseOperation('add'))
    act(() => result.current.compute())
    await waitFor(() => expect(result.current.error).toBe('Invalid number'))
  })
})
