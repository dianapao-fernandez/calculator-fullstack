export interface OperationRequest {
  a: number
  b?: number
}

export interface OperationResponse {
  result?: number
  error?: string
}

export type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'sqrt' | 'percentage'
