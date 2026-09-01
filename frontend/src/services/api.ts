import type { Operation, OperationRequest, OperationResponse } from '../types/calculator'

const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) || '/api'

export const calculate = async (
  operation: Operation,
  data: OperationRequest,
): Promise<OperationResponse> => {
  const response = await fetch(`${baseUrl}/${operation}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  let result: OperationResponse
  try {
    result = (await response.json()) as OperationResponse
  } catch {
    result = { error: 'unexpected server response' }
  }

  return result
}
