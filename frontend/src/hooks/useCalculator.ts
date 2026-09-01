import { useCallback, useState } from 'react'
import { calculate as defaultCalculate } from '../services/api'
import type { Operation, OperationRequest, OperationResponse } from '../types/calculator'

interface UseCalculatorState {
  display: string
  previousValue: string | null
  operation: Operation | null
  waitingForOperand: boolean
  error: string | null
  isLoading: boolean
}

interface UseCalculatorOptions {
  calculate?: (operation: Operation, data: OperationRequest) => Promise<OperationResponse>
}

const initialState: UseCalculatorState = {
  display: '0',
  previousValue: null,
  operation: null,
  waitingForOperand: false,
  error: null,
  isLoading: false,
}

export const useCalculator = (options: UseCalculatorOptions = {}) => {
  const calculateFn = options.calculate ?? defaultCalculate
  const [state, setState] = useState<UseCalculatorState>(initialState)

  const runOperation = useCallback(
    async (
      operation: Operation,
      request: OperationRequest,
      transform: (result: number) => Partial<UseCalculatorState>,
    ) => {
      if (Number.isNaN(request.a) || (request.b !== undefined && Number.isNaN(request.b))) {
        setState(prev => ({ ...prev, error: 'Invalid number', isLoading: false }))
        return
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await calculateFn(operation, request)

        if (response.error) {
          setState(prev => ({
            ...prev,
            error: response.error ?? 'Calculation error',
            isLoading: false,
            waitingForOperand: true,
          }))
          return
        }

        const result = response.result
        if (result === undefined) {
          setState(prev => ({
            ...prev,
            error: 'No result',
            isLoading: false,
            waitingForOperand: true,
          }))
          return
        }

        setState(prev => ({
          ...prev,
          display: String(result),
          waitingForOperand: true,
          isLoading: false,
          error: null,
          ...transform(result),
        }))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Network error'
        setState(prev => ({
          ...prev,
          error: message,
          isLoading: false,
          waitingForOperand: true,
        }))
      }
    },
    [calculateFn],
  )

  const inputDigit = useCallback((digit: string) => {
    setState(prev => ({
      ...prev,
      display: prev.waitingForOperand
        ? digit
        : prev.display === '0'
          ? digit
          : prev.display + digit,
      waitingForOperand: false,
      error: null,
    }))
  }, [])

  const inputDecimal = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return { ...prev, display: '0.', waitingForOperand: false, error: null }
      }
      if (prev.display.includes('.')) {
        return prev
      }
      return { ...prev, display: prev.display + '.', error: null }
    })
  }, [])

  const chooseOperation = useCallback(
    (op: Operation) => {
      setState(prev => {
        if (op === 'sqrt') {
          const current = parseFloat(prev.display)
          if (Number.isNaN(current)) {
            return { ...prev, error: 'Invalid number' }
          }
          void runOperation('sqrt', { a: current }, () => ({}))
          return { ...prev, isLoading: true, error: null }
        }

        return {
          ...prev,
          previousValue: prev.display,
          operation: op,
          waitingForOperand: true,
          error: null,
        }
      })
    },
    [runOperation],
  )

  const clear = useCallback(() => {
    setState(initialState)
  }, [])

  const compute = useCallback(() => {
    setState(prev => {
      if (prev.previousValue === null || prev.operation === null) {
        return prev
      }

      const a = parseFloat(prev.previousValue)
      const b = parseFloat(prev.display)
      if (Number.isNaN(a) || Number.isNaN(b)) {
        return { ...prev, error: 'Invalid number' }
      }

      void runOperation(prev.operation, { a, b }, () => ({
        previousValue: null,
        operation: null,
      }))

      return { ...prev, isLoading: true, error: null }
    })
  }, [runOperation])

  const toggleSign = useCallback(() => {
    setState(prev => {
      const current = parseFloat(prev.display)
      if (Number.isNaN(current)) {
        return prev
      }
      return { ...prev, display: String(-current), error: null }
    })
  }, [])

  const inputPercent = useCallback(() => {
    setState(prev => {
      const current = parseFloat(prev.display)
      if (Number.isNaN(current)) {
        return { ...prev, error: 'Invalid number' }
      }
      void runOperation('percentage', { a: current, b: 1 }, () => ({}))
      return { ...prev, isLoading: true, error: null }
    })
  }, [runOperation])

  return {
    display: state.display,
    previousValue: state.previousValue,
    operation: state.operation,
    waitingForOperand: state.waitingForOperand,
    error: state.error,
    isLoading: state.isLoading,
    inputDigit,
    inputDecimal,
    chooseOperation,
    clear,
    compute,
    toggleSign,
    inputPercent,
  }
}
