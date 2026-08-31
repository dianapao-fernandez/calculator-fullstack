export type Operation = 'add' | 'subtract' | 'multiply' | 'divide'

export interface CalculationRequest {
  a: number
  b: number
  operation: Operation
}

export interface CalculationResponse {
  result: number
}

