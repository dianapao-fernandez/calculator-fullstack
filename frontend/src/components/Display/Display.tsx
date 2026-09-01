import styles from './Display.module.css'

const operationSymbols: Record<string, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
  power: '^',
  sqrt: '√',
  percentage: '%',
}

interface DisplayProps {
  value: string
  previousValue: string | null
  operation: string | null
  error: string | null
  isLoading: boolean
}

const formatValue = (value: string): string => {
  if (value === '') {
    return '0'
  }
  const num = parseFloat(value)
  if (Number.isNaN(num)) {
    return value
  }
  if (Math.abs(num) > 999999999999) {
    return num.toExponential(6)
  }
  return value
}

export const Display = ({ value, previousValue, operation, error, isLoading }: DisplayProps) => {
  const symbol = operation ? operationSymbols[operation] ?? operation : null
  const history = previousValue !== null && symbol !== null ? `${previousValue} ${symbol}` : ''

  const mainContent = () => {
    if (error) {
      return <span className={styles.error}>{error}</span>
    }
    if (isLoading) {
      return <span className={styles.loading}>...</span>
    }
    return <span className={styles.value}>{formatValue(value)}</span>
  }

  return (
    <div className={styles.display} role="region" aria-label="Calculator display">
      <div className={styles.history}>{history}</div>
      <div className={styles.main}>{mainContent()}</div>
      <div className={styles.scanlines} aria-hidden="true" />
    </div>
  )
}

export default Display
