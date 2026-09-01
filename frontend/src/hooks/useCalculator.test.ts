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

  it('handles sqrt immediately', async () => {
    const mockCalculate = vi.fn(createMockCalculate({ sqrt: { result: 3 } }))
    const { result } = renderHook(() => useCalculator({ calculate: mockCalculate }))

    act(() => result.current.inputDigit('9'))
    act(() => result.current.chooseOperation('sqrt'))

    await waitFor(() => expect(result.current.display).toBe('3'))
    expect(mockCalculate).toHaveBeenCalledWith('sqrt', { a: 9 })
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

  it('clears all state', () => {
    const { result } = renderHook(() => useCalculator({ calculate: vi.fn() }))

    act(() => result.current.inputDigit('5'))
    act(() => result.current.clear())

    expect(result.current.display).toBe('0')
    expect(result.current.previousValue).toBeNull()
    expect(result.current.operation).toBeNull()
    expect(result.current.error).toBeNull()
  })
})
